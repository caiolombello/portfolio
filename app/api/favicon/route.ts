import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const size = parseInt(searchParams.get('size') || '32');
    const format = searchParams.get('format') || 'png';

    // Read the SVG file
    const svgPath = path.join(process.cwd(), 'public', 'images', 'devops_logo.svg');
    const svgBuffer = await fs.readFile(svgPath);

    // Convert SVG to the requested format and size
    let imageBuffer;
    if (format === 'ico') {
      // For ICO format, we'll create a 32x32 PNG and convert it to ICO
      imageBuffer = await sharp(svgBuffer)
        .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
    } else {
      // For PNG format
      imageBuffer = await sharp(svgBuffer)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
    }

    // Set the appropriate content type
    const contentType = format === 'ico' ? 'image/x-icon' : 'image/png';

    // Return the image
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error generating favicon:', error);
    return new NextResponse('Error generating favicon', { status: 500 });
  }
}
