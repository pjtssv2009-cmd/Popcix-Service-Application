import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ANDROID_RES = path.resolve('android/app/src/main/res');
const BRANDING_DIR = path.resolve('public/assets/branding');

const darkSquarePath = path.join(BRANDING_DIR, 'logo-dark-square.png');
const darkHorizPath = path.join(BRANDING_DIR, 'logo-dark-horizontal.png');
const lightHorizPath = path.join(BRANDING_DIR, 'logo-light-horizontal.png');

async function processBranding() {
  console.log('Generating Android Icons from official brand logo...');

  const mipmapSizes = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192
  };

  for (const [dir, size] of Object.entries(mipmapSizes)) {
    const targetDir = path.join(ANDROID_RES, dir);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    // Square Launcher
    await sharp(darkSquarePath)
      .resize(size, size)
      .png()
      .toFile(path.join(targetDir, 'ic_launcher.png'));

    // Round Launcher (with subtle round mask if desired or direct)
    await sharp(darkSquarePath)
      .resize(size, size)
      .png()
      .toFile(path.join(targetDir, 'ic_launcher_round.png'));

    // Foreground icon with slight padding
    const innerSize = Math.round(size * 0.75);
    const pad = Math.round((size - innerSize) / 2);
    await sharp(darkSquarePath)
      .resize(innerSize, innerSize)
      .extend({
        top: pad,
        bottom: pad,
        left: pad,
        right: pad,
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      })
      .resize(size, size)
      .png()
      .toFile(path.join(targetDir, 'ic_launcher_foreground.png'));

    console.log(`✓ Generated ${dir} (${size}x${size})`);
  }

  console.log('Generating Native Splash Screens with official brand logo...');

  const splashPortSizes = {
    'drawable': [1080, 1920],
    'drawable-port-mdpi': [320, 480],
    'drawable-port-hdpi': [480, 800],
    'drawable-port-xhdpi': [720, 1280],
    'drawable-port-xxhdpi': [960, 1600],
    'drawable-port-xxxhdpi': [1280, 1920],
    'drawable-land-mdpi': [480, 320],
    'drawable-land-hdpi': [800, 480],
    'drawable-land-xhdpi': [1280, 720],
    'drawable-land-xxhdpi': [1600, 960],
    'drawable-land-xxxhdpi': [1920, 1280]
  };

  for (const [dir, [w, h]] of Object.entries(splashPortSizes)) {
    const targetDir = path.join(ANDROID_RES, dir);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    // Calculate logo width for splash (roughly 55% of width or suitable max)
    const logoTargetWidth = Math.min(Math.round(w * 0.65), 600);

    const resizedLogo = await sharp(darkHorizPath)
      .resize(logoTargetWidth)
      .toBuffer();

    // Composite on black background
    await sharp({
      create: {
        width: w,
        height: h,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      }
    })
      .composite([{
        input: resizedLogo,
        gravity: 'center'
      }])
      .png()
      .toFile(path.join(targetDir, 'splash.png'));

    console.log(`✓ Generated ${dir}/splash.png (${w}x${h})`);
  }

  console.log('Branding assets generated successfully!');
}

processBranding().catch(console.error);
