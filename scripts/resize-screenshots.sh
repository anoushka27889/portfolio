#!/bin/bash

# Batch process screenshots: preserve originals, create resized versions
# Usage: ./scripts/resize-screenshots.sh

SCREENSHOTS_DIR="$HOME/portfolio/screenshots"
ORIGINAL_DIR="$SCREENSHOTS_DIR/original"
RESIZED_DIR="$SCREENSHOTS_DIR/resized"
MAX_WIDTH=2000

# Ensure directories exist
mkdir -p "$ORIGINAL_DIR"
mkdir -p "$RESIZED_DIR"

echo "Processing images in ${SCREENSHOTS_DIR}..."

# Counter for processed images
processed_count=0

# Process each image file in the screenshots directory root (not subdirectories)
shopt -s nullglob
for ext in png jpg jpeg gif PNG JPG JPEG GIF; do
  for img in "$SCREENSHOTS_DIR"/*."$ext"; do
    # Skip if no files match
    [ -e "$img" ] || continue

    filename=$(basename "$img")

    # Get current width
    width=$(sips -g pixelWidth "$img" 2>/dev/null | grep pixelWidth | awk '{print $2}')

    # Skip if width couldn't be determined
    if [ -z "$width" ]; then
      echo "Skipping: $filename (not an image)"
      continue
    fi

    echo "Processing: $filename (${width}px)"

    # Copy to original folder
    cp "$img" "$ORIGINAL_DIR/$filename"
    echo "  ✓ Original saved"

    # Create resized version
    if [ "$width" -gt "$MAX_WIDTH" ] 2>/dev/null; then
      echo "  → Resizing to ${MAX_WIDTH}px"
      sips --resampleWidth "$MAX_WIDTH" "$img" --out "$RESIZED_DIR/$filename" > /dev/null 2>&1
    else
      echo "  → No resize needed, copying as-is"
      cp "$img" "$RESIZED_DIR/$filename"
    fi
    echo "  ✓ Resized version saved"

    # Remove from root
    rm "$img"

    ((processed_count++))
  done
done

if [ $processed_count -eq 0 ]; then
  echo "No images to process."
else
  echo "Done! Processed $processed_count image(s)."
fi
