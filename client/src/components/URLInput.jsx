import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EXAMPLE_URLS = [
  'stripe.com',
  'notion.so',
  'vercel.com',
  'github.com',
  'linear.app',
]

/**
 * URLInput — hero section with URL input, validation feedback, and example URLs.
 */
export default function URLInput({ url, onChange, onSubmit, isLoading, validationError }) {
  const [isFocused, setIsFocused] = useState(false)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      onSubmit()
    }
  }

  const handleExampleClick = (example) => {
    onChange(example)
    // Small delay so user sees the value fill in before submit
    setTimeout(() => onSubmit(example), 100)
  }

  return (
    <motion.section
      className="relative z-10 max-w-3xl mx-auto px-6 pt-8 pb-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
    >
      {/* Hero text */}
      <div className="text-center mb-10">
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs font-mono mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          WT Assignment
        </motion.div>

        <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-4 leading-[1.1]">
          Understand{' '}
          <span className="gradient-text">any website</span>
          <br />
          in seconds.
        </h1>

        <p className="text-muted text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Paste any URL and get an instant AI breakdown — what it does, how it's built,
          the UX quality, and potential security flags.
        </p>
      </div>

      {/* Input container */}
      <div className="relative">
        <motion.div
          className={`
            relative flex items-center rounded-2xl border transition-all duration-300
            ${isFocused
              ? 'border-accent/60 shadow-[0_0_0_4px_rgba(124,106,255,0.1)]'
              : validationError
              ? 'border-red-500/50'
              : 'border-border hover:border-subtle'
            }
          `}
          style={{
            background: 'rgba(13, 13, 20, 0.9)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Globe icon */}
          <div className="flex-shrink-0 pl-5">
            <svg
              className={`w-5 h-5 transition-colors duration-200 ${isFocused ? 'text-accent' : 'text-muted'}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
          </div>

          {/* Text input */}
          <input
            type="text"
            value={url}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="https://example.com or just example.com"
            className="
              flex-1 bg-transparent px-4 py-4 text-white placeholder-muted
              text-sm sm:text-base outline-none font-mono
            "
            autoComplete="off"
            spellCheck={false}
            disabled={isLoading}
            aria-label="Website URL to analyze"
          />

          {/* Clear button (shown when there's text) */}
          <AnimatePresence>
            {url && !isLoading && (
              <motion.button
                onClick={() => onChange('')}
                className="flex-shrink-0 p-2 text-muted hover:text-white transition-colors mr-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                aria-label="Clear URL"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Analyze button */}
          <motion.button
            onClick={() => onSubmit()}
            disabled={isLoading || !url.trim()}
            className={`
              flex-shrink-0 flex items-center gap-2 m-1.5 px-5 py-3 rounded-xl
              font-display font-semibold text-sm transition-all duration-200
              ${isLoading || !url.trim()
                ? 'bg-subtle text-muted cursor-not-allowed'
                : 'bg-accent text-white hover:bg-accent/90 glow-accent cursor-pointer'
              }
            `}
            whileTap={!isLoading && url.trim() ? { scale: 0.97 } : {}}
            aria-label="Analyze website"
          >
            {isLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="hidden sm:inline">Analyzing...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="hidden sm:inline">Analyze</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Validation error */}
        <AnimatePresence>
          {validationError && (
            <motion.p
              className="absolute -bottom-7 left-0 text-red-400 text-xs flex items-center gap-1.5"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {validationError}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Example URLs */}
      <motion.div
        className="flex flex-wrap items-center justify-center gap-2 mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-xs text-muted">Try:</span>
        {EXAMPLE_URLS.map((example) => (
          <button
            key={example}
            onClick={() => handleExampleClick(example)}
            disabled={isLoading}
            className="
              px-3 py-1 rounded-lg border border-border text-xs text-muted
              hover:border-accent/40 hover:text-accent hover:bg-accent/5
              transition-all duration-200 font-mono disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {example}
          </button>
        ))}
      </motion.div>
    </motion.section>
  )
}
