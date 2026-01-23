import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-green': '#24C626',
      },
      fontFamily: {
        'space-grotesk': ['var(--font-space-grotesk)', 'sans-serif'],
      },
      gridTemplateColumns: {
        'mobile': 'repeat(8, 1fr)',
        'desktop': 'repeat(24, 1fr)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
