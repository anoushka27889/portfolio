#!/usr/bin/env tsx
/**
 * Analyze slideshow images to determine optimal arrow colors for a11y contrast
 *
 * This script analyzes the left and right edges of images (where slideshow arrows appear)
 * and determines whether white or dark arrows provide better contrast.
 *
 * Usage: tsx scripts/analyze-arrow-colors.ts
 *
 * Colors used:
 * - 'white': Default, used on darker backgrounds
 * - '#767676': Light charcoal, used on very light backgrounds (brightness > 200)
 *              This is the lightest gray that maintains WCAG AA contrast (4.5:1) on white
 */

import { createCanvas, loadImage } from 'canvas'
import { readFileSync, unlinkSync, existsSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

const PUBLIC_DIR = join(process.cwd(), 'public')

interface ArrowColorResult {
  image: string
  arrowColor: 'white' | '#767676'
  avgBrightness: number
  isVideo: boolean
}

async function analyzeVideoFrames(videoPath: string): Promise<ArrowColorResult> {
  const fullVideoPath = join(PUBLIC_DIR, videoPath)

  try {
    // Get video duration
    const durationOutput = execSync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${fullVideoPath}"`,
      { encoding: 'utf-8' }
    )
    const duration = parseFloat(durationOutput.trim())

    if (isNaN(duration) || duration <= 0) {
      console.warn(`Could not get duration for ${videoPath}, defaulting to white`)
      return { image: videoPath, arrowColor: 'white', avgBrightness: 0, isVideo: true }
    }

    // Sample 5 frames evenly distributed throughout the video
    const frameTimestamps = [0.2, 0.35, 0.5, 0.65, 0.8].map(pct => pct * duration)
    const allBrightnessValues: number[] = []

    for (const timestamp of frameTimestamps) {
      const tempFramePath = `/tmp/arrow-analysis-frame-${Date.now()}.png`

      try {
        // Extract frame at timestamp
        execSync(
          `ffmpeg -ss ${timestamp} -i "${fullVideoPath}" -vframes 1 -y "${tempFramePath}" 2>/dev/null`,
          { stdio: 'pipe' }
        )

        // Load and analyze the frame
        const frameImage = await loadImage(tempFramePath)
        const result = analyzeBrightness(videoPath, frameImage)

        // Clean up temp file
        if (existsSync(tempFramePath)) {
          unlinkSync(tempFramePath)
        }

        allBrightnessValues.push(result.avgBrightness)
      } catch (e) {
        // Skip this frame if extraction fails
        if (existsSync(tempFramePath)) {
          unlinkSync(tempFramePath)
        }
      }
    }

    if (allBrightnessValues.length === 0) {
      console.warn(`Could not extract any frames from ${videoPath}, defaulting to white`)
      return { image: videoPath, arrowColor: 'white', avgBrightness: 0, isVideo: true }
    }

    // Calculate median brightness across all sampled frames
    allBrightnessValues.sort((a, b) => a - b)
    const mid = Math.floor(allBrightnessValues.length / 2)
    const medianBrightness = allBrightnessValues.length % 2 === 0
      ? (allBrightnessValues[mid - 1] + allBrightnessValues[mid]) / 2
      : allBrightnessValues[mid]

    const arrowColor = medianBrightness > 200 ? '#767676' : 'white'

    return {
      image: videoPath,
      arrowColor: arrowColor as 'white' | '#767676',
      avgBrightness: Math.round(medianBrightness),
      isVideo: true
    }
  } catch (e) {
    console.error(`Failed to analyze video ${videoPath}:`, e)
    return { image: videoPath, arrowColor: 'white', avgBrightness: 0, isVideo: true }
  }
}

async function analyzeImageBrightness(imagePath: string): Promise<ArrowColorResult> {
  const isVideo = imagePath.endsWith('.mp4') || imagePath.endsWith('.webm') || imagePath.endsWith('.mov')

  // For videos, extract and analyze actual video frames
  if (isVideo) {
    return await analyzeVideoFrames(imagePath)
  }

  // Load actual image
  const fullPath = join(PUBLIC_DIR, imagePath)
  try {
    const img = await loadImage(fullPath)
    return analyzeBrightness(imagePath, img)
  } catch (e) {
    console.error(`Failed to load ${imagePath}:`, e)
    return {
      image: imagePath,
      arrowColor: 'white',
      avgBrightness: 0,
      isVideo: false
    }
  }
}

