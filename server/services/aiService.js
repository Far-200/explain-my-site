import { buildSystemPrompt, buildUserPrompt } from './promptBuilder.js'

/**
 * Generates an AI analysis of website data.
 * Supports three providers: openai, anthropic, mock.
 *
 * @param {Object} siteData - Scraped website data from fetcher.js
 * @returns {Promise<{summary, techStack, uiUx, security}>}
 */
export async function generateAnalysis(siteData) {
  const provider = process.env.AI_PROVIDER || 'mock'

  console.log(`[AI] Using provider: ${provider} for ${siteData.url}`)

  switch (provider) {
    case 'openai':
      return await analyzeWithOpenAI(siteData)
    case 'anthropic':
      return await analyzeWithAnthropic(siteData)
    case 'mock':
    default:
      return await generateMockAnalysis(siteData)
  }
}

// ─── OpenAI ──────────────────────────────────────────────────────────────────

async function analyzeWithOpenAI(siteData) {
  const { default: OpenAI } = await import('openai')

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini', // Fast + cheap. Use 'gpt-4o' for higher quality.
    max_tokens: 2000,
    temperature: 0.7,
    response_format: { type: 'json_object' }, // Enforce JSON output
    messages: [
      { role: 'system', content: buildSystemPrompt() },
      { role: 'user', content: buildUserPrompt(siteData) },
    ],
  })

  const raw = response.choices[0]?.message?.content
  if (!raw) throw new Error('OpenAI returned an empty response.')

  return parseAIResponse(raw)
}

// ─── Anthropic (Claude) ───────────────────────────────────────────────────────

async function analyzeWithAnthropic(siteData) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2000,
      system: buildSystemPrompt(),
      messages: [
        { role: 'user', content: buildUserPrompt(siteData) },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(`Anthropic API error: ${err.error?.message || response.statusText}`)
  }

  const data = await response.json()
  const raw = data.content?.[0]?.text
  if (!raw) throw new Error('Anthropic returned an empty response.')

  return parseAIResponse(raw)
}

// ─── Mock (development) ───────────────────────────────────────────────────────

async function generateMockAnalysis(siteData) {
  // Simulate API latency so the loading skeleton is visible during dev
  await new Promise(resolve => setTimeout(resolve, 2500))

  const domain = new URL(siteData.url).hostname.replace(/^www\./, '')
  const hasHTTPS = siteData.url.startsWith('https')
  const title = siteData.title || domain

  return {
    summary: `**${title}** appears to be a ${inferSiteType(siteData)} targeting ${inferAudience(siteData)}.

• The site's primary purpose is to ${inferPurpose(siteData)}
• The main call-to-action seems to be: **${inferCTA(siteData)}**
• The business model appears to be **${inferBusinessModel(siteData)}**

Based on the page headings and body content, the site emphasizes ${siteData.headings.slice(0, 2).join(' and ') || 'its core value proposition'}. ${siteData.description ? `The site describes itself as: "${siteData.description.substring(0, 120)}..."` : ''}

**Note:** This is a mock response (AI_PROVIDER=mock). Set AI_PROVIDER=openai or AI_PROVIDER=anthropic in your .env file with a valid API key to get real AI analysis.`,

    techStack: `Based on the scripts, stylesheets, and HTML structure of **${domain}**:

• **Frontend:** ${inferFrontend(siteData)} — evidence from script filenames and class patterns
• **Build Tool:** ${inferBuildTool(siteData)} — inferred from asset URL structure
• **Hosting/CDN:** ${inferHosting(siteData)} — based on script domains and URL structure
• **Analytics:** ${inferAnalytics(siteData)}
• **UI Library:** Possibly **Tailwind CSS** or custom styles based on class naming conventions
• **Authentication:** Cannot be determined from public pages alone

${siteData.generator ? `• **CMS/Generator:** ${siteData.generator}` : ''}

Script tags found: **${siteData.scripts.length}** external scripts.
${siteData.scripts.slice(0, 3).map(s => `• \`${s.substring(s.lastIndexOf('/') + 1).substring(0, 60)}\``).join('\n')}`,

    uiUx: `**UI/UX Assessment for ${domain}:**

