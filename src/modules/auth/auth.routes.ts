import { Hono } from 'hono'
import { createAuth } from './auth'

const authRoutes = new Hono<{ Bindings: CloudflareBindings }>()

authRoutes.get('/me', async (context) => {
  const auth = createAuth(context.env)

  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  })

  if (!session) {
    return context.json({ error: 'Unauthorized' }, 401)
  }

  return context.json({ user: session.user })
})

authRoutes.all('/auth/*', (context) => createAuth(context.env).handler(context.req.raw))

export default authRoutes
