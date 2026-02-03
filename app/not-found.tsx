import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-8xl md:text-9xl font-space-grotesk font-bold mb-6" style={{ fontFamily: "'BBB Baskervvol', serif" }}>
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-space-grotesk mb-4">
          Page Not Found
        </h2>
        <p className="text-lg mb-8 opacity-70">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-transparent border-2 border-current rounded-full hover:bg-[#24C626] hover:border-[#24C626] hover:text-white transition-all duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
