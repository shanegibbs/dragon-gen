import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/dragon-gen/', // GitHub Pages base path
  build: {
    outDir: 'dist-web',
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
});