• **Visual Design:** The site uses a ${pickRandom(['clean, minimal', 'bold, colorful', 'professional, corporate', 'modern, gradient-heavy'])} aesthetic that ${pickRandom(['aligns well with', 'somewhat matches', 'could better reflect'])} its target audience
• **Navigation:** ${pickRandom(['Clear top navigation with logical grouping', 'Navigation structure appears straightforward', 'Menu items could be better organized'])}
• **Content Hierarchy:** ${siteData.headings.length > 3 ? 'Good use of heading structure (H1–H3 detected)' : 'Limited heading structure — content hierarchy could be improved'}
• **CTAs:** ${pickRandom(['Well-positioned calls-to-action', 'CTAs are present but could be more prominent', 'Primary CTA is clear and accessible'])}
• **Mobile Readiness:** Cannot be fully assessed from source alone, but ${pickRandom(['responsive meta viewport is present', 'no viewport meta tag detected — may not be mobile-optimized'])}

**Improvement Suggestions:**
• Consider adding social proof elements (testimonials, logos, user counts) above the fold
• Ensure sufficient color contrast for accessibility (WCAG AA compliance)

**Overall UX Rating:** ${pickRandom(['Good', 'Adequate', 'Good', 'Excellent'])} — based on content structure and heading clarity`,

    security: `**Security Surface Assessment for ${domain}:**

• **HTTPS:** ${hasHTTPS ? '✅ Site uses HTTPS — transport is encrypted' : '⚠️ Site appears to use HTTP — no transport encryption detected'}
• **Third-Party Scripts:** **${siteData.scripts.length} external scripts** detected. Each script is a potential supply-chain risk if not from trusted CDNs
• **Content Security Policy:** Cannot be determined from HTML alone — requires header inspection. Recommend checking with SecurityHeaders.com
• **Cookies:** Presence of login/session cookies cannot be confirmed from static HTML
• **Form Security:** ${pickRandom(['No login forms detected on main page', 'Form elements present — ensure CSRF protection is implemented', 'Input forms detected — validate server-side'])}
• **Subresource Integrity (SRI):** ${siteData.scripts.some(s => s.includes('integrity')) ? '✅ SRI hashes detected on some scripts' : '⚠️ No SRI hashes detected on external scripts — recommend adding integrity attributes'}
• **Mixed Content:** ${hasHTTPS ? 'Monitor for HTTP resources loaded on HTTPS pages' : 'N/A (site is HTTP)'}

