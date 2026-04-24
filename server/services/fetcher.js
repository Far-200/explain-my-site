import axios from 'axios'
import * as cheerio from 'cheerio'

/**
 * Fetches a website URL and extracts structured data for AI analysis.
 *
 * Returns:
 *   {
 *     url, title, description, keywords,
 *     headings, links, scripts, stylesheets,
 *     ogData, bodyText, metaTags
 *   }
 *
 * @param {string} url - Fully qualified URL to fetch
 * @param {number} timeout - Request timeout in ms
 */
export async function fetchWebsiteData(url, timeout = 10000) {
  let html

  try {
    const response = await axios.get(url, {
      timeout,
      maxRedirects: 5,
      headers: {
        // Impersonate a real browser so sites don't block us
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      // Don't throw on 4xx/5xx — we still want to parse whatever came back
      validateStatus: () => true,
    })
    html = response.data
  } catch (err) {
    if (err.code === 'ECONNABORTED') {
      throw new Error('The website took too long to respond (timeout).')
    }
    if (err.code === 'ENOTFOUND' || err.code === 'EAI_AGAIN') {
      throw new Error(`Unable to reach the website. Is the URL correct? (${err.code})`)
    }
    if (err.code === 'ECONNREFUSED') {
      throw new Error('Connection refused. The website may be down.')
    }
    throw new Error(`Failed to fetch website: ${err.message}`)
  }

  if (typeof html !== 'string' || html.length < 100) {
    throw new Error('Received an empty or invalid response from the website.')
  }

  // Parse HTML with cheerio (server-side jQuery)
  const $ = cheerio.load(html)

  // --- Extract metadata ---
  const title = $('title').first().text().trim() ||
    $('meta[property="og:title"]').attr('content') || ''

  const description =
    $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="twitter:description"]').attr('content') || ''

  const keywords = $('meta[name="keywords"]').attr('content') || ''

  // --- Open Graph data ---
  const ogData = {
    title: $('meta[property="og:title"]').attr('content') || '',
    type: $('meta[property="og:type"]').attr('content') || '',
    siteName: $('meta[property="og:site_name"]').attr('content') || '',
    image: $('meta[property="og:image"]').attr('content') || '',
  }

  // --- All meta tags (useful for tech stack detection) ---
  const metaTags = {}
  $('meta').each((_, el) => {
    const name = $(el).attr('name') || $(el).attr('property') || $(el).attr('http-equiv')
    const content = $(el).attr('content')
    if (name && content) metaTags[name] = content
  })

  // --- Headings (h1–h3) ---
  const headings = []
  $('h1, h2, h3').each((_, el) => {
    const text = $(el).text().trim()
    if (text && headings.length < 15) headings.push(text)
  })

  // --- External scripts (reveal tech stack) ---
  const scripts = []
  $('script[src]').each((_, el) => {
    const src = $(el).attr('src') || ''
    if (src && scripts.length < 20) scripts.push(src)
  })

  // --- Stylesheets ---
  const stylesheets = []
  $('link[rel="stylesheet"]').each((_, el) => {
    const href = $(el).attr('href') || ''
    if (href && stylesheets.length < 10) stylesheets.push(href)
  })

  // --- Generator / framework hints ---
  const generator = $('meta[name="generator"]').attr('content') || ''

  // --- Body text (truncated to avoid huge AI payloads) ---
  // Remove noise elements first
  $('script, style, nav, footer, header, .cookie-banner, #cookie-notice').remove()
  const bodyText = $('body').text()
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 3000)

  // --- External links ---
  const links = []
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || ''
    if (href.startsWith('http') && !href.includes(new URL(url).hostname)) {
      if (links.length < 10) links.push(href)
    }
  })

  return {
    url,
    title,
    description,
    keywords,
    ogData,
    metaTags,
    headings,
    scripts,
    stylesheets,
    generator,
    bodyText,
    links,
  }
}
