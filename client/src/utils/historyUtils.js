const HISTORY_KEY = 'emw_analysis_history'
const MAX_HISTORY = 10

/**
 * Retrieves the analysis history from localStorage.
 * @returns {Array} Array of history items
 */
export function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Saves a new analysis result to history.
 * Deduplicates by URL and keeps only the latest MAX_HISTORY items.
 *
 * @param {string} url - The analyzed URL
 * @param {Object} result - The analysis result object
 */
export function saveToHistory(url, result) {
  try {
    const history = getHistory()

    // Remove existing entry for this URL (we'll add fresh one at front)
    const filtered = history.filter(item => item.url !== url)

    const newEntry = {
      id: Date.now(),
      url,
      domain: new URL(url).hostname.replace(/^www\./, ''),
      timestamp: new Date().toISOString(),
      result,
    }

    const updated = [newEntry, ...filtered].slice(0, MAX_HISTORY)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  } catch (e) {
    console.warn('Could not save to history:', e)
  }
}

/**
 * Removes a specific item from history by its id.
 * @param {number} id
 */
export function removeFromHistory(id) {
  try {
    const history = getHistory()
    const updated = history.filter(item => item.id !== id)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  } catch (e) {
    console.warn('Could not remove from history:', e)
  }
}

/**
 * Clears all history.
 */
export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch (e) {
    console.warn('Could not clear history:', e)
  }
}

/**
 * Formats a timestamp string into a human-readable relative time.
 * e.g. "2 hours ago", "3 days ago"
 */
export function formatRelativeTime(isoString) {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString()
}
