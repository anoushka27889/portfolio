#!/bin/bash

# Compress videos larger than 4MB
# Usage: ./scripts/compress-large-videos.sh

echo "Compressing videos larger than 4MB..."
echo "Using CRF 28 for better compression while maintaining quality"
echo ""

total_before=0
total_after=0
count=0

# Find all videos larger than 4MB
find public/media -type f -name "*.mp4" -size +4M | while read -r video; do
  # Get file size before
  size_before=$(stat -f%z "$video" 2>/dev/null || stat -c%s "$video" 2>/dev/null)
  size_before_mb=$(du -h "$video" | cut -f1)

  echo "Compressing: $video (Current: $size_before_mb)"

  # Create temp file
  temp="${video%.mp4}_temp.mp4"

  # Compress with CRF 28 (good quality, better compression)
  ffmpeg -i "$video" \
    -c:v libx264 \
    -crf 28 \
    -preset slow \
    -movflags +faststart \
    -c:a aac -b:a 128k \
    -pix_fmt yuv420p \
    "$temp" -y 2>/dev/null

  if [ $? -eq 0 ] && [ -f "$temp" ]; then
    # Check if temp file is valid (not 0 bytes)
    temp_size=$(stat -f%z "$temp" 2>/dev/null || stat -c%s "$temp" 2>/dev/null)

    if [ "$temp_size" -gt 1000 ]; then
      # Get size after
      size_after_mb=$(du -h "$temp" | cut -f1)

      # Calculate reduction percentage
      reduction=$(echo "scale=1; (1 - $temp_size / $size_before) * 100" | bc)

      # Replace original with compressed version
      mv "$temp" "$video"

      echo "  ✓ Compressed: $size_before_mb → $size_after_mb (${reduction}% reduction)"

      count=$((count + 1))
      total_before=$((total_before + size_before))
      total_after=$((total_after + temp_size))
    else
      echo "  ✗ Failed: Output file too small, keeping original"
      rm -f "$temp"
    fi
  else
    echo "  ✗ Failed to compress"
    rm -f "$temp"
  fi

  echo ""
done

echo "Compression complete!"
echo "Files compressed: $count"

if [ $count -gt 0 ]; then
  total_before_mb=$(echo "scale=1; $total_before / 1024 / 1024" | bc)
  total_after_mb=$(echo "scale=1; $total_after / 1024 / 1024" | bc)
  total_saved_mb=$(echo "scale=1; ($total_before - $total_after) / 1024 / 1024" | bc)

  echo "Total before: ${total_before_mb}MB"
  echo "Total after: ${total_after_mb}MB"
  echo "Total saved: ${total_saved_mb}MB"
fi