function analyzeBrightness(imagePath: string, img: any): ArrowColorResult {
  const canvas = createCanvas(img.width, img.height)
  const ctx = canvas.getContext('2d')

  // Draw the image
  ctx.drawImage(img, 0, 0)

  // Sample the ENTIRE left and right edges where arrows appear
  // This captures the full vertical area, ignoring text outliers via median
  const imgWidth = img.width
  const imgHeight = img.height

  // Sample narrow strips on left and right edges (20px wide, full height)
  const edgeWidth = 20
  const edgeHeight = imgHeight

  if (edgeHeight === 0) {
    return {
      image: imagePath,
      arrowColor: 'white',
      avgBrightness: 0,
      isVideo: false
    }
  }

  // Sample left edge (20px wide strip, full height)
  const leftData = ctx.getImageData(0, 0, edgeWidth, edgeHeight)

  // Sample right edge (20px wide strip, full height)
  const rightData = ctx.getImageData(imgWidth - edgeWidth, 0, edgeWidth, edgeHeight)

  // Collect all brightness values to calculate median (more robust than average)
  const brightnessValues: number[] = []

  // Calculate brightness for left sample
  for (let i = 0; i < leftData.data.length; i += 4) {
    const r = leftData.data[i]
    const g = leftData.data[i + 1]
    const b = leftData.data[i + 2]
    // Calculate perceived brightness using luminance formula
    const brightness = (r * 0.299 + g * 0.587 + b * 0.114)
    brightnessValues.push(brightness)
  }

  // Calculate brightness for right sample
  for (let i = 0; i < rightData.data.length; i += 4) {
    const r = rightData.data[i]
    const g = rightData.data[i + 1]
    const b = rightData.data[i + 2]
    const brightness = (r * 0.299 + g * 0.587 + b * 0.114)
    brightnessValues.push(brightness)
  }

  // Sort to find median
  brightnessValues.sort((a, b) => a - b)

  // Calculate median brightness (more robust to outliers like white text)
  const mid = Math.floor(brightnessValues.length / 2)
  const medianBrightness = brightnessValues.length % 2 === 0
    ? (brightnessValues[mid - 1] + brightnessValues[mid]) / 2
    : brightnessValues[mid]

  // Use light charcoal when background is very light (brightness > 200)
  // Median is more robust - ignores white text/UI elements on edges
  const arrowColor = medianBrightness > 200 ? '#767676' : 'white'

  return {
    image: imagePath,
    arrowColor: arrowColor as 'white' | '#767676',
    avgBrightness: Math.round(medianBrightness),
    isVideo: false
  }
}

async function analyzeAllProjects() {
  // Import projects data
  const projectsModule = await import('../lib/projects-data')
  const projects = projectsModule.projects

  console.log('Analyzing slideshow arrow colors for a11y contrast...\n')

  const results: Record<number, ArrowColorResult[]> = {}

  for (const project of projects) {
    console.log(`\nProject ${project.id}: ${project.client}`)
    console.log('─'.repeat(60))

    const projectResults: ArrowColorResult[] = []

    for (const image of project.images) {
      const result = await analyzeImageBrightness(image)
      projectResults.push(result)

      const brightIcon = result.avgBrightness > 200 ? '☀️' : '🌙'
      const videoIcon = result.isVideo ? '🎬' : '🖼️'

      console.log(`${videoIcon} ${brightIcon} ${result.arrowColor === 'white' ? 'WHITE' : 'DARK '} (${result.avgBrightness.toString().padStart(3)}) ${image}`)
    }

    results[project.id] = projectResults
  }

  // Generate TypeScript code
  console.log('\n\n')
  console.log('='.repeat(60))
  console.log('GENERATED CODE - Copy to projects-data.ts')
  console.log('='.repeat(60))
  console.log('\n')

  for (const project of projects) {
    const arrowColors = results[project.id].map(r => `'${r.arrowColor}'`).join(', ')
    console.log(`  // Project ${project.id}: ${project.client}`)
    console.log(`  arrowColors: [${arrowColors}],`)
    console.log('')
  }
}

analyzeAllProjects().catch(console.error)
