// import 'dotenv/config'
// import express from 'express'
// import cors from 'cors'
// import helmet from 'helmet'
// import morgan from 'morgan'
// import rateLimit from 'express-rate-limit'
// import authRoutes from './routes/auth.js'

// const app  = express()
// const PORT = process.env.PORT || 3001

// /* ── Security & Middleware ── */
// app.use(helmet())
// app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
// app.use(express.json({ limit: '10mb' }))
// app.use(express.urlencoded({ extended: true }))
// app.use(morgan('dev'))

// /* ── Rate Limiting ── */
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
// })
// app.use('/api', limiter)

// /* ── Auth rate limit (stricter) ── */
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 20,
//   message: { error: 'Too many attempts. Please try again later.' },
// })

// /* ── Health check ── */
// app.get('/api/health', (_req, res) => {
//   res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV })
// })

// /* ── Routes ── */
// app.use('/api/auth', authLimiter, authRoutes)

// // Step 3+ routes (uncomment as built):
// // import issueRoutes  from './routes/issues.js'
// // import voteRoutes   from './routes/votes.js'
// // import notifRoutes  from './routes/notifications.js'
// // import dashRoutes   from './routes/dashboard.js'
// // app.use('/api/issues',        issueRoutes)
// // app.use('/api/votes',         voteRoutes)
// // app.use('/api/notifications', notifRoutes)
// // app.use('/api/dashboard',     dashRoutes)

// /* ── 404 handler ── */
// app.use((_req, res) => res.status(404).json({ error: 'Route not found' }))

// /* ── Global error handler ── */
// app.use((err, _req, res, _next) => {
//   console.error(err.stack)
//   res.status(err.status || 500).json({
//     error: err.message || 'Internal server error',
//     ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
//   })
// })

// app.listen(PORT, () => {
//   console.log(`\n🏙️  FixTown API running on http://localhost:${PORT}`)
//   console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`)
// })

// export default app

// import 'dotenv/config'
// import express from 'express'
// import cors from 'cors'
// import helmet from 'helmet'
// import morgan from 'morgan'
// import rateLimit from 'express-rate-limit'
// import authRoutes   from './routes/auth.js'
// import issueRoutes  from './routes/issues.js'

// const app  = express()
// const PORT = process.env.PORT || 3001

// /* ── Security & Middleware ── */
// app.use(helmet())
// app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
// app.use(express.json({ limit: '10mb' }))
// app.use(express.urlencoded({ extended: true }))
// app.use(morgan('dev'))

// /* ── Rate Limiting ── */
// const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false })
// app.use('/api', limiter)

// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, max: 20,
//   message: { error: 'Too many attempts. Please try again later.' },
// })

// /* ── Health check ── */
// app.get('/api/health', (_req, res) => {
//   res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV })
// })

// /* ── Routes ── */
// app.use('/api/auth',   authLimiter, authRoutes)
// app.use('/api/issues', issueRoutes)

// // Step 4+ (uncomment as built):
// // import voteRoutes  from './routes/votes.js'
// // import notifRoutes from './routes/notifications.js'
// // import dashRoutes  from './routes/dashboard.js'
// // app.use('/api/votes',         voteRoutes)
// // app.use('/api/notifications', notifRoutes)
// // app.use('/api/dashboard',     dashRoutes)

// /* ── 404 & error handlers ── */
// app.use((_req, res) => res.status(404).json({ error: 'Route not found' }))
// app.use((err, _req, res, _next) => {
//   console.error(err.stack)
//   res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
// })

// app.listen(PORT, () => {
//   console.log(`\n🏙️  FixTown API → http://localhost:${PORT}`)
//   console.log(`   Env: ${process.env.NODE_ENV || 'development'}\n`)
// })

// export default app

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import authRoutes         from './routes/auth.js'
import issueRoutes        from './routes/issues.js'
import voteRoutes         from './routes/votes.js'
import notificationRoutes from './routes/notifications.js'
import dashboardRoutes    from './routes/dashboard.js'

const app  = express()
const PORT = process.env.PORT || 3001

/* ── Middleware ── */
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

/* ── Rate Limiting ── */
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false })
app.use('/api', limiter)

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 20,
  message: { error: 'Too many attempts. Please try again later.' },
})

/* ── Health check ── */
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV })
)

/* ── Routes ── */
app.use('/api/auth',          authLimiter,   authRoutes)
app.use('/api/issues',                       issueRoutes)
app.use('/api/issues/:id/vote',              voteRoutes)
app.use('/api/notifications',                notificationRoutes)
app.use('/api/dashboard',                    dashboardRoutes)

/* ── 404 & error handlers ── */
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }))
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`\n🏙️  FixTown API → http://localhost:${PORT}`)
  console.log(`   Env: ${process.env.NODE_ENV || 'development'}\n`)
})

export default app