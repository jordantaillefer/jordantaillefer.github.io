import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jordantaillefer.github.io',
  integrations: [
    sitemap({
      // Pages utilitaires : hors index.
      filter: (page) => !['/og/', '/cv/', '/mentions-legales/'].some((path) => page.endsWith(path)),
    }),
  ],
});
