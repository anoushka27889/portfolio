import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Get parameters or use defaults
    const title = searchParams.get('title') || 'Anoushka Garg'
    const subtitle = searchParams.get('subtitle') || 'Product Designer'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px',
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: 72,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#000000',
                marginBottom: 20,
                textAlign: 'center',
              }}
            >
              {title}
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: 36,
                fontWeight: 400,
                color: '#666666',
                textAlign: 'center',
              }}
            >
              {subtitle}
            </div>

            {/* Accent line */}
            <div
              style={{
                width: 200,
                height: 4,
                backgroundColor: '#24C626',
                marginTop: 40,
              }}
            />
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: 60,
              display: 'flex',
              alignItems: 'center',
              fontSize: 24,
              color: '#999999',
            }}
          >
            anoushkagarg.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: unknown) {
    const error = e as Error
    console.log(`Error generating OG image: ${error.message}`)
    return new Response(`Failed to generate image`, {
      status: 500,
    })
  }
}
