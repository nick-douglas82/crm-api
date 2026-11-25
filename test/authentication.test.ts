import { env, exports } from 'cloudflare:workers'
import { betterAuth } from 'better-auth'
import { testUtils } from 'better-auth/plugins'
import { describe, expect, it } from 'vitest'
import { createAuth } from '../src/modules/auth/auth'
import { drizzle } from 'drizzle-orm/d1'
import { user as users } from '../src/db/auth.schema'

describe('GET /api/me', () => {
  it('returns 401 when the user is not authenticated', async () => {
    const response = await exports.default.fetch('http://localhost/api/me')

    expect(response.status).toBe(401)
  })

  it('exposes the Better Auth endpoint', async () => {
    const response = await exports.default.fetch('http://localhost:8787/api/auth/ok')

    expect(response.status).toBe(200)
  })

  it('returns 200 with the authenticated user', async () => {
    const authContext = await createAuth(env).$context

    const testAuth = betterAuth({
      ...authContext.options,
      plugins: [testUtils()],
    })

    const helpers = (await testAuth.$context).test

    const user = helpers.createUser({
      name: 'Test User',
      email: 'test@example.com',
    })

    const database = drizzle(env.DB)

    await database.insert(users).values(user)

    try {
      const headers = await helpers.getAuthHeaders({
        userId: user.id,
      })

      const response = await exports.default.fetch('http://localhost/api/me', {
        headers,
      })

      expect(response.status).toBe(200)

      const body: { user: { id: string; email: string } } = await response.json()

      expect(body.user.id).toBe(user.id)
      expect(body.user.email).toBe(user.email)
    } finally {
      await helpers.deleteUser(user.id)
    }
  })
})
