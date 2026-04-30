// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()],

  build: {
    // Inline all CSS into the HTML to eliminate render-blocking stylesheets.
    // Trade-off: ~11KB gzipped added to HTML, no separate CSS request.
    // Worth it because Lighthouse flagged the external CSS as the only
    // render-blocking resource on the page.
    inlineStylesheets: 'always'
  }
});