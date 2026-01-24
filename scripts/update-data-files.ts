#!/usr/bin/env tsx

/**
 * Data File Update Script
 *
 * Reads the migration report and automatically updates projects-data.ts
 * with the correct local image paths
 */

import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const readdir = promisify(fs.readdir)

interface MigrationReport {
  assets: {
    projectSlug: string
    homepage: Array<{ url: string; destinationPath: string; downloaded: boolean }>
    detailPage: Array<{ url: string; destinationPath: string; downloaded: boolean; type: string }>
  }[]
}

async function getLatestReport(): Promise<MigrationReport> {
  const reportDir = path.join(process.cwd(), 'scripts', 'migration-reports')
  const files = await readdir(reportDir)
  const jsonFiles = files.filter(f => f.endsWith('.json')).sort().reverse()

  if (jsonFiles.length === 0) {
    throw new Error('No migration reports found. Run migrate-assets.ts first.')
  }

  const latestReport = path.join(reportDir, jsonFiles[0])
  console.log(`📖 Reading report: ${jsonFiles[0]}`)

  const content = await readFile(latestReport, 'utf-8')
  return JSON.parse(content)
}

function pathToPublicUrl(absolutePath: string): string {
  // Convert /Users/.../portfolio/public/media/... to /media/...
  const publicIndex = absolutePath.indexOf('/public/')
  if (publicIndex === -1) {
    // Already a URL or relative path
    return absolutePath
  }
  return absolutePath.substring(publicIndex + '/public'.length)
}

async function updateProjectsData(report: MigrationReport): Promise<void> {
  console.log('\n📝 Updating projects-data.ts...')

  const projectsDataPath = path.join(process.cwd(), 'lib', 'projects-data.ts')
  let content = await readFile(projectsDataPath, 'utf-8')

  for (const projectAssets of report.assets) {
    if (projectAssets.projectSlug === 'homepage') {
      // Homepage slideshow images - update separately
      const homepageImages = projectAssets.homepage
        .filter(a => a.downloaded)
        .map(a => `    '${pathToPublicUrl(a.destinationPath)}',`)
        .join('\n')

      console.log(`   ✓ Homepage: ${projectAssets.homepage.filter(a => a.downloaded).length} images`)
      continue
    }

    // Project detail page images
    const images = projectAssets.detailPage
      .filter(a => a.type === 'image' && a.downloaded)
      .map(a => `    '${pathToPublicUrl(a.destinationPath)}',`)

    const videos = projectAssets.detailPage
      .filter(a => a.type === 'video')
      .map(a => `    '${a.url}',`)

    const allMedia = [...images, ...videos].join('\n')

    // Find and replace the images array for this project
    const projectRegex = new RegExp(
      `(id: \\d+,\\s*slug: '${projectAssets.projectSlug}'[\\s\\S]*?images: \\[)[\\s\\S]*?(\\])`,
      'm'
    )

    content = content.replace(projectRegex, `$1\n${allMedia}\n  $2`)

    console.log(`   ✓ ${projectAssets.projectSlug}: ${images.length} images, ${videos.length} videos`)
  }

  await writeFile(projectsDataPath, content)
  console.log('\n✅ projects-data.ts updated!')
}

async function generateUpdateSummary(report: MigrationReport): Promise<void> {
  console.log('\n📊 Update Summary:')
  console.log('─'.repeat(50))

  for (const projectAssets of report.assets) {
    const images = projectAssets.detailPage.filter(a => a.type === 'image' && a.downloaded)
    const videos = projectAssets.detailPage.filter(a => a.type === 'video')
    const failed = projectAssets.detailPage.filter(a => !a.downloaded && a.type === 'image')

    console.log(`\n${projectAssets.projectSlug}:`)
    console.log(`  ✓ ${images.length} images`)
    console.log(`  ✓ ${videos.length} videos`)
    if (failed.length > 0) {
      console.log(`  ✗ ${failed.length} failed downloads`)
    }
  }

  console.log('\n' + '─'.repeat(50))
  console.log('\n✅ Data files are now ready!')
  console.log('\nNext steps:')
  console.log('1. Review the updated files in your editor')
  console.log('2. Test the site: npm run dev')
  console.log('3. Verify all images load correctly')
  console.log('4. Commit the changes\n')
}

async function main() {
  console.log('🚀 Starting Data File Update\n')

  try {
    const report = await getLatestReport()
    await updateProjectsData(report)
    await generateUpdateSummary(report)
  } catch (error) {
    console.error('❌ Update failed:', error)
    process.exit(1)
  }
}

main()
