#!/usr/bin/env tsx

/**
 * Download Vimeo Videos Script
 *
 * Downloads Vimeo videos from URL data files and saves them locally
 */

import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { exec } from 'child_process'

const execPromise = promisify(exec)
const readFile = promisify(fs.readFile)
const readdir = promisify(fs.readdir)
const mkdir = promisify(fs.mkdir)

interface URLData {
  project: string
  vimeoIds?: string[]
  vimeoUrls?: string[]
  images?: string[]
  videos?: string[]
}

async function downloadVimeoVideo(videoId: string, outputPath: string): Promise<boolean> {
  try {
    console.log(`   Downloading Vimeo video ${videoId}...`)

    // Use yt-dlp to download the video with cookies from browser
    // --cookies-from-browser chrome - use Chrome's cookies (you must be logged into Vimeo in Chrome)
    // Let yt-dlp choose the best format automatically
    // --output - specify output path
    const command = `yt-dlp --cookies-from-browser chrome --output "${outputPath}" "https://vimeo.com/${videoId}"`

    await execPromise(command)
    console.log(`   ✓ Downloaded: ${path.basename(outputPath)}`)
    return true
  } catch (error) {
    console.error(`   ❌ Failed to download ${videoId}:`, error)
    return false
  }
}

async function processProject(urlData: URLData): Promise<void> {
  const projectSlug = urlData.project

  if (!urlData.vimeoIds || urlData.vimeoIds.length === 0) {
    console.log(`   ℹ️  No videos to download for ${projectSlug}`)
    return
  }

  console.log(`\n📦 Processing ${projectSlug}...`)
  console.log(`   Found ${urlData.vimeoIds.length} videos`)

  // Create project video directory
  const videoDir = path.join(process.cwd(), 'public', 'media', 'projects', projectSlug, 'videos')
  await mkdir(videoDir, { recursive: true })

  // Download each video
  let successCount = 0
  for (let i = 0; i < urlData.vimeoIds.length; i++) {
    const videoId = urlData.vimeoIds[i]
    const outputPath = path.join(videoDir, `video-${i + 1}.mp4`)

    // Skip if already exists
    if (fs.existsSync(outputPath)) {
      console.log(`   ⏭️  Skipped (exists): video-${i + 1}.mp4`)
      successCount++
      continue
    }

    const success = await downloadVimeoVideo(videoId, outputPath)
    if (success) {
      successCount++
    }
  }

  console.log(`   Complete: ${successCount}/${urlData.vimeoIds.length} videos downloaded`)
}

async function main() {
  console.log('🚀 Starting Vimeo Video Download\n')

  // Read all URL data files
  const urlDataDir = path.join(process.cwd(), 'scripts', 'url-data')
  const files = await readdir(urlDataDir)
  const jsonFiles = files.filter(f => f.startsWith('urls-') && f.endsWith('.json'))

  if (jsonFiles.length === 0) {
    console.log('❌ No URL data files found in scripts/url-data/')
    process.exit(1)
  }

  // Process each project
  for (const file of jsonFiles) {
    const filePath = path.join(urlDataDir, file)
    const content = await readFile(filePath, 'utf-8')
    const urlData: URLData = JSON.parse(content)

    if (urlData.vimeoIds && urlData.vimeoIds.length > 0) {
      await processProject(urlData)
    }
  }

  console.log('\n✅ Video download complete!\n')
  console.log('Next steps:')
  console.log('1. Check public/media/projects/{project}/videos/')
  console.log('2. Update case-studies-data.ts with local video paths')
  console.log('3. Create video component for auto-play, loop, no controls\n')
}

main()
