import fs from 'fs/promises';
import path from 'path';

export interface ProfileImageConfig {
  type: 'local' | 'github' | 'external';
  source: string;
  fallbacks?: ProfileImageConfig[];
}

export interface ProfileImageResult {
  buffer: Buffer;
  contentType: string;
  source: string;
}

/**
 * Resolve profile image from different sources with fallback support
 */
export async function resolveProfileImage(
  config: ProfileImageConfig | string,
  options: { size?: number } = {}
): Promise<ProfileImageResult | null> {
  // Handle legacy string config
  if (typeof config === 'string') {
    config = {
      type: 'local',
      source: config,
    };
  }

  const { size } = options;

  try {
    switch (config.type) {
      case 'github':
        return await fetchGitHubAvatar(config.source, size);
      
      case 'external':
        return await fetchExternalImage(config.source);
      
      case 'local':
      default:
        return await fetchLocalImage(config.source);
    }
  } catch (error) {
    // Try fallbacks
    if (config.fallbacks && config.fallbacks.length > 0) {
      for (const fallback of config.fallbacks) {
        try {
          const result = await resolveProfileImage(fallback, options);
          if (result) {
            return result;
          }
        } catch (fallbackError) {
          // Continue to next fallback
        }
      }
    }
    
    return null;
  }
}

async function fetchGitHubAvatar(username: string, size?: number): Promise<ProfileImageResult> {
  const sizeParam = size ? `?s=${size}` : '';
  const url = `https://github.com/${username}.png${sizeParam}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GitHub avatar fetch failed: ${response.status}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  return {
    buffer,
    contentType: 'image/png',
    source: `github:${username}`
  };
}

async function fetchExternalImage(url: string): Promise<ProfileImageResult> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`External image fetch failed: ${response.status}`);
  }
  
  const contentType = response.headers.get('content-type') || 'image/png';
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  return {
    buffer,
    contentType,
    source: `external:${url}`
  };
}

async function fetchLocalImage(imagePath: string): Promise<ProfileImageResult> {
  // Remove leading slash if present for path.join
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const fullPath = path.join(process.cwd(), 'public', cleanPath);
  
  try {
    await fs.access(fullPath);
  } catch {
    throw new Error(`Local image not found: ${fullPath}`);
  }
  
  const buffer = await fs.readFile(fullPath);
  const ext = path.extname(imagePath).toLowerCase();
  
  let contentType = 'image/png';
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      contentType = 'image/jpeg';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
    case '.webp':
      contentType = 'image/webp';
      break;
    case '.gif':
      contentType = 'image/gif';
      break;
  }
  
  return {
    buffer,
    contentType,
    source: `local:${imagePath}`
  };
}

/**
 * Generate a circular mask for the image
 */
export function createCircularMask(size: number): Buffer {
  const svgMask = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id="circle">
          <rect width="${size}" height="${size}" fill="black"/>
          <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white"/>
        </mask>
      </defs>
      <rect width="${size}" height="${size}" fill="white" mask="url(#circle)"/>
    </svg>
  `;
  return Buffer.from(svgMask);
}

export default resolveProfileImage; 