⚠️ **Disclaimer:** This is a surface-level, automated analysis only. It does NOT constitute a security audit. Always engage a qualified security professional for thorough assessments.`,
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Parses and validates the AI's JSON response.
 * Handles cases where the AI wraps JSON in markdown code blocks.
 */
function parseAIResponse(raw) {
  // Strip markdown code fences if present
  let cleaned = raw.trim()
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '')

  try {
    const parsed = JSON.parse(cleaned)

    // Validate required keys
    const required = ['summary', 'techStack', 'uiUx', 'security']
    for (const key of required) {
      if (!parsed[key] || typeof parsed[key] !== 'string') {
        throw new Error(`AI response missing required field: ${key}`)
      }
    }

    return parsed
  } catch (e) {
    throw new Error(`Failed to parse AI response as JSON: ${e.message}`)
  }
}

// Mock inference helpers
function inferSiteType(data) {
  const text = `${data.title} ${data.description} ${data.bodyText}`.toLowerCase()
  if (text.includes('shop') || text.includes('buy') || text.includes('cart')) return 'e-commerce platform'
  if (text.includes('blog') || text.includes('article') || text.includes('post')) return 'content/blog platform'
  if (text.includes('dashboard') || text.includes('analytics') || text.includes('saas')) return 'SaaS application'
  if (text.includes('portfolio') || text.includes('projects') || text.includes('work')) return 'portfolio website'
  if (text.includes('news') || text.includes('media') || text.includes('press')) return 'news/media site'
  return 'web application or business site'
}

function inferAudience(data) {
  const text = `${data.description} ${data.bodyText}`.toLowerCase()
  if (text.includes('developer') || text.includes('engineer') || text.includes('code')) return 'software developers'
  if (text.includes('business') || text.includes('enterprise') || text.includes('team')) return 'business teams and enterprises'
  if (text.includes('student') || text.includes('learn') || text.includes('course')) return 'students and learners'
  if (text.includes('creator') || text.includes('content') || text.includes('design')) return 'content creators and designers'
  return 'a broad general audience'
}

function inferPurpose(data) {
  const text = `${data.title} ${data.description}`.toLowerCase()
  if (text.includes('manage') || text.includes('track')) return 'help users manage and track their work'
  if (text.includes('connect') || text.includes('network')) return 'connect people and enable networking'
  if (text.includes('learn') || text.includes('teach')) return 'provide educational resources and training'
  if (text.includes('sell') || text.includes('buy')) return 'facilitate product sales and purchases'
  return 'provide value through its core service offering'
}

function inferCTA(data) {
  const headings = data.headings.join(' ').toLowerCase()
  if (headings.includes('get started') || headings.includes('start free')) return 'Get Started'
  if (headings.includes('sign up') || headings.includes('create account')) return 'Sign Up'
  if (headings.includes('try for free') || headings.includes('free trial')) return 'Try for Free'
  if (headings.includes('learn more') || headings.includes('explore')) return 'Learn More'
  return 'Contact / Sign Up'
}

function inferBusinessModel(data) {
  const text = `${data.description} ${data.bodyText}`.toLowerCase()
  if (text.includes('free') && (text.includes('pro') || text.includes('premium'))) return 'Freemium SaaS'
  if (text.includes('pricing') || text.includes('per month') || text.includes('/mo')) return 'Subscription SaaS'
  if (text.includes('shop') || text.includes('checkout') || text.includes('cart')) return 'E-commerce / Product Sales'
  if (text.includes('ad') || text.includes('sponsor')) return 'Ad-supported Content'
  return 'Product / Service Business'
}

function inferFrontend(data) {
  const scripts = data.scripts.join(' ').toLowerCase()
  const body = data.bodyText.toLowerCase()
  if (scripts.includes('react') || body.includes('__react') || scripts.includes('/_next/')) return '**React** (likely Next.js)'
  if (scripts.includes('vue') || scripts.includes('nuxt')) return '**Vue.js** (possibly Nuxt)'
  if (scripts.includes('angular')) return '**Angular**'
  if (scripts.includes('svelte')) return '**Svelte / SvelteKit**'
  if (data.generator?.toLowerCase().includes('wordpress')) return '**WordPress** (PHP-based)'
  if (data.generator?.toLowerCase().includes('webflow')) return '**Webflow** (no-code)'
  return '**Vanilla JS** or a lightweight framework'
}

function inferBuildTool(data) {
  const scripts = data.scripts.join(' ')
  if (scripts.includes('/_next/')) return '**Next.js** build pipeline'
  if (scripts.includes('/assets/') && scripts.match(/\.[a-f0-9]{8}\./)) return '**Vite** (content-hashed assets)'
  if (scripts.includes('/static/js/')) return '**Create React App** / Webpack'
  if (scripts.includes('webpack')) return '**Webpack**'
  return '**Unknown** — standard web server or CDN'
}

function inferHosting(data) {
  const scripts = data.scripts.join(' ').toLowerCase()
  if (scripts.includes('vercel') || scripts.includes('_vercel')) return '**Vercel**'
  if (scripts.includes('netlify')) return '**Netlify**'
  if (scripts.includes('cloudflare')) return '**Cloudflare**'
  if (scripts.includes('amazonaws') || scripts.includes('s3.')) return '**AWS (S3 / CloudFront)**'
  if (scripts.includes('googleapis')) return '**Google Cloud**'
  return '**Unknown hosting provider**'
}

function inferAnalytics(data) {
  const scripts = data.scripts.join(' ').toLowerCase()
  const results = []
  if (scripts.includes('google-analytics') || scripts.includes('gtag') || scripts.includes('ga.js')) results.push('**Google Analytics**')
  if (scripts.includes('segment')) results.push('**Segment**')
  if (scripts.includes('mixpanel')) results.push('**Mixpanel**')
  if (scripts.includes('amplitude')) results.push('**Amplitude**')
  if (scripts.includes('hotjar')) results.push('**Hotjar**')
  if (scripts.includes('plausible')) results.push('**Plausible**')
  if (scripts.includes('posthog')) results.push('**PostHog**')
  return results.length > 0 ? results.join(', ') + ' detected' : 'No analytics scripts detected on main page'
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
