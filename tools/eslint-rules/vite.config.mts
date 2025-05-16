/// <reference types='vitest' />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/tools/eslint-rules',
  resolve: {
    mainFields: ['module']
  },
  plugins: [nxViteTsPaths()],
  test: {
    coverage: {
      reportsDirectory: '../../coverage/tools/eslint-rules',
      provider: 'istanbul'
    },
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['rules/**/*.spec.ts'],
    reporters: ['default']
  },
  define: {
    'import.meta.vitest': mode !== 'production'
  }
}));
