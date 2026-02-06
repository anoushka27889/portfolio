#!/bin/bash

# Analyze actual video content by sampling multiple frames
# This is more accurate than just looking at posters

VIDEO_PATH="$1"

if [ -z "$VIDEO_PATH" ]; then
    echo "Usage: $0 <video-path>"
    exit 1
fi

# Get video duration
DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$VIDEO_PATH")

# Sample 5 frames evenly distributed
for i in 0 2 4 6 8; do
    TIME=$(echo "scale=2; $DURATION * $i / 10" | bc)
    echo "Sampling frame at ${TIME}s"

    # Extract frame and analyze left edge
    ffmpeg -ss "$TIME" -i "$VIDEO_PATH" -vframes 1 -vf "crop=80:ih:0:0" -f image2pipe -vcodec png - 2>/dev/null | \
        convert - -colorspace Gray -format "%[fx:mean*255]" info: | \
        xargs printf "  Left edge brightness: %.0f\n"

    # Extract frame and analyze right edge
    ffmpeg -ss "$TIME" -i "$VIDEO_PATH" -vframes 1 -vf "crop=80:ih:iw-80:0" -f image2pipe -vcodec png - 2>/dev/null | \
        convert - -colorspace Gray -format "%[fx:mean*255]" info: | \
        xargs printf "  Right edge brightness: %.0f\n"

    echo ""
done
