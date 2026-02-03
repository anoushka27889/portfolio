import type { Metadata } from 'next'
import { projects } from '@/lib/projects-data'
import { getCaseStudyByProjectId } from '@/lib/case-studies-data'
import ImageGallery from '@/components/ImageGallery'
import AutoplayVideo from '@/components/AutoplayVideo'
import ProjectNavigation from '@/components/ProjectNavigation'
import ProjectSchema from '@/components/ProjectSchema'

export const metadata: Metadata = {
  title: 'ÜPP - Empathy Device for Children',
  description: 'Designing a wearable empathy device for 6-8 year olds using machine learning and haptic feedback. IxDA Awards Shortlist 2019. Educational interaction design.',
  openGraph: {
    title: 'ÜPP - Empathy Device for Children | Anoushka Garg',
    description: 'Designing a wearable empathy device for 6-8 year olds using machine learning and haptic feedback. IxDA Awards Shortlist 2019.',
    url: 'https://anoushkagarg.com/upp',
    type: 'article',
    images: [
      {
        url: '/api/og?title=ÜPP&subtitle=Empathy Device for Children',
        width: 1200,
        height: 630,
        alt: 'ÜPP Empathy Device Case Study',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ÜPP - Empathy Device for Children',
    description: 'Designing a wearable empathy device for 6-8 year olds using machine learning and haptic feedback.',
    images: ['/api/og?title=ÜPP&subtitle=Empathy Device'],
  },
  alternates: {
    canonical: 'https://anoushkagarg.com/upp',
  },
}

export default function UppPage() {
  const project = projects.find(p => p.id === 6)
  const caseStudy = getCaseStudyByProjectId(6)

  if (!project || !caseStudy) {
    return <div>Project not found</div>
  }

  return (
    <article className="project-detail">
      <ProjectSchema
        name="ÜPP - Empathy Device for Children"
        description="Designing a wearable empathy device for 6-8 year olds using machine learning and haptic feedback. IxDA Awards Shortlist 2019. Educational interaction design helping children discuss complex emotions through playful technology."
        url="https://anoushkagarg.com/upp"
        dateCreated="2017"
        keywords={['interaction design', 'wearable technology', 'educational design', 'empathy', 'children', 'machine learning', 'IxDA Awards']}
        image="/api/og?title=ÜPP&subtitle=Empathy Device"
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
                  <AutoplayVideo src={block.media} hasAudio={block.mediaHasAudio} />
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
          prevProject={{ href: '/fotex', name: 'Salling Group × Fjord' }}
          nextProject={{ href: '/the-other-side', name: 'The Other Side' }}
        />
      </div>
    </article>
  )
}
