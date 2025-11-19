import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Caio Barbieri - DevOps Engineer';
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
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid de fundo animado */}
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
            backgroundSize: '50px 50px',
          }}
        />

        {/* Círculos de fundo decorativos */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
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
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
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
          {/* Logo/Ícone no topo */}
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
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '16px 32px',
                background: 'rgba(255, 215, 0, 0.1)',
                border: '2px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '50px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}
              >
                ⚡
              </div>
              <span
                style={{
                  fontSize: '28px',
                  color: '#FFD700',
                  fontWeight: '700',
                  letterSpacing: '2px',
                }}
              >
                DEVOPS • SRE • CLOUD
              </span>
            </div>
          </div>

          {/* Nome principal */}
          <h1
            style={{
              fontSize: '96px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              margin: '0 0 24px 0',
              lineHeight: 1,
              textAlign: 'center',
              letterSpacing: '-2px',
            }}
          >
            Caio Barbieri
          </h1>

          {/* Descrição/Título */}
          <p
            style={{
              fontSize: '36px',
              color: '#e2e8f0',
              margin: '0 0 40px 0',
              textAlign: 'center',
              lineHeight: 1.4,
              fontWeight: '500',
              maxWidth: '900px',
            }}
          >
            Senior DevOps Engineer & Cloud Architect
          </p>

          {/* Tech Stack */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {['AWS', 'Kubernetes', 'Terraform', 'Docker', 'CI/CD', 'Python'].map((tech) => (
              <div
                key={tech}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#cbd5e1',
                  fontSize: '20px',
                  fontWeight: '600',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* Footer com URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 32px',
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '50px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 215, 0, 0.2)',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
            }}
          />
          <span
            style={{
              fontSize: '22px',
              color: '#e2e8f0',
              fontFamily: 'monospace',
              fontWeight: '500',
            }}
          >
            caio.lombello.com
          </span>
        </div>

        {/* Elementos decorativos de código */}
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '60px',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.15)',
            fontFamily: 'monospace',
          }}
        >
          {'<DevOps />'}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '100px',
            right: '60px',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.15)',
            fontFamily: 'monospace',
          }}
        >
          {'{ cloud: "native" }'}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

