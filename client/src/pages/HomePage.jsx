import { AnimatePresence } from 'framer-motion'
import { useAnalysis } from '../hooks/useAnalysis'
import URLInput from '../components/URLInput'
import SkeletonLoader from '../components/SkeletonLoader'
import AnalysisResults from '../components/AnalysisResults'
import ErrorDisplay from '../components/ErrorDisplay'
import HistoryPanel from '../components/HistoryPanel'

/**
 * HomePage — the single page of the app.
 *
 * Wires together:
 *   - URL input
 *   - Loading skeleton
 *   - Results display
 *   - Error display
 *   - History panel
 */
export default function HomePage() {
  const {
    url,
    setUrl,
    analyzedUrl,
    result,
    status,
    error,
    validationError,
    handleSubmit,
    reset,
    isLoading,
    isSuccess,
    isError,
  } = useAnalysis()

  // When user picks a URL from history, pre-fill and submit it
  const handleHistorySelect = (selectedUrl) => {
    setUrl(selectedUrl)
    handleSubmit(selectedUrl)
  }

  return (
    <div className="min-h-screen">
      {/* URL input — always visible unless results are shown */}
      <AnimatePresence mode="wait">
        {!isSuccess && (
          <URLInput
            url={url}
            onChange={setUrl}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            validationError={validationError}
          />
        )}
      </AnimatePresence>

      {/* Loading skeleton */}
      <AnimatePresence>
        {isLoading && (
          <SkeletonLoader url={analyzedUrl} />
        )}
      </AnimatePresence>

      {/* Error state */}
      <AnimatePresence>
        {isError && (
          <ErrorDisplay
            error={error}
            onRetry={reset}
          />
        )}
      </AnimatePresence>

      {/* Success: show results */}
      <AnimatePresence>
        {isSuccess && result && (
          <AnalysisResults
            result={result}
            url={analyzedUrl}
            onReset={reset}
          />
        )}
      </AnimatePresence>

      {/* History panel — always available */}
      <HistoryPanel onSelectURL={handleHistorySelect} />
    </div>
  )
}
