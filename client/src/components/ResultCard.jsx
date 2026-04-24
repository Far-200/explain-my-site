import { useState } from 'react'
import { motion } from 'framer-motion'
import { useClipboard } from '../hooks/useClipboard'

/**
 * ResultCard — displays a single section of the AI analysis.
 *
 * Props:
 *   emoji        — section icon
 *   title        — section title
 *   subtitle     — small label under title
 *   content      — the AI-generated text content
 *   accentColor  — tailwind-compatible CSS color string for accent
 *   delay        — animation delay
 *   tags         — optional array of tag strings to display
 */
export default function ResultCard({
  emoji,
  title,
  subtitle,
  content,
  accentColor = '#7c6aff',
  delay = 0,
  tags = [],
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const { copy, isCopied } = useClipboard()

  // Parse bullet points if content contains them
  const formatContent = (text) => {
    if (!text) return null

    const lines = text.split('\n').filter(line => line.trim())

    return lines.map((line, i) => {
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')
      const cleanLine = isBullet ? line.replace(/^[\s•\-*]+/, '') : line

      if (isBullet) {
        return (
          <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-[#b0b0c8]">
            <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
            <span>{cleanLine}</span>
          </li>
        )
      }

      // Check for bold **text**
      const parts = cleanLine.split(/\*\*(.*?)\*\*/g)
      return (
        <p key={i} className="text-sm leading-relaxed text-[#b0b0c8]">
          {parts.map((part, j) =>
            j % 2 === 1
              ? <strong key={j} className="text-white font-medium">{part}</strong>
              : part
          )}
        </p>
      )
    })
  }

  const formattedLines = formatContent(content)
  const hasBullets = content?.includes('•') || content?.includes('\n-') || content?.includes('\n*')

  return (
    <motion.div
      className="glass-card-hover overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      layout
    >
      {/* Top accent border */}
      <div
        className="h-0.5 w-full"
        style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
      />

      {/* Card header */}
      <div className="flex items-start justify-between gap-4 p-5 pb-4">
        <div className="flex items-center gap-3">
          {/* Emoji icon with glow */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}30` }}
          >
            {emoji}
          </div>

          <div>
            <h3 className="font-display font-semibold text-white text-base leading-tight">
              {title}
            </h3>
            <p className="text-xs text-muted mt-0.5 font-mono">{subtitle}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Copy button */}
          <motion.button
            onClick={() => copy(content)}
            className="p-2 rounded-lg text-muted hover:text-white hover:bg-subtle transition-all duration-150"
            whileTap={{ scale: 0.9 }}
            title="Copy to clipboard"
            aria-label="Copy section to clipboard"
          >
            {isCopied ? (
              <motion.svg
                className="w-4 h-4 text-accent-3"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </motion.svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </motion.button>

          {/* Collapse toggle */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg text-muted hover:text-white hover:bg-subtle transition-all duration-150"
            animate={{ rotate: isExpanded ? 0 : -90 }}
            transition={{ duration: 0.2 }}
            aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Card content */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        style={{ overflow: 'hidden' }}
      >
        <div className="px-5 pb-5">
          {/* Divider */}
          <div className="h-px bg-border mb-4" />

          {/* Content */}
          {hasBullets ? (
            <ul className="space-y-2.5">{formattedLines}</ul>
          ) : (
            <div className="space-y-3">{formattedLines}</div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md text-xs font-mono"
                  style={{
                    background: `${accentColor}15`,
                    color: accentColor,
                    border: `1px solid ${accentColor}25`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
