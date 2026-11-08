import { defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: false,
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      css: false,
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/components/ui/**', 'src/main.tsx', 'src/test/**', 'src/**/*.test.{ts,tsx}'],
        thresholds: { lines: 80 },
        reporter: ['text', 'html'],
      },
    },
  }),
)
