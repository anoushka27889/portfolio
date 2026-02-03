'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-6xl md:text-7xl font-space-grotesk font-bold mb-6" style={{ fontFamily: "'BBB Baskervvol', serif" }}>
          Oops!
        </h1>
        <h2 className="text-2xl md:text-3xl font-space-grotesk mb-4">
          Something went wrong
        </h2>
        <p className="text-lg mb-8 opacity-70">
          An unexpected error occurred. Please try again or return to the homepage.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#24C626] text-white rounded-full hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-transparent border-2 border-current rounded-full hover:bg-[#24C626] hover:border-[#24C626] hover:text-white transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
