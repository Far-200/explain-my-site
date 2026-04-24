import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <motion.footer
      className="relative z-10 border-t border-border mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-muted font-mono">
          © {new Date().getFullYear()} ExplainMyWebsite · Built with React + Claude AI
        </p>
        <div className="flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-3 animate-pulse" />
            AI-Powered
          </span>
          <span>·</span>
          <span>No data stored server-side</span>
          <span>·</span>
          <span>Open Source</span>
        </div>
      </div>
    </motion.footer>
  )
}
