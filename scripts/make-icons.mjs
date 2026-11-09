// Generates the OG image and favicon set from the NV mark. Run: node scripts/make-icons.mjs
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';

const mark = '<path d="M0 320 185 0 278 158 185 320ZM370 0H555L370 320 278 158Z"/>';
const font = (f) => `data:font/woff2;base64,${readFileSync(`public/fonts/${f}`).toString('base64')}`;
const css = `@font-face{font-family:T;src:url(${font('tomorrow-latin-600-normal.woff2')})}@font-face{font-family:I;src:url(${font('inter-latin-400-normal.woff2')})}
html,body{margin:0;background:#0a0a0a;color:#f1f0ea}`;

const og = `<html><head><style>${css}
.wrap{position:relative;width:1200px;height:630px;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;padding:64px 72px;box-sizing:border-box}
.wm{position:absolute;right:-120px;top:50%;transform:translateY(-50%);width:900px;fill:#f1f0ea;opacity:.06}
.top{display:flex;align-items:center;gap:20px;font:600 30px T;letter-spacing:.08em}
.top svg{width:64px;fill:#f1f0ea}
.words{font:600 84px/1 T;letter-spacing:-.02em;display:flex;gap:26px;align-items:center}
.words i{display:block;flex:none;width:12px;height:12px;border-radius:50%;background:#8a8a85}
.sub{font:400 26px I;color:#8a8a85}</style></head><body><div class="wrap">
<svg class="wm" viewBox="0 0 555 320">${mark}</svg>
<div class="top"><svg viewBox="0 0 555 320">${mark}</svg>NAITVISION</div>
<div><div class="words">FOTO<i></i>VIDEO<i></i>CONTENT</div><p class="sub">Short-form content en beeld voor lokale ondernemers in Limburg.</p></div>
</div></body></html>`;

const icon = (size, pad) => `<html><head><style>html,body{margin:0;background:transparent}
.b{width:${size}px;height:${size}px;background:#0a0a0a;display:grid;place-items:center;border-radius:${Math.round(size * 0.18)}px}
svg{width:${Math.round(size * (1 - pad * 2))}px;fill:#f1f0ea}</style></head><body><div class="b"><svg viewBox="0 0 555 320">${mark}</svg></div></body></html>`;
const iconSquare = (size, pad) => icon(size, pad).replace(/border-radius:\d+px/, 'border-radius:0');

const b = await chromium.launch();
async function shot(html, w, h, path, transparent = false) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.setContent(html);
  await p.evaluate(() => document.fonts.ready);
  const buf = await p.screenshot({ path, omitBackground: transparent });
  await p.close();
  return buf;
}
await shot(og, 1200, 630, 'public/og.png');
await shot(iconSquare(180, 0.16), 180, 180, 'public/apple-touch-icon.png');
await shot(iconSquare(192, 0.18), 192, 192, 'public/icon-192.png');
await shot(iconSquare(512, 0.18), 512, 512, 'public/icon-512.png');
const png32 = await shot(icon(32, 0.1), 32, 32, 'shots/favicon-32.png', true);
await b.close();

// favicon.ico holding one 32px PNG
const head = Buffer.alloc(22);
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(1, 4);
head.writeUInt8(32, 6); head.writeUInt8(32, 7); head.writeUInt8(0, 8); head.writeUInt8(0, 9);
head.writeUInt16LE(1, 10); head.writeUInt16LE(32, 12); head.writeUInt32LE(png32.length, 14); head.writeUInt32LE(22, 18);
writeFileSync('public/favicon.ico', Buffer.concat([head, png32]));

writeFileSync('public/favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#0a0a0a"/><g transform="translate(6 17) scale(.0937)" fill="#f1f0ea">${mark}</g></svg>\n`);
console.log('icons done');
