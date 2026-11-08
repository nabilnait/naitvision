/**
 * Contact form handler: POST /api/contact
 * Verifies Cloudflare Turnstile on the server, then sends the message by e-mail through Resend.
 * Used by the Worker entry (worker/index.ts). functions/api/contact.ts reuses it on Pages.
 *
 * Environment variables (Worker > Settings > Variables and Secrets):
 *   RESEND_API_KEY        secret, from resend.com
 *   TURNSTILE_SECRET_KEY  secret, from Cloudflare Turnstile
 *   CONTACT_TO            where messages go, e.g. hallo@naitvision.be
 *   CONTACT_FROM          verified sender in Resend, e.g. "Naitvision website <website@naitvision.be>"
 */

export interface ContactEnv {
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const str = (v: unknown, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function handleContact(request: Request, env: ContactEnv): Promise<Response> {
  if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405, { Allow: 'POST' });

  // refuse to run without real configuration; never skip the Turnstile check
  if (!env.TURNSTILE_SECRET_KEY || !env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    console.error('contact: missing env', {
      TURNSTILE_SECRET_KEY: !!env.TURNSTILE_SECRET_KEY, RESEND_API_KEY: !!env.RESEND_API_KEY,
      CONTACT_TO: !!env.CONTACT_TO, CONTACT_FROM: !!env.CONTACT_FROM,
    });
    return json({ ok: false, error: 'config' }, 500);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid' }, 400);
  }

  // honeypot: bots fill the hidden "website" field
  if (str(body.website)) return json({ ok: true });

  const name = str(body.name, 200);
  const company = str(body.company, 200);
  const email = str(body.email, 320);
  const phone = str(body.phone, 60);
  const message = str(body.message, 5000);
  const needs = Array.isArray(body.needs) ? body.needs.map((n) => str(n, 80)).filter(Boolean).slice(0, 10) : [];
  const token = str(body.token, 4000);

  if (!name || !company || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return json({ ok: false, error: 'invalid' }, 400);
  }

  // Turnstile, verified server-side
  if (!token) return json({ ok: false, error: 'turnstile' }, 400);
  const ip = request.headers.get('CF-Connecting-IP') ?? '';
  const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
  });
  const outcome = (await verify.json().catch(() => ({ success: false }))) as { success: boolean; 'error-codes'?: string[] };
  if (!outcome.success) {
    console.warn('contact: turnstile failed', outcome['error-codes']);
    return json({ ok: false, error: 'turnstile' }, 400);
  }

  const rows: [string, string][] = [
    ['Naam', name],
    ['Bedrijf', company],
    ['E-mail', email],
    ['Telefoon', phone || '-'],
    ['Waarvoor', needs.join(', ') || '-'],
  ];
  const html = `
    <h2 style="font-family:sans-serif">Nieuwe aanvraag via de website</h2>
    <table style="font-family:sans-serif;border-collapse:collapse">
      ${rows.map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#666">${k}</td><td style="padding:4px 0">${esc(v)}</td></tr>`).join('')}
    </table>
    <p style="font-family:sans-serif;white-space:pre-wrap;margin-top:16px">${esc(message)}</p>`;
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${message}`;

  const send = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: email,
      subject: `Aanvraag van ${name} (${company})`,
      html,
      text,
    }),
  });
  if (!send.ok) {
    console.error('contact: resend failed', send.status, await send.text().catch(() => ''));
    return json({ ok: false, error: 'server' }, 502);
  }
  return json({ ok: true });
}
