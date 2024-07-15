/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './lib/main.ts',
      name: 'CacheMemory',
      fileName: 'cacheMemory'
    }
  },
  test: {
    coverage: {
      provider: 'istanbul',
      enabled: true
    },
  },
})
