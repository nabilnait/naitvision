# Naitvision website

Static Astro site for Naitvision: home, /contact, /privacy and a 404 (/werk was removed and redirects to / with a 301). Dark, black and white, video-first. The brief is in [docs/BRIEF.md](docs/BRIEF.md); open placeholders are in [docs/PLACEHOLDERS.md](docs/PLACEHOLDERS.md).

**Stack:** Astro 7 (static output), TypeScript, plain CSS with custom properties, GSAP + ScrollTrigger, Lenis, self-hosted fonts (Tomorrow, Barlow Condensed, Inter). Hosted as a **Cloudflare Worker** with static assets: `worker/index.ts` serves `dist/` and handles the contact form at `/api/contact` (Turnstile + Resend). Cookieless Cloudflare Web Analytics.

## Run it locally

Needs Node 22 or newer.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build in dist/
npm run preview    # serve dist/ on http://localhost:4321
```

Check for dead links (against `npm run worker:dev`, or pass the live URL):

```bash
npm run linkcheck
npm run linkcheck -- https://naitvision.nabil-naits.workers.dev
```

Screenshots at 375, 768 and 1440 px (needs `npx playwright install chromium` once):

```bash
npm run shots -- / /contact /privacy
```

The contact form calls `/api/contact`, which is handled by the Worker, not by Astro. To run the site exactly as Cloudflare does (Worker + assets), copy `.dev.vars.example` to `.dev.vars`, then:

```bash
npm run worker:dev     # builds, then serves on http://localhost:8787
```

With the test secret from `.dev.vars.example`, Turnstile always passes; a fake Resend key makes the last step fail with `{"error":"server"}`, which proves the whole path up to sending.

## Change the text

All copy is in **`src/content/site.ts`**, grouped per section in page order (`business`, `nav`, `hero`, `marquee`, `intro`, `clients`, `impact`, `process`, `services`, `about`, `faq`, `finalCta`, `footer`, then `pages.contact`, `pages.privacy`, `pages.notFound`). Components never hold text.

- Anything written as `[INVULLEN: ...]` is **shown with a dashed outline in `npm run dev` only**. A production build drops every sentence that contains one, and leaves out items that end up empty: FAQ questions without an answer, stats without a value, grid items without media, contact details and social links that aren't filled in, empty privacy paragraphs.
- To review a production build with the placeholders visible: `SHOW_PLACEHOLDERS=1 npm run build`.
- The clients band appears only once `clients.items` holds at least 4 real names.
- Hero: `hero.variant` is `'video'` (option B: up to three 9:16 loops side by side at 35% opacity, one on phones, poster first, loop starts once the page is idle). Set it to `'watermark'` for option A (black with the large NV mark).
- English later: add an `en` object next to `nl` at the bottom of site.ts with the same shape, add `'en'` to `locales` in `astro.config.mjs`, and create pages under `src/pages/en/` that call `t('en')`.

Design tokens (colours, type scale, spacing) are in `src/styles/tokens.css` and match the Naitvision design system.

## Add videos

1. Put the original files in `raw/` (that folder is not committed to git).
2. Install ffmpeg once: `brew install ffmpeg`.
3. Run:

   ```bash
   scripts/compress-videos.sh                     # every file in raw/
   START=12 DURATION=6 scripts/compress-videos.sh raw/my-clip.mp4
   ```

   Each clip becomes `public/media/<name>.mp4` (H.264), `.webm` (VP9) and a poster of its exact first frame as `.webp` and `.avif` (via `scripts/posters.mjs`): 8 seconds, no audio, max 720 px on the short side, aiming under 3 MB. The script warns when a clip comes out bigger.
4. Reference it in site.ts as `media: '/media/<name>', webm: true`.

Full-length videos do not belong in the repo; host them on YouTube (unlisted) or Cloudflare R2/Stream.

The loops in `public/media` now were made from the files in `raw/` with macOS's own video tools, because ffmpeg wasn't installed yet. They are MP4 only (posters are WebP + AVIF). Rerun the script once ffmpeg is installed to add the WebM versions.

## Deploy on Cloudflare (Worker with static assets)

The site runs as a Worker. `wrangler.jsonc` points the Worker at `worker/index.ts` and serves `dist/` as static assets; requests to `/api/*` go to the Worker first, everything else is served straight from `dist/` (404s get `404.html`).

> `functions/` is only used if you ever move to Cloudflare **Pages**. On Workers it is ignored; the same handler lives in `worker/contact.ts`.

### 1. Worker project (already connected to GitHub)

1. Cloudflare dashboard → **Workers & Pages** → your Worker → **Settings** → **Build**.
2. Build command: `npm run build`. Deploy command: `npx wrangler deploy`. Root directory: `/`.
3. **The `name` in `wrangler.jsonc` must match the Worker's name in the dashboard** (it is `naitvision` now). Change one of them if they differ, or the deploy creates a second Worker.
4. Under **Build** → **Variables and secrets** (these are available while building):
   - `NODE_VERSION` = `22`
   - `SITE_URL` = the address the site lives on now, `https://naitvision.nabil-naits.workers.dev` (later `https://naitvision.be`)
   - `PUBLIC_TURNSTILE_SITE_KEY` = the Turnstile site key (step 3)

### 2. Contact form settings

`wrangler.jsonc` already sets the non-secret values, so they deploy with the code:

- `CONTACT_TO` = `info@naitvision.be` (where requests arrive)
- `CONTACT_FROM` = `Naitvision website <website@naitvision.be>` (sender, must be on the domain verified in Resend)

The visitor's e-mail address is set as reply-to, so "Reply" in your mailbox answers them directly.

The two secrets are set once from this folder (see the setup steps in [docs/SETUP-CONTACT.md](docs/SETUP-CONTACT.md)):

```bash
npx wrangler login
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler secret put RESEND_API_KEY
```

If any value is missing, `/api/contact` answers `500 {"error":"config"}` and sends nothing.

### 3. Turnstile site key

Either of these works:

- **Build variable** `PUBLIC_TURNSTILE_SITE_KEY`: Worker → Settings → **Build** → Variables and secrets. It must be under *Build*, not under the runtime "Variables and Secrets", or the build never sees it. Then trigger a new build.
- **Runtime variable** `TURNSTILE_SITE_KEY`: the Worker fills it into `/contact` on every request when the build had none. Set it in the dashboard (Settings → Variables and Secrets, type Text) or uncomment it in `wrangler.jsonc` `vars`.

Without either, `/contact` shows a short "temporarily unavailable" notice instead of the form.

### 4. Resend and Turnstile accounts

Step by step in [docs/SETUP-CONTACT.md](docs/SETUP-CONTACT.md): verify `naitvision.be` in Resend, create the Turnstile widget, set the secrets, and test.

### 5. Test the live form with a real POST

```bash
curl -i -X POST https://naitvision.nabil-naits.workers.dev/api/contact -H 'content-type: application/json' -d '{"name":"Test","company":"Test","email":"test@example.com","message":"Test","token":"x"}'
```

Expected once configured: `400 {"ok":false,"error":"turnstile"}` (the route works and Turnstile is checked on the server). `500 config` means a value is missing. Then send the real form in the browser and check info@naitvision.be.

### 6. Custom domain

naitvision.be's DNS is at GoDaddy, and Workers need it on Cloudflare. Full steps, including keeping the Titan e-mail records: [docs/DOMAIN.md](docs/DOMAIN.md).

### 7. Web Analytics (no cookies, no banner)

Cloudflare dashboard → **Analytics & Logs** → **Web Analytics** → **Add a site** → copy the token → build variable `PUBLIC_CF_BEACON_TOKEN` → redeploy. (On Workers the script isn't injected automatically, so the token is needed.)

Pushing to `main` deploys automatically.

## Project layout

```
src/content/site.ts        all copy
src/i18n/index.ts          t(lang) helper, placeholder checks
src/styles/                tokens.css (design tokens), global.css
src/layouts/Base.astro     <head>, SEO, JSON-LD, header, footer
src/components/            one component per section
src/scripts/               motion.ts (GSAP, Lenis), main.ts (reveals, counts, parallax), videos.ts
src/pages/                 index, contact, privacy, 404, robots.txt
public/_redirects          301 /werk and /werk/* to /
worker/index.ts            Worker entry: static assets + /api/contact
worker/contact.ts          contact handler: Turnstile (server-side) + Resend
wrangler.jsonc             Worker config (name, assets, run_worker_first)
functions/api/contact.ts   only for Cloudflare Pages; reuses worker/contact.ts
public/                    fonts, media loops, icons, og.png, _headers, manifest
scripts/                   compress-videos.sh, posters.mjs, shots.mjs, make-icons.mjs
raw/                       original videos (not in git)
Logo/                      original logo files and the SVG mark
```

`node scripts/make-icons.mjs` regenerates `og.png` and the favicon set from the mark in that script.

## Lighthouse (production build, local preview, 8 Nov 2026)

| Page | Mobile perf / a11y / best practices / SEO | Desktop |
| --- | --- | --- |
| Home (hero option B) | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| /contact | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| /privacy | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |

Mobile LCP: home 0.9 s, /contact 0.9 s. Measured locally, so expect slightly different numbers on Cloudflare; rerun on the live URL.
