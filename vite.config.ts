import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import lovableTagger from 'lovable-tagger/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    lovableTagger()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2018',
  },
});


