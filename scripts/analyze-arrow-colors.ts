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
import { readFileSync } from 'fs'
import { join } from 'path'

const PUBLIC_DIR = join(process.cwd(), 'public')

interface ArrowColorResult {
  image: string
  arrowColor: 'white' | '#767676'
  avgBrightness: number
  isVideo: boolean
}

async function analyzeImageBrightness(imagePath: string): Promise<ArrowColorResult> {
  const isVideo = imagePath.endsWith('.mp4') || imagePath.endsWith('.webm') || imagePath.endsWith('.mov')

  // For videos, check if poster exists, otherwise default to white
  if (isVideo) {
    const posterPath = imagePath.replace(/\.(mp4|webm|mov)$/, '-poster.jpg')
    const fullPosterPath = join(PUBLIC_DIR, posterPath)

    try {
      // Try to load poster
      const img = await loadImage(fullPosterPath)
      return analyzeBrightness(posterPath, img)
    } catch (e) {
      // No poster, default to white
      return {
        image: imagePath,
        arrowColor: 'white',
        avgBrightness: 0,
        isVideo: true
      }
    }
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

  // Sample the left and right edges where arrows appear
  const imgWidth = img.width
  const imgHeight = img.height

  // Sample size (approximately 80px in screen space, or 5% of width)
  const sampleSize = Math.min(80, Math.floor(imgWidth * 0.05))

  if (sampleSize === 0) {
    return {
      image: imagePath,
      arrowColor: 'white',
      avgBrightness: 0,
      isVideo: false
    }
  }

  // Vertical center of image
  const verticalCenter = Math.floor(imgHeight / 2) - Math.floor(sampleSize / 2)

  // Sample left edge
  const leftData = ctx.getImageData(0, verticalCenter, sampleSize, sampleSize)

  // Sample right edge
  const rightData = ctx.getImageData(imgWidth - sampleSize, verticalCenter, sampleSize, sampleSize)

  // Combine both samples
  const combinedLength = leftData.data.length + rightData.data.length
  let totalBrightness = 0
  const pixelCount = combinedLength / 4

  // Calculate brightness for left sample
  for (let i = 0; i < leftData.data.length; i += 4) {
    const r = leftData.data[i]
    const g = leftData.data[i + 1]
    const b = leftData.data[i + 2]
    // Calculate perceived brightness using luminance formula
    const brightness = (r * 0.299 + g * 0.587 + b * 0.114)
    totalBrightness += brightness
  }

  // Calculate brightness for right sample
  for (let i = 0; i < rightData.data.length; i += 4) {
    const r = rightData.data[i]
    const g = rightData.data[i + 1]
    const b = rightData.data[i + 2]
    const brightness = (r * 0.299 + g * 0.587 + b * 0.114)
    totalBrightness += brightness
  }

  const avgBrightness = totalBrightness / pixelCount

  // Use light charcoal only when background is very light (brightness > 200)
  // This ensures white is the default and light charcoal is only used when
  // white arrows would fail a11y contrast requirements
  const arrowColor = avgBrightness > 200 ? '#767676' : 'white'

  return {
    image: imagePath,
    arrowColor: arrowColor as 'white' | '#767676',
    avgBrightness: Math.round(avgBrightness),
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
