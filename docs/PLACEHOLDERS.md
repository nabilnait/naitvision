# Open placeholders

Everything below is still `[INVULLEN]`. All of it lives in `src/content/site.ts`; search that file for `[INVULLEN` (line numbers below may shift).

## On every page (header, footer, structured data)

| What | Where in site.ts |
| --- | --- |
| Domain (also set `SITE_URL` in Cloudflare) | `meta.domain` |
| E-mail | `business.email` |
| Phone | `business.phone` |
| WhatsApp number (international, digits only, e.g. 32470123456) | `business.whatsapp` |
| Address | `business.address` |
| Company number (BE ...) | `business.vat` |
| Instagram, TikTok, LinkedIn links (remove channels you don't use) | `socials` |

## Home

| Section | What | Where in site.ts |
| --- | --- | --- |
| Intro / reel carousel | Client or project name under each of the 8 reels, and permission to show them | `intro.reels[].label` |
| Clients band | Direct clients who gave permission (+ optional monochrome SVG logos in `public/clients/`) | `clients.items` |
| Impact | Total views for clients (e.g. 120M+) | `impact.stats[0]` |
| Impact | Number of projects | `impact.stats[1]` |
| Impact | Three 16:9 videos or photos (grey panels now) | `impact.media` |
| Cases | Views for the football camp | `cases.items[0].result` |
| Cases | Views of the best Wellness Dilsen reel | `cases.items[3].result` |
| Cases | Names of the pro footballers, if allowed | `cases.items[4].delivered` |
| Cases | Details of the football creator series | `cases.items[5].delivered` |
| Cases | Confirm every case name may be shown | `cases.items` |
| FAQ | Answers: preparation, image ownership, outside Limburg, one-off jobs; check "how often" | `faq.items` |

## /werk

| What | Where in site.ts |
| --- | --- |
| Client name for each grid item | `pages.werk.items[].title` |
| An aftermovie, a 360° tour and a photo series (grey panels now) | `pages.werk.items` with `media: undefined` |
| Links to the full videos for the lightbox (YouTube unlisted or R2); without one the lightbox plays the 8-second loop | `pages.werk.items[].full` |

## /contact

| What | Where |
| --- | --- |
| WhatsApp, e-mail, phone | `business.*` (see above) |
| Turnstile site key | `PUBLIC_TURNSTILE_SITE_KEY` in Cloudflare |

## /privacy

| What | Where in site.ts |
| --- | --- |
| Date last updated | `pages.privacy.updated` |
| Address, company number, e-mail | `pages.privacy.sections[0]` and `[5]` |
| Retention period for form data | `pages.privacy.sections[3]` |

## Not in site.ts

| What | Where |
| --- | --- |
| Chess knight logo with aperture (the brief's logo). The NV mark from `Logo/NV.png` is used until it arrives. | `src/components/Mark.astro`, `public/logo.svg`, then rerun `node scripts/make-icons.mjs` |
| A real showreel for hero option B | `hero.showreel` in site.ts |
| Copy written by us that you should check: impact paragraph, process paragraph, services title and paragraph, "Recent werk", "Vaak gevraagd", contact intro, privacy text | site.ts |
