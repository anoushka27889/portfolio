# Extract URLs from All Project Pages

This guide helps you extract image and video URLs from each project detail page on anoushkagarg.com.

## Quick Instructions

For each project page, follow these steps:

### 1. Visit the project page
### 2. Open DevTools Console (Cmd+Option+J)
### 3. Paste the extraction script below
### 4. The JSON is automatically copied to your clipboard
### 5. Tell Claude you've copied the data for that project

---

## Projects to Extract

Visit each URL and run the script:

1. **REST** - https://anoushkagarg.com/rest
2. **Lumen** - https://anoushkagarg.com/lumen
3. **Unge Univers** - https://anoushkagarg.com/unge-univers
4. **Fotex** - https://anoushkagarg.com/fotex
5. **UPP** - https://anoushkagarg.com/upp
6. **The Other Side** - https://anoushkagarg.com/the-other-side

---

## Extraction Script (Copy & Paste into Console)

```javascript
// Detect project from URL
const projectSlug = window.location.pathname.replace(/^\/|\/$/g, '') || 'homepage';

const images = [];
const videos = [];

// Extract images
document.querySelectorAll('img').forEach(img => {
  const src = img.src || img.dataset.src || img.getAttribute('data-image');
  if (src && (src.includes('squarespace') || src.includes('static'))) {
    if (!images.includes(src)) {
      images.push(src);
    }
  }
});

// Extract videos
document.querySelectorAll('video source, video').forEach(vid => {
  const src = vid.src || vid.dataset.src;
  if (src && (src.includes('squarespace') || src.includes('static'))) {
    if (!videos.includes(src)) {
      videos.push(src);
    }
  }
});

const output = {
  project: projectSlug,
  images: images,
  videos: videos
};

console.log(`\n📊 Found ${images.length} images and ${videos.length} videos for: ${projectSlug}\n`);
console.log(JSON.stringify(output, null, 2));
copy(JSON.stringify(output, null, 2));
console.log('\n✅ URLs copied to clipboard!\n');
console.log('Next: Tell Claude you have the data ready');
```

---

## What Happens Next

After you copy each project's data:
1. Tell me which project you just extracted
2. I'll save it automatically using `pbpaste`
3. After all 6 projects are done, I'll run the import and mapping scripts
4. All images will be downloaded and organized automatically

---

## Current Status

- [x] Homepage (completed)
- [ ] REST
- [ ] Lumen
- [ ] Unge Univers
- [ ] Fotex
- [ ] UPP
- [ ] The Other Side
