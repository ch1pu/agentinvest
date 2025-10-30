import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const watchlistStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: '$178.42', change: '+2.34%', positive: true, addedDate: '2025-09-15' },
  { symbol: 'MSFT', name: 'Microsoft', price: '$412.15', change: '+1.67%', positive: true, addedDate: '2025-09-20' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$142.38', change: '+1.85%', positive: true, addedDate: '2025-09-22' },
  { symbol: 'NVDA', name: 'NVIDIA', price: '$768.62', change: '+4.45%', positive: true, addedDate: '2025-09-28' },
  { symbol: 'TSLA', name: 'Tesla', price: '$241.35', change: '-1.23%', positive: false, addedDate: '2025-09-30' },
]

export default function WatchlistPage() {
  const navigate = useNavigate()
  const [stocks, setStocks] = useState(watchlistStocks)

  const handleViewStock = (symbol: string) => {
    navigate(`/stock/${symbol}`)
  }

  const handleRemoveStock = (symbol: string) => {
    setStocks(stocks.filter(s => s.symbol !== symbol))
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-2">My Watchlist</h1>
          <p className="text-gray-400">Track stocks you're interested in</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-xl bg-neon-gradient font-semibold hover-glow"
        >
          + Add Stock
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 gap-4">
        {stocks.map((stock, index) => (
          <motion.div
            key={stock.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01, x: 5 }}
            className="glass-morphism-strong rounded-xl p-4 sm:p-6 border border-white/10 hover:border-cyber-blue/50 transition-all"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-neon-gradient flex items-center justify-center font-bold text-lg shimmer">
                  {stock.symbol.substring(0, 2)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{stock.symbol}</h3>
                  <p className="text-sm text-gray-400">{stock.name}</p>
                  <p className="text-xs text-gray-500 mt-1">Added: {stock.addedDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                <div className="text-center flex-1 sm:flex-none">
                  <div className="text-xs text-gray-400 mb-1">Price</div>
                  <div className="text-xl font-bold">{stock.price}</div>
                </div>
                <div className="text-center flex-1 sm:flex-none">
                  <div className="text-xs text-gray-400 mb-1">Change</div>
                  <div className={`text-lg font-bold ${stock.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {stock.change}
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleViewStock(stock.symbol)}
                    className="w-10 h-10 rounded-lg glass-morphism border border-cyber-blue/50 hover:bg-cyber-blue/10 flex items-center justify-center"
                    title="View Details"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveStock(stock.symbol)}
                    className="w-10 h-10 rounded-lg glass-morphism border border-red-500/50 hover:bg-red-500/10 flex items-center justify-center"
                    title="Remove from Watchlist"
                  >
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
