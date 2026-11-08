# Naitvision website

Static Astro site for Naitvision: home, /werk, /contact, /privacy and a 404. Dark, black and white, video-first. The brief is in [docs/BRIEF.md](docs/BRIEF.md); open placeholders are in [docs/PLACEHOLDERS.md](docs/PLACEHOLDERS.md).

**Stack:** Astro 7 (static output), TypeScript, plain CSS with custom properties, GSAP + ScrollTrigger, Lenis, self-hosted fonts (Tomorrow, Barlow Condensed, Inter). Hosting on Cloudflare Pages, with a Pages Function for the contact form (Resend + Turnstile) and cookieless Cloudflare Web Analytics.

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

The contact form calls `/api/contact`, which only exists on Cloudflare. To test it locally, copy `.dev.vars.example` to `.dev.vars`, build, then run `npx wrangler pages dev dist`.

## Change the text

All copy is in **`src/content/site.ts`**, grouped per section in page order (`hero`, `marquee`, `intro`, `clients`, `impact`, `process`, `services`, `cases`, `about`, `faq`, `finalCta`, `footer`, then `pages.werk`, `pages.contact`, `pages.privacy`, `pages.notFound`). Components never hold text.

- Anything written as `[INVULLEN: ...]` shows on the site with a dashed outline until you replace it.
- Social links, e-mail, phone and WhatsApp that are still placeholders are shown as placeholders or hidden; they become real links once filled in.
- FAQ answers that are still placeholders are left out of the FAQ structured data automatically.
- Hero option B (dimmed showreel behind the logo): set `hero.variant` to `'video'` in site.ts, or pass `<Hero variant="video" />` in `src/pages/index.astro`.
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

   Each clip becomes `public/media/<name>.mp4` (H.264), `.webm` (VP9) and a `.jpg` + `.webp` poster: 8 seconds, no audio, max 720 px on the short side, aiming under 3 MB. The script warns when a clip comes out bigger.
4. Reference it in site.ts as `media: '/media/<name>', webm: true`.

Full-length videos for the /werk lightbox do not belong in the repo. Upload them to YouTube (unlisted) or Cloudflare R2/Stream and put the link in `full` for that item. YouTube links are embedded through youtube-nocookie.com, only after a click.

The loops in `public/media` now were made from the files in `raw/` with macOS's own video tools, because ffmpeg wasn't installed yet. They are MP4 only. Rerun the script once ffmpeg is installed to add the WebM versions.

## Deploy on Cloudflare Pages

### 1. GitHub

Create an empty repository on GitHub, then:

```bash
git remote add origin git@github.com:<account>/naitvision-site.git
git push -u origin main
```

### 2. Pages project

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → pick the repository.
2. Framework preset: **Astro**. Build command: `npm run build`. Build output directory: `dist`.
3. Under **Environment variables** add `NODE_VERSION` = `22` and `SITE_URL` = `https://naitvision.be` (your real domain).
4. **Save and Deploy**. The `functions/` folder is picked up automatically and becomes `/api/contact`.

### 3. Custom domain

1. Pages project → **Custom domains** → **Set up a custom domain** → enter `naitvision.be` → follow the steps. If the domain's DNS is already on Cloudflare, the record is created for you; otherwise add the CNAME it shows at your registrar.
2. Repeat for `www.naitvision.be`, then in **Rules** → **Redirect Rules** redirect `www` to the bare domain (or the other way round; pick one).
3. Update `SITE_URL` if it changed and redeploy.

### 4. Resend (sends the form to your mailbox)

1. Make an account at resend.com → **Domains** → **Add domain** → `naitvision.be`.
2. Add the DNS records Resend shows (SPF, DKIM) in Cloudflare → your domain → **DNS**. Wait until Resend says *Verified*.
3. Resend → **API Keys** → **Create API key** with *Sending access*.
4. Pages project → **Settings** → **Variables and Secrets** (Production), add:
   - `RESEND_API_KEY` (type *Secret*): the key from step 3
   - `CONTACT_TO`: the mailbox that should receive requests
   - `CONTACT_FROM`: a sender on your verified domain, e.g. `Naitvision website <website@naitvision.be>`

Replies go straight to the visitor: the function sets their address as reply-to.

### 5. Turnstile (spam protection)

1. Cloudflare dashboard → **Turnstile** → **Add widget**. Name: Naitvision. Hostnames: `naitvision.be` and your `*.pages.dev` address. Mode: **Managed**.
2. Copy the keys into the Pages variables:
   - `PUBLIC_TURNSTILE_SITE_KEY` (plain text; read at build time)
   - `TURNSTILE_SECRET_KEY` (type *Secret*)
3. **Redeploy** (Deployments → ⋯ → Retry deployment), because the site key is baked in at build time.

Until the site key is set, the form uses Cloudflare's test key and shows "Alleen voor testen". Submissions will fail on the server with the real secret, which is expected.

### 6. Web Analytics (no cookies, no banner)

Pages project → **Metrics** → **Web Analytics** → **Enable**. Cloudflare injects the script itself. Use this *or* the `PUBLIC_CF_BEACON_TOKEN` variable, not both, or visits are counted twice.

### After each change

Pushing to `main` deploys automatically. Other branches get a preview URL.

## Project layout

```
src/content/site.ts        all copy
src/i18n/index.ts          t(lang) helper, placeholder checks
src/styles/                tokens.css (design tokens), global.css
src/layouts/Base.astro     <head>, SEO, JSON-LD, header, footer
src/components/            one component per section
src/scripts/               motion.ts (GSAP, Lenis), main.ts (reveals, counts, parallax), videos.ts
src/pages/                 index, werk, contact, privacy, 404, robots.txt
functions/api/contact.ts   Cloudflare Pages Function: Turnstile + Resend
public/                    fonts, media loops, icons, og.png, _headers, manifest
scripts/                   compress-videos.sh, shots.mjs, make-icons.mjs
raw/                       original videos (not in git)
Logo/                      original logo files and the SVG mark
```

`node scripts/make-icons.mjs` regenerates `og.png` and the favicon set from the mark in that script.

## Lighthouse (production build, local preview, 8 Nov 2026)

| Page | Mobile perf / a11y / best practices / SEO | Desktop |
| --- | --- | --- |
| Home | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| /werk | 97 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| /contact | 99 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| /privacy | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |

Mobile LCP: home 0.9 s, /werk 2.3 s, /contact 2.0 s. Measured locally, so expect slightly different numbers on Cloudflare; rerun on the live URL after launch.
