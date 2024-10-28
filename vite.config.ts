/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { coverageConfigDefaults } from 'vitest/config'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: './lib/main.ts',
      name: 'CacheMemory',
      fileName: 'cacheMemory'
    }
  },
  plugins: [
    dts({
      outDir: 'types',
      rollupTypes: true
    })
  ],
  test: {
    coverage: {
      enabled: true,
      exclude: ['**/src/**', '**/scripts/**', ...coverageConfigDefaults.exclude]
    },
  },
})
