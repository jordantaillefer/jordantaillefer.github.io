import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jordantaillefer.com',
  integrations: [
    sitemap({
      // Pages utilitaires : hors index.
      filter: (page) => !['/og/', '/cv/', '/mentions-legales/'].some((path) => page.endsWith(path)),
    }),
  ],
});
