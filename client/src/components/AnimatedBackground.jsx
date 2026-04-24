import { motion } from 'framer-motion'

/**
 * AnimatedBackground — decorative gradient orbs + grid overlay.
 * Renders behind all content.
 */
export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(124, 106, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 106, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Orb 1 — Purple (top left) */}
      <motion.div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(124, 106, 255, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Orb 2 — Pink (top right) */}
      <motion.div
        className="absolute -top-20 -right-40 w-80 h-80 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 106, 158, 0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Orb 3 — Teal (bottom center) */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-64 rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(106, 255, 218, 0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scaleX: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Orb 4 — Purple (center) */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(124, 106, 255, 0.04) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
