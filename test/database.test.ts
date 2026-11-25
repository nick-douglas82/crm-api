import { env } from 'cloudflare:workers'
import { drizzle } from 'drizzle-orm/d1'
import { describe, expect, it } from 'vitest'
import { projects } from '../src/db/schema'

describe('Database', () => {
  it('can query the projects table', async () => {
    const database = drizzle(env.DB)
    const result = await database.select().from(projects)

    expect(result).toEqual([])
  })
})
