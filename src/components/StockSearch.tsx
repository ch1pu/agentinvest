import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const mockResults = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: '$178.42', sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: '$142.38', sector: 'E-commerce' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: '$124.56', sector: 'Semiconductors' },
]

export default function StockSearch() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const handleStockClick = (symbol: string) => {
    navigate(`/stock/${symbol}`)
    setQuery('')
    setShowResults(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      <div className="relative group">
        <motion.div
          animate={{
            boxShadow: isFocused
              ? '0 0 30px rgba(0, 240, 255, 0.3), 0 0 60px rgba(0, 240, 255, 0.1)'
              : '0 0 0px rgba(0, 240, 255, 0)',
          }}
          className="absolute inset-0 rounded-xl bg-neon-gradient opacity-20 blur-xl transition-opacity"
        />
        <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
          <motion.svg
            animate={{ rotate: isFocused ? 90 : 0 }}
            className="w-6 h-6 text-cyber-blue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </motion.svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowResults(e.target.value.length > 0)
          }}
          onFocus={() => {
            setIsFocused(true)
            query.length > 0 && setShowResults(true)
          }}
          onBlur={() => {
            setIsFocused(false)
            setTimeout(() => setShowResults(false), 200)
          }}
          placeholder="Search stocks... (e.g., AAPL, TSLA, NVDA)"
          className="w-full pl-16 pr-6 py-4 sm:py-5 rounded-xl glass-morphism-strong border-2 border-white/10 focus:border-cyber-blue focus:neon-border outline-none text-base sm:text-lg font-medium transition-all relative z-10 bg-transparent"
        />
        {query && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1, rotate: 90 }}
            onClick={() => {
              setQuery('')
              setShowResults(false)
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full glass-morphism flex items-center justify-center hover:bg-red-500/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full mt-3 w-full glass-morphism-strong rounded-xl border border-cyber-blue/30 overflow-hidden z-50 shadow-2xl"
          >
            <div className="p-2 max-h-80 overflow-y-auto">
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 flex items-center justify-between">
                <span>Search Results</span>
                <span>{mockResults.length} stocks</span>
              </div>
              {mockResults.map((stock, index) => (
                <motion.div
                  key={stock.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all hover:bg-cyber-blue/10 hover:border hover:border-cyber-blue/50 group"
                  onClick={() => handleStockClick(stock.symbol)}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-12 h-12 rounded-lg bg-neon-gradient flex items-center justify-center font-bold text-sm shimmer"
                    >
                      {stock.symbol.substring(0, 2)}
                    </motion.div>
                    <div className="flex-1">
                      <div className="font-bold text-sm sm:text-base">{stock.symbol}</div>
                      <div className="text-xs text-gray-400">{stock.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm sm:text-base text-cyber-blue">{stock.price}</div>
                    <div className="text-xs text-gray-400">{stock.sector}</div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="ml-3"
                  >
                    <svg className="w-5 h-5 text-cyber-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
