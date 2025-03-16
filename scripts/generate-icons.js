// Simple script to generate icons of different sizes for PWA

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Ensure the icons directory exists
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Source icon (needs to be high resolution)
// For this demo, you would need to create or download a high-res PM2 logo
const sourceIcon = path.join(__dirname, '../public/pm2-logo.png');

// Icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Generate icons for each size
async function generateIcons() {
  if (!fs.existsSync(sourceIcon)) {
    console.error('Source icon not found. Please create or download a high-resolution PM2 logo at public/pm2-logo.png');
    return;
  }

  try {
    // Create Apple touch icon
    await sharp(sourceIcon)
      .resize(180, 180)
      .toFile(path.join(iconsDir, 'apple-touch-icon.png'));
    
    console.log('Generated Apple touch icon');
    
    // Create all other sized icons
    for (const size of sizes) {
      await sharp(sourceIcon)
        .resize(size, size)
        .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
      
      console.log(`Generated ${size}x${size} icon`);
    }
    
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
