# Adding New Projects to Portfolio

This guide walks through the complete process of adding a new project to your portfolio.

## Quick Overview

Adding a new project involves:
1. Preparing media assets (images/videos)
2. Adding project data to the homepage
3. Optionally creating a detailed case study page

---

## Step 1: Prepare Media Assets

### Media Directory Structure
All project media goes in: `public/media/projects/[project-slug]/`

Example:
```
public/media/projects/my-new-project/
├── slideshow-1.png
├── slideshow-2.mp4
├── video-1.mp4
├── video-1-poster.jpg
└── hero-image.png
```

### Media Optimization Guidelines

**Images (PNG/JPG):**
- Target size: < 500KB per image
- Use pngquant for PNG compression:
  ```bash
  pngquant --quality=80-95 --force --output optimized.png original.png
  ```
- For JPG, use quality 85

**Videos (MP4):**
- Target bitrate: 1200-1400 kbps for good quality
- Compress with ffmpeg:
  ```bash
  ffmpeg -i input.mp4 -c:v libx264 -b:v 1400k -preset slow \
         -c:a aac -b:a 128k -movflags +faststart output.mp4
  ```
- Always include a poster image for videos:
  ```bash
  ffmpeg -i video.mp4 -ss 00:00:01 -vframes 1 video-poster.jpg
  ```

---

## Step 2: Add Project to Homepage

### 2.1 Add Project Entry

Edit `lib/projects-data.ts` and add your project to the `projects` array:

```typescript
{
  id: 10, // Use next available ID
  client: "Client Name",
  year: "2025",
  title: "Brief project description that appears on homepage",
  images: [
    "/media/projects/my-project/slideshow-1.png",
    "/media/projects/my-project/slideshow-2.mp4",
    "/media/projects/my-project/slideshow-3.png"
  ],
  arrowColors: ['white', 'white', 'white'], // Placeholder - will compute in next step
  hasCaseStudy: true, // Set to true if adding case study
  url: "/my-project", // URL path for the project
  comingSoon: false // Set to true if case study not ready yet
}
```

### 2.2 Compute Arrow Colors for Accessibility

Run the arrow color analysis script to determine optimal contrast:

```bash
tsx scripts/analyze-arrow-colors.ts
```

This script:
- Analyzes the edges of each image/video frame
- Determines whether white or dark (#767676) arrows provide better contrast
- Outputs the `arrowColors` array to copy into your project data

Copy the generated `arrowColors` array and paste it into your project entry.

**Example output:**
```typescript
arrowColors: ['white', '#767676', 'white']
```

---

## Step 3: Create Case Study Page (Optional)

### 3.1 Create Project Directory

Create a new directory in `app/`:
```bash
mkdir app/my-project
```

### 3.2 Create page.tsx

Create `app/my-project/page.tsx` with this structure:

```typescript
import WorkContainer from '@/components/WorkContainer'

export default function MyProjectPage() {
  return <WorkContainer projectId={10} />
}

export const metadata = {
  title: 'My Project - Anoushka Garg',
  description: 'Brief description for SEO'
}
```

### 3.3 Add Case Study Content

Edit `lib/case-studies-data.ts` and add your case study:

```typescript
{
  projectId: 10, // Must match the ID in projects-data.ts
  year: '2025',
  team: 'With product, engineering, design teams at Client',
  role: 'Role: UX & Product Design Lead',
  challenge: 'Detailed description of the problem/challenge...',

  // Optional hero video/image at top of page
  heroMedia: '/media/projects/my-project/hero-video.mp4',
  heroHasAudio: true, // Set true if video has audio (shows controls)
  heroPoster: '/media/projects/my-project/hero-video-poster.jpg',

  // Process blocks - the main content sections
  processBlocks: [
    {
      header: 'Section Title',
      description: 'Detailed description of this part of the process...',
      media: '/media/projects/my-project/video-1.mp4', // Single image/video
      mediaHasAudio: false // Optional: set true if video has audio
    },
    {
      header: 'Another Section',
      description: 'More details...',
      media: [ // Multiple images create a slideshow
        '/media/projects/my-project/slide-1.png',
        '/media/projects/my-project/slide-2.png'
      ]
    }
  ],

  outcome: 'Final results and impact. Can use <br/><br/> for paragraphs.'
}
```

---

## Step 4: Test Locally

```bash
npm run dev
```

Check:
1. Project appears on homepage with correct slideshow
2. Arrow colors have good contrast
3. Case study page loads correctly
4. All videos/images load properly
5. Mobile responsiveness looks good

---

## Step 5: Deploy

```bash
git add .
git commit -m "Add [Project Name] to portfolio"
git push
```

Vercel will automatically build and deploy.

---

## Project Structure Reference

```
portfolio/
├── app/
│   ├── my-project/          # Case study page
│   │   └── page.tsx
│   └── page.tsx             # Homepage
├── lib/
│   ├── projects-data.ts     # Homepage project listings
│   └── case-studies-data.ts # Detailed case study content
├── public/media/projects/
│   └── my-project/          # All project media
│       ├── slideshow-*.png/mp4
│       ├── video-*.mp4
│       └── *-poster.jpg
└── scripts/
    └── analyze-arrow-colors.ts

```

---

## Tips & Best Practices

1. **Media First**: Prepare and optimize all media before adding data
2. **Arrow Colors**: Always run the analysis script for accessibility
3. **Video Posters**: Always include poster images (video-name-poster.jpg)
4. **Test on Mobile**: Check responsiveness, especially touch targets
5. **Clean Console**: No errors should appear in browser console
6. **File Sizes**: Keep homepage assets < 1MB each for fast loading
7. **Commit Often**: Commit media separately from code changes
8. **Case Study Optional**: Can add project to homepage first, case study later

---

## Troubleshooting

**Images not loading:**
- Check file paths are correct (case-sensitive)
- Ensure files are in `public/` directory
- Hard refresh browser (Cmd+Shift+R)

**Arrow colors wrong:**
- Re-run `tsx scripts/analyze-arrow-colors.ts`
- Copy the exact output to projects-data.ts
- Clear browser cache

**Videos not playing:**
- Ensure video format is MP4 (H.264)
- Check video codec: `ffmpeg -i video.mp4`
- Add poster image for better loading experience

**Case study not found:**
- Verify projectId matches in both files
- Check URL in projects-data.ts matches folder name
- Restart dev server

---

## Need Help?

- Review existing projects in `lib/projects-data.ts` for examples
- Check similar case studies in `lib/case-studies-data.ts`
- Test thoroughly on mobile before deploying
