#!/bin/bash

# Extract first frame from all MP4 videos as poster images
# Usage: ./scripts/extract-video-posters.sh

echo "Extracting first frames from all videos..."

# Find all .mp4 files in public/media
find public/media -type f -name "*.mp4" | while read -r video; do
  # Get the base name without extension
  base="${video%.mp4}"
  poster="${base}-poster.jpg"

  # Skip if poster already exists
  if [ -f "$poster" ]; then
    echo "✓ Poster already exists: $poster"
    continue
  fi

  echo "Extracting frame from: $video"

  # Extract first frame at 0.1 seconds (to avoid black frames at start)
  # -q:v 2 = high quality JPEG (1-31, lower is better)
  # -vframes 1 = extract only 1 frame
  ffmpeg -i "$video" -ss 00:00:00.1 -vframes 1 -q:v 2 "$poster" -y 2>/dev/null

  if [ $? -eq 0 ]; then
    # Get file sizes
    video_size=$(du -h "$video" | cut -f1)
    poster_size=$(du -h "$poster" | cut -f1)
    echo "  ✓ Created: $poster (Video: $video_size, Poster: $poster_size)"
  else
    echo "  ✗ Failed to extract frame from: $video"
  fi
done

echo ""
echo "Done! Poster images created."
echo "Summary:"
find public/media -type f -name "*-poster.jpg" | wc -l | xargs echo "Total posters:"
find public/media -type f -name "*-poster.jpg" -exec du -ch {} + | grep total$ | cut -f1 | xargs echo "Total size:"
