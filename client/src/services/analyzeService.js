import axios from 'axios'

const API_BASE = '/api'

/**
 * Analyzes a website URL by sending it to our backend,
 * which fetches HTML and runs it through AI.
 *
 * @param {string} url - The website URL to analyze
 * @returns {Promise<{summary, techStack, uiUx, security}>}
 */
export async function analyzeWebsite(url) {
  try {
    const response = await axios.post(`${API_BASE}/analyze`, { url }, {
      timeout: 45000, // 45s timeout — AI can be slow
    })
    return response.data
  } catch (error) {
    // Normalize errors into user-friendly messages
    if (error.response) {
      // Server returned an error response
      const msg = error.response.data?.error || 'Server error. Please try again.'
      throw new Error(msg)
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. The website may be slow to respond.')
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Cannot connect to the analysis server. Make sure the backend is running.')
    } else {
      throw new Error(error.message || 'An unexpected error occurred.')
    }
  }
}
