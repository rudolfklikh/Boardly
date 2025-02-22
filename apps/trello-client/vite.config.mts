/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(({ mode }) => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/trello-client',
  build: {
    outDir: '../../dist/apps/trello-client',
    reportCompressedSize: true,
    target: ['es2020']
  },
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  resolve: {
    mainFields: ['module']
  },
  plugins: [
    angular({
      liveReload: true,
      jit: false
    }),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md'])
  ],
  test: {
    coverage: {
      reportsDirectory: '../../coverage/apps/trello-client',
      provider: 'istanbul'
    },
    watch: false,
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
    server: {
      deps: {
        inline: ['@ngneat/spectator']
      }
    }
  },
  define: {
    'import.meta.vitest': mode !== 'production'
  }
}));
