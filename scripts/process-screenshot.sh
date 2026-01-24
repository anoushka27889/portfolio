#!/bin/bash

# Process a single screenshot: preserve original, create resized version
# Usage: ./scripts/process-screenshot.sh <file-path>

FILE="$1"
MAX_WIDTH=2000
SCREENSHOTS_DIR="$HOME/portfolio/screenshots"
ORIGINAL_DIR="$SCREENSHOTS_DIR/original"
RESIZED_DIR="$SCREENSHOTS_DIR/resized"

# Exit if file doesn't exist
[ ! -f "$FILE" ] && exit 0

# Ensure directories exist
mkdir -p "$ORIGINAL_DIR"
mkdir -p "$RESIZED_DIR"

# Get file extension and base name
ext="${FILE##*.}"
original_name=$(basename "$FILE")

# Generate timestamp-based filename
timestamp=$(date +"%Y-%m-%d-%H%M%S")
new_name="screenshot-${timestamp}.${ext}"

# Define paths
original_path="$ORIGINAL_DIR/$new_name"
resized_path="$RESIZED_DIR/$new_name"

# Get current width
width=$(sips -g pixelWidth "$FILE" 2>/dev/null | grep pixelWidth | awk '{print $2}')

# Skip if width couldn't be determined (not an image)
if [ -z "$width" ]; then
  echo "Skipping: $original_name (not an image)"
  exit 0
fi

echo "Processing: $original_name (${width}px)"

# Step 1: Copy original to original folder
cp "$FILE" "$original_path"
echo "  ✓ Original saved to: original/$new_name"

# Step 2: Create resized version (always, even if no resize needed)
if [ "$width" -gt "$MAX_WIDTH" ] 2>/dev/null; then
  echo "  → Resizing from ${width}px to ${MAX_WIDTH}px"
  sips --resampleWidth "$MAX_WIDTH" "$FILE" --out "$resized_path" > /dev/null 2>&1
else
  echo "  → No resize needed, copying as-is"
  cp "$FILE" "$resized_path"
fi
echo "  ✓ Resized version saved to: resized/$new_name"

# Step 3: Remove the original file from screenshots root
rm "$FILE"

echo "✓ Done: $new_name"
