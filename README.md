# Naitvision website

Static Astro site for Naitvision: home, /werk, /contact, /privacy and a 404. Dark, black and white, video-first. The brief is in [docs/BRIEF.md](docs/BRIEF.md); open placeholders are in [docs/PLACEHOLDERS.md](docs/PLACEHOLDERS.md).

**Stack:** Astro 7 (static output), TypeScript, plain CSS with custom properties, GSAP + ScrollTrigger, Lenis, self-hosted fonts (Tomorrow, Barlow Condensed, Inter). Hosted as a **Cloudflare Worker** with static assets: `worker/index.ts` serves `dist/` and handles the contact form at `/api/contact` (Turnstile + Resend). Cookieless Cloudflare Web Analytics.

## Run it locally

Needs Node 22 or newer.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build in dist/
npm run preview    # serve dist/ on http://localhost:4321
```

Screenshots at 375, 768 and 1440 px (needs `npx playwright install chromium` once):

```bash
npm run shots -- / /werk /contact
```

The contact form calls `/api/contact`, which is handled by the Worker, not by Astro. To run the site exactly as Cloudflare does (Worker + assets), copy `.dev.vars.example` to `.dev.vars`, then:

```bash
npm run worker:dev     # builds, then serves on http://localhost:8787
```

With the test secret from `.dev.vars.example`, Turnstile always passes; a fake Resend key makes the last step fail with `{"error":"server"}`, which proves the whole path up to sending.

## Change the text

All copy is in **`src/content/site.ts`**, grouped per section in page order (`hero`, `marquee`, `intro`, `clients`, `impact`, `process`, `services`, `cases`, `about`, `faq`, `finalCta`, `footer`, then `pages.werk`, `pages.contact`, `pages.privacy`, `pages.notFound`). Components never hold text.

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

Full-length videos for the /werk lightbox do not belong in the repo. Upload them to YouTube (unlisted) or Cloudflare R2/Stream and put the link in `full` for that item. YouTube links are embedded through youtube-nocookie.com, only after a click.

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
   - `SITE_URL` = the address the site lives on now, e.g. `https://naitvision.<account>.workers.dev` (later your own domain)
   - `PUBLIC_TURNSTILE_SITE_KEY` = the Turnstile site key (step 3)

### 2. Runtime variables and secrets (used by `/api/contact`)

Worker → **Settings** → **Variables and Secrets** → **Add**:

| Name | Type | Value |
| --- | --- | --- |
| `TURNSTILE_SECRET_KEY` | Secret | Turnstile secret key (step 3) |
| `RESEND_API_KEY` | Secret | Resend API key (step 4) |
| `CONTACT_TO` | Text | the mailbox that receives requests |
| `CONTACT_FROM` | Text | a sender on your verified domain, e.g. `Naitvision website <website@naitvision.be>` |

If any of these is missing, `/api/contact` answers `500 {"error":"config"}` and never sends. `wrangler.jsonc` has `keep_vars: true`, so deploys don't wipe these.

### 3. Turnstile (spam protection, verified on the server)

1. Cloudflare dashboard → **Turnstile** → **Add widget**. Hostnames: your `*.workers.dev` address and, later, `naitvision.be`. Mode: **Managed**.
2. Site key → build variable `PUBLIC_TURNSTILE_SITE_KEY`. Secret key → runtime secret `TURNSTILE_SECRET_KEY`.
3. Redeploy (Deployments → retry, or push a commit): the site key is baked in at build time.

Without a site key, a production build disables the form and shows a short notice instead; the build log says so. The test key is only used in `npm run dev`.

### 4. Resend (sends the form to your mailbox)

1. resend.com → **Domains** → **Add domain**, add the DNS records it shows (SPF, DKIM) in Cloudflare DNS, wait for *Verified*. Until you have a domain you can test with `onboarding@resend.dev` as sender, which only delivers to your own Resend account address.
2. **API Keys** → **Create API key** with *Sending access* → secret `RESEND_API_KEY`.

Replies go straight to the visitor: the function sets their address as reply-to.

### 5. Test the live form with a real POST

After deploying, from any terminal (replace the URL):

```bash
curl -i -X POST https://naitvision.<account>.workers.dev/api/contact -H 'content-type: application/json' -d '{"name":"Test","company":"Test","email":"test@example.com","message":"Test","token":"x"}'
```

Expected: `400 {"ok":false,"error":"turnstile"}` (the route exists and Turnstile is checked on the server; a 404 means the Worker entry isn't deployed, a 500 `config` means a variable is missing). Then send the real form once in the browser and check the mailbox.

### 6. Custom domain (later)

Worker → **Settings** → **Domains & Routes** → **Add** → **Custom domain** → `naitvision.be` (and `www`). Then update `SITE_URL`, add the domain to the Turnstile widget, and redeploy.

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
src/pages/                 index, werk, contact, privacy, 404, robots.txt
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
| /werk | 97 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| /contact | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| /privacy | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |

Mobile LCP: home 0.9 s, /werk 2.6 s, /contact 0.9 s. Measured locally, so expect slightly different numbers on Cloudflare; rerun on the live URL.
