// Crawls the site from / and checks every internal link, asset and #anchor.
// Usage: node scripts/linkcheck.mjs [base]   (default http://localhost:8787, i.e. `npm run worker:dev`)
const base = (process.argv[2] || 'http://localhost:8787').replace(/\/$/, '');
const pages = new Map(); // path -> html
const queue = ['/', '/sitemap-index.xml', '/sitemap-0.xml', '/robots.txt', '/site.webmanifest'];
const checked = new Map(); // url -> status
const problems = [];

const attr = /(?:href|src|poster|data-poster|content|data-src)=["']([^"']+)["']/g;
const internal = (u) => u.startsWith('/') && !u.startsWith('//');

async function status(url) {
  if (checked.has(url)) return checked.get(url);
  const r = await fetch(base + url, { redirect: 'manual' });
  checked.set(url, r.status);
  return r.status;
}

while (queue.length) {
  const path = queue.shift();
  if (pages.has(path)) continue;
  const r = await fetch(base + path, { redirect: 'manual' });
  if (r.status !== 200) { problems.push(`${path} -> ${r.status}`); pages.set(path, ''); continue; }
  const text = await r.text();
  pages.set(path, text);
  const found = new Set();
  for (const m of text.matchAll(attr)) found.add(m[1]);
  for (const m of text.matchAll(/<loc>([^<]+)<\/loc>/g)) found.add(new URL(m[1]).pathname);
  for (const m of text.matchAll(/"src":\s*"([^"]+)"/g)) found.add(m[1]);
  for (let u of found) {
    if (u.startsWith(base)) u = u.slice(base.length) || '/';
    if (!internal(u)) continue;
    const [p, hash] = u.split('#');
    const clean = p.split('?')[0] || '/';
    const s = await status(clean);
    if (s >= 400) problems.push(`${path}: ${u} -> ${s}`);
    else if (s >= 300) problems.push(`${path}: ${u} -> ${s} (redirect)`);
    else if (/\.(html?)$|^\/[^.]*$/.test(clean) && !pages.has(clean)) queue.push(clean);
    if (hash) (globalThis.anchors ??= []).push([path, clean, hash]);
  }
}
for (const [from, page, hash] of globalThis.anchors ?? []) {
  const html = pages.get(page) ?? '';
  if (!new RegExp(`id=["']${hash}["']`).test(html)) problems.push(`${from}: ${page}#${hash} -> anchor not found`);
}
console.log(`Pages crawled: ${[...pages.keys()].filter((p) => !/\.(xml|txt|webmanifest)$/.test(p)).join(', ')}`);
console.log(`URLs checked: ${checked.size}`);
console.log(problems.length ? `PROBLEMS:\n  ${problems.join('\n  ')}` : 'No dead links.');
process.exitCode = problems.length ? 1 : 0;
