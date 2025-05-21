/// <reference types='vitest' />
import { defineConfig, mergeConfig } from 'vite';
import viteBase from '../../vite.base';

export default defineConfig((configEnv) =>
  mergeConfig(
    viteBase(configEnv, __dirname),
    defineConfig({
      test: {
        include: ['rules/**/*.spec.ts'],
        setupFiles: []
      }
    })
  )
);
