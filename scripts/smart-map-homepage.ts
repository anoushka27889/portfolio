#!/usr/bin/env tsx

/**
 * Smart Homepage Image Mapper
 *
 * Analyzes homepage images and automatically maps them to the correct projects
 * based on filename patterns and URL context
 */

import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

interface URLData {
  project: string
  images: string[]
  videos: string[]
}

interface ProjectMapping {
  slug: string
  patterns: string[]
  images: string[]
}

const PROJECT_PATTERNS: ProjectMapping[] = [
  {
    slug: 'hatch-ai',
    patterns: ['luna', 'testPS', 'Chat_entry', 'Chat+entry', 'Lunaintro'],
    images: []
  },
  {
    slug: 'hatch-hardware',
    patterns: ['hb-', 'device', 'Sequence', 'hatch_mrb', 'hatch+mrb'],
    images: []
  },
  {
    slug: 'rest',
    patterns: ['rest', 'Rest'],
    images: []
  },
  {
    slug: 'lumen',
    patterns: ['Lumen', 'lumen', 'IMG_9790'],
    images: []
  },
  {
    slug: 'unge-univers',
    patterns: ['unge', 'Unge'],
    images: []
  },
  {
    slug: 'fotex',
    patterns: ['fotex', 'Fotex'],
    images: []
  },
  {
    slug: 'upp',
    patterns: ['UPP', 'Children_Value', 'What_is_UPP'],
    images: []
  },
  {
    slug: 'the-other-side',
    patterns: ['otherside', 'Other'],
    images: []
  }
]

function getImageFilename(url: string): string {
  const parts = url.split('/')
  const filenameWithQuery = parts[parts.length - 1]
  return filenameWithQuery.split('?')[0]
}

function matchImageToProject(imageUrl: string): string | null {
  const filename = getImageFilename(imageUrl)

  for (const project of PROJECT_PATTERNS) {
    for (const pattern of project.patterns) {
      if (filename.includes(pattern)) {
        return project.slug
      }
    }
  }

  return null
}

async function main() {
  console.log('🚀 Smart Mapping Homepage Images to Projects\n')

  // Read homepage URLs
  const homepageDataPath = path.join(process.cwd(), 'scripts', 'url-data', 'urls-homepage.json')
  const homepageData: URLData = JSON.parse(await readFile(homepageDataPath, 'utf-8'))

  // Map images to projects
  const unmapped: string[] = []

  for (const imageUrl of homepageData.images) {
    const projectSlug = matchImageToProject(imageUrl)

    if (projectSlug) {
      const project = PROJECT_PATTERNS.find(p => p.slug === projectSlug)
      if (project) {
        project.images.push(imageUrl)
      }
    } else {
      const filename = getImageFilename(imageUrl)
      // Skip UI elements (cursors, icons, etc.)
      if (!filename.includes('sun_') && !filename.includes('moon') &&
          !filename.includes('Clode') && !filename.includes('flower') &&
          !filename.includes('island') && !filename.includes('Untitled_Artwork')) {
        unmapped.push(imageUrl)
      }
    }
  }

  // Generate JSON files for each project
  console.log('📝 Generating project URL files...\n')

  for (const project of PROJECT_PATTERNS) {
    if (project.images.length > 0) {
      const outputPath = path.join(
        process.cwd(),
        'scripts',
        'url-data',
        `urls-${project.slug}.json`
      )

      const data = {
        project: project.slug,
        images: project.images,
        videos: []
      }

      await writeFile(outputPath, JSON.stringify(data, null, 2))
      console.log(`   ✓ ${project.slug}: ${project.images.length} images → urls-${project.slug}.json`)
    }
  }

  if (unmapped.length > 0) {
    console.log(`\n⚠️  ${unmapped.length} images could not be mapped:`)
    unmapped.forEach(url => console.log(`   - ${getImageFilename(url)}`))
  }

  console.log('\n✅ Mapping complete!')
  console.log('\nNext steps:')
  console.log('1. Review generated JSON files in scripts/url-data/')
  console.log('2. Run: tsx scripts/import-urls.ts')
  console.log('3. Run: tsx scripts/update-data-from-import.ts')
  console.log('4. Test: npm run dev\n')
}

main()
