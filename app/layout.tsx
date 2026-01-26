import type { Metadata } from 'next'
import './globals.css'
import './portfolio.css'
import { spaceGrotesk } from '@/lib/fonts'
import { ThemeProvider } from '@/components/ThemeProvider'
import Header from '@/components/Header'
import CursorFlower from '@/components/CursorFlower'
import BackToTop from '@/components/BackToTop'
import PageTransition from '@/components/PageTransition'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import NavigationTracker from '@/components/NavigationTracker'

export const metadata: Metadata = {
  title: 'Anoushka Garg - Product Designer',
  description: 'Product designer specializing in user experience and interaction design',
  keywords: ['product design', 'UX', 'UI', 'interaction design', 'portfolio'],
  authors: [{ name: 'Anoushka Garg' }],
  openGraph: {
    title: 'Anoushka Garg - Product Designer',
    description: 'Product designer specializing in user experience and interaction design',
    url: 'https://anoushkagarg.com',
    siteName: 'Anoushka Garg Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: 'https://images.squarespace-cdn.com/content/v1/6738d2af7eb1c555618825c1/e965fb52-9d2b-4ffb-9c47-67734d8263ee/favicon-32x32.jpg?format=100w',
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
        {/* Preload critical images */}
        <link
          rel="preload"
          href="/media/projects/homepage/sun_animated.png"
          as="image"
        />
        <link
          rel="preload"
          href="/media/projects/homepage/moon_animated.png"
          as="image"
        />
        <link
          rel="preload"
          href="/media/projects/homepage/flower-close.png"
          as="image"
        />
        <link
          rel="preload"
          href="/media/projects/homepage/flower-bloom.png"
          as="image"
        />
      </head>
      <body className="antialiased loaded">
        <ThemeProvider>
          <PerformanceMonitor />
          <NavigationTracker />
          <PageTransition />
          <CursorFlower />
          <Header />
          <main className="pt-20">{children}</main>
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
