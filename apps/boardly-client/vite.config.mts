/// <reference types='vitest' />
/// <reference types='../../global/vite.config.d.ts' />
import { fileURLToPath } from 'url';
import { defineConfig, mergeConfig } from 'vite';
import viteBase from '../../vite.base';

export default defineConfig((configEnv) =>
  mergeConfig(
    viteBase(configEnv, __dirname),
    defineConfig({
      test: {
        setupFiles: ['src/test-setup.ts']
      },
      resolve: {
        alias: {
          '@styles': fileURLToPath(new URL(`./src/styles`, import.meta.url))
        }
      }
    })
  )
);
