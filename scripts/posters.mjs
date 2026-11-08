// Turns a frame image into poster files: <out>.webp and <out>.avif (max 720px wide).
// Usage: node scripts/posters.mjs <frame.png> <public/media/name>   (repeat pairs for more)
import sharp from 'sharp';

const args = process.argv.slice(2);
if (!args.length || args.length % 2) {
  console.error('Usage: node scripts/posters.mjs <frame.png> <public/media/name> [...]');
  process.exit(1);
}
for (let i = 0; i < args.length; i += 2) {
  const [src, out] = [args[i], args[i + 1]];
  const img = sharp(src).resize({ width: 720, withoutEnlargement: true });
  const webp = await img.clone().webp({ quality: 72 }).toFile(`${out}.webp`);
  const avif = await img.clone().avif({ quality: 50, effort: 6 }).toFile(`${out}.avif`);
  console.log(`${out}  webp ${Math.round(webp.size / 1024)} KB  avif ${Math.round(avif.size / 1024)} KB`);
}
