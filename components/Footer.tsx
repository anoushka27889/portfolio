import Image from 'next/image'
import { footer } from '@/lib/content-data'

export default function Footer() {
  return (
    <footer className="footer-custom">
      {footer.blobImage && (
        <div className="footer-blob-container">
          <Image
            src={footer.blobImage}
            alt=""
            width={400}
            height={400}
            className="footer-img"
          />
        </div>
      )}

      <div className="footer-links-container">
        {footer.links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            className="footer-link-custom"
            target={link.url.startsWith('http') ? '_blank' : undefined}
            rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {link.text}
          </a>
        ))}
      </div>
    </footer>
  )
}
