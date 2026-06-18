const fs = require('fs');

// Base64 for a simple purple 1x1 png, which browsers will stretch. Wait, stretching might fail Lighthouse checks for exact sizes.
// Better to create a buffer. Wait, writing a PNG manually is complex. Let's just download a placeholder image.
const https = require('https');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  await download('https://placehold.co/192x192/a855f7/ffffff/png?text=Mentoria', 'public/pwa-192x192.png');
  await download('https://placehold.co/512x512/a855f7/ffffff/png?text=Mentoria', 'public/pwa-512x512.png');
  await download('https://placehold.co/180x180/a855f7/ffffff/png?text=M', 'public/apple-touch-icon.png');
  console.log('Icons downloaded.');
}

run();
