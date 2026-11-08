import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Set SITE_URL in Cloudflare Pages once the domain is known.
const site = process.env.SITE_URL || 'https://naitvision.be';

export default defineConfig({
  site,
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'never',
  build: { format: 'file' },
  i18n: {
    defaultLocale: 'nl',
    locales: ['nl'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
});
