import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Watchlist', path: '/watchlist' },
  { name: 'Screener', path: '/screener' },
  { name: 'AI Insights', path: '/insights' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative z-20 border-b border-white/10 glass-morphism-strong backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
            >
              <motion.div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-neon-gradient flex items-center justify-center relative overflow-hidden shimmer"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(0, 240, 255, 0.3)',
                    '0 0 40px rgba(176, 48, 255, 0.5)',
                    '0 0 20px rgba(0, 240, 255, 0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-xl sm:text-2xl font-bold relative z-10">AI</span>
              </motion.div>
              <h1 className="text-xl sm:text-2xl font-bold text-gradient">AgentInvest</h1>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link key={item.name} to={item.path}>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, color: '#00f0ff' }}
                  className={`transition-colors font-medium relative group ${
                    location.pathname === item.path ? 'text-cyber-blue' : 'text-gray-300 hover:text-cyber-blue'
                  }`}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-neon-gradient transition-all duration-300 ${
                    location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </motion.div>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Get Started Button */}
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:block px-4 sm:px-6 py-2 rounded-lg bg-neon-gradient text-white font-semibold relative overflow-hidden group"
              >
                <span className="relative z-10">Get Started</span>
                <motion.div
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"
                />
              </motion.button>
            </Link>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg glass-morphism border border-white/10"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              {navItems.map((item, index) => (
                <Link key={item.name} to={item.path}>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`block px-4 py-3 rounded-lg glass-morphism hover:neon-border transition-all ${
                      location.pathname === item.path ? 'border border-cyber-blue' : ''
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </motion.div>
                </Link>
              ))}
              <Link to="/">
                <motion.button
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="w-full px-6 py-3 rounded-lg bg-neon-gradient text-white font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
