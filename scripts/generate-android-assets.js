import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ANDROID_RES = path.resolve('android/app/src/main/res');

// Create High-Res Icon SVG (1024x1024)
const iconSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#111111" />
      <stop offset="50%" stop-color="#000000" />
      <stop offset="100%" stop-color="#1A1A1A" />
    </linearGradient>
    <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE600" />
      <stop offset="100%" stop-color="#FF9900" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="24" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Squircle with subtle border -->
  <rect x="32" y="32" width="960" height="960" rx="220" fill="url(#bgGrad)" stroke="#333333" stroke-width="12" />

  <!-- Outer Ring Accent -->
  <circle cx="512" cy="480" r="320" stroke="#222222" stroke-width="8" stroke-dasharray="20 20" />

  <!-- Modern POPCIX 'P' + Home Shield Emblem -->
  <!-- Roof / Home Crest -->
  <path d="M512 240 L700 390 H324 Z" fill="url(#sparkGrad)" filter="url(#glow)" />
  <path d="M360 410 H664 V680 C664 740 590 800 512 820 C434 800 360 740 360 680 Z" fill="#FFFFFF" opacity="0.08" />
  
  <!-- Stylized Letter 'P' with lightning cut -->
  <path d="M420 380 H570 C630 380 670 420 670 480 C670 540 630 580 570 580 H490 V760 H420 V380 Z" fill="#FFFFFF" />
  <!-- Counter of P -->
  <path d="M490 440 H560 C590 440 610 460 610 480 C610 500 590 520 560 520 H490 V440 Z" fill="#000000" />

  <!-- Gamified Spark / Energy Dot -->
  <polygon points="512,490 528,525 565,528 536,552 545,588 512,568 479,588 488,552 459,528 496,525" fill="url(#sparkGrad)" filter="url(#glow)" />

  <!-- POPCIX Wordmark -->
  <text x="512" y="890" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="80" letter-spacing="12" fill="#FFFFFF" text-anchor="middle">POPCIX</text>
</svg>
`;

// Create Splash Screen SVG (1080x1920)
const splashSvg = `
<svg width="1080" height="1920" viewBox="0 0 1080 1920" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050505" />
      <stop offset="50%" stop-color="#000000" />
      <stop offset="100%" stop-color="#0A0A0A" />
    </linearGradient>
    <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE600" />
      <stop offset="100%" stop-color="#FF9900" />
    </linearGradient>
    <radialGradient id="ambientGlow" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="#FFE600" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1080" height="1920" fill="url(#bgGrad)" />
  <circle cx="540" cy="850" r="450" fill="url(#ambientGlow)" />

  <!-- Center Emblem -->
  <g transform="translate(540, 800) scale(1.1)">
    <!-- Roof Crest -->
    <path d="M0 -220 L188 -70 H-188 Z" fill="url(#sparkGrad)" />
    <!-- Shield / Body -->
    <path d="M-152 -50 H152 V220 C152 280 78 340 0 360 C-78 340 -152 280 -152 220 Z" fill="#FFFFFF" opacity="0.06" stroke="#333333" stroke-width="4" />
    <!-- Stylized 'P' -->
    <path d="M-92 -80 H58 C118 -80 158 -40 158 20 C158 80 118 120 58 120 H-22 V300 H-92 V-80 Z" fill="#FFFFFF" />
    <path d="M-22 -20 H48 C78 -20 98 0 98 20 C98 40 78 60 48 60 H-22 V-20 Z" fill="#000000" />
    <!-- Gold Star Center -->
    <polygon points="0,-10 16,25 53,28 24,52 33,88 0,68 -33,88 -24,52 -53,28 -16,25" fill="url(#sparkGrad)" />
  </g>

  <!-- Title & Tagline -->
  <text x="540" y="1260" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif" font-weight="900" font-size="74" letter-spacing="14" fill="#FFFFFF" text-anchor="middle">POPCIX</text>
  <text x="540" y="1320" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif" font-weight="600" font-size="28" letter-spacing="6" fill="#888888" text-anchor="middle">YOUR HOME. YOUR SERVICES.</text>

  <!-- Footer Tag -->
  <text x="540" y="1800" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif" font-weight="500" font-size="22" letter-spacing="3" fill="#444444" text-anchor="middle">EVERYTHING YOUR HOME NEEDS</text>
</svg>
`;

async function buildAssets() {
  console.log('Generating Android App Icons...');
  const iconBuffer = Buffer.from(iconSvg);
  const splashBuffer = Buffer.from(splashSvg);

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

    await sharp(iconBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(targetDir, 'ic_launcher.png'));

    await sharp(iconBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(targetDir, 'ic_launcher_round.png'));

    await sharp(iconBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(targetDir, 'ic_launcher_foreground.png'));

    console.log(`✓ Generated ${dir} (${size}x${size})`);
  }

  // Generate Splash Screen Images
  console.log('Generating Android Splash Screens...');
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

    await sharp(splashBuffer)
      .resize(w, h, { fit: 'cover' })
      .png()
      .toFile(path.join(targetDir, 'splash.png'));

    console.log(`✓ Generated ${dir}/splash.png (${w}x${h})`);
  }

  console.log('All Android mobile branding assets generated successfully!');
}

buildAssets().catch(console.error);
