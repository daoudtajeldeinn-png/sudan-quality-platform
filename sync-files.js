const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src', 'data', 'content_new.js');
const destPath = path.join(__dirname, 'backend', 'src', 'data', 'content_new.js');

try {
  fs.copyFileSync(srcPath, destPath);
  console.log('✅ Successfully copied and synced content_new.js from frontend to backend!');
} catch (error) {
  console.error('❌ Failed to copy file:', error);
}
