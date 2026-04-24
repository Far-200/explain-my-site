import { useState, useCallback } from 'react'

/**
 * useClipboard — copies text to clipboard and tracks state.
 *
 * @param {number} resetDelay - ms before "copied" state resets (default 2000)
 * @returns {{ copy, isCopied }}
 */
export function useClipboard(resetDelay = 2000) {
  const [isCopied, setIsCopied] = useState(false)

  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), resetDelay)
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), resetDelay)
    }
  }, [resetDelay])

  return { copy, isCopied }
}
