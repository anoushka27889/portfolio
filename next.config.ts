import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Compress output
  compress: true,
  // Turbopack configuration for Next.js 16+
  turbopack: {
    // Root directory for Turbopack (silences the warning)
    root: process.cwd(),
  },
  // Redirects
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/#about',
        permanent: true, // 301 redirect for SEO
      },
      {
        source: '/fotex-home',
        destination: '/fotex',
        permanent: true, // 301 redirect for SEO
      },
    ]
  },
  // Webpack configuration for monitoring
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Log compilation start/end
      config.plugins = config.plugins || []

      class CompilationMonitorPlugin {
        apply(compiler: any) {
          compiler.hooks.compile.tap('CompilationMonitorPlugin', () => {
            console.log('\n[WEBPACK] 🔨 Compilation started at', new Date().toISOString())
          })

          compiler.hooks.done.tap('CompilationMonitorPlugin', (stats: any) => {
            const duration = stats.endTime - stats.startTime
            console.log(`[WEBPACK] ✅ Compilation finished in ${duration}ms`)

            if (stats.hasErrors()) {
              console.error('[WEBPACK] ❌ Compilation has errors!')
            }
            if (stats.hasWarnings()) {
              console.warn('[WEBPACK] ⚠️  Compilation has warnings')
            }
          })

          compiler.hooks.invalid.tap('CompilationMonitorPlugin', (filename: string) => {
            console.log(`[WEBPACK] 🔄 File changed: ${filename}`)
          })
        }
      }

      config.plugins.push(new CompilationMonitorPlugin())
    }

    return config
  },
}

export default nextConfig
