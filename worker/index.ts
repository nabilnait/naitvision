/**
 * Worker entry. Serves the static Astro build from ./dist (ASSETS binding)
 * and handles the contact form at /api/contact.
 */
import { handleContact, type ContactEnv } from './contact';

interface Env extends ContactEnv {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/contact') return handleContact(request, env);
    if (pathname.startsWith('/api/')) return new Response('Not found', { status: 404 });
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
