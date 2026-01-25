#!/usr/bin/env tsx

/**
 * Update Data from Import Script
 *
 * Reads the import report and updates projects-data.ts with local paths
 */

import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const readdir = promisify(fs.readdir)

interface ImportReport {
  assets: Array<{
    projectSlug: string
    images: Array<{
      url: string
      destinationPath: string
      downloaded: boolean
    }>
    videos: string[]
  }>
}

async function getLatestImportReport(): Promise<ImportReport> {
  const reportDir = path.join(process.cwd(), 'scripts', 'migration-reports')
  const files = await readdir(reportDir)
  const importFiles = files.filter(f => f.startsWith('import-') && f.endsWith('.json')).sort().reverse()

  if (importFiles.length === 0) {
    throw new Error('No import reports found. Run import-urls.ts first.')
  }

  const latestReport = path.join(reportDir, importFiles[0])
  console.log(`📖 Reading report: ${importFiles[0]}\n`)

  const content = await readFile(latestReport, 'utf-8')
  return JSON.parse(content)
}

function pathToPublicUrl(absolutePath: string): string {
  const publicIndex = absolutePath.indexOf('/public/')
  if (publicIndex === -1) {
    return absolutePath
  }
  return absolutePath.substring(publicIndex + '/public'.length)
}

async function updateProjectsData(report: ImportReport): Promise<void> {
  console.log('📝 Updating lib/projects-data.ts...\n')

  const projectsDataPath = path.join(process.cwd(), 'lib', 'projects-data.ts')
  let content = await readFile(projectsDataPath, 'utf-8')

  for (const projectAssets of report.assets) {
    const slug = projectAssets.projectSlug

    // Build arrays of local paths
    const imagePaths = projectAssets.images
      .filter(a => a.downloaded)
      .map(a => `    '${pathToPublicUrl(a.destinationPath)}',`)

    const videoPaths = projectAssets.videos
      .map(url => `    '${url}',`)

    const allMedia = [...imagePaths, ...videoPaths].join('\n')

    if (slug === 'homepage') {
      console.log(`   ℹ️  Skipping homepage (no specific project in projects-data.ts)`)
      console.log(`   → ${projectAssets.images.filter(a => a.downloaded).length} images available in /media/projects/homepage/`)
      continue
    }

    // Find and replace the images array for this project by matching the folder path pattern
    const projectRegex = new RegExp(
      `("/media/projects/${slug}/[^"]*"[\\s\\S]*?images: \\[)[\\s\\S]*?(\\])`,
      'm'
    )

    if (content.match(projectRegex)) {
      content = content.replace(projectRegex, `$1\n${allMedia}\n    $2`)
      console.log(`   ✓ Updated ${slug}: ${imagePaths.length} images, ${videoPaths.length} videos`)
    } else {
      console.log(`   ⚠️  Could not find ${slug} in projects-data.ts`)
    }
  }

  await writeFile(projectsDataPath, content)
  console.log('\n✅ projects-data.ts updated!\n')
}

async function main() {
  console.log('🚀 Updating Data Files from Import\n')

  try {
    const report = await getLatestImportReport()
    await updateProjectsData(report)

    console.log('Next steps:')
    console.log('1. Review the updated lib/projects-data.ts')
    console.log('2. Test locally: npm run dev')
    console.log('3. Verify images load correctly')
    console.log('4. Extract and import remaining project pages\n')

  } catch (error) {
    console.error('❌ Update failed:', error)
    process.exit(1)
  }
}

main()
