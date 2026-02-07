import { ImageResponse } from 'next/og';
import { loadPostBySlug } from '@/lib/data';
import { getOgSiteConfig, getDomainFromUrl } from '@/lib/og-config';

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
            background: '#121212',
            color: '#FFD700',
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

  const config = await getOgSiteConfig();
  const name = config.site.shortName;
  const jobTitle = config.site.title.split(' - ').slice(1).join(' - ') || '';
  const domain = getDomainFromUrl(config.site.url);

  const isPt = post.slug_pt === slug;
  const title = isPt ? post.title_pt : post.title_en;
  const tags = isPt ? post.tags_pt : post.tags_en;

  const hasCover = !!post.coverImage;
  const coverUrl = hasCover
    ? (post.coverImage!.startsWith('http') ? post.coverImage! : `${config.site.url}${post.coverImage}`)
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        }}
      >
        {/* Cover image as background */}
        {coverUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt=""
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
              }}
            />
            {/* Dark overlay for readability */}
            <div
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)',
              }}
            />
          </>
        )}

        {/* Background pattern (only when no cover) */}
        {!hasCover && (
          <div
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 215, 0, 0.15) 2%, transparent 0%)',
              backgroundSize: '50px 50px',
            }}
          />
        )}

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '80px',
            width: '100%',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Site Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '32px',
              background: 'rgba(255, 215, 0, 0.15)',
              padding: '10px 22px',
              borderRadius: '30px',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              alignSelf: 'flex-start',
            }}
          >
            <div
              style={{
                width: '10px', height: '10px',
                borderRadius: '50%', background: '#FFD700',
              }}
            />
            <span style={{ fontSize: '22px', color: '#FFD700', fontWeight: 'bold' }}>
              {domain}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: title.length > 60 ? '52px' : '68px',
              fontWeight: 'bold',
              color: '#ffffff',
              lineHeight: 1.1,
              marginBottom: '32px',
              maxWidth: '90%',
              textShadow: hasCover ? '0 2px 8px rgba(0,0,0,0.5)' : 'none',
            }}
          >
            {title}
          </h1>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {tags?.slice(0, 4).map((tag: string) => (
              <div
                key={tag}
                style={{
                  padding: '8px 18px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  borderRadius: '20px',
                  fontSize: '22px',
                  color: '#e2e8f0',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                #{tag}
              </div>
            ))}
          </div>
        </div>

        {/* Author */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '60px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '24px', color: '#ffffff', fontWeight: 'bold', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              {name}
            </span>
            {jobTitle && (
              <span style={{ fontSize: '18px', color: '#94a3b8', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                {jobTitle}
              </span>
            )}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
