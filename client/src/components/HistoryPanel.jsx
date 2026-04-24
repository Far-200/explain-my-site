import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getHistory, removeFromHistory, clearHistory, formatRelativeTime } from '../utils/historyUtils'

/**
 * HistoryPanel — a slide-in sidebar showing past analyses.
 * Lets the user re-analyze or remove history entries.
 */
export default function HistoryPanel({ onSelectURL }) {
  const [isOpen, setIsOpen] = useState(false)
  const [history, setHistory] = useState([])

  // Load history when panel opens
  useEffect(() => {
    if (isOpen) {
      setHistory(getHistory())
    }
  }, [isOpen])

  const handleRemove = (id, e) => {
    e.stopPropagation()
    removeFromHistory(id)
    setHistory(getHistory())
  }

  const handleClearAll = () => {
    clearHistory()
    setHistory([])
  }

  const handleSelect = (item) => {
    onSelectURL(item.url)
    setIsOpen(false)
  }

  return (
    <>
      {/* Trigger button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-3 rounded-2xl glass-card border border-border text-sm text-muted hover:text-white hover:border-accent/40 transition-all shadow-xl"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-mono text-xs">History</span>
        {getHistory().length > 0 && (
          <span className="w-4 h-4 rounded-full bg-accent text-white text-[10px] flex items-center justify-center font-bold">
            {getHistory().length}
          </span>
        )}
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed top-0 right-0 h-full w-full sm:w-96 z-50 flex flex-col"
              style={{ background: 'rgba(10, 10, 16, 0.98)', backdropFilter: 'blur(30px)', borderLeft: '1px solid rgba(30,30,46,0.8)' }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Panel header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div>
                  <h2 className="font-display font-semibold text-white">Analysis History</h2>
                  <p className="text-xs text-muted mt-0.5">{history.length} saved analyses</p>
                </div>
                <div className="flex items-center gap-2">
                  {history.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-xs text-muted hover:text-red-400 transition-colors font-mono"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg text-muted hover:text-white hover:bg-subtle transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* History list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16">
                    <div className="text-5xl mb-4">🕳️</div>
                    <p className="text-muted text-sm font-display">No analyses yet.</p>
                    <p className="text-muted/60 text-xs mt-1">Analyze a website to see it here.</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {history.map((item, i) => (
                      <motion.div
                        key={item.id}
                        className="group relative glass-card-hover p-4 cursor-pointer"
                        onClick={() => handleSelect(item)}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ delay: i * 0.05 }}
                        layout
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                              <p className="font-mono text-sm text-white truncate">{item.domain}</p>
                            </div>
                            <p className="text-xs text-muted truncate pl-4">{item.url}</p>
                            <p className="text-[10px] text-muted/60 mt-1 pl-4 font-mono">
                              {formatRelativeTime(item.timestamp)}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            {/* Re-analyze hint */}
                            <span className="opacity-0 group-hover:opacity-100 text-[10px] text-accent font-mono transition-opacity">
                              analyze →
                            </span>

                            {/* Remove */}
                            <button
                              onClick={(e) => handleRemove(item.id, e)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                              aria-label="Remove from history"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Panel footer */}
              <div className="p-4 border-t border-border">
                <p className="text-[10px] text-muted/60 text-center font-mono">
                  Stored locally in your browser · Max 10 entries
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
