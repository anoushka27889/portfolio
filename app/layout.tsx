import type { Metadata } from 'next'
import './globals.css'
import './portfolio.css'
import { spaceGrotesk } from '@/lib/fonts'
import { ThemeProvider } from '@/components/ThemeProvider'
import Header from '@/components/Header'
import CursorFlower from '@/components/CursorFlower'
import PageTransition from '@/components/PageTransition'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  metadataBase: new URL('https://anoushkagarg.com'),
  title: {
    default: 'Anoushka Garg - Product Designer',
    template: '%s | Anoushka Garg',
  },
  description: 'Product designer specializing in user experience, interaction design, and design leadership. Creating innovative solutions in AR/VR, healthcare, and consumer technology.',
  authors: [{ name: 'Anoushka Garg' }],
  creator: 'Anoushka Garg',
  publisher: 'Anoushka Garg',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://anoushkagarg.com',
    siteName: 'Anoushka Garg Portfolio',
    title: 'Anoushka Garg - Product Designer',
    description: 'Product designer specializing in user experience, interaction design, and design leadership. Creating innovative solutions in AR/VR, healthcare, and consumer technology.',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Anoushka Garg - Product Designer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anoushka Garg - Product Designer',
    description: 'Product designer specializing in user experience, interaction design, and design leadership.',
    images: ['/api/og'],
    creator: '@anoushkagarg',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://anoushkagarg.com',
  },
  verification: {
    google: 'your-google-verification-code', // TODO: Add after Google Search Console setup
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={spaceGrotesk.variable} suppressHydrationWarning>
      <head>
        {/* Preload critical fonts for instant text rendering */}
        <link
          rel="preload"
          href="/fonts/BBBBaskervvol-Fondue.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Preload only small, critical UI images - removed large 4-5MB PNGs */}
      </head>
      <body className="antialiased loaded">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <ThemeProvider>
          <PageTransition />
          <CursorFlower />
          <Header />
          <main id="main-content" className="pt-20">{children}</main>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
