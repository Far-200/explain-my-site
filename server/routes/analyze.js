import express from 'express'
import { fetchWebsiteData } from '../services/fetcher.js'
import { generateAnalysis } from '../services/aiService.js'
import { validateURLMiddleware } from '../middleware/validateURL.js'

const router = express.Router()

/**
 * POST /analyze
 *
 * Body: { url: string }
 * Response: { summary, techStack, uiUx, security }
 *
 * Flow:
 *   1. Validate URL (middleware)
 *   2. Fetch website HTML + extract data
 *   3. Send to AI for analysis
 *   4. Return structured JSON
 */
router.post('/analyze', validateURLMiddleware, async (req, res) => {
  const url = req.normalizedURL
  const startTime = Date.now()

  console.log(`[${new Date().toISOString()}] Analyzing: ${url}`)

  try {
    // Step 1: Fetch and parse the website
    console.log(`  → Fetching website data...`)
    const siteData = await fetchWebsiteData(url, parseInt(process.env.FETCH_TIMEOUT) || 10000)
    console.log(`  → Fetched OK. Title: "${siteData.title?.substring(0, 50)}"`)

    // Step 2: Run AI analysis
    console.log(`  → Running AI analysis...`)
    const analysis = await generateAnalysis(siteData)

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log(`  ✓ Done in ${duration}s`)

    res.json(analysis)

  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.error(`  ✗ Error after ${duration}s:`, error.message)

    // Map internal errors to user-friendly messages
    const userMessage = error.message || 'An unexpected error occurred during analysis.'

    res.status(500).json({ error: userMessage })
  }
})

/**
 * GET /health
 * Health check endpoint — useful for monitoring and dev
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    provider: process.env.AI_PROVIDER || 'mock',
    uptime: process.uptime().toFixed(0) + 's',
  })
})

export default router
