import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import * as path from 'path';

const rootDir = import.meta.dirname ?? process.cwd();
export default defineConfig({
  server: {
    port: 5000
  },
  base: '/',
  plugins: [react(), svgr({ svgrOptions: { titleProp: true } })],
  resolve: {
    alias: {
      '@components': path.resolve(rootDir, './src/components'),
      '@sections': path.resolve(rootDir, './src/site/sections'),
      '@hooks': path.resolve(rootDir, './src/hooks'),
      '@utils': path.resolve(rootDir, './src/utils'),
      '@analytics': path.resolve(rootDir, './src/analytics'),
      '@stores': path.resolve(rootDir, './src/stores'),
      '@versioning': path.resolve(rootDir, './src/versioning'),
      '@models': path.resolve(rootDir, './src/models'),
      '@repositories': path.resolve(rootDir, './src/repositories'),
      '@data': path.resolve(rootDir, './src/data'),
      '@assets': path.resolve(rootDir, './public/assets')
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true
  }
});