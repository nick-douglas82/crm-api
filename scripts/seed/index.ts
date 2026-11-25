import { getPlatformProxy } from 'wrangler'
import { createDatabase } from '../../src/db'
import { seeders } from './seeders'

const platform = await getPlatformProxy<CloudflareBindings>({
  configPath: './wrangler.jsonc',
  persist: true,
  remoteBindings: false,
})

try {
  const database = createDatabase(platform.env.DB)

  for (const seeder of seeders) {
    console.log(`Seeding ${seeder.name}...`)
    await seeder.run(database)
  }

  console.log('Database seeding complete.')
} finally {
  await platform.dispose()
}
