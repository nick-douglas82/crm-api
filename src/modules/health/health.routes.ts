import { Hono } from 'hono'
import { createDatabase } from '../../db'
import { customers } from '../../db/schema'

const healthRoutes = new Hono<{ Bindings: CloudflareBindings }>()

healthRoutes.get('/db-check', async (context) => {
  const database = createDatabase(context.env.DB)
  const result = await database.select().from(customers)

  return context.json({ connected: true, customers: result })
})

export default healthRoutes
