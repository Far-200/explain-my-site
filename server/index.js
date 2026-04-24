import express from 'express'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import 'dotenv/config'
import analyzeRouter from './routes/analyze.js'

const app = express()
const PORT = process.env.PORT || 3001

// ─── Middleware ───────────────────────────────────────────────────────────────

// CORS — allow requests from the React dev server (and production)
app.use(cors({
  origin: [
    process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    'http://localhost:4173', // Vite preview
    'http://localhost:3000', // Alternative dev port
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}))

// Parse JSON request bodies
app.use(express.json({ limit: '1mb' }))

// Rate limiting — prevent abuse
// 30 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a few minutes before trying again.' },
})
app.use('/analyze', limiter)

// Request logger
app.use((req, res, next) => {
  if (req.path !== '/health') {
    console.log(`[${req.method}] ${req.path}`)
  }
  next()
})

// ─── Routes ───────────────────────────────────────────────────────────────────

// Mount all routes from the analyze router
app.use('/', analyzeRouter)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` })
})

// Global error handler (catches uncaught errors in middleware/routes)
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err)
  res.status(500).json({ error: 'An internal server error occurred.' })
})

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log('')
  console.log('  ╔═══════════════════════════════════════╗')
  console.log('  ║     ExplainMyWebsite — Server         ║')
  console.log('  ╚═══════════════════════════════════════╝')
  console.log('')
  console.log(`  🚀 Server running at http://localhost:${PORT}`)
  console.log(`  🤖 AI Provider: ${process.env.AI_PROVIDER || 'mock'}`)
  console.log(`  🌐 CORS origin: ${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}`)
  console.log('')
  console.log('  Endpoints:')
  console.log(`  POST http://localhost:${PORT}/analyze`)
  console.log(`  GET  http://localhost:${PORT}/health`)
  console.log('')
})

export default app
