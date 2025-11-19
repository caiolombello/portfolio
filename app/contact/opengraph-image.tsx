import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = "Get in Touch - Caio Barbieri";
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
          background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)',
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
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Círculos decorativos */}
        <div
          style={{
            position: 'absolute',
            top: '-150px',
            right: '-150px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-150px',
            left: '-150px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(52, 211, 153, 0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
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
          {/* Ícone grande de contato */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '50px',
            }}
          >
            <div
              style={{
                width: '140px',
                height: '140px',
                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '72px',
                boxShadow: '0 25px 70px rgba(16, 185, 129, 0.5)',
              }}
            >
              💬
            </div>
          </div>

          {/* Título */}
          <h1
            style={{
              fontSize: '88px',
              fontWeight: '900',
              color: '#ffffff',
              margin: '0 0 20px 0',
              lineHeight: 1,
              textAlign: 'center',
              letterSpacing: '-2px',
            }}
          >
            Let's Connect
          </h1>

          {/* Subtítulo */}
          <p
            style={{
              fontSize: '36px',
              color: '#d1fae5',
              margin: '0 0 50px 0',
              textAlign: 'center',
              lineHeight: 1.4,
              fontWeight: '500',
              maxWidth: '900px',
            }}
          >
            Ready to discuss your next project?
          </p>

          {/* Métodos de contato */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '40px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px 32px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div
                style={{
                  fontSize: '32px',
                }}
              >
                📧
              </div>
              <span
                style={{
                  fontSize: '24px',
                  color: '#ffffff',
                  fontWeight: '600',
                }}
              >
                Email
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px 32px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div
                style={{
                  fontSize: '32px',
                }}
              >
                💼
              </div>
              <span
                style={{
                  fontSize: '24px',
                  color: '#ffffff',
                  fontWeight: '600',
                }}
              >
                LinkedIn
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px 32px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div
                style={{
                  fontSize: '32px',
                }}
              >
                💻
              </div>
              <span
                style={{
                  fontSize: '24px',
                  color: '#ffffff',
                  fontWeight: '600',
                }}
              >
                GitHub
              </span>
            </div>
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
              color: '#d1fae5',
              fontWeight: '700',
            }}
          >
            Caio Barbieri
          </span>
          <div
            style={{
              width: '2px',
              height: '20px',
              background: 'rgba(209, 250, 229, 0.4)',
            }}
          />
          <span
            style={{
              fontSize: '20px',
              color: '#ffffff',
              fontFamily: 'monospace',
            }}
          >
            caio.lombello.com/contact
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

