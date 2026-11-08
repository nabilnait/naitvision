# Contact form setup (Resend + Turnstile)

The form sends to **info@naitvision.be**, from **website@naitvision.be**, with the visitor's address as reply-to. Those two addresses are already in `wrangler.jsonc`. What's left is two accounts, two secrets and one site key.

Order: a → b → c → d → test.

## a) Resend: verify naitvision.be

1. Sign in at https://resend.com → **Domains** → **Add Domain**.
2. Domain: `naitvision.be`. Region: **Ireland (eu-west-1)**, so the mail stays in the EU.
3. Resend shows 3–4 DNS records. If naitvision.be's DNS is on Cloudflare, the quickest way is Resend's **Auto configure → Cloudflare** button. Otherwise add them by hand in Cloudflare → **naitvision.be** → **DNS** → **Records** → **Add record**, copying each value exactly from Resend. They look like this (yours will differ, especially the DKIM key):

   | Type | Name | Content | Extra |
   | --- | --- | --- | --- |
   | MX | `send` | `feedback-smtp.eu-west-1.amazonses.com` | Priority 10 |
   | TXT | `send` | `v=spf1 include:amazonses.com ~all` | |
   | TXT | `resend._domainkey` | `p=MIGfMA0GCSqG...` (long key from Resend) | |
   | TXT | `_dmarc` | `v=DMARC1; p=none;` | recommended |

   - Set every record to **DNS only** (grey cloud), not proxied.
   - These live on the `send` subdomain, so they don't touch the MX records of your info@ mailbox.
   - If the DNS for naitvision.be is not on Cloudflare, add the same records at your registrar.
4. Back in Resend, click **Verify DNS records**. It usually turns green within minutes (allow up to a few hours).
5. **API Keys** → **Create API Key** → name `naitvision-website`, permission **Sending access**, domain `naitvision.be` → copy the key (starts with `re_`). You need it in step c; Resend shows it only once.

## b) Turnstile: create the widget

1. Cloudflare dashboard → **Turnstile** (left menu, under *Protect & Connect* / *Application security*) → **Add widget**.
2. Widget name: `Naitvision contact`.
3. Hostnames, add all three:
   - `naitvision.be`
   - `www.naitvision.be`
   - `naitvision.nabil-naits.workers.dev`
4. Widget mode: **Managed**. Pre-clearance: **No**.
5. **Create** → copy the **Site Key** (public, starts with `0x4`) and the **Secret Key**.

## c) Secrets with wrangler

In a terminal, in the project folder (`~/Documents/Projects/Naitvision`). Node lives in `~/.local/node` on this Mac:

```bash
export PATH="$HOME/.local/node/bin:$PATH"
```

```bash
npx wrangler login
```

(A browser window opens; approve access to your Cloudflare account.)

```bash
npx wrangler secret put TURNSTILE_SECRET_KEY
```

(Paste the Turnstile **Secret Key** when asked, press Enter.)

```bash
npx wrangler secret put RESEND_API_KEY
```

(Paste the `re_...` key, press Enter.)

Check that both are there:

```bash
npx wrangler secret list
```

Secrets take effect immediately; no redeploy needed. They are stored encrypted on Cloudflare, never in the repo.

## d) Site key as build variable

1. Cloudflare dashboard → **Workers & Pages** → **naitvision** → **Settings** → **Build** → **Variables and secrets** → **Add**.
2. Name `PUBLIC_TURNSTILE_SITE_KEY`, value = the **Site Key** from step b. Save.
3. **Deployments** → latest build → **Retry build** (or push any commit). The key is read while building.

Important: it must be under **Build** → Variables. A variable under the runtime "Variables and Secrets" section is not visible to the build; that is why `data-sitekey` was empty before.

Alternative that needs no rebuild: add a runtime variable `TURNSTILE_SITE_KEY` (type Text) with the same site key. The Worker then fills it into /contact on every request. One of the two is enough.

## Test

1. Route and server-side check:

   ```bash
   curl -i -X POST https://naitvision.nabil-naits.workers.dev/api/contact -H 'content-type: application/json' -d '{"name":"Test","company":"Test","email":"test@example.com","message":"Test","token":"x"}'
   ```

   - `400 {"ok":false,"error":"turnstile"}`: good. Everything is configured, and the fake token was refused on the server.
   - `500 {"error":"config"}`: a secret or variable is missing (check `npx wrangler secret list`).

2. Real submission: open https://naitvision.nabil-naits.workers.dev/contact, fill in the form with your own e-mail as visitor address, submit. You should see the green "Bedankt" message, and a mail "Aanvraag van … (…)" should arrive in info@naitvision.be within a minute. Reply to it: the reply goes to the address you filled in.

3. If the mail doesn't arrive: Resend → **Emails** shows every attempt and why it failed. Live logs of the Worker:

   ```bash
   npx wrangler tail
   ```
