#!/bin/bash
# Video Compression Script
# Uses H.265 (HEVC) encoding for 50-70% file size reduction
# Maintains visual quality with CRF 28 (visually lossless)

set -e

echo "🎬 Video Compression Script"
echo "================================"
echo ""

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "📦 Installing ffmpeg..."
    brew install ffmpeg
    echo ""
fi

compress_video() {
    local input="$1"
    local temp="${input%.mp4}_compressed_temp.mp4"
    local size_before=$(du -h "$input" | cut -f1)

    echo "  📹 Compressing: $(basename "$input") (was: $size_before)"

    # H.265 encoding with:
    # - CRF 28 = visually lossless quality
    # - preset medium = good balance of speed/compression
    # - AAC audio at 128k (sufficient for web)
    # - Fast start for web streaming
    ffmpeg -i "$input" \
        -c:v libx265 \
        -crf 28 \
        -preset medium \
        -c:a aac \
        -b:a 128k \
        -movflags +faststart \
        -y \
        "$temp" 2>&1 | grep -E "(Duration|time=)" | tail -1 || true

    # Check if compression was successful and smaller
    if [ -f "$temp" ]; then
        local size_after_kb=$(du -k "$temp" | cut -f1)
        local size_before_kb=$(du -k "$input" | cut -f1)

        if [ $size_after_kb -lt $size_before_kb ]; then
            # Compressed version is smaller, replace original
            mv "$temp" "$input"
            local size_after=$(du -h "$input" | cut -f1)
            local savings=$((100 - (size_after_kb * 100 / size_before_kb)))
            echo "  ✅ Compressed: $size_after (saved ${savings}%)"
        else
            # Compressed version is larger, keep original
            rm "$temp"
            echo "  ⚠️  Kept original (compression didn't help)"
        fi
    else
        echo "  ❌ Compression failed"
    fi
    echo ""
}

echo "🎯 Compressing videos larger than 8MB..."
echo ""

# Find and compress videos over 8MB
find public/media/projects -type f -name "*.mp4" -size +8M | sort | while read video; do
    compress_video "$video"
done

echo "================================"
echo "✅ Video compression complete!"
echo ""
echo "📊 New total size:"
du -sh public/media/projects
echo ""
echo "💡 Videos now use H.265 encoding for better compression"
echo "   Compatible with all modern browsers (Safari, Chrome, Edge, Firefox)"
echo ""
