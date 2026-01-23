#!/bin/bash

# Auto-resize screenshots to max 2000px width
# Usage: ./scripts/resize-screenshots.sh

SCREENSHOTS_DIR="$HOME/portfolio/screenshots"
MAX_WIDTH=2000

echo "Checking for images over ${MAX_WIDTH}px wide in ${SCREENSHOTS_DIR}..."

# Counter for resized images
resized_count=0

# Process each image file in the screenshots directory
shopt -s nullglob
for ext in png jpg jpeg gif PNG JPG JPEG GIF; do
  for img in "$SCREENSHOTS_DIR"/*."$ext"; do
    # Skip if no files match
    [ -e "$img" ] || continue

    # Get current width
    width=$(sips -g pixelWidth "$img" 2>/dev/null | grep pixelWidth | awk '{print $2}')

    # Skip if width couldn't be determined
    [ -z "$width" ] && continue

    # Check if width exceeds max
    if [ "$width" -gt "$MAX_WIDTH" ] 2>/dev/null; then
      echo "Resizing: $(basename "$img") (${width}px → ${MAX_WIDTH}px)"
      sips --resampleWidth "$MAX_WIDTH" "$img" --out "$img" > /dev/null 2>&1
      ((resized_count++))
    fi
  done
done

if [ $resized_count -eq 0 ]; then
  echo "No images needed resizing."
else
  echo "Done! Resized $resized_count image(s)."
fi
