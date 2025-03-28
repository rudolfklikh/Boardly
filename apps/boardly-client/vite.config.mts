/// <reference types='vitest' />
import angular from '@analogjs/vite-plugin-angular';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import tsconfigPaths from 'vite-tsconfig-paths';

import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/boardly-client',
  build: {
    outDir: '../../dist/apps/boardly-client',
    reportCompressedSize: true,
    target: ['es2020']
  },
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  resolve: {
    mainFields: ['module'],
    alias: {
      '@styles': fileURLToPath(new URL('./src/styles', import.meta.url))
    }
  },
  plugins: [
    angular({
      liveReload: true,
      jit: false
    }),
    tsconfigPaths(),
    nxCopyAssetsPlugin(['*.md'])
  ],
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       api: 'modern-compiler',
  //       importer: new NodePackageImporter('./src/styles')
  //     }
  //   }
  // },
  test: {
    coverage: {
      reportsDirectory: '../../coverage/apps/boardly-client',
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
