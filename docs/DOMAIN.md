# Connecting naitvision.be

## Where things stand (checked 9 Nov 2026)

| What | Now |
| --- | --- |
| DNS (nameservers) | GoDaddy: `ns49.domaincontrol.com`, `ns50.domaincontrol.com` |
| naitvision.be | GoDaddy forwarding (A records `3.33.251.168`, `15.197.225.128`), redirects to `naitvision.framer.photos` |
| E-mail info@naitvision.be | Titan (MX `mx1.titan.email` / `mx2.titan.email`, SPF `include:spf.titan.email`) |
| Resend | records on `send` and `resend._domainkey` are already at GoDaddy |

A Worker can only use a custom domain whose DNS runs on Cloudflare. So the nameservers have to move from GoDaddy to Cloudflare. That is also why Cloudflare complained about "externally managed DNS records".

## Steps

### 1. Add the domain to Cloudflare (skip if it's already there)

Cloudflare dashboard → **Add a domain** → `naitvision.be` → **Free** plan → let it scan the existing records.

### 2. Check the imported DNS records

Cloudflare → naitvision.be → **DNS** → **Records**. Compare with GoDaddy (Domain → DNS) and make sure all of these exist in Cloudflare, copied exactly:

- **E-mail (Titan), must not get lost:**
  - MX `@` → `mx1.titan.email` (priority 10)
  - MX `@` → `mx2.titan.email` (priority 20)
  - TXT `@` → `v=spf1 include:spf.titan.email ~all`
  - any `titan._domainkey` or other DKIM TXT that GoDaddy shows
- **Resend:** everything on `send` (MX and TXT), TXT `resend._domainkey`, and `_dmarc` if present.

Set all of these to **DNS only** (grey cloud).

### 3. Delete the old website records in Cloudflare

Delete only these:

- the two **A** records on `naitvision.be` (`3.33.251.168` and `15.197.225.128`), which are GoDaddy's forwarding to the Framer page
- the **A/AAAA/CNAME** on `www`

Keep every MX and TXT. This is what removes the "externally managed DNS records" error.

### 4. Switch the nameservers at GoDaddy

1. GoDaddy → **My Products** → naitvision.be → **DNS** → **Nameservers** → **Change nameservers** → **I'll use my own nameservers**.
2. Enter the two nameservers Cloudflare shows (something like `xxx.ns.cloudflare.com` and `yyy.ns.cloudflare.com`). Save.
3. GoDaddy → the same domain → **Forwarding**: remove the forwarding to the Framer page.
4. If **DNSSEC** is on at GoDaddy, turn it off first (you can turn it on again in Cloudflare later).

Cloudflare e-mails you when the domain is **Active**, usually within an hour, sometimes up to 24 hours.

### 5. Attach the domain to the Worker

Once the domain is Active: **Workers & Pages** → **naitvision** → **Settings** → **Domains & Routes** → **Add** → **Custom domain**:

1. `naitvision.be` → Add
2. Again for `www.naitvision.be`

Cloudflare creates the DNS records and the SSL certificate itself (a few minutes).

### 6. Send www to the bare domain

naitvision.be → **Rules** → **Redirect Rules** → **Create rule** → template **Redirect from WWW to root** → Deploy.

### 7. Site address

`astro.config.mjs` already uses `https://naitvision.be` when `SITE_URL` is empty. If you set the build variable `SITE_URL` to the workers.dev address, change it to `https://naitvision.be` (Worker → Settings → Build → Variables) and retry the build. Canonical links, sitemap and social previews then point to the domain.

Turnstile already lists `naitvision.be` and `www.naitvision.be`, and Resend doesn't change.

### 8. Check

```bash
curl -I https://naitvision.be
```

```bash
curl -I https://www.naitvision.be
```

- The first should give `200`, the second a `301` to `https://naitvision.be/`.
- Send an e-mail to info@naitvision.be and one from it, to confirm mail still works.
- Submit the contact form once on https://naitvision.be/contact.

While the nameservers switch, the domain can briefly show nothing (a few minutes, rarely longer). The Framer page disappears from the domain; the workers.dev address keeps working.
