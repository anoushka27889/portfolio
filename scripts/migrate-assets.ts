#!/usr/bin/env tsx

/**
 * Asset Migration Script
 *
 * This script methodically scrapes media from anoushkagarg.com and organizes it
 * for the Next.js portfolio site with complete tracking and reporting.
 */

import fs from 'fs'
import path from 'path'
import https from 'https'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)

interface MediaAsset {
  url: string
  type: 'image' | 'video'
  sourcePageUrl: string
  destinationPath: string
  downloaded: boolean
  error?: string
}

interface ProjectAssets {
  projectSlug: string
  homepage: MediaAsset[]
  detailPage: MediaAsset[]
}

interface MigrationReport {
  timestamp: string
  projectsProcessed: string[]
  totalAssets: number
  successfulDownloads: number
  failedDownloads: number
  missing: string[]
  risks: string[]
  assets: ProjectAssets[]
}

const PROJECTS = [
  { slug: 'rest', url: 'https://anoushkagarg.com/rest' },
  { slug: 'lumen', url: 'https://anoushkagarg.com/lumen' },
  { slug: 'unge-univers', url: 'https://anoushkagarg.com/unge-univers' },
  { slug: 'fotex', url: 'https://anoushkagarg.com/fotex' },
  { slug: 'upp', url: 'https://anoushkagarg.com/upp' },
  { slug: 'the-other-side', url: 'https://anoushkagarg.com/the-other-side' },
]

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'media', 'projects')
const REPORT_DIR = path.join(process.cwd(), 'scripts', 'migration-reports')

async function fetchHTML(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', (chunk) => data += chunk)
      res.on('end', () => resolve(data))
      res.on('error', reject)
    }).on('error', reject)
  })
}

async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const fileStream = fs.createWriteStream(filepath)
      res.pipe(fileStream)
      fileStream.on('finish', () => {
        fileStream.close()
        resolve()
      })
      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {}) // Delete partial file
        reject(err)
      })
    }).on('error', reject)
  })
}

