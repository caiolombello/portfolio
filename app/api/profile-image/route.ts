import { NextRequest, NextResponse } from 'next/server';
import { getSiteConfig } from '@/lib/config-server';
import { resolveProfileImage } from '@/lib/profile-image';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const size = searchParams.get('size') ? parseInt(searchParams.get('size')!) : undefined;

    // Get site configuration
    const config = getSiteConfig();
    const profileImageConfig = config.site.profileImage;
    
    // Try to resolve the profile image
    const profileImageResult = await resolveProfileImage(profileImageConfig, { size });
    
    if (!profileImageResult) {
      return new NextResponse('Profile image not found', { status: 404 });
    }

    // Return the image with appropriate headers
    return new NextResponse(profileImageResult.buffer, {
      headers: {
        'Content-Type': profileImageResult.contentType,
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400', // 1h cache, 24h stale
        'X-Image-Source': profileImageResult.source,
      },
    });
  } catch (error) {
    console.error('Error serving profile image:', error);
    return new NextResponse('Error loading profile image', { status: 500 });
  }
} 