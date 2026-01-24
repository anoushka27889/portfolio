# Media Assets

This folder contains all local media assets for the portfolio site.

## Folder Structure

```
media/
└── projects/
    ├── hatch-ai/           # Hatch AI Sleep Agent (2025)
    ├── hatch-hardware/     # Hatch Hardware Launch (2024-2025)
    ├── rest/               # Hatch Rest (2023-2024)
    ├── lumen/              # Lumen AR Flashlight (2019-2023)
    ├── unge-univers/       # Unge Univers (2021)
    ├── fotex/              # Fotex (2021)
    ├── upp/                # ÜPP (2017)
    └── the-other-side/     # The Other Side (2017)
```

## File Naming Convention

- **Homepage slideshows:** `slideshow-[number].[ext]`
- **Process block media:** `process-[number].[ext]`

## How to Add New Media

### For Homepage Slideshows:
1. Add image/GIF to the appropriate project folder
2. Name it `slideshow-[next-number].[ext]`
3. Update `lib/projects-data.ts` to reference `/media/projects/[project]/slideshow-[number].[ext]`

### For Process Block Media:
1. Add image/GIF/video to the appropriate project folder
2. Name it `process-[number].[ext]`
3. Update `lib/case-studies-data.ts` to add `media: '/media/projects/[project]/process-[number].[ext]'` to the process block

## Supported Formats

- **Images:** PNG, JPEG, GIF
- **Videos:** Vimeo embed URLs (referenced directly in data files, not stored locally)

## Notes

- All assets in `/public` are served from the root URL
- Reference paths should start with `/media/` (e.g., `/media/projects/rest/slideshow-1.gif`)
- External Squarespace CDN URLs are kept in data files for projects where local downloads failed
- Vimeo videos are embedded via URLs, not downloaded locally
