import fs from 'fs';
import https from 'https';
import path from 'path';

const destPath = path.resolve('src/assets/certificate_bg.png');

// Ensure directory exists
const dir = path.dirname(destPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// List of URLs to try in order
const urls = [
  'https://img.freepik.com/free-vector/golden-ornamental-frame-background_52683-30528.jpg',
  'https://corsproxy.io/?https://img.freepik.com/free-vector/golden-ornamental-frame-background_52683-30528.jpg',
  'https://api.allorigins.win/raw?url=https://img.freepik.com/free-vector/golden-ornamental-frame-background_52683-30528.jpg'
];

const downloadUrl = (url, dest, callback, redirectCount = 0) => {
  if (redirectCount > 5) {
    callback(new Error('Too many redirects'));
    return;
  }

  const request = https.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  }, (response) => {
    // Handle redirects (e.g. 301, 302)
    if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
      const redirectUrl = new URL(response.headers.location, url).toString();
      console.log(`Redirecting to: ${redirectUrl}`);
      downloadUrl(redirectUrl, dest, callback, redirectCount + 1);
      return;
    }

    if (response.statusCode !== 200) {
      callback(new Error(`Failed with status code ${response.statusCode}`));
      return;
    }

    const file = fs.createWriteStream(dest);
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      callback(null);
    });
  });

  request.on('error', (err) => {
    callback(err);
  });
};

const tryUrls = (index) => {
  if (index >= urls.length) {
    console.error('All download URLs failed.');
    process.exit(1);
  }

  const url = urls[index];
  console.log(`Downloading certificate background from: ${url}`);

  downloadUrl(url, destPath, (err) => {
    if (err) {
      console.warn(`URL ${index} failed: ${err.message}. Trying next...`);
      fs.unlink(destPath, () => {});
      tryUrls(index + 1);
    } else {
      console.log('Download complete and saved to src/assets/certificate_bg.png!');
      process.exit(0);
    }
  });
};

tryUrls(0);
