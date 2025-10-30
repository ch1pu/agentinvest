import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const mockStocks = [
  { symbol: 'TSLA', name: 'Tesla Inc.', price: '$241.35', change: '-1.23%', positive: false, marketCap: '$765B', pe: '51.2', sector: 'Automotive' },
  { symbol: 'META', name: 'Meta Platforms', price: '$312.44', change: '+2.15%', positive: true, marketCap: '$793B', pe: '28.5', sector: 'Technology' },
  { symbol: 'NFLX', name: 'Netflix Inc.', price: '$445.21', change: '+1.87%', positive: true, marketCap: '$191B', pe: '34.8', sector: 'Entertainment' },
  { symbol: 'PYPL', name: 'PayPal Holdings', price: '$59.82', change: '+3.45%', positive: true, marketCap: '$67B', pe: '18.2', sector: 'Fintech' },
  { symbol: 'SQ', name: 'Block Inc.', price: '$68.34', change: '+4.21%', positive: true, marketCap: '$41B', pe: '92.1', sector: 'Fintech' },
]

export default function ScreenerPage() {
  const navigate = useNavigate()
  const [stocks] = useState(mockStocks)
  const [selectedSector, setSelectedSector] = useState('All')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const sectors = ['All', 'Technology', 'Automotive', 'Entertainment', 'Fintech']

  const handleViewDetails = (symbol: string) => {
    navigate(`/stock/${symbol}`)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-2">Stock Screener</h1>
          <p className="text-gray-400">Filter and discover stocks based on your criteria</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-morphism-strong rounded-xl p-4 sm:p-6 border border-white/10"
      >
        <h2 className="text-xl font-bold mb-4 text-gradient">Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Sector Filter */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Sector</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-4 py-3 rounded-lg glass-morphism border border-white/10 focus:border-cyber-blue focus:neon-border outline-none transition-all bg-transparent"
            >
              {sectors.map(sector => (
                <option key={sector} value={sector} className="bg-gray-900">{sector}</option>
              ))}
            </select>
          </div>

          {/* Min Price */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Min Price ($)</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 rounded-lg glass-morphism border border-white/10 focus:border-cyber-blue focus:neon-border outline-none transition-all bg-transparent"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Max Price ($)</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="1000"
              className="w-full px-4 py-3 rounded-lg glass-morphism border border-white/10 focus:border-cyber-blue focus:neon-border outline-none transition-all bg-transparent"
            />
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedSector('All')
                setMinPrice('')
                setMaxPrice('')
              }}
              className="w-full px-4 py-3 rounded-lg border-2 border-cyber-blue/50 hover:bg-cyber-blue/10 font-semibold transition-all"
            >
              Reset Filters
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Results ({stocks.length} stocks)</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <div className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse"></div>
            <span>Live data</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {stocks.map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
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
                    <p className="text-xs text-gray-500 mt-1">{stock.sector}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:flex sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">Price</div>
                    <div className="text-lg font-bold">{stock.price}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">Change</div>
                    <div className={`text-lg font-bold ${stock.positive ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.change}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">Market Cap</div>
                    <div className="text-sm font-bold text-cyber-blue">{stock.marketCap}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">P/E</div>
                    <div className="text-sm font-bold">{stock.pe}</div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleViewDetails(stock.symbol)}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-neon-gradient font-semibold hover-glow"
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
