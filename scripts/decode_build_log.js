const fs = require('fs');
const inPath = './build.log';
const outPath = './build.txt';
try {
  const buf = fs.readFileSync(inPath);
  // try utf16le first
  let text = buf.toString('utf16le');
  // if it doesn't contain expected markers, fallback to utf8
  if (!text.includes('Next.js') && !text.includes('Turbopack') && !text.includes('Error')) {
    text = buf.toString('utf8');
  }
  fs.writeFileSync(outPath, text, 'utf8');
  console.log('Decoded to', outPath);
} catch (e) {
  console.error('Failed to decode:', e.message);
  process.exit(1);
}
