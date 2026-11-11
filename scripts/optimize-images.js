// Shrinks images in the built site (dist/) so photos uploaded through the CMS
// stay fast without the editor resizing them first. Originals in the repository
// are untouched; file names and formats stay the same, so no links change.
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import sharp from 'sharp';

const root = new URL('../dist/assets/images/', import.meta.url).pathname;
const maxWidth = 1600;
const formats = { '.jpg': 'jpeg', '.jpeg': 'jpeg', '.png': 'png', '.webp': 'webp' };

async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else if (formats[extname(entry.name).toLowerCase()]) yield path;
  }
}

let before = 0;
let after = 0;
try {
  await stat(root);
} catch {
  console.log('optimize-images: no dist/assets/images, skipping');
  process.exit(0);
}
for await (const path of files(root)) {
  const input = await readFile(path);
  const format = formats[extname(path).toLowerCase()];
  let pipeline = sharp(input, { failOn: 'none' }).rotate().resize({ width: maxWidth, withoutEnlargement: true });
  if (format === 'jpeg') pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
  if (format === 'png') pipeline = pipeline.png({ compressionLevel: 9, palette: true, quality: 85, effort: 8 });
  if (format === 'webp') pipeline = pipeline.webp({ quality: 80 });
  const output = await pipeline.toBuffer();
  before += input.length;
  if (output.length < input.length) {
    await writeFile(path, output);
    after += output.length;
  } else {
    after += input.length;
  }
}
const mb = (bytes) => (bytes / 1048576).toFixed(1);
console.log(`optimize-images: ${mb(before)} MB → ${mb(after)} MB`);
