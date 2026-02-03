#!/bin/bash
# Aggressive Image Optimization
# Targets: Large PNGs that didn't compress enough
# Converts PNG → WebP where appropriate (50-80% size reduction)

set -e

echo "🚀 Aggressive Image Optimization"
echo "================================"
echo ""

# Function to convert PNG to WebP and replace if smaller
convert_to_webp() {
    local png_file="$1"
    local webp_file="${png_file%.png}.webp"
    local dir=$(dirname "$png_file")
    local base=$(basename "$png_file" .png)

    local size_before=$(du -k "$png_file" | cut -f1)

    echo "  Converting: $(basename "$png_file") ($(du -h "$png_file" | cut -f1))"

    # Convert to WebP with high quality (90 = visually lossless)
    cwebp -q 90 -m 6 -mt "$png_file" -o "$webp_file" 2>/dev/null || {
        echo "  ⚠️  WebP conversion failed, trying aggressive PNG compression..."
        # Fallback: very aggressive PNG compression
        pngquant --quality=70-85 --skip-if-larger --ext .png --force "$png_file"
        return
    }

    local size_after=$(du -k "$webp_file" | cut -f1)
    local savings=$((100 - (size_after * 100 / size_before)))

    if [ $savings -gt 30 ]; then
        # WebP is significantly smaller, keep it
        rm "$png_file"
        echo "  ✅ Converted to WebP: $(du -h "$webp_file" | cut -f1) (saved ${savings}%)"
    else
        # Not much savings, keep PNG and delete WebP
        rm "$webp_file"
        pngquant --quality=70-85 --skip-if-larger --ext .png --force "$png_file"
        echo "  ✓ Kept as PNG: $(du -h "$png_file" | cut -f1)"
    fi
}

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo "📦 Installing WebP tools..."
    brew install webp
    echo ""
fi

# Find large PNGs (over 1.5MB) and optimize them
echo "🎯 Targeting large images (>1.5MB)..."
echo ""

find public/media/projects -type f -name "*.png" -size +1500k | while read file; do
    convert_to_webp "$file"
done

echo ""
echo "================================"
echo "✅ Aggressive optimization complete!"
echo ""
echo "📊 New total size:"
du -sh public/media/projects | cut -f1
echo ""
