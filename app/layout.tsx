import type { Metadata } from 'next'
import './globals.css'
import { spaceGrotesk } from '@/lib/fonts'
import { ThemeProvider } from '@/components/ThemeProvider'
import Header from '@/components/Header'

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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={spaceGrotesk.variable} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <Header />
          <main className="pt-20">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
