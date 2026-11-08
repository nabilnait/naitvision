# Open placeholders

Everything below is still `[INVULLEN]`. All of it lives in `src/content/site.ts`; search that file for `[INVULLEN` (line numbers below may shift).

Placeholders are visible in `npm run dev` (dashed outline). **Production builds hide them**: the sentence or item is simply left out until you fill it in. Run `SHOW_PLACEHOLDERS=1 npm run build` to review a build with them visible.

## On every page (header, footer, structured data)

| What | Where in site.ts |
| --- | --- |
| Domain (also set `SITE_URL` in Cloudflare) | `meta.domain` |
| Address (legally required; shown in the footer and on /privacy once filled in) | `business.address` |
| Phone, WhatsApp: optional, hidden while empty | `business.phone`, `business.whatsapp` |
| Instagram, TikTok, LinkedIn links (remove channels you don't use) | `socials` |

## Home

| Section | What | Where in site.ts |
| --- | --- | --- |
| Intro / reel carousel | Client or project name under each of the 8 reels, and permission to show them | `intro.reels[].label` |
| Clients band | Direct clients who gave permission (+ optional monochrome SVG logos in `public/clients/`). The band only appears with at least 4 names. | `clients.items` |
| Impact | Total views for clients (e.g. 120M+) | `impact.stats[0]` |
| Impact | Number of projects | `impact.stats[1]` |
| Impact | Three 16:9 videos or photos (row hidden in production until added) | `impact.media` |
| FAQ | Answers: preparation, image ownership, outside Limburg, one-off jobs; check "how often" | `faq.items` |

## /contact

| What | Where |
| --- | --- |
| Turnstile site key (build variable) and secret (runtime secret); the form is disabled in production without them | `PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` in Cloudflare |

## /privacy

| What | Where in site.ts |
| --- | --- |
| Date last updated | `pages.privacy.updated` |
| Address | `pages.privacy.sections[0]` |
| Retention period for form data | `pages.privacy.sections[3]` |

## Not in site.ts

| What | Where |
| --- | --- |
| Team photo at least 1400 px wide (now 980 px; the build warns). Replace the file, same name. | `src/assets/team/broers.png` |
| Logo: the site uses the NV mark and the about text says so ("een N en een V, voor Nait en Vision"). If you switch to the chess knight logo, update `src/components/Mark.astro`, `public/logo.svg`, rerun `node scripts/make-icons.mjs`, and change `about.text` in site.ts. | |
| Hero option B uses three existing reels (barber, stadium, wellness); swap in others or a dedicated showreel | `hero.showreel` in site.ts |
| Copy written by us that you should check: impact paragraph, process paragraph, services title and paragraph, "Vaak gevraagd", contact intro, privacy text | site.ts |
