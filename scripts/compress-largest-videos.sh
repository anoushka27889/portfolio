#!/bin/bash

# Compress only the largest videos (over 5MB)
# Using CRF 26 for good quality with better compression

echo "Compressing videos larger than 5MB with CRF 26..."

# List of large videos to compress
videos=(
  "public/media/projects/lumen/videos/video-3.mp4"
  "public/media/projects/lumen/videos/video-1.mp4"
  "public/media/projects/theotherside/videos/video-1.mp4"
  "public/media/projects/theotherside/videos/video-2.mp4"
  "public/media/projects/fotex-home/videos/video-4.mp4"
  "public/media/projects/fotex-home/videos/video-3.mp4"
  "public/media/projects/fotex-home/videos/video-2.mp4"
  "public/media/projects/unge-univers/videos/video-3.mp4"
  "public/media/projects/upp/videos/video-1.mp4"
  "public/media/projects/upp/videos/video-2.mp4"
  "public/media/projects/hatch-rest/videos/video-3.mp4"
)

for video in "${videos[@]}"; do
  if [ ! -f "$video" ]; then
    echo "✗ File not found: $video"
    continue
  fi

  size_before=$(du -h "$video" | cut -f1)
  echo "Compressing: $video ($size_before)"

  temp="${video%.mp4}_temp.mp4"

  # Compress with CRF 26
  ffmpeg -i "$video" \
    -c:v libx264 \
    -crf 26 \
    -preset slow \
    -movflags +faststart \
    -c:a aac -b:a 128k \
    -pix_fmt yuv420p \
    "$temp" -y 2>/dev/null

  if [ $? -eq 0 ] && [ -f "$temp" ] && [ -s "$temp" ]; then
    size_after=$(du -h "$temp" | cut -f1)
    mv "$temp" "$video"
    echo "  ✓ Done: $size_before → $size_after"
  else
    echo "  ✗ Failed"
    rm -f "$temp"
  fi
done

echo ""
echo "Compression complete!"
