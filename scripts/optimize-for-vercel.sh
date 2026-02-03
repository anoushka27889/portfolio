#!/bin/bash
# Optimize media to meet Vercel best practices (target: 150-200MB)
# Re-encodes large MP4s with higher CRF (lower quality but still visually good)

set -e

echo "🎯 Vercel Optimization Script"
echo "================================"
echo "Target: Reduce 307MB → 150-200MB"
echo ""

# Backup before optimization
BACKUP_DIR="$HOME/portfolio-media-backup-vercel-$(date +%Y%m%d-%H%M%S)"
echo "📁 Creating backup at: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"
cp -R public/media/projects "$BACKUP_DIR/"
echo "✅ Backup complete"
echo ""

optimize_large_video() {
    local video="$1"
    local size_before=$(du -h "$video" | cut -f1)
    local size_before_kb=$(du -k "$video" | cut -f1)

    # Skip if already small enough
    if [ $size_before_kb -lt 3000 ]; then
        echo "  ⏭️  Skipping $(basename "$video") - already < 3MB"
        return
    fi

    echo "  🔄 Optimizing: $(basename "$video") (was: $size_before)"

    local temp="${video%.mp4}_temp.mp4"

    # Re-encode with higher CRF (26 = good balance of quality/size)
    # Original was CRF 18, this will be ~40-50% smaller
    ffmpeg -i "$video" \
        -c:v libx264 \
        -crf 26 \
        -preset medium \
        -c:a aac \
        -b:a 96k \
        -movflags +faststart \
        -y \
        "$temp" 2>&1 | grep -E "(time=)" | tail -1 || true

    if [ -f "$temp" ]; then
        local size_after_kb=$(du -k "$temp" | cut -f1)
        local size_after=$(du -h "$temp" | cut -f1)

        # Only replace if actually smaller
        if [ $size_after_kb -lt $size_before_kb ]; then
            local savings=$((100 - (size_after_kb * 100 / size_before_kb)))
            mv "$temp" "$video"
            echo "  ✅ Reduced to: $size_after (saved ${savings}%)"
        else
            rm "$temp"
            echo "  ⚠️  Kept original (re-encode not smaller)"
        fi
    else
        echo "  ❌ Optimization failed"
    fi
    echo ""
}

resize_large_image() {
    local image="$1"
    local size_before=$(du -h "$image" | cut -f1)
    local size_before_kb=$(du -k "$image" | cut -f1)

    # Skip if already small enough
    if [ $size_before_kb -lt 500 ]; then
        return
    fi

    echo "  📐 Resizing: $(basename "$image") (was: $size_before)"

    # Resize to max 1920px width, maintain aspect ratio
    # Then compress with ImageMagick
    magick "$image" -resize '1920x1920>' -strip -quality 85 "$image"

    local size_after=$(du -h "$image" | cut -f1)
    local size_after_kb=$(du -k "$image" | cut -f1)
    local savings=$((100 - (size_after_kb * 100 / size_before_kb)))

    if [ $savings -gt 0 ]; then
        echo "  ✅ Reduced to: $size_after (saved ${savings}%)"
    else
        echo "  ⏭️  No reduction"
    fi
}

echo "🎬 Optimizing large videos (>3MB) with CRF 26..."
echo ""

find public/media/projects -type f -name "*.mp4" -size +3M | sort | while read video; do
    optimize_large_video "$video"
done

echo ""
echo "🖼️  Resizing large images (>500KB) to max 1920px..."
echo ""

find public/media/projects -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.webp" \) -size +500k | while read image; do
    resize_large_image "$image"
done

echo "================================"
echo "✅ Optimization Complete!"
echo ""
echo "📊 Size comparison:"
BEFORE=$(du -sh "$BACKUP_DIR/projects" | cut -f1)
AFTER=$(du -sh public/media/projects | cut -f1)
echo "  Before: $BEFORE"
echo "  After:  $AFTER"
echo ""
echo "💾 Backup location: $BACKUP_DIR"
echo ""
echo "🚀 Next steps:"
echo "   1. Test site: npm run dev"
echo "   2. Verify videos/images look good"
echo "   3. If acceptable: git add . && git commit && git push"
echo ""
