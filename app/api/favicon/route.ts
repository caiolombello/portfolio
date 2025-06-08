import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { resolveProfileImage } from '@/lib/profile-image';
import { getSiteConfig } from '@/lib/config-server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const size = parseInt(searchParams.get('size') || '32');
  const format = searchParams.get('format') || 'ico';

  try {
    let imageBuffer: Buffer;
    
    try {
      // Tentar carregar imagem de perfil
      const config = getSiteConfig();
      const profileImageResult = await resolveProfileImage(config.site.profileImage, { size });
      
      if (profileImageResult) {
        // Gerar favicon simples com a imagem de perfil (sem círculo por enquanto)
        imageBuffer = await sharp(profileImageResult.buffer)
          .resize(size, size, { fit: 'cover', position: 'center' })
          .png()
          .toBuffer();
      } else {
        throw new Error('Profile image not available');
      }
    } catch (profileError) {
      // Fallback: gerar favicon padrão com logo do site
      const logoSvg = `
        <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#FFA500;stop-opacity:1" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#grad)" stroke="#333" stroke-width="2"/>
          <text x="50" y="65" font-family="Arial, sans-serif" font-size="45" font-weight="bold" 
                text-anchor="middle" fill="#333">P</text>
        </svg>
      `;

      imageBuffer = await sharp(Buffer.from(logoSvg))
        .resize(size, size)
        .png()
        .toBuffer();
    }

    // Converter para ICO se solicitado
    if (format === 'ico') {
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': 'image/x-icon',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // Para outros formatos (PNG)
    const contentType = format === 'png' ? 'image/png' : 'image/x-icon';
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    // Fallback ainda mais simples
    const fallbackSvg = `
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" fill="#FFD700"/>
        <text x="16" y="22" font-family="Arial" font-size="18" font-weight="bold" 
              text-anchor="middle" fill="#333">P</text>
      </svg>
    `;
    
    try {
      const fallbackBuffer = await sharp(Buffer.from(fallbackSvg))
        .png()
        .toBuffer();
        
      return new NextResponse(fallbackBuffer, {
        headers: {
          'Content-Type': 'image/x-icon',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } catch (fallbackError) {
      return new NextResponse('Error generating favicon', { status: 500 });
    }
  }
}
