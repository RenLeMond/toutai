import path from 'node:path';
import { defineConfig } from 'vitest/config';

const appDir = path.resolve(__dirname, './app');

export default defineConfig({
  test: {
    environment: 'node',
    include: ['app/_lib/__tests__/**/*.test.ts']
  },
  resolve: {
    alias: [
      { find: '@/lib', replacement: path.join(appDir, '_lib') },
      { find: '@/data', replacement: path.join(appDir, '_data') },
      { find: '@/components', replacement: path.join(appDir, '_components') },
      { find: '@/hooks', replacement: path.join(appDir, '_hooks') },
      { find: '@', replacement: appDir }
    ]
  }
});
