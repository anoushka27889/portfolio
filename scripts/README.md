# Asset Migration Scripts

Scripts to migrate media assets from anoushkagarg.com (Squarespace) to the Next.js portfolio.

## Overview

Since Squarespace loads images dynamically via JavaScript, we use a manual URL extraction method combined with automated download and organization scripts.

## Migration Process

### Step 1: Extract URLs from Squarespace (Manual)
See **`extract-urls-guide.md`** for detailed instructions.

Use browser DevTools JavaScript console to extract image and video URLs from each page on anoushkagarg.com.

### Step 2: Import URLs (Automated)
**Script:** `import-urls.ts`

Reads your collected URL JSON files and downloads all images.

### Step 3: Update Data Files (Automated)
**Script:** `update-data-files.ts`

Updates `lib/projects-data.ts` with the new local image paths.

## Complete Workflow

### Step 1: Extract URLs from Browser

Follow the guide in **`extract-urls-guide.md`**:

1. Visit https://anoushkagarg.com
2. Open browser DevTools Console (`Cmd+Option+J`)
3. Run the JavaScript extraction script
4. Save output to `scripts/url-data/urls-homepage.json`
5. Repeat for each project page:
   - /rest → `urls-rest.json`
   - /lumen → `urls-lumen.json`
   - /unge-univers → `urls-unge-univers.json`
   - /fotex → `urls-fotex.json`
   - /upp → `urls-upp.json`
   - /the-other-side → `urls-the-other-side.json`

### Step 2: Import and Download Images

```bash
tsx scripts/import-urls.ts
```

**What happens:**
- Reads all JSON files from `scripts/url-data/`
- Downloads images to `public/media/projects/{project}/`
- Skips already-downloaded files
- Generates detailed report

**Expected output:**
```
🚀 Starting URL Import

📖 Loaded: urls-homepage.json (16 images, 0 videos)
📖 Loaded: urls-rest.json (8 images, 1 videos)
...

📦 Processing homepage...
   ✓ Downloaded: image-1.jpg
   ⏭️  Skipped (exists): image-2.jpg
   ...

✅ Import Complete!
   Total: 95 assets
   Success: 94
   Failed: 1
```

### Step 3: Update Data Files

```bash
tsx scripts/update-data-files.ts
```

This automatically updates `lib/projects-data.ts` with the correct local paths.

### Step 4: Test

```bash
npm run dev
```

Visit http://localhost:3000 and verify all images load correctly.

## File Organization

```
public/media/projects/
├── homepage/
│   ├── image-1.jpg
│   ├── image-2.jpg
│   └── ...
├── rest/
│   ├── hero.jpg
│   ├── process-1.jpg
│   └── ...
├── lumen/
│   ├── hero.jpg
│   └── ...
└── ...
```

## Migration Report Structure

### JSON Report (`migration-{timestamp}.json`)
Complete machine-readable record of migration:
```json
{
  "timestamp": "2026-01-24T...",
  "projectsProcessed": ["rest", "lumen", ...],
  "totalAssets": 95,
  "successfulDownloads": 94,
  "failedDownloads": 1,
  "missing": [],
  "risks": ["Large file: ..."],
  "assets": [
    {
      "projectSlug": "rest",
      "detailPage": [
        {
          "url": "https://static1.squarespace.com/...",
          "type": "image",
          "destinationPath": "/Users/.../public/media/projects/rest/hero.jpg",
          "downloaded": true
        }
      ]
    }
  ]
}
```

### Markdown Summary (`migration-{timestamp}.md`)
Human-readable summary for quick review

## Troubleshooting

### Issue: "No images found"
**Cause:** Website structure may have changed
**Solution:**
1. Check migration report for risks
2. Manually visit the page to verify images exist
3. Update regex patterns in `migrate-assets.ts` if needed

### Issue: Failed downloads
**Cause:** Network issues, CORS, or invalid URLs
**Solution:**
1. Check the "Failed Downloads" section in report
2. Try downloading failed URLs manually
3. Re-run migration script (it will skip existing files)

### Issue: Images not showing on site
**Cause:** Incorrect paths in data files
**Solution:**
1. Check migration report for correct paths
2. Verify files exist in `public/media/projects/`
3. Ensure `update-data-files.ts` ran successfully
4. Check browser console for 404 errors

## Re-running Migration

Safe to re-run at any time:
- Existing files won't be re-downloaded
- New assets will be added
- Reports track what changed

## Optimizations & Risks

The migration script flags these risks automatically:

- **Large files (>1MB):** Consider optimizing before deployment
- **Missing assets:** Pages with no media found
- **Download failures:** Network or URL issues

Check the report's "Risks & Warnings" section after each run.

## Next Steps After Migration

1. ✅ Review migration report
2. ✅ Verify all images load in browser
3. ⏳ Optimize large images if needed
4. ⏳ Update any missing case study content
5. ⏳ Deploy to production
