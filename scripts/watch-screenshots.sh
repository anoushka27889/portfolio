#!/bin/bash

# Watch screenshots folder and auto-process new files
# Usage: ./scripts/watch-screenshots.sh

SCREENSHOTS_DIR="$HOME/portfolio/screenshots"
PROCESS_SCRIPT="$HOME/portfolio/scripts/process-screenshot.sh"

echo "🔍 Watching $SCREENSHOTS_DIR for new screenshots..."
echo "Drop files here and they'll be auto-processed!"
echo "Press Ctrl+C to stop."
echo ""

# Watch for new files and process them
fswatch -0 -e ".*" -i "\\.png$" -i "\\.jpg$" -i "\\.jpeg$" -i "\\.gif$" -i "\\.PNG$" -i "\\.JPG$" -i "\\.JPEG$" -i "\\.GIF$" "$SCREENSHOTS_DIR" | while read -d "" file
do
  # Wait a moment for file to finish copying
  sleep 0.5

  # Skip if file doesn't exist (might have been already processed)
  [ ! -f "$file" ] && continue

  # Skip if already processed (has screenshot- prefix)
  basename=$(basename "$file")
  [[ "$basename" =~ ^screenshot- ]] && continue

  # Process the file
  "$PROCESS_SCRIPT" "$file"
  echo ""
done
