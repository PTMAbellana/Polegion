const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You need this

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const BUCKET_NAME = 'assets';

async function createBucketIfNotExists() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);

  if (!bucketExists) {
    console.log(`📦 Creating bucket: ${BUCKET_NAME}`);
    const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 52428800, // 50MB
    });

    if (error) {
      console.error('❌ Error creating bucket:', error);
      process.exit(1);
    }
    console.log('✅ Bucket created successfully');
  } else {
    console.log(`✅ Bucket already exists: ${BUCKET_NAME}`);
  }
}

async function uploadFile(filePath, uploadPath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const contentType = getContentType(filePath);

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(uploadPath, fileBuffer, {
        contentType,
        cacheControl: '31536000', // 1 year
        upsert: true
      });

    if (error) {
      console.error(`❌ Error uploading ${uploadPath}:`, error.message);
      return false;
    }

    console.log(`✅ Uploaded: ${uploadPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error uploading ${filePath}:`, error.message);
    return false;
  }
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
  };
  return types[ext] || 'application/octet-stream';
}

async function walkDirectory(dir, baseDir, callback) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await walkDirectory(filePath, baseDir, callback);
    } else {
      const relativePath = path.relative(baseDir, filePath);
      await callback(filePath, relativePath);
    }
  }
}

async function main() {
  console.log('🚀 Starting upload to Supabase Storage...\n');

  // Create bucket if needed
  await createBucketIfNotExists();

  const stats = {
    total: 0,
    uploaded: 0,
    failed: 0,
    totalSize: 0
  };

  // Upload images
  const imagesDir = path.join(PUBLIC_DIR, 'images');
  if (fs.existsSync(imagesDir)) {
    console.log('\n📁 Uploading images...');
    await walkDirectory(imagesDir, PUBLIC_DIR, async (filePath, relativePath) => {
      stats.total++;
      stats.totalSize += fs.statSync(filePath).size;
      
      const success = await uploadFile(filePath, relativePath);
      if (success) {
        stats.uploaded++;
      } else {
        stats.failed++;
      }
    });
  }

  // Upload audio
  const audioDir = path.join(PUBLIC_DIR, 'audio');
  if (fs.existsSync(audioDir)) {
    console.log('\n🔊 Uploading audio files...');
    await walkDirectory(audioDir, PUBLIC_DIR, async (filePath, relativePath) => {
      stats.total++;
      stats.totalSize += fs.statSync(filePath).size;
      
      const success = await uploadFile(filePath, relativePath);
      if (success) {
        stats.uploaded++;
      } else {
        stats.failed++;
      }
    });
  }

  console.log('\n📊 Upload Summary:');
  console.log(`   Total files: ${stats.total}`);
  console.log(`   Uploaded: ${stats.uploaded}`);
  console.log(`   Failed: ${stats.failed}`);
  console.log(`   Total size: ${(stats.totalSize / 1024 / 1024).toFixed(2)}MB`);
  
  if (stats.uploaded > 0) {
    console.log('\n✅ Upload complete!');
    console.log('\n💡 Next steps:');
    console.log('   1. Add to .env.local: NEXT_PUBLIC_USE_SUPABASE_STORAGE=true');
    console.log('   2. Update image imports to use the imageLoader utility');
    console.log('   3. Test locally');
    console.log('   4. Deploy to Railway');
    console.log(`\n📦 Your assets are now available at:`);
    console.log(`   ${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/`);
  }
}

main().catch(console.error);
