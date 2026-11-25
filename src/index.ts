import { Hono } from 'hono'
import { cors } from 'hono/cors'
import authRoutes from './modules/auth/auth.routes'
import healthRoutes from './modules/health/health.routes'

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.use(
  '/api/*',
  cors({
    origin: (_origin, context) => context.env.FRONTEND_URL,
    credentials: true,
  }),
)

app.route('/api', authRoutes)
app.route('/', healthRoutes)

export default app
