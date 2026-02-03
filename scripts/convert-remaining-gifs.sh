#!/bin/bash
# Convert all remaining GIFs over 200KB

find /Users/anoushkagarg/portfolio/public/media/projects -name "*.gif" -size +200k | while read gif; do
  mp4="${gif%.gif}.mp4"
  if [ ! -f "$mp4" ]; then
    echo "Converting $(basename $gif)..."
    ffmpeg -i "$gif" -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -crf 18 -preset fast -y "$mp4" 2>&1 | grep "time=" | tail -1 || true
    if [ -f "$mp4" ]; then
      rm "$gif"
      echo "✓ Converted and removed GIF"
    fi
  fi
done

echo "Done converting remaining GIFs"
du -sh /Users/anoushkagarg/portfolio/public/media/projects
