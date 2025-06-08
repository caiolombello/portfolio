#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];
const OUTPUT_FORMATS = ['webp', 'avif'];
const QUALITY_SETTINGS = {
  webp: 85,
  avif: 80,
  jpeg: 90,
  png: 95
};

// Different size configurations for different image types
const SIZE_CONFIGS = {
  profile: [
    { width: 400, height: 400, suffix: '' },
    { width: 200, height: 200, suffix: '-200' },
    { width: 100, height: 100, suffix: '-100' },
    { width: 50, height: 50, suffix: '-50' }
  ],
  projects: [
    { width: 800, height: 600, suffix: '' },
    { width: 400, height: 300, suffix: '-400' },
    { width: 200, height: 150, suffix: '-200' }
  ],
  blog: [
    { width: 1200, height: 675, suffix: '' },
    { width: 800, height: 450, suffix: '-800' },
    { width: 400, height: 225, suffix: '-400' }
  ],
  general: [
    { width: 800, height: 600, suffix: '' },
    { width: 400, height: 300, suffix: '-400' }
  ]
};

async function getAllImageFiles(dir) {
  const files = [];
  
  async function scanDirectory(currentDir) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          await scanDirectory(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (SUPPORTED_FORMATS.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan directory ${currentDir}:`, error.message);
    }
  }
  
  await scanDirectory(dir);
  return files;
}

function getImageType(filePath) {
  const normalizedPath = filePath.toLowerCase();
  
  if (normalizedPath.includes('/profile/')) return 'profile';
  if (normalizedPath.includes('/projects/')) return 'projects';
  if (normalizedPath.includes('/blog/')) return 'blog';
  return 'general';
}

async function optimizeImage(inputPath, outputDir, sizeConfig, format, quality) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Calculate output dimensions maintaining aspect ratio
    let { width: targetWidth, height: targetHeight } = sizeConfig;
    
    if (metadata.width && metadata.height) {
      const aspectRatio = metadata.width / metadata.height;
      
      if (targetWidth && !targetHeight) {
        targetHeight = Math.round(targetWidth / aspectRatio);
      } else if (targetHeight && !targetWidth) {
        targetWidth = Math.round(targetHeight * aspectRatio);
      }
    }
    
    // Don't upscale images
    if (metadata.width && targetWidth > metadata.width) {
      targetWidth = metadata.width;
    }
    if (metadata.height && targetHeight > metadata.height) {
      targetHeight = metadata.height;
    }
    
    const parsedPath = path.parse(inputPath);
    const outputFileName = `${parsedPath.name}${sizeConfig.suffix}.${format}`;
    const outputPath = path.join(outputDir, outputFileName);
    
    let processedImage = image.resize(targetWidth, targetHeight, {
      fit: 'cover',
      withoutEnlargement: true
    });
    
    // Apply format-specific optimizations
    switch (format) {
      case 'webp':
        await processedImage
          .webp({ quality, effort: 6 })
          .toFile(outputPath);
        break;
      case 'avif':
        await processedImage
          .avif({ quality, effort: 6 })
          .toFile(outputPath);
        break;
      case 'jpeg':
        await processedImage
          .jpeg({ quality, progressive: true, mozjpeg: true })
          .toFile(outputPath);
        break;
      case 'png':
        await processedImage
          .png({ compressionLevel: 9, adaptiveFiltering: true })
          .toFile(outputPath);
        break;
    }
    
    return outputPath;
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

async function processImages() {
  console.log('🚀 Starting image optimization...\n');
  
  const publicDir = path.join(__dirname, '..', 'public');
  const imagesDir = path.join(publicDir, 'images');
  
  // Check if images directory exists
  try {
    await fs.access(imagesDir);
  } catch {
    console.log('📁 Creating images directory...');
    await fs.mkdir(imagesDir, { recursive: true });
  }
  
  // Get all image files
  console.log('🔍 Scanning for images...');
  const imageFiles = await getAllImageFiles(imagesDir);
  
  if (imageFiles.length === 0) {
    console.log('ℹ️  No images found to optimize.');
    return;
  }
  
  console.log(`📸 Found ${imageFiles.length} images to optimize\n`);
  
  let totalProcessed = 0;
  let totalSaved = 0;
  
  for (const imagePath of imageFiles) {
    const relativePath = path.relative(imagesDir, imagePath);
    console.log(`⚙️  Processing: ${relativePath}`);
    
    try {
      const imageType = getImageType(imagePath);
      const sizeConfigs = SIZE_CONFIGS[imageType];
      const outputDir = path.dirname(imagePath);
      
      // Get original file size
      const originalStats = await fs.stat(imagePath);
      const originalSize = originalStats.size;
      
      // Create optimized versions
      for (const sizeConfig of sizeConfigs) {
        for (const format of OUTPUT_FORMATS) {
          const quality = QUALITY_SETTINGS[format];
          const outputPath = await optimizeImage(
            imagePath, 
            outputDir, 
            sizeConfig, 
            format, 
            quality
          );
          
          if (outputPath) {
            const newStats = await fs.stat(outputPath);
            const savings = ((originalSize - newStats.size) / originalSize * 100).toFixed(1);
            console.log(`   ✅ Created: ${path.basename(outputPath)} (${savings}% smaller)`);
            totalSaved += (originalSize - newStats.size);
          }
        }
      }
      
      totalProcessed++;
      
    } catch (error) {
      console.error(`   ❌ Failed to process ${relativePath}:`, error.message);
    }
    
    console.log(''); // Empty line for readability
  }
  
  // Summary
  console.log('📊 Optimization Summary:');
  console.log(`   • Images processed: ${totalProcessed}/${imageFiles.length}`);
  console.log(`   • Total space saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
  console.log('\n✨ Image optimization complete!');
}

// Handle command line execution
if (import.meta.url === `file://${process.argv[1]}`) {
  processImages().catch(console.error);
}

export { processImages, optimizeImage, getAllImageFiles }; 