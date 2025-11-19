import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Professional Resume - Caio Barbieri';
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
          background: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 50%, #c2410c 100%)',
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
            background: 'radial-gradient(circle, rgba(251, 146, 60, 0.25) 0%, transparent 70%)',
            filter: 'blur(70px)',
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
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.25) 0%, transparent 70%)',
            filter: 'blur(70px)',
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
          {/* Ícone de currículo */}
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
                width: '140px',
                height: '140px',
                background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '72px',
                boxShadow: '0 25px 70px rgba(251, 146, 60, 0.5)',
                border: '3px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              📄
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
            Resume
          </h1>

          {/* Nome */}
          <h2
            style={{
              fontSize: '48px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              margin: '0 0 30px 0',
              lineHeight: 1,
              textAlign: 'center',
            }}
          >
            Caio Barbieri
          </h2>

          {/* Título profissional */}
          <p
            style={{
              fontSize: '32px',
              color: '#fed7aa',
              margin: '0 0 50px 0',
              textAlign: 'center',
              lineHeight: 1.4,
              fontWeight: '500',
            }}
          >
            Senior DevOps Engineer & Cloud Architect
          </p>

          {/* Seções do currículo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {[
              { icon: '💼', label: 'Experience' },
              { icon: '🎓', label: 'Education' },
              { icon: '🏆', label: 'Certifications' },
              { icon: '🛠️', label: 'Skills' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '20px 28px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <div
                  style={{
                    fontSize: '36px',
                  }}
                >
                  {item.icon}
                </div>
                <span
                  style={{
                    fontSize: '20px',
                    color: '#ffffff',
                    fontWeight: '600',
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Badge de download */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '50px',
              padding: '16px 32px',
              background: 'rgba(251, 146, 60, 0.2)',
              border: '2px solid rgba(251, 146, 60, 0.4)',
              borderRadius: '50px',
            }}
          >
            <div
              style={{
                fontSize: '28px',
              }}
            >
              ⬇️
            </div>
            <span
              style={{
                fontSize: '24px',
                color: '#ffffff',
                fontWeight: '600',
                letterSpacing: '1px',
              }}
            >
              AVAILABLE FOR DOWNLOAD
            </span>
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
              color: '#fed7aa',
              fontWeight: '700',
            }}
          >
            Professional Portfolio
          </span>
          <div
            style={{
              width: '2px',
              height: '20px',
              background: 'rgba(254, 215, 170, 0.4)',
            }}
          />
          <span
            style={{
              fontSize: '20px',
              color: '#ffffff',
              fontFamily: 'monospace',
            }}
          >
            caio.lombello.com/resume
          </span>
        </div>

        {/* Elementos decorativos */}
        <div
          style={{
            position: 'absolute',
            top: '60px',
            left: '60px',
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.15)',
            fontFamily: 'monospace',
          }}
        >
          {'{ pdf: true }'}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '120px',
            right: '60px',
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.15)',
            fontFamily: 'monospace',
          }}
        >
          {'<CV />'}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

