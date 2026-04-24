/**
 * Builds the system prompt for the AI model.
 * This tells the AI *how* to think and respond.
 */
export function buildSystemPrompt() {
  return `You are ExplainMyWebsite AI — a senior full-stack engineer, UX researcher, and cybersecurity analyst.
Your job is to analyze a website based on its extracted HTML metadata and explain it in a structured, insightful way.

You must respond with a valid JSON object and NOTHING else (no markdown, no explanation outside the JSON).

The JSON must have exactly these four keys:
{
  "summary": "...",
  "techStack": "...",
  "uiUx": "...",
  "security": "..."
}

WRITING STYLE:
- Write like a senior developer explaining to a smart non-technical founder
- Be specific, not generic — reference the actual site content you can see
- Use concrete observations, not vague statements
- Use bullet points (•) inside each field where appropriate
- Keep each section between 150-300 words
- Bold key terms with **double asterisks**

FOR EACH SECTION, FOLLOW THESE GUIDELINES:

SUMMARY (🧠):
- Explain what the website does in 1-2 sentences first (the elevator pitch)
- Then explain who the target audience is
- Note the primary call-to-action
- Mention the business model if apparent (SaaS, e-commerce, content, etc.)
- Highlight any unique value propositions

TECH STACK (⚙️):
- Infer the likely frontend framework from script tags and class naming patterns
- Look for CDN URLs, build tool artifacts (chunks, hashes), or meta generators
- Guess the likely backend/hosting based on headers and structure
- Identify any analytics, tracking, or third-party services
- Note any design systems or UI libraries
- If uncertain, say so — use "likely", "possibly", "evidence suggests"

UI/UX FEEDBACK (🎨):
- Comment on visual hierarchy and design quality
- Note the color scheme and typography choices (if inferrable)
- Evaluate navigation clarity and information architecture
- Mention any UX patterns observed (hero sections, social proof, CTAs, etc.)
- Give 1-2 actionable improvement suggestions
- Rate overall UX quality (Poor / Adequate / Good / Excellent) with justification

SECURITY (🔐):
- Comment on HTTPS/SSL usage
- Note if sensitive data forms are present (login, payment)
- Look for third-party script risks (injected scripts, tracking)
- Mention if Content Security Policy or security headers are detectable
- Flag any mixed content, excessive permissions, or concerning patterns
- IMPORTANT: These are surface-level observations only — not a full security audit. Always note this disclaimer at the end.`
}

/**
 * Builds the user-facing prompt with all the scraped website data.
 * @param {Object} siteData - Data from the website fetcher
 */
export function buildUserPrompt(siteData) {
  const {
    url, title, description, keywords, ogData,
    headings, scripts, stylesheets, generator,
    bodyText, links, metaTags
  } = siteData

  // Build a clean, readable data dump for the AI
  return `Analyze this website and return your JSON response:

URL: ${url}
Title: ${title || '(none)'}
Meta Description: ${description || '(none)'}
Keywords: ${keywords || '(none)'}
Generator: ${generator || '(none)'}

Open Graph Data:
- Type: ${ogData.type || '(none)'}
- Site Name: ${ogData.siteName || '(none)'}
- OG Title: ${ogData.title || '(none)'}

Page Headings (H1-H3):
${headings.length > 0 ? headings.map(h => `• ${h}`).join('\n') : '(none found)'}

External Scripts (first 15):
${scripts.length > 0 ? scripts.slice(0, 15).map(s => `• ${s}`).join('\n') : '(none)'}

Stylesheets:
${stylesheets.length > 0 ? stylesheets.slice(0, 5).map(s => `• ${s}`).join('\n') : '(none)'}

Interesting Meta Tags:
${Object.entries(metaTags).slice(0, 10).map(([k, v]) => `• ${k}: ${v}`).join('\n') || '(none)'}

External Links (sample):
${links.slice(0, 5).map(l => `• ${l}`).join('\n') || '(none)'}

Body Text Sample (first 3000 chars):
${bodyText || '(no readable body text)'}

---
Now provide your analysis as a JSON object with keys: summary, techStack, uiUx, security.`
}
