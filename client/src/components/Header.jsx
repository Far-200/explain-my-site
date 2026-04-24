import { motion } from 'framer-motion'

/**
 * Header — top navigation bar with logo and tagline.
 */
export default function Header() {
  return (
    <motion.header
      className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-lg shadow-lg glow-accent">
            🔍
          </div>
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-accent/30 to-accent-2/30 blur-sm -z-10" />
        </div>
        <div>
          <span className="font-display font-bold text-lg text-white tracking-tight">
            Explain<span className="gradient-text">My</span>Website
          </span>
        </div>
      </div>

      {/* Badge */}
      <motion.div
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-border glass-card text-xs font-mono text-muted"
        whileHover={{ borderColor: 'rgba(124, 106, 255, 0.4)', scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-accent-3 animate-pulse-glow" />
        AI-Powered Analysis
      </motion.div>
    </motion.header>
  )
}
