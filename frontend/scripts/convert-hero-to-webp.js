const sharp = require('sharp');
const path = require('path');

const inputPath = path.join(__dirname, '../public/images/landing-page-herosection.png');
const outputPath = path.join(__dirname, '../public/images/landing-page-herosection.webp');

console.log('Converting landing-page-herosection.png to WebP...');

sharp(inputPath)
  .webp({ quality: 85 })
  .toFile(outputPath)
  .then(info => {
    console.log('✅ Conversion successful!');
    console.log(`Output: ${outputPath}`);
    console.log(`Size: ${(info.size / 1024).toFixed(2)} KB`);
    console.log(`Dimensions: ${info.width}x${info.height}`);
  })
  .catch(err => {
    console.error('❌ Conversion failed:', err);
  });
