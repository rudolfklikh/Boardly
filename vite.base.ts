/// <reference types='vitest' />
import angular from '@analogjs/vite-plugin-angular';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import tsConfigPaths from 'vite-tsconfig-paths';

import { defineConfig, type ConfigEnv } from 'vite';

export default (config: Readonly<ConfigEnv>, projectRoot: string) =>
  defineConfig(({ mode }) => {
    const baseDir = projectRoot.replace(`${__dirname}/`, '');
    return {
      root: projectRoot,
      build: {
        reportCompressedSize: true,
        target: ['esnext'],
        emptyOutDir: true,
        outDir: `${__dirname}/dist/${baseDir}`
      },
      resolve: {
        mainFields: ['browser', 'module']
      },
      plugins: [
        angular({
          liveReload: true
        }),
        tsConfigPaths(),
        nxCopyAssetsPlugin(['*.md'])
      ],
      test: {
        reporters: ['default'],
        coverage: {
          reportsDirectory: `${__dirname}/coverage/${baseDir}`,
          provider: 'v8',
          reporter: ['html', 'text', 'json'],
          thresholds: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90
          }
        },
        watch: false,
        globals: true,
        environment: 'jsdom',
        include: ['src/**/*.spec.ts'],
        server: {
          deps: {
            inline: ['@ngneat/spectator']
          }
        }
      },
      cacheDir: `${__dirname}/node_modules/.vite/${baseDir}`,
      define: {
        'import.meta.vitest': mode !== 'production'
      }
    };
  })(config);
