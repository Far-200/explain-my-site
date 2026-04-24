import { motion } from 'framer-motion'

/**
 * SkeletonBlock — a single animated shimmer block.
 */
function SkeletonBlock({ width = 'w-full', height = 'h-4', className = '' }) {
  return (
    <div
      className={`${width} ${height} ${className} rounded-md shimmer-bg`}
    />
  )
}

/**
 * SkeletonCard — a full section card skeleton.
 */
function SkeletonCard({ emoji, delay = 0 }) {
  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      {/* Card header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl shimmer-bg" />
        <div className="space-y-2">
          <SkeletonBlock width="w-32" height="h-4" />
          <SkeletonBlock width="w-20" height="h-3" />
        </div>
      </div>

      {/* Content lines */}
      <div className="space-y-3">
        <SkeletonBlock width="w-full" height="h-3.5" />
        <SkeletonBlock width="w-11/12" height="h-3.5" />
        <SkeletonBlock width="w-4/5" height="h-3.5" />
        <SkeletonBlock width="w-full" height="h-3.5" />
        <SkeletonBlock width="w-3/4" height="h-3.5" />
      </div>

      {/* Tags row */}
      <div className="flex gap-2 mt-5">
        <SkeletonBlock width="w-16" height="h-6" className="rounded-full" />
        <SkeletonBlock width="w-20" height="h-6" className="rounded-full" />
        <SkeletonBlock width="w-14" height="h-6" className="rounded-full" />
      </div>
    </motion.div>
  )
}

/**
 * SkeletonLoader — displayed while the AI analyzes the website.
 * Shows a "scanning" header + 4 card skeletons.
 */
export default function SkeletonLoader({ url }) {
  const steps = [
    'Fetching website content...',
    'Extracting metadata & structure...',
    'Running AI analysis...',
    'Building your report...',
  ]

  return (
    <motion.div
      className="relative z-10 max-w-6xl mx-auto px-6 pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Scanning status banner */}
      <motion.div
        className="glass-card p-5 mb-8 flex items-center gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Animated radar circle */}
        <div className="relative flex-shrink-0 w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-ping" />
          <div className="absolute inset-1 rounded-full border border-accent/50" />
          <div className="absolute inset-0 flex items-center justify-center text-xl">🔍</div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-display font-semibold text-sm mb-1">
            Analyzing{' '}
            <span className="text-accent font-mono">
              {url ? new URL(url).hostname : '...'}
            </span>
          </p>
          {/* Step indicators */}
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {steps.map((step, i) => (
              <motion.span
                key={step}
                className="text-xs font-mono flex items-center gap-1.5"
                initial={{ color: '#4a4a6a' }}
                animate={{ color: ['#4a4a6a', '#7c6aff', '#4a4a6a'] }}
                transition={{
                  delay: i * 0.8,
                  duration: 1.6,
                  repeat: Infinity,
                  repeatDelay: steps.length * 0.8,
                }}
              >
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-current"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{
                    delay: i * 0.8,
                    duration: 0.6,
                    repeat: Infinity,
                    repeatDelay: steps.length * 0.8 + 1,
                  }}
                />
                {step}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Skeleton cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SkeletonCard emoji="🧠" delay={0.1} />
        <SkeletonCard emoji="⚙️" delay={0.2} />
        <SkeletonCard emoji="🎨" delay={0.3} />
        <SkeletonCard emoji="🔐" delay={0.4} />
      </div>
    </motion.div>
  )
}
