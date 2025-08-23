import { InlineConfig } from 'vitest/node';

declare module 'vite' {
  interface UserConfig {
    test?: InlineConfig;
  }
}
