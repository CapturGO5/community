const fs = require('fs');
const path = require('path');

// Function to save base64 image to file
function saveBase64Image(base64String, outputPath) {
    // Remove data URL prefix if present
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(outputPath, buffer);
    console.log(`Saved: ${outputPath}`);
}

// Create lens directory if it doesn't exist
const lensDir = path.join(__dirname, '..', 'public', 'lens');
if (!fs.existsSync(lensDir)) {
    fs.mkdirSync(lensDir, { recursive: true });
}

// Save the lens images
const images = {
    'gold.png': 'YOUR_BASE64_STRING_HERE',
    'green.png': 'YOUR_BASE64_STRING_HERE',
    'red.png': 'YOUR_BASE64_STRING_HERE',
    'purple.png': 'YOUR_BASE64_STRING_HERE',
    'blue.png': 'YOUR_BASE64_STRING_HERE'
};

Object.entries(images).forEach(([filename, base64]) => {
    const outputPath = path.join(lensDir, filename);
    saveBase64Image(base64, outputPath);
});
