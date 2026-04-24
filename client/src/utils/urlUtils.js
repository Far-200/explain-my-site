/**
 * Validates and normalizes a URL string.
 * Adds https:// if missing, checks format.
 *
 * @param {string} input - Raw URL string from user input
 * @returns {{ isValid: boolean, url: string, error: string | null }}
 */
export function validateAndNormalizeURL(input) {
  if (!input || input.trim() === '') {
    return { isValid: false, url: '', error: 'Please enter a URL.' }
  }

  let url = input.trim()

  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }

  try {
    const parsed = new URL(url)

    // Must have a valid hostname with at least one dot
    if (!parsed.hostname.includes('.')) {
      return { isValid: false, url, error: 'Please enter a valid domain (e.g. google.com).' }
    }

    // Block localhost / private networks
    const blockedHostnames = ['localhost', '127.0.0.1', '0.0.0.0']
    if (blockedHostnames.includes(parsed.hostname)) {
      return { isValid: false, url, error: 'Cannot analyze local/private URLs.' }
    }

    return { isValid: true, url: parsed.href, error: null }
  } catch {
    return { isValid: false, url, error: 'Invalid URL format. Try something like: google.com' }
  }
}

/**
 * Extracts the clean domain name for display purposes.
 * e.g. "https://www.google.com/search?q=hi" → "google.com"
 */
export function extractDomain(url) {
  try {
    const parsed = new URL(url)
    return parsed.hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

/**
 * Formats a full URL for display, truncating if too long.
 */
export function truncateURL(url, maxLength = 50) {
  if (url.length <= maxLength) return url
  return url.substring(0, maxLength) + '...'
}
