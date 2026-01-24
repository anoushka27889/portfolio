# Asset Migration Scripts

Automated scripts to migrate media assets from anoushkagarg.com (Squarespace) to the Next.js portfolio.

## Overview

This migration system methodically scrapes, downloads, and organizes all media assets with complete tracking and reporting.

## Scripts

### 1. `migrate-assets.ts`
**Purpose:** Scrapes and downloads all images and videos from Squarespace site

**What it does:**
- Scrapes homepage for slideshow images
- Scrapes each project detail page for media
- Downloads images to organized folders
- Extracts Vimeo video URLs (no download needed)
- Generates detailed JSON and Markdown reports
- Tracks successes, failures, and risks

**Output:**
- Images saved to: `public/media/projects/{project-slug}/`
- Homepage images: `public/media/projects/homepage/`
- Reports saved to: `scripts/migration-reports/`

### 2. `update-data-files.ts`
**Purpose:** Automatically updates data files with migrated asset paths

**What it does:**
- Reads the latest migration report
- Updates `lib/projects-data.ts` with correct image paths
- Converts absolute paths to public URLs
- Preserves existing data structure
- Shows summary of what was updated

## Usage

### Step 1: Run Migration
```bash
npm install -g tsx  # If not already installed
tsx scripts/migrate-assets.ts
```

**Expected output:**
```
🚀 Starting Asset Migration

=== HOMEPAGE ===
📄 Scraping homepage: https://anoushkagarg.com
   Found 16 images on homepage
   ✓ Downloaded: image-1.jpg
   ✓ Downloaded: image-2.jpg
   ...

=== PROJECT PAGES ===
📄 Scraping rest: https://anoushkagarg.com/rest
   Found 8 images, 1 videos
   ✓ Downloaded: rest-hero.jpg
   ...

✅ Migration Complete!
   Total: 95 assets
   Success: 94
   Failed: 1
```

### Step 2: Review Migration Report

Check the generated report in `scripts/migration-reports/migration-{timestamp}.md`:

```markdown
# Asset Migration Report

## Summary
- Projects Processed: 6
- Total Assets Found: 95
- Successfully Downloaded: 94
- Failed Downloads: 1

## Risks & Warnings
- ⚠️  Large image file detected: rest-hero.jpg (3.2MB) - consider optimizing

## Missing Assets
- ✅ All expected assets found
```

### Step 3: Update Data Files
```bash
tsx scripts/update-data-files.ts
```

**Expected output:**
```
📖 Reading report: migration-1738555098955.json

📝 Updating projects-data.ts...
   ✓ Homepage: 16 images
   ✓ rest: 8 images, 1 videos
   ✓ lumen: 12 images, 2 videos
   ...

✅ projects-data.ts updated!
```

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
