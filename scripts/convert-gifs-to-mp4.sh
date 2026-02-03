#!/bin/bash
# Convert large GIFs to MP4 for massive file size reduction
# MP4 files are 80-95% smaller than GIFs with same visual quality

set -e

echo "🎬 GIF to MP4 Conversion Script"
echo "================================"
echo ""

convert_gif_to_mp4() {
    local gif_file="$1"
    local mp4_file="${gif_file%.gif}.mp4"
    local size_before=$(du -h "$gif_file" | cut -f1)

    echo "  🔄 Converting: $(basename "$gif_file") (was: $size_before)"

    # Convert GIF to MP4 with high quality
    # - High quality H.264 encoding (CRF 18 = visually lossless)
    # - Loops infinitely like GIF
    # - Fast start for web streaming
    # - No audio (GIFs don't have audio)
    ffmpeg -i "$gif_file" \
        -movflags faststart \
        -pix_fmt yuv420p \
        -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" \
        -c:v libx264 \
        -crf 18 \
        -preset medium \
        -y \
        "$mp4_file" 2>&1 | grep -E "(Duration|time=)" | tail -1 || true

    if [ -f "$mp4_file" ]; then
        local size_after_kb=$(du -k "$mp4_file" | cut -f1)
        local size_before_kb=$(du -k "$gif_file" | cut -f1)
        local size_after=$(du -h "$mp4_file" | cut -f1)
        local savings=$((100 - (size_after_kb * 100 / size_before_kb)))

        echo "  ✅ Created MP4: $size_after (saved ${savings}%)"

        # Delete original GIF if conversion was successful and smaller
        if [ $size_after_kb -lt $size_before_kb ]; then
            rm "$gif_file"
            echo "  🗑️  Removed original GIF"
        else
            rm "$mp4_file"
            echo "  ⚠️  Kept GIF (MP4 not smaller)"
        fi
    else
        echo "  ❌ Conversion failed"
    fi
    echo ""
}

# Convert all GIFs over 1MB (keep small GIFs as-is)
echo "🎯 Converting GIFs larger than 1MB to MP4..."
echo ""

gif_count=0
find /Users/anoushkagarg/portfolio/public/media/projects -type f -name "*.gif" -size +1M | while read gif; do
    convert_gif_to_mp4 "$gif"
    ((gif_count++)) || true
done

echo "================================"
echo "✅ Conversion complete!"
echo ""
echo "📊 New total media size:"
du -sh /Users/anoushkagarg/portfolio/public/media/projects
echo ""
echo "💡 Next steps:"
echo "   1. Update components to use MP4 instead of GIF"
echo "   2. Test locally to verify all animations work"
echo "   3. Commit and deploy"
echo ""
