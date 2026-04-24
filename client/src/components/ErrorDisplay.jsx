import { motion } from 'framer-motion'

/**
 * ErrorDisplay — shown when the analysis fails.
 * Gives the user helpful troubleshooting tips based on the error message.
 */
export default function ErrorDisplay({ error, onRetry }) {
  const isNetworkError = error?.includes('connect') || error?.includes('network')
  const isTimeoutError = error?.includes('timed out')
  const isFetchError = error?.includes('fetch') || error?.includes('Unable to')

  const getTip = () => {
    if (isNetworkError) return 'Make sure the backend server is running on port 3001.'
    if (isTimeoutError) return 'The website took too long to respond. Try a different URL or retry.'
    if (isFetchError) return 'The website may block automated requests. Try a different URL.'
    return 'Check the URL and try again. Some sites block external access.'
  }

  return (
    <motion.div
      className="relative z-10 max-w-2xl mx-auto px-6 pb-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="glass-card p-8 text-center border-red-500/20">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-3xl mx-auto mb-6">
          💥
        </div>

        <h2 className="font-display font-bold text-white text-xl mb-2">
          Analysis Failed
        </h2>

        <p className="text-[#b0b0c8] text-sm mb-3 max-w-md mx-auto leading-relaxed">
          {error}
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-subtle border border-border text-xs text-muted font-mono mb-8">
          <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          💡 {getTip()}
        </div>

        <motion.button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-display font-semibold mx-auto hover:bg-accent/90 transition-colors"
          whileTap={{ scale: 0.97 }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </motion.button>
      </div>
    </motion.div>
  )
}
