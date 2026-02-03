import type { Metadata } from 'next'
import { projects } from '@/lib/projects-data'
import { getCaseStudyByProjectId } from '@/lib/case-studies-data'
import ImageGallery from '@/components/ImageGallery'
import AutoplayVideo from '@/components/AutoplayVideo'
import ProjectNavigation from '@/components/ProjectNavigation'
import ProjectSchema from '@/components/ProjectSchema'

export const metadata: Metadata = {
  title: 'Lumen - AR Flashlight for Exploration',
  description: 'Designing an iPhone-powered AR handheld device for physical-first, social metaverse experiences. Patent-holding startup with investors including Snap and Stanford.',
  openGraph: {
    title: 'Lumen - AR Flashlight for Exploration | Anoushka Garg',
    description: 'Designing an iPhone-powered AR handheld device for physical-first, social metaverse experiences. Co-founder and experience design lead.',
    url: 'https://anoushkagarg.com/lumen',
    type: 'article',
    images: [
      {
        url: '/api/og?title=Lumen&subtitle=AR Device for Physical-First Exploration',
        width: 1200,
        height: 630,
        alt: 'Lumen AR Flashlight Case Study',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumen - AR Flashlight for Exploration',
    description: 'Designing an iPhone-powered AR handheld device for physical-first, social metaverse experiences.',
    images: ['/api/og?title=Lumen&subtitle=AR Device'],
  },
  alternates: {
    canonical: 'https://anoushkagarg.com/lumen',
  },
}

export default function LumenPage() {
  const project = projects.find(p => p.id === 3)
  const caseStudy = getCaseStudyByProjectId(3)

  if (!project || !caseStudy) {
    return <div>Project not found</div>
  }

  return (
    <article className="project-detail">
      <ProjectSchema
        name="Lumen - AR Flashlight for Physical-First Exploration"
        description="iPhone-powered AR handheld device for physical-first, social metaverse experiences. Patent-holding startup with investors including Snap, Stanford, and Harvard. Featured at Global Grad Show Dubai."
        url="https://anoushkagarg.com/lumen"
        dateCreated="2019-2023"
        keywords={['AR design', 'augmented reality', 'product design', 'experience design', 'startup', 'metaverse', 'hardware design']}
        image="/api/og?title=Lumen&subtitle=AR Device"
      />
      <div className="project-detail-container-wide">
        {/* Project Title */}
        <div className="project-title-wrapper">
          <p className="project-name">{project.client}</p>
          <p className="project-subtitle">{project.title}</p>
        </div>

        {/* Hero Video/Image */}
        <div className="project-hero-video full-bleed">
          {caseStudy.heroMedia && (
            <AutoplayVideo
              src={caseStudy.heroMedia}
              hasAudio={caseStudy.heroHasAudio}
            />
          )}
        </div>

        {/* Header: Metadata (left) + Challenge (right) */}
        <div className="project-header">
          <div className="header-left">
            <div className="team-section">
              <h6 className="header-left-desc">{caseStudy.year}</h6>
            </div>
            <div className="team-section">
              <h6 className="header-left-desc">{caseStudy.team}</h6>
            </div>
            <div className="team-section">
              <h6 className="header-left-desc">{caseStudy.role}</h6>
            </div>
          </div>
          <div className="header-right">
            <h4 className="project-info-header">The Challenge</h4>
            <div className="project-description">
              {caseStudy.challenge}
            </div>
          </div>
        </div>

        {/* Process Blocks */}
        {caseStudy.processBlocks.map((block, index) => (
          <div key={index} className="process-block">
            <div className="process-visual">
              {block.media ? (
                Array.isArray(block.media) ? (
                  // Multiple images - use gallery
                  <ImageGallery images={block.media} slideshowIndex={100 + index} />
                ) : block.media.endsWith('.mp4') || block.media.endsWith('.webm') || block.media.endsWith('.mov') ? (
                  // Local video file
                  <AutoplayVideo src={block.media} />
                ) : block.media.includes('vimeo.com') ? (
                  // Vimeo video
                  <div className="vimeo-container">
                    <iframe
                      src={block.media}
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={block.header}
                    />
                  </div>
                ) : (
                  // Single image
                  <img src={block.media} alt={block.header} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )
              ) : (
                // Placeholder
                <div style={{ width: '100%', height: '100%', background: 'var(--slideshow-bg)' }}></div>
              )}
            </div>
            <div className="process-content">
              <h3 className="caption-header">{block.header}</h3>
              <div className="process-caption">
                {block.description}
              </div>
            </div>
          </div>
        ))}

        {/* Bottom Section: Outcome */}
        <div className="bottom-section">
          <div className="header-left"></div>
          <div className="header-right">
            <h4 className="project-info-header">Where we landed</h4>
            <div className="project-description" dangerouslySetInnerHTML={{ __html: caseStudy.outcome }} />
          </div>
        </div>

        {/* Navigation */}
        <ProjectNavigation
          prevProject={{ href: '/rest', name: 'Hatch' }}
          nextProject={{ href: '/unge-univers', name: 'BørneRiget Hospital × Fjord' }}
        />
      </div>
    </article>
  )
}
