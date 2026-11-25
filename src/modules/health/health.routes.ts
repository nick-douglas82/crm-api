import { Hono } from 'hono'
import { createDatabase } from '../../db'
import { projects } from '../../db/schema'

const healthRoutes = new Hono<{ Bindings: CloudflareBindings }>()

healthRoutes.get('/db-check', async (context) => {
  const database = createDatabase(context.env.DB)
  const result = await database.select().from(projects)

  return context.json({ connected: true, projects: result })
})

export default healthRoutes
