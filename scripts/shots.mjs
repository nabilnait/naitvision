// Screenshots at 375, 768 and 1440px with Playwright.
// Usage: node scripts/shots.mjs [path ...] [--el=<css selector>] [--widths=375,768,1440] [--base=http://localhost:4321] [--top]
//   --el   screenshot only that element (after scrolling through the page)
//   --top  screenshot the first viewport only (no scroll-through)
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.find((a) => a.startsWith(`--${k}=`)) ?? `=${d}`).split('=').slice(1).join('=');
const paths = args.filter((a) => !a.startsWith('--'));
if (!paths.length) paths.push('/');
const widths = opt('widths', '375,768,1440').split(',').map(Number);
const base = opt('base', 'http://localhost:4321');
const el = opt('el', '');
const top = args.includes('--top');
const heights = { 375: 812, 768: 1024, 1440: 900 };

mkdirSync('shots', { recursive: true });
const browser = await chromium.launch();
for (const p of paths) {
  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: heights[w] ?? 900 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.goto(base + p, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1800);
    if (!top) {
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += 500) {
        await page.evaluate((yy) => window.scrollTo(0, yy), y);
        await page.waitForTimeout(140);
      }
      await page.waitForTimeout(1200);
    }
    const name = `shots/${(p === '/' ? 'home' : p.replace(/\//g, '_').replace(/^_/, ''))}${el ? '-' + el.replace(/[^a-z0-9]+/gi, '') : ''}-${w}.png`;
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (el) await page.locator(el).first().screenshot({ path: name });
    else await page.screenshot({ path: name, fullPage: !top });
    console.log(name, overflow > 0 ? `HORIZONTAL OVERFLOW ${overflow}px` : 'ok', errors.length ? 'ERRORS: ' + errors.join(' | ') : '');
    await page.close();
  }
}
await browser.close();
