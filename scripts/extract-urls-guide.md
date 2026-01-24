# Browser DevTools Image URL Extraction Guide

Since Squarespace loads images dynamically with JavaScript, we need to extract URLs from the rendered page using browser developer tools.

## Quick Setup

Open your browser's Developer Console:
- **Chrome/Edge:** `Cmd + Option + J` (Mac) or `Ctrl + Shift + J` (Windows)
- **Firefox:** `Cmd + Option + K` (Mac) or `Ctrl + Shift + K` (Windows)
- **Safari:** Enable Developer menu in Preferences, then `Cmd + Option + C`

## Method 1: Automated JavaScript Extraction (Recommended)

### For Homepage

1. Visit: https://anoushkagarg.com
2. Open Developer Console
3. Paste this code and press Enter:

```javascript
// Extract all image URLs from homepage
const images = [];
const videos = [];

// Get all img elements
document.querySelectorAll('img').forEach(img => {
  const src = img.src || img.dataset.src || img.getAttribute('data-image');
  if (src && (src.includes('squarespace') || src.includes('static'))) {
    images.push(src);
  }
});

// Get all video/iframe elements
document.querySelectorAll('iframe, video').forEach(vid => {
  const src = vid.src || vid.dataset.src;
  if (src && src.includes('vimeo')) {
    videos.push(src);
  }
});

// Get all background images from CSS
document.querySelectorAll('[style*="background"]').forEach(el => {
  const style = el.style.backgroundImage;
  if (style) {
    const match = style.match(/url\(['"]?([^'"]+)['"]?\)/);
    if (match && match[1].includes('squarespace')) {
      images.push(match[1]);
    }
  }
});

// Remove duplicates
const uniqueImages = [...new Set(images)];
const uniqueVideos = [...new Set(videos)];

console.log('=== HOMEPAGE IMAGES ===');
uniqueImages.forEach((url, i) => console.log(`${i + 1}. ${url}`));
console.log('\n=== HOMEPAGE VIDEOS ===');
uniqueVideos.forEach((url, i) => console.log(`${i + 1}. ${url}`));

// Copy to clipboard (if supported)
const output = {
  project: 'homepage',
  images: uniqueImages,
  videos: uniqueVideos
};
copy(JSON.stringify(output, null, 2));
console.log('\n✅ URLs copied to clipboard!');
```

4. The URLs will be logged to console AND copied to clipboard
5. Paste into a text file: `urls-homepage.json`

### For Each Project Page

Repeat for each project:
- https://anoushkagarg.com/rest
- https://anoushkagarg.com/lumen
- https://anoushkagarg.com/unge-univers
- https://anoushkagarg.com/fotex
- https://anoushkagarg.com/upp
- https://anoushkagarg.com/the-other-side

Use this modified script (change project name):

```javascript
// Extract all image URLs from project page
const PROJECT_NAME = 'rest'; // CHANGE THIS for each project

const images = [];
const videos = [];

// Get all img elements
document.querySelectorAll('img').forEach(img => {
  const src = img.src || img.dataset.src || img.getAttribute('data-image');
  if (src && (src.includes('squarespace') || src.includes('static'))) {
    images.push(src);
  }
});

// Get all video/iframe elements
document.querySelectorAll('iframe, video').forEach(vid => {
  const src = vid.src || vid.dataset.src;
  if (src && src.includes('vimeo')) {
    videos.push(src);
  }
});

// Get background images
document.querySelectorAll('[style*="background"]').forEach(el => {
  const style = el.style.backgroundImage;
  if (style) {
    const match = style.match(/url\(['"]?([^'"]+)['"]?\)/);
    if (match && match[1].includes('squarespace')) {
      images.push(match[1]);
    }
  }
});

// Remove duplicates
const uniqueImages = [...new Set(images)];
const uniqueVideos = [...new Set(videos)];

console.log(`=== ${PROJECT_NAME.toUpperCase()} IMAGES ===`);
uniqueImages.forEach((url, i) => console.log(`${i + 1}. ${url}`));
console.log(`\n=== ${PROJECT_NAME.toUpperCase()} VIDEOS ===`);
uniqueVideos.forEach((url, i) => console.log(`${i + 1}. ${url}`));

const output = {
  project: PROJECT_NAME,
  images: uniqueImages,
  videos: uniqueVideos
};
copy(JSON.stringify(output, null, 2));
console.log('\n✅ URLs copied to clipboard!');
```

## Method 2: Network Tab Inspection (Alternative)

1. Visit the project page
2. Open DevTools → Network tab
3. Refresh the page
4. Filter by "Img" or "Media"
5. Look for URLs containing:
   - `images.squarespace-cdn.com`
   - `static1.squarespace.com`
   - `vimeo.com`
6. Right-click each → Copy → Copy URL
7. Paste into text file

## What to Save

Create these files in `scripts/url-data/`:

```
scripts/url-data/
  ├── urls-homepage.json
  ├── urls-rest.json
  ├── urls-lumen.json
  ├── urls-unge-univers.json
  ├── urls-fotex.json
  ├── urls-upp.json
  └── urls-the-other-side.json
```

Each file should look like:
```json
{
  "project": "rest",
  "images": [
    "https://images.squarespace-cdn.com/content/v1/6738d2af7eb1c555618825c1/...",
    "https://static1.squarespace.com/static/6738d2af7eb1c555618825c1/..."
  ],
  "videos": [
    "https://player.vimeo.com/video/123456789"
  ]
}
```

## Tips

- **Scroll the page** before running the script to load lazy-loaded images
- **Click through slideshow** if there is one to ensure all images load
- **Check console output** - it shows how many images were found
- **Videos:** Look for vimeo.com URLs specifically
- **Duplicates:** The script automatically removes duplicates

## Next Steps

After collecting URLs for all pages:

1. Run the import script: `tsx scripts/import-urls.ts`
2. Script will download all images and organize them
3. Script will update data files automatically
4. Review the migration report
5. Test locally

## Troubleshooting

**No images found?**
- Make sure you scrolled the page to load lazy images
- Check if images are in iframes (run script in iframe context)
- Try Method 2 (Network tab)

**Copy command doesn't work?**
- Manually copy the console output
- Create JSON files manually with the structure above

**Page requires login?**
- You may need to be logged into Squarespace
- Or the project pages might be unpublished
