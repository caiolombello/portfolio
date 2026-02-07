import { ImageResponse } from 'next/og';
import { loadProjectById } from '@/lib/data';
import { getOgSiteConfig, getDomainFromUrl } from '@/lib/og-config';
import type { Technology } from '@/types/project';

export const runtime = 'edge';

export const alt = 'Project';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function Image({ params }: Props) {
  const { id } = await params;
  const project = await loadProjectById(id);

  if (!project) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: '#121212',
            color: '#FFD700',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Project not found
        </div>
      ),
      { ...size }
    );
  }

  const config = await getOgSiteConfig();
  const domain = getDomainFromUrl(config.site.url);
  const title = project.title_en || project.title_pt;
  const description = project.shortDescription_en || project.shortDescription_pt;
  const techs: string[] = project.technologies?.slice(0, 5).map((t: Technology) => t.tech) || [];
  const category = project.category || '';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0c1220 0%, #1a2744 50%, #0f2027 100%)',
          padding: '80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 215, 0, 0.08) 2%, transparent 0%)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Decorative circle */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Category badge */}
        {category && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '32px',
              background: 'rgba(59, 130, 246, 0.15)',
              padding: '10px 24px',
              borderRadius: '30px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            <span style={{ fontSize: '28px' }}>🚀</span>
            <span
              style={{
                fontSize: '22px',
                color: '#93c5fd',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {category}
            </span>
          </div>
        )}

        {/* Title */}
        <h1
          style={{
            fontSize: '68px',
            fontWeight: 'bold',
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: '24px',
            maxWidth: '90%',
          }}
        >
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p
            style={{
              fontSize: '28px',
              color: '#94a3b8',
              lineHeight: 1.4,
              marginBottom: '40px',
              maxWidth: '85%',
            }}
          >
            {description.length > 120 ? `${description.substring(0, 117)}...` : description}
          </p>
        )}

        {/* Technologies */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {techs.map((tech) => (
            <div
              key={tech}
              style={{
                padding: '10px 22px',
                background: 'rgba(255, 215, 0, 0.1)',
                border: '1px solid rgba(255, 215, 0, 0.25)',
                borderRadius: '20px',
                fontSize: '20px',
                color: '#fde68a',
                fontWeight: '600',
              }}
            >
              {tech}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '60px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <span style={{ fontSize: '22px', color: '#64748b', fontFamily: 'monospace' }}>
            {domain}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