function extractImageUrls(html: string): string[] {
  const imageRegex = /https:\/\/static1?\.squarespace\.com\/[^"'\s]+\.(jpg|jpeg|png|gif|webp)/gi
  const matches = html.match(imageRegex) || []
  // Deduplicate
  return [...new Set(matches)]
}

function extractVimeoUrls(html: string): string[] {
  const vimeoRegex = /https:\/\/(?:player\.)?vimeo\.com\/[^"'\s]+/gi
  const matches = html.match(vimeoRegex) || []
  return [...new Set(matches)]
}

function sanitizeFilename(url: string, index: number): string {
  const urlObj = new URL(url)
  const pathname = urlObj.pathname
  const filename = path.basename(pathname)

  // If filename is too generic or missing, create numbered filename
  if (!filename || filename.length < 5) {
    const ext = path.extname(pathname) || '.jpg'
    return `image-${index}${ext}`
  }

  return filename
}

async function scrapeHomepage(): Promise<MediaAsset[]> {
  console.log('📄 Scraping homepage: https://anoushkagarg.com')

  const html = await fetchHTML('https://anoushkagarg.com')
  const imageUrls = extractImageUrls(html)

  console.log(`   Found ${imageUrls.length} images on homepage`)

  return imageUrls.map((url, i) => ({
    url,
    type: 'image' as const,
    sourcePageUrl: 'https://anoushkagarg.com',
    destinationPath: path.join(OUTPUT_DIR, 'homepage', sanitizeFilename(url, i)),
    downloaded: false,
  }))
}

async function scrapeProjectPage(project: { slug: string; url: string }): Promise<ProjectAssets> {
  console.log(`📄 Scraping ${project.slug}: ${project.url}`)

  const html = await fetchHTML(project.url)
  const imageUrls = extractImageUrls(html)
  const vimeoUrls = extractVimeoUrls(html)

  console.log(`   Found ${imageUrls.length} images, ${vimeoUrls.length} videos`)

  const imageAssets: MediaAsset[] = imageUrls.map((url, i) => ({
    url,
    type: 'image' as const,
    sourcePageUrl: project.url,
    destinationPath: path.join(OUTPUT_DIR, project.slug, sanitizeFilename(url, i)),
    downloaded: false,
  }))

  const videoAssets: MediaAsset[] = vimeoUrls.map((url) => ({
    url,
    type: 'video' as const,
    sourcePageUrl: project.url,
    destinationPath: '', // Videos are URLs, not downloaded
    downloaded: true, // Mark as "downloaded" since we just use the URL
  }))

  return {
    projectSlug: project.slug,
    homepage: [],
    detailPage: [...imageAssets, ...videoAssets],
  }
}

async function downloadAsset(asset: MediaAsset, report: MigrationReport): Promise<void> {
  if (asset.type === 'video') {
    // Videos are just URLs, no download needed
    asset.downloaded = true
    return
  }

  try {
    const dir = path.dirname(asset.destinationPath)
    await mkdir(dir, { recursive: true })

    await downloadImage(asset.url, asset.destinationPath)
    asset.downloaded = true
    console.log(`   ✓ Downloaded: ${path.basename(asset.destinationPath)}`)
  } catch (error) {
    asset.downloaded = false
    asset.error = error instanceof Error ? error.message : 'Unknown error'
    console.error(`   ✗ Failed: ${asset.url} - ${asset.error}`)
    report.failedDownloads++
  }
}

async function generateMigrationReport(report: MigrationReport): Promise<void> {
  await mkdir(REPORT_DIR, { recursive: true })

  const reportPath = path.join(REPORT_DIR, `migration-${Date.now()}.json`)
  await writeFile(reportPath, JSON.stringify(report, null, 2))

  // Generate human-readable summary
  const summaryPath = path.join(REPORT_DIR, `migration-${Date.now()}.md`)
  const summary = `# Asset Migration Report
Generated: ${report.timestamp}

## Summary
- Projects Processed: ${report.projectsProcessed.length}
- Total Assets Found: ${report.totalAssets}
- Successfully Downloaded: ${report.successfulDownloads}
- Failed Downloads: ${report.failedDownloads}

## Projects
${report.projectsProcessed.map(p => `- ${p}`).join('\n')}

## Risks & Warnings
${report.risks.length > 0 ? report.risks.map(r => `- ⚠️  ${r}`).join('\n') : '✅ No risks identified'}

## Missing Assets
${report.missing.length > 0 ? report.missing.map(m => `- 🔍 ${m}`).join('\n') : '✅ All expected assets found'}

## Failed Downloads
${report.assets.flatMap(p => [...p.homepage, ...p.detailPage])
  .filter(a => !a.downloaded)
  .map(a => `- ${a.url}\n  Error: ${a.error}`)
  .join('\n') || '✅ All downloads successful'}

## Next Steps
1. Review this report for any risks or missing assets
2. Run the data file generation script to update projects-data.ts
3. Test the site locally to verify all images load correctly
4. If assets are missing, run targeted scrape scripts for specific pages
`

  await writeFile(summaryPath, summary)

  console.log(`\n📊 Report saved to: ${reportPath}`)
  console.log(`📊 Summary saved to: ${summaryPath}`)
}

async function main() {
  console.log('🚀 Starting Asset Migration\n')

  const report: MigrationReport = {
    timestamp: new Date().toISOString(),
    projectsProcessed: [],
    totalAssets: 0,
    successfulDownloads: 0,
    failedDownloads: 0,
    missing: [],
    risks: [],
    assets: [],
  }

  try {
    // 1. Scrape homepage
    console.log('=== HOMEPAGE ===')
    const homepageAssets = await scrapeHomepage()

    if (homepageAssets.length === 0) {
      report.risks.push('No images found on homepage - may need manual verification')
    }

    // Download homepage assets
    for (const asset of homepageAssets) {
      await downloadAsset(asset, report)
      if (asset.downloaded) report.successfulDownloads++
    }

    // 2. Scrape each project page
    console.log('\n=== PROJECT PAGES ===')
    for (const project of PROJECTS) {
      const projectAssets = await scrapeProjectPage(project)
      report.assets.push(projectAssets)
      report.projectsProcessed.push(project.slug)

      // Download project assets
      for (const asset of projectAssets.detailPage) {
        await downloadAsset(asset, report)
        if (asset.downloaded) report.successfulDownloads++
      }

      // Check for expected content
      if (projectAssets.detailPage.length === 0) {
        report.missing.push(`${project.slug}: No media assets found`)
      }
    }

    // Add homepage assets to report
    if (homepageAssets.length > 0) {
      report.assets.unshift({
        projectSlug: 'homepage',
        homepage: homepageAssets,
        detailPage: [],
      })
    }

    report.totalAssets = report.successfulDownloads + report.failedDownloads

    // Generate report
    await generateMigrationReport(report)

    console.log('\n✅ Migration Complete!')
    console.log(`   Total: ${report.totalAssets} assets`)
    console.log(`   Success: ${report.successfulDownloads}`)
    console.log(`   Failed: ${report.failedDownloads}`)

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

main()
