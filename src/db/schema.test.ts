import { env } from 'cloudflare:workers'
import { drizzle } from 'drizzle-orm/d1'
import { describe, expect, it } from 'vitest'
import { customers } from './schema'

describe('Database', () => {
  it('can query the customers table', async () => {
    const database = drizzle(env.DB)
    const result = await database.select().from(customers)

    expect(result).toEqual([])
  })
})
