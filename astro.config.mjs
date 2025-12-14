// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';


// https://astro.build/config
export default defineConfig({
  site: 'https://reinicio333.github.io',
  base: 'procerbolsai_astro',
  vite: {
    plugins: [tailwindcss()]
  }
});