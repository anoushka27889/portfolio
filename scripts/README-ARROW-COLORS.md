# Arrow Color Analysis Script

## Purpose

This script analyzes slideshow images to determine optimal arrow colors for a11y (accessibility) contrast compliance. Arrow colors are pre-computed and hard-coded in the project data instead of being calculated at runtime for better performance.

## When to Use

Run this script whenever you:
- Add new slideshow images to any project
- Replace existing slideshow images
- Notice that arrow colors don't provide good contrast

## How It Works

The script:
1. Loads each image from the `public/` directory
2. Samples the left and right edges (where slideshow arrows appear)
3. Calculates average brightness using the luminance formula: `brightness = r * 0.299 + g * 0.587 + b * 0.114`
4. Determines arrow color based on brightness threshold:
   - **Brightness > 200**: Use `#767676` (light charcoal) - for very light backgrounds
   - **Brightness ≤ 200**: Use `white` (default) - for darker backgrounds

## Color Choices

- **White (`'white'`)**: Default arrow color, used on darker backgrounds
- **Light Charcoal (`'#767676'`)**: Used on very light backgrounds
  - This is the lightest gray that maintains WCAG AA contrast (4.5:1) on white
  - Ensures arrows remain visible on light backgrounds

## Usage

```bash
# Run the analysis script
tsx scripts/analyze-arrow-colors.ts
```

The script will:
1. Analyze all images in all projects
2. Display results with visual indicators:
   - 🖼️ = Image file
   - 🎬 = Video file (uses poster if available)
   - 🌙 = Dark background (brightness ≤ 200) → WHITE arrows
   - ☀️ = Light background (brightness > 200) → DARK arrows
3. Generate TypeScript code at the end

## Example Output

```
Project 6: ÜPP
────────────────────────────────────────────────────────────
🖼️ 🌙 WHITE (155) /media/projects/upp/UPP_8_AnoushkaGarg.jpg
🖼️ 🌙 WHITE (149) /media/projects/upp/Children_Value.jpg
🖼️ 🌙 WHITE (147) /media/projects/upp/UPP1_Website.jpg
🖼️ 🌙 WHITE (150) /media/projects/upp/What_is_UPP_Slide.jpg

============================================================
GENERATED CODE - Copy to projects-data.ts
============================================================

  // Project 6: ÜPP
  arrowColors: ['white', 'white', 'white', 'white'],
```

## Updating Project Data

1. Run the script
2. Copy the generated `arrowColors` arrays from the output
3. Paste them into the corresponding project entries in `lib/projects-data.ts`
4. Ensure each project's `arrowColors` array has the same length as its `images` array

## Performance Benefits

### Before (Runtime Analysis)
- ~100 lines of brightness analysis code
- Canvas operations on every slide change
- DOM queries to find img elements
- Pixel-by-pixel brightness calculations
- 300ms delay for analysis

### After (Pre-computed)
- Simple array lookup: `arrowColors[currentIndex]`
- Instant color switching
- No runtime computation
- No DOM manipulation
- No memory allocations

## Video Handling

For video files (`.mp4`, `.webm`, `.mov`):
- Script looks for poster image at `{video-name}-poster.jpg`
- If poster exists, analyzes the poster image
- If no poster, defaults to white arrows
- Examples:
  - `slideshow-1.mp4` → looks for `slideshow-1-poster.jpg`
  - `video.webm` → looks for `video-poster.jpg`

## Troubleshooting

**Script fails to load an image:**
- Check that the image file exists in `public/media/projects/`
- Verify the image path in `projects-data.ts` is correct
- For unsupported formats, the script defaults to `white`

**Arrow colors don't match expectations:**
- The brightness threshold (200) is tuned for WCAG AA compliance
- You can adjust the threshold in the script if needed
- Remember: higher brightness = lighter background = darker arrows needed

## Dependencies

- `canvas`: Node.js canvas implementation for image analysis
- Already installed as dev dependency

```json
{
  "devDependencies": {
    "canvas": "^2.x.x"
  }
}
```
