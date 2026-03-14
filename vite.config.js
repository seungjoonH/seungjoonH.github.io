import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import * as path from 'path';

export default defineConfig({
  base: '/',
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@sections': path.resolve(__dirname, './src/sections'),
      '@widgets': path.resolve(__dirname, './src/widgets'),
      '@assets': path.resolve(__dirname, './public/assets'),
    },
  },
});
