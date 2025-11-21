import { ImageResponse } from 'next/og';
import { loadPostBySlug } from '@/lib/data';

export const runtime = 'edge';

export const alt = 'Blog Post Cover';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const post = await loadPostBySlug(slug);

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Post not found
        </div>
      ),
      { ...size }
    );
  }

  // Determine language and content based on slug
  const isPt = post.slug_pt === slug;
  const title = isPt ? post.title_pt : post.title_en;
  const tags = isPt ? post.tags_pt : post.tags_en;

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
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 215, 0, 0.15) 2%, transparent 0%)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Site Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '40px',
            background: 'rgba(255, 215, 0, 0.1)',
            padding: '12px 24px',
            borderRadius: '30px',
            border: '1px solid rgba(255, 215, 0, 0.2)',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#FFD700',
            }}
          />
          <span
            style={{
              fontSize: '24px',
              color: '#FFD700',
              fontWeight: 'bold',
              fontFamily: 'sans-serif',
            }}
          >
            caio.lombello.com
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: '40px',
            fontFamily: 'sans-serif',
            maxWidth: '90%',
          }}
        >
          {title}
        </h1>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {tags?.slice(0, 3).map((tag: string) => (
            <div
              key={tag}
              style={{
                padding: '8px 20px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                fontSize: '24px',
                color: '#e2e8f0',
                fontFamily: 'sans-serif',
              }}
            >
              #{tag}
            </div>
          ))}
        </div>

        {/* Author */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            right: '60px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <span style={{ fontSize: '24px', color: '#ffffff', fontWeight: 'bold' }}>
              Caio Barbieri
            </span>
            <span style={{ fontSize: '18px', color: '#94a3b8' }}>
              SRE | Cloud Engineer
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
