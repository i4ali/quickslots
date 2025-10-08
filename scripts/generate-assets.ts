/**
 * Generate production image assets from SVG sources
 *
 * Usage:
 *   npm install sharp --save-dev
 *   npx tsx scripts/generate-assets.ts
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join } from 'path';

const publicDir = join(process.cwd(), 'public');

async function generateAssets() {
  console.log('🎨 Generating production assets...\n');

  try {
    // Read SVG files
    const faviconSvg = readFileSync(join(publicDir, 'favicon.svg'));
    const ogImageSvg = readFileSync(join(publicDir, 'og-image.svg'));

    // Generate apple-touch-icon.png (180x180)
    console.log('📱 Generating apple-touch-icon.png (180x180)...');
    await sharp(faviconSvg)
      .resize(180, 180)
      .png()
      .toFile(join(publicDir, 'apple-touch-icon.png'));
    console.log('✅ Created apple-touch-icon.png\n');

    // Generate favicon.ico (32x32)
    console.log('🌐 Generating favicon.ico (32x32)...');
    await sharp(faviconSvg)
      .resize(32, 32)
      .png() // Sharp doesn't support ICO directly, so we'll create PNG
      .toFile(join(publicDir, 'favicon-32x32.png'));
    console.log('✅ Created favicon-32x32.png (use this or rename to favicon.ico)\n');

    // Generate OG image PNG (1200x630)
    console.log('📷 Generating og-image.png (1200x630)...');
    await sharp(ogImageSvg)
      .resize(1200, 630)
      .png()
      .toFile(join(publicDir, 'og-image.png'));
    console.log('✅ Created og-image.png\n');

    console.log('🎉 All assets generated successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Update app/layout.tsx to use og-image.png instead of .svg');
    console.log('2. For true favicon.ico, use https://realfavicongenerator.net/');
    console.log('   or rename favicon-32x32.png to favicon.ico');

  } catch (error) {
    console.error('❌ Error generating assets:', error);
    console.log('\n💡 Make sure sharp is installed:');
    console.log('   npm install sharp --save-dev');
    process.exit(1);
  }
}

generateAssets();
