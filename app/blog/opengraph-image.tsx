import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Caio Barbieri - Blog | DevOps & Cloud Articles';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
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
              linear-gradient(rgba(255, 215, 0, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 215, 0, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Círculos decorativos */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Container principal */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '80px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Ícone de Blog */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                width: '120px',
                height: '120px',
                background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
                borderRadius: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '64px',
                boxShadow: '0 20px 60px rgba(168, 85, 247, 0.4)',
              }}
            >
              📝
            </div>
          </div>

          {/* Título */}
          <h1
            style={{
              fontSize: '88px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              margin: '0 0 20px 0',
              lineHeight: 1,
              textAlign: 'center',
              letterSpacing: '-2px',
            }}
          >
            Tech Blog
          </h1>

          {/* Subtítulo */}
          <p
            style={{
              fontSize: '32px',
              color: '#e9d5ff',
              margin: '0 0 40px 0',
              textAlign: 'center',
              lineHeight: 1.4,
              fontWeight: '500',
              maxWidth: '900px',
            }}
          >
            Articles about DevOps, Cloud, Kubernetes & More
          </p>

          {/* Categorias */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {['DevOps', 'Cloud', 'Kubernetes', 'Infrastructure', 'Automation'].map((cat) => (
              <div
                key={cat}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(168, 85, 247, 0.2)',
                  border: '2px solid rgba(168, 85, 247, 0.4)',
                  borderRadius: '12px',
                  color: '#e9d5ff',
                  fontSize: '20px',
                  fontWeight: '600',
                }}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <span
            style={{
              fontSize: '24px',
              color: '#c084fc',
              fontWeight: '700',
            }}
          >
            Caio Barbieri
          </span>
          <div
            style={{
              width: '2px',
              height: '20px',
              background: 'rgba(192, 132, 252, 0.3)',
            }}
          />
          <span
            style={{
              fontSize: '20px',
              color: '#e9d5ff',
              fontFamily: 'monospace',
            }}
          >
            caio.lombello.com/blog
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

