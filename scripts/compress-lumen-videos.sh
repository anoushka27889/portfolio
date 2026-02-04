#!/bin/bash

echo "Compressing Lumen videos with CRF 23..."
echo ""

# Compress video-1.mp4
echo "Compressing video-1.mp4 (12MB)..."
ffmpeg -i public/media/projects/lumen/videos/video-1.mp4 \
  -c:v libx264 \
  -crf 23 \
  -preset medium \
  -movflags +faststart \
  -c:a aac -b:a 128k \
  -pix_fmt yuv420p \
  public/media/projects/lumen/videos/video-1-temp.mp4 -y 2>/dev/null

if [ -f public/media/projects/lumen/videos/video-1-temp.mp4 ] && [ -s public/media/projects/lumen/videos/video-1-temp.mp4 ]; then
  original_size=$(du -h public/media/projects/lumen/videos/video-1.mp4 | cut -f1)
  new_size=$(du -h public/media/projects/lumen/videos/video-1-temp.mp4 | cut -f1)

  if [ $(stat -f%z public/media/projects/lumen/videos/video-1-temp.mp4) -lt $(stat -f%z public/media/projects/lumen/videos/video-1.mp4) ]; then
    mv public/media/projects/lumen/videos/video-1-temp.mp4 public/media/projects/lumen/videos/video-1.mp4
    echo "  ✓ Done: $original_size → $new_size"
  else
    rm public/media/projects/lumen/videos/video-1-temp.mp4
    echo "  ✗ Compressed version was larger, keeping original"
  fi
else
  echo "  ✗ Compression failed"
fi

echo ""

# Compress video-3.mp4
echo "Compressing video-3.mp4 (13MB)..."
ffmpeg -i public/media/projects/lumen/videos/video-3.mp4 \
  -c:v libx264 \
  -crf 23 \
  -preset medium \
  -movflags +faststart \
  -c:a aac -b:a 128k \
  -pix_fmt yuv420p \
  public/media/projects/lumen/videos/video-3-temp.mp4 -y 2>/dev/null

if [ -f public/media/projects/lumen/videos/video-3-temp.mp4 ] && [ -s public/media/projects/lumen/videos/video-3-temp.mp4 ]; then
  original_size=$(du -h public/media/projects/lumen/videos/video-3.mp4 | cut -f1)
  new_size=$(du -h public/media/projects/lumen/videos/video-3-temp.mp4 | cut -f1)

  if [ $(stat -f%z public/media/projects/lumen/videos/video-3-temp.mp4) -lt $(stat -f%z public/media/projects/lumen/videos/video-3.mp4) ]; then
    mv public/media/projects/lumen/videos/video-3-temp.mp4 public/media/projects/lumen/videos/video-3.mp4
    echo "  ✓ Done: $original_size → $new_size"
  else
    rm public/media/projects/lumen/videos/video-3-temp.mp4
    echo "  ✗ Compressed version was larger, keeping original"
  fi
else
  echo "  ✗ Compression failed"
fi

echo ""
echo "Compression complete!"
