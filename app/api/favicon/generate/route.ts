import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import sharp from 'sharp'

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    // Fetch the image
    const response = await fetch(imageUrl)
    const imageBuffer = await response.arrayBuffer()

    // Generate favicons in different sizes
    const sizes = [16, 32, 48, 64, 96, 128, 192, 256, 384, 512]

    for (const size of sizes) {
      // Process the image with sharp
      const processedImage = await sharp(Buffer.from(imageBuffer))
        .resize(size, size)
        .toFormat('png')
        .toBuffer()

      // Upload to Blob Storage
      await put(`portfolio-images/favicon-${size}x${size}.png`, processedImage, {
        access: 'public',
        contentType: 'image/png',
      })
    }

    // Generate favicon.ico (using size 32x32)
    const icoImage = await sharp(Buffer.from(imageBuffer))
      .resize(32, 32)
      .toFormat('png')
      .toBuffer()

    await put('portfolio-images/favicon.ico', icoImage, {
      access: 'public',
      contentType: 'image/x-icon',
    })

    // Generate apple-touch-icon (using size 180x180)
    const appleIcon = await sharp(Buffer.from(imageBuffer))
      .resize(180, 180)
      .toFormat('png')
      .toBuffer()

    await put('portfolio-images/apple-touch-icon.png', appleIcon, {
      access: 'public',
      contentType: 'image/png',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error generating favicon:', error)
    return NextResponse.json(
      { error: 'Failed to generate favicon' },
      { status: 500 }
    )
  }
} 