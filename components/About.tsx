import { about } from '@/lib/content-data'

export default function About() {
  return (
    <section id="about" className="homepage-about">
      <h3 className="homepage-section-title">About</h3>
      <div className="homepage-about-content">
        {about.content.map((paragraph, index) => (
          <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
        ))}
      </div>

      <div className="footer-links-custom">
        <div className="footer-links-container">
          {about.contact.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className={`footer-link-custom ${index === 0 ? 'footer-link-left' : ''}`}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
            >
              {link.text}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
