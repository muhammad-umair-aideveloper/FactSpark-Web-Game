import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://gridfluency.com',
  build: {
    format: 'directory'
  }
});
