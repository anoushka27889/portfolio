#!/bin/bash
# Image Compression Script
# Compresses PNG/JPG images while maintaining visual quality
# Target: Reduce 13MB images to ~200-500KB

set -e

echo "🗜️  Image Compression Script"
echo "================================"
echo ""

# Check if imagemagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Installing..."
    brew install imagemagick
fi

# Check if pngquant is installed (better PNG compression)
if ! command -v pngquant &> /dev/null; then
    echo "📦 Installing pngquant for better PNG compression..."
    brew install pngquant
fi

# Backup original files
BACKUP_DIR="$HOME/portfolio-media-backup-$(date +%Y%m%d-%H%M%S)"
echo "📁 Creating backup at: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"
cp -R public/media/projects "$BACKUP_DIR/"
echo "✅ Backup complete"
echo ""

# Compression function for PNG files
compress_png() {
    local file="$1"
    local size_before=$(du -h "$file" | cut -f1)

    echo "  Compressing: $(basename "$file") (was: $size_before)"

    # Use pngquant for lossy compression (visually lossless, 70-90% reduction)
    # --quality 80-95 maintains excellent visual quality
    pngquant --quality=80-95 --skip-if-larger --ext .png --force "$file" 2>/dev/null || {
        # Fallback to ImageMagick if pngquant fails
        convert "$file" -strip -quality 85 -define png:compression-level=9 "$file"
    }

    local size_after=$(du -h "$file" | cut -f1)
    echo "  ✓ Done: $size_after"
}

# Compression function for JPG files
compress_jpg() {
    local file="$1"
    local size_before=$(du -h "$file" | cut -f1)

    echo "  Compressing: $(basename "$file") (was: $size_before)"

    # Strip metadata, optimize, quality 85 (visually identical to 100)
    convert "$file" -strip -interlace Plane -quality 85 "$file"

    local size_after=$(du -h "$file" | cut -f1)
    echo "  ✓ Done: $size_after"
}

# Find and compress large PNG files (over 1MB)
echo "🖼️  Compressing large PNG files..."
find public/media/projects -type f -name "*.png" -size +1M | while read file; do
    compress_png "$file"
done
echo ""

# Find and compress large JPG files (over 500KB)
echo "🖼️  Compressing large JPG files..."
find public/media/projects -type f \( -name "*.jpg" -o -name "*.jpeg" \) -size +500k | while read file; do
    compress_jpg "$file"
done
echo ""

# Summary
echo "================================"
echo "✅ Compression Complete!"
echo ""
echo "📊 Size comparison:"
BEFORE=$(du -sh "$BACKUP_DIR/projects" | cut -f1)
AFTER=$(du -sh public/media/projects | cut -f1)
echo "  Before: $BEFORE"
echo "  After:  $AFTER"
echo ""
echo "💾 Backup location: $BACKUP_DIR"
echo "   (You can delete this once you verify everything looks good)"
echo ""
echo "🚀 Next steps:"
echo "   1. Test locally: npm run dev"
echo "   2. Verify images look good"
echo "   3. Commit and push to trigger Vercel deployment"
echo ""
