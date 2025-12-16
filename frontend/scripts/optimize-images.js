const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const OUTPUT_DIR = path.join(__dirname, '..', 'public-optimized');

// Configuration
const QUALITY = 80; // WebP quality
const MAX_WIDTH = 1920; // Max width for images
const SKIP_GIFS = true; // Don't convert GIFs (they're animated)

async function optimizeImage(inputPath, outputPath) {
  try {
    const ext = path.extname(inputPath).toLowerCase();
    
    // Skip GIFs
    if (ext === '.gif' && SKIP_GIFS) {
      console.log(`⏭️  Skipping: ${path.basename(inputPath)} (GIF)`);
      return;
    }

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Get original size
    const originalStats = fs.statSync(inputPath);
    const originalSize = originalStats.size / 1024; // KB

    // Convert to WebP
    const webpPath = outputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    
    await sharp(inputPath)
      .resize(MAX_WIDTH, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: QUALITY })
      .toFile(webpPath);

    // Get optimized size
    const optimizedStats = fs.statSync(webpPath);
    const optimizedSize = optimizedStats.size / 1024; // KB
    const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

    console.log(`✅ ${path.basename(inputPath)} -> ${path.basename(webpPath)}`);
    console.log(`   ${originalSize.toFixed(1)}KB -> ${optimizedSize.toFixed(1)}KB (${savings}% smaller)`);

    return {
      original: inputPath,
      optimized: webpPath,
      originalSize,
      optimizedSize,
      savings: parseFloat(savings)
    };
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

async function walkDirectory(dir, callback) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await walkDirectory(filePath, callback);
    } else if (/\.(png|jpg|jpeg|gif)$/i.test(file)) {
      await callback(filePath);
    }
  }
}

async function main() {
  console.log('🚀 Starting image optimization...\n');
  
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error('❌ Images directory not found:', IMAGES_DIR);
    process.exit(1);
  }

  // Check if sharp is installed
  try {
    require('sharp');
  } catch (e) {
    console.error('❌ Sharp is not installed. Run: npm install --save-dev sharp');
    process.exit(1);
  }

  const stats = {
    total: 0,
    optimized: 0,
    totalOriginalSize: 0,
    totalOptimizedSize: 0
  };

  await walkDirectory(IMAGES_DIR, async (filePath) => {
    stats.total++;
    const relativePath = path.relative(PUBLIC_DIR, filePath);
    const outputPath = path.join(OUTPUT_DIR, relativePath);

    const result = await optimizeImage(filePath, outputPath);
    if (result) {
      stats.optimized++;
      stats.totalOriginalSize += result.originalSize;
      stats.totalOptimizedSize += result.optimizedSize;
    }
  });

  console.log('\n📊 Optimization Summary:');
  console.log(`   Files processed: ${stats.total}`);
  console.log(`   Files optimized: ${stats.optimized}`);
  console.log(`   Original size: ${stats.totalOriginalSize.toFixed(1)}KB`);
  console.log(`   Optimized size: ${stats.totalOptimizedSize.toFixed(1)}KB`);
  console.log(`   Total savings: ${((1 - stats.totalOptimizedSize / stats.totalOriginalSize) * 100).toFixed(1)}%`);
  console.log('\n✅ Optimization complete!');
  console.log(`   Optimized images saved to: ${OUTPUT_DIR}`);
  console.log('\n💡 Next steps:');
  console.log('   1. Review optimized images in public-optimized/');
  console.log('   2. If satisfied, backup original public/ folder');
  console.log('   3. Replace public/images with public-optimized/images');
  console.log('   4. Deploy to Railway');
}

main().catch(console.error);
