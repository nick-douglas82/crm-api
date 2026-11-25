import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin'
import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    cloudflareTest(async () => ({
      wrangler: {
        configPath: './wrangler.jsonc',
      },
      miniflare: {
        bindings: {
          TEST_MIGRATIONS: await readD1Migrations(resolve('drizzle')),
        },
      },
    })),
  ],
  test: {
    setupFiles: ['./test/setup.ts'],
  },
})
