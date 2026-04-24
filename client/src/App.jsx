import AnimatedBackground from './components/AnimatedBackground'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'

/**
 * App — root component.
 *
 * Layout:
 *   AnimatedBackground (fixed, behind everything)
 *   Header
 *   HomePage (main content)
 *   Footer
 */
export default function App() {
  return (
    <div className="relative min-h-screen flex flex-col noise-overlay">
      <AnimatedBackground />
      <Header />
      <main className="flex-1">
        <HomePage />
      </main>
      <Footer />
    </div>
  )
}
