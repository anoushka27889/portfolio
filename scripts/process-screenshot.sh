#!/bin/bash

# Process a single screenshot: resize if needed and rename with timestamp
# Usage: ./scripts/process-screenshot.sh <file-path>

FILE="$1"
MAX_WIDTH=2000

# Exit if file doesn't exist
[ ! -f "$FILE" ] && exit 0

# Get file extension and base directory
ext="${FILE##*.}"
dir=$(dirname "$FILE")
original_name=$(basename "$FILE")

# Generate timestamp-based filename
timestamp=$(date +"%Y-%m-%d-%H%M%S")
new_name="screenshot-${timestamp}.${ext}"
new_path="${dir}/${new_name}"

# Get current width
width=$(sips -g pixelWidth "$FILE" 2>/dev/null | grep pixelWidth | awk '{print $2}')

# Skip if width couldn't be determined (not an image)
if [ -z "$width" ]; then
  echo "Skipping: $original_name (not an image)"
  exit 0
fi

# Resize if needed
if [ "$width" -gt "$MAX_WIDTH" ] 2>/dev/null; then
  echo "Processing: $original_name"
  echo "  → Resizing from ${width}px to ${MAX_WIDTH}px"
  sips --resampleWidth "$MAX_WIDTH" "$FILE" --out "$FILE" > /dev/null 2>&1
  echo "  → Renaming to $new_name"
  mv "$FILE" "$new_path"
  echo "✓ Done: $new_name"
else
  echo "Processing: $original_name"
  echo "  → Size OK (${width}px)"
  echo "  → Renaming to $new_name"
  mv "$FILE" "$new_path"
  echo "✓ Done: $new_name"
fi
