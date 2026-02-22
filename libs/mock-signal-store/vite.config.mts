/// <reference types='vitest' />
/// <reference types='../../global/vite.config.d.ts' />
import { defineConfig, mergeConfig } from 'vite';
import vitestBase from '../../vite.base';

export default defineConfig((configEnv) =>
  mergeConfig(
    vitestBase(configEnv, __dirname),
    defineConfig({
      test: {
        setupFiles: ['src/test-setup.ts']
      }
    })
  )
);
