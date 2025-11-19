import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Blog Post - Caio Barbieri';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  // Formatar o slug para título
  const title = params.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid de fundo */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(rgba(255, 215, 0, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 215, 0, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
        />

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '40px 60px',
            borderBottom: '2px solid rgba(168, 85, 247, 0.2)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
              }}
            >
              📝
            </div>
            <span
              style={{
                fontSize: '24px',
                color: '#e9d5ff',
                fontWeight: '600',
              }}
            >
              Blog Post
            </span>
          </div>
          <div
            style={{
              padding: '8px 20px',
              background: 'rgba(168, 85, 247, 0.2)',
              borderRadius: '20px',
              fontSize: '18px',
              color: '#c084fc',
            }}
          >
            Caio Barbieri
          </div>
        </div>

        {/* Conteúdo */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            padding: '60px 80px',
          }}
        >
          {/* Título do Post */}
          <h1
            style={{
              fontSize: '64px',
              fontWeight: '900',
              color: '#ffffff',
              margin: '0 0 30px 0',
              lineHeight: 1.1,
              letterSpacing: '-1px',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {title}
          </h1>

          {/* Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              marginTop: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                }}
              >
                👨‍💻
              </div>
              <span
                style={{
                  fontSize: '22px',
                  color: '#c084fc',
                  fontWeight: '600',
                }}
              >
                Caio Barbieri
              </span>
            </div>
            <div
              style={{
                width: '2px',
                height: '30px',
                background: 'rgba(192, 132, 252, 0.3)',
              }}
            />
            <span
              style={{
                fontSize: '20px',
                color: '#e9d5ff',
              }}
            >
              DevOps Engineer
            </span>
          </div>
        </div>

        {/* Footer decorativo */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 50%, #f59e0b 100%)',
          }}
        />

        {/* Elemento decorativo */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '-100px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}

