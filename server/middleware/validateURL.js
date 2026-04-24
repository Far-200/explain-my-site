/**
 * validateURLMiddleware — validates the URL in the request body.
 * Rejects missing, malformed, or blocked URLs before they hit the handler.
 */
export function validateURLMiddleware(req, res, next) {
  const { url } = req.body

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'A URL is required.' })
  }

  const trimmed = url.trim()

  // Must start with http:// or https://
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return res.status(400).json({ error: 'URL must start with http:// or https://' })
  }

  let parsed
  try {
    parsed = new URL(trimmed)
  } catch {
    return res.status(400).json({ error: 'Invalid URL format.' })
  }

  // Block private / local network addresses
  const blocked = ['localhost', '127.0.0.1', '0.0.0.0', '::1', '169.254.169.254']
  if (blocked.includes(parsed.hostname)) {
    return res.status(400).json({ error: 'Requests to local/private addresses are not allowed.' })
  }

  // Block private IP ranges (basic check)
  const ipPattern = /^(\d{1,3})\.(\d{1,3})\./
  const ipMatch = parsed.hostname.match(ipPattern)
  if (ipMatch) {
    const [, a, b] = ipMatch.map(Number)
    if (a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)) {
      return res.status(400).json({ error: 'Requests to private IP ranges are not allowed.' })
    }
  }

  // Attach the normalized URL to the request for the handler
  req.normalizedURL = parsed.href
  next()
}
