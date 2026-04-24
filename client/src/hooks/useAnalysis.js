import { useState, useCallback } from 'react'
import { analyzeWebsite } from '../services/analyzeService'
import { validateAndNormalizeURL } from '../utils/urlUtils'
import { saveToHistory } from '../utils/historyUtils'

/**
 * useAnalysis — manages the entire analysis lifecycle.
 *
 * Returns:
 *   url, setUrl          — controlled input state
 *   result               — the analysis result object (or null)
 *   status               — 'idle' | 'loading' | 'success' | 'error'
 *   error                — error message string (or null)
 *   validationError      — inline URL validation error
 *   handleSubmit         — triggers the analysis
 *   reset                — clears result and error
 *   analyzedUrl          — the final normalized URL that was analyzed
 */
export function useAnalysis() {
  const [url, setUrl] = useState('')
  const [analyzedUrl, setAnalyzedUrl] = useState('')
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [error, setError] = useState(null)
  const [validationError, setValidationError] = useState(null)

  const handleSubmit = useCallback(async (inputUrl) => {
    const targetUrl = inputUrl || url

    // Validate first
    const { isValid, url: normalizedUrl, error: urlError } = validateAndNormalizeURL(targetUrl)

    if (!isValid) {
      setValidationError(urlError)
      return
    }

    setValidationError(null)
    setError(null)
    setResult(null)
    setAnalyzedUrl(normalizedUrl)
    setStatus('loading')

    try {
      const data = await analyzeWebsite(normalizedUrl)
      setResult(data)
      setStatus('success')
      saveToHistory(normalizedUrl, data)
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }, [url])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
    setStatus('idle')
    setValidationError(null)
    setAnalyzedUrl('')
  }, [])

  // Clear validation error when user types
  const handleUrlChange = useCallback((value) => {
    setUrl(value)
    if (validationError) setValidationError(null)
  }, [validationError])

  return {
    url,
    setUrl: handleUrlChange,
    analyzedUrl,
    result,
    status,
    error,
    validationError,
    handleSubmit,
    reset,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  }
}
