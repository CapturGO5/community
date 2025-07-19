const fs = require('fs');
const path = require('path');

// Create images directory if it doesn't exist
const imagesDir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Save each lens image
const lensImages = [
  { name: 'lens-purple.png', data: '' }, // Add base64 data here
  { name: 'lens-red.png', data: '' },    // Add base64 data here
  { name: 'lens-green.png', data: '' },  // Add base64 data here
  { name: 'lens-gold.png', data: '' }    // Add base64 data here
];

lensImages.forEach(({ name, data }) => {
  const imagePath = path.join(imagesDir, name);
  try {
    fs.writeFileSync(imagePath, Buffer.from(data, 'base64'));
    console.log(`Saved ${name}`);
  } catch (error) {
    console.error(`Error saving ${name}:`, error);
  }
});
