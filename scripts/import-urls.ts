#!/usr/bin/env tsx

/**
 * Import URLs Script
 *
 * Reads manually-collected URL files and downloads/organizes images
 */

import fs from 'fs'
import path from 'path'
import https from 'https'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)
const readdir = promisify(fs.readdir)

interface URLData {
  project: string
  images: string[]
  videos: string[]
}

interface MigrationReport {
  timestamp: string
  projectsProcessed: string[]
  totalAssets: number
  successfulDownloads: number
  failedDownloads: number
  assets: {
    projectSlug: string
    images: Array<{
      url: string
      destinationPath: string
      downloaded: boolean
      error?: string
    }>
    videos: string[]
  }[]
}

const URL_DATA_DIR = path.join(process.cwd(), 'scripts', 'url-data')
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'media', 'projects')
const REPORT_DIR = path.join(process.cwd(), 'scripts', 'migration-reports')

async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Follow redirect
        const redirectUrl = res.headers.location
        if (redirectUrl) {
          return downloadImage(redirectUrl, filepath).then(resolve).catch(reject)
        }
      }

      const fileStream = fs.createWriteStream(filepath)
      res.pipe(fileStream)
      fileStream.on('finish', () => {
        fileStream.close()
        resolve()
      })
      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {})
        reject(err)
      })
    }).on('error', reject)
  })
}

function getFilenameFromUrl(url: string, index: number): string {
  try {
    const urlObj = new URL(url)
    let pathname = urlObj.pathname

    // Remove query parameters
    pathname = pathname.split('?')[0]

    // Get the filename
    const filename = path.basename(pathname)

    // If filename is valid and has extension, use it
    if (filename && filename.includes('.') && filename.length > 3) {
      // Clean up the filename
      return filename.replace(/[^a-zA-Z0-9.-]/g, '_')
    }

    // Otherwise create numbered filename
    const ext = path.extname(pathname) || '.jpg'
    return `image-${index + 1}${ext}`
  } catch {
    return `image-${index + 1}.jpg`
  }
}

async function loadURLData(): Promise<URLData[]> {
  await mkdir(URL_DATA_DIR, { recursive: true })

  const files = await readdir(URL_DATA_DIR)
  const jsonFiles = files.filter(f => f.endsWith('.json'))

  if (jsonFiles.length === 0) {
    console.log(`⚠️  No URL data files found in ${URL_DATA_DIR}`)
    console.log('Please create URL JSON files using the extract-urls-guide.md instructions')
    return []
  }

  const urlDataList: URLData[] = []

  for (const file of jsonFiles) {
    const filepath = path.join(URL_DATA_DIR, file)
    const content = await readFile(filepath, 'utf-8')
    const data = JSON.parse(content) as URLData
    urlDataList.push(data)
    console.log(`📖 Loaded: ${file} (${data.images.length} images, ${data.videos.length} videos)`)
  }

  return urlDataList
}

async function processProject(urlData: URLData, report: MigrationReport): Promise<void> {
  console.log(`\n📦 Processing ${urlData.project}...`)

  const projectDir = path.join(OUTPUT_DIR, urlData.project)
  await mkdir(projectDir, { recursive: true })

  const projectAssets = {
    projectSlug: urlData.project,
    images: [] as Array<{
      url: string
      destinationPath: string
      downloaded: boolean
      error?: string
    }>,
    videos: urlData.videos
  }

  // Download images
  for (let i = 0; i < urlData.images.length; i++) {
    const url = urlData.images[i]
    const filename = getFilenameFromUrl(url, i)
    const destinationPath = path.join(projectDir, filename)

    const asset = {
      url,
      destinationPath,
      downloaded: false,
      error: undefined as string | undefined
    }

    try {
      // Check if already exists
      if (fs.existsSync(destinationPath)) {
        console.log(`   ⏭️  Skipped (exists): ${filename}`)
        asset.downloaded = true
        report.successfulDownloads++
      } else {
        await downloadImage(url, destinationPath)
        asset.downloaded = true
        console.log(`   ✓ Downloaded: ${filename}`)
        report.successfulDownloads++
      }
    } catch (error) {
      asset.downloaded = false
      asset.error = error instanceof Error ? error.message : 'Unknown error'
      console.error(`   ✗ Failed: ${filename} - ${asset.error}`)
      report.failedDownloads++
    }

    projectAssets.images.push(asset)
  }

  report.assets.push(projectAssets)
  report.projectsProcessed.push(urlData.project)
}

async function generateReport(report: MigrationReport): Promise<void> {
  await mkdir(REPORT_DIR, { recursive: true })

  const timestamp = Date.now()
  const reportPath = path.join(REPORT_DIR, `import-${timestamp}.json`)
  await writeFile(reportPath, JSON.stringify(report, null, 2))

  const summaryPath = path.join(REPORT_DIR, `import-${timestamp}.md`)
  const summary = `# URL Import Report
Generated: ${report.timestamp}

## Summary
- Projects Processed: ${report.projectsProcessed.length}
- Total Assets: ${report.totalAssets}
- Successfully Downloaded: ${report.successfulDownloads}
- Failed Downloads: ${report.failedDownloads}

## Projects
${report.projectsProcessed.map(p => `- ${p}`).join('\n')}

## Downloaded Images by Project
${report.assets.map(p => `
### ${p.projectSlug}
- Images: ${p.images.filter(i => i.downloaded).length}/${p.images.length}
- Videos: ${p.videos.length}
${p.images.filter(i => !i.downloaded).length > 0 ? `\n**Failed:**\n${p.images.filter(i => !i.downloaded).map(i => `- ${path.basename(i.destinationPath)}: ${i.error}`).join('\n')}` : ''}
`).join('\n')}

## Next Steps
1. Review failed downloads (if any)
2. Run: \`tsx scripts/update-data-from-import.ts\`
3. Test the site locally
4. Commit and push changes
`

  await writeFile(summaryPath, summary)

  console.log(`\n📊 Report saved: ${path.basename(summaryPath)}`)
}

async function main() {
  console.log('🚀 Starting URL Import\n')

  const report: MigrationReport = {
    timestamp: new Date().toISOString(),
    projectsProcessed: [],
    totalAssets: 0,
    successfulDownloads: 0,
    failedDownloads: 0,
    assets: []
  }

  try {
    const urlDataList = await loadURLData()

    if (urlDataList.length === 0) {
      console.log('\n❌ No URL data found. Please follow extract-urls-guide.md to collect URLs first.')
      process.exit(1)
    }

    console.log(`\nFound ${urlDataList.length} project(s) to process\n`)
    console.log('='.repeat(50))

    for (const urlData of urlDataList) {
      await processProject(urlData, report)
    }

    report.totalAssets = report.successfulDownloads + report.failedDownloads

    await generateReport(report)

    console.log('\n' + '='.repeat(50))
    console.log('\n✅ Import Complete!')
    console.log(`   Total: ${report.totalAssets} assets`)
    console.log(`   Success: ${report.successfulDownloads}`)
    console.log(`   Failed: ${report.failedDownloads}`)
    console.log(`\nNext: Run \`tsx scripts/update-data-from-import.ts\` to update data files\n`)

  } catch (error) {
    console.error('❌ Import failed:', error)
    process.exit(1)
  }
}

main()
