/**
 * Worker entry. Serves the static Astro build from ./dist (ASSETS binding)
 * and handles the contact form at /api/contact.
 */
import { handleContact, type ContactEnv } from './contact';

interface Env extends ContactEnv {
  ASSETS: Fetcher;
  /** Public Turnstile site key; injected into /contact when the build had none. */
  TURNSTILE_SITE_KEY?: string;
}

/** Fills in an empty data-sitekey on the Turnstile box. */
class SiteKey implements HTMLRewriterElementContentHandlers {
  constructor(private key: string) {}
  element(el: Element) {
    if (!el.getAttribute('data-sitekey')) el.setAttribute('data-sitekey', this.key);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/contact') return handleContact(request, env);
    if (pathname.startsWith('/api/')) return new Response('Not found', { status: 404 });

    const res = await env.ASSETS.fetch(request);
    const key = env.TURNSTILE_SITE_KEY;
    if (key && (pathname === '/contact' || pathname === '/contact.html') && res.headers.get('content-type')?.includes('text/html')) {
      return new HTMLRewriter().on('[data-turnstile]', new SiteKey(key)).transform(res);
    }
    return res;
  },
} satisfies ExportedHandler<Env>;
