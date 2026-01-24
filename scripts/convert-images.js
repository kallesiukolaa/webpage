const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const IMAGES_DIR = path.join(__dirname, '../public/images');

async function convertImages() {
  try {
    // Read all files in the directory
    const files = fs.readdirSync(IMAGES_DIR);

    for (const file of files) {
      const filePath = path.join(IMAGES_DIR, file);
      const ext = path.extname(file).toLowerCase();
      const fileName = path.parse(file).name;

      // Only process .jpg or .jpeg files
      if (ext === '.jpg' || ext === '.jpeg') {
        console.log(`Converting ${file} to WebP...`);

        await sharp(filePath)
          .webp({ quality: 80 }) 
          .toFile(path.join(IMAGES_DIR, `${fileName}.webp`));
        
        console.log(`✔ Created ${fileName}.webp`);
      }
    }
  } catch (error) {
    console.error('Error converting images:', error);
  }
}

convertImages();