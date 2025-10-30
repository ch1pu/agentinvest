import { motion } from 'framer-motion'

const stocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', value: '$178.42', change: '+2.34%', positive: true, sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft', value: '$412.15', change: '+1.67%', positive: true, sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla', value: '$241.35', change: '-1.23%', positive: false, sector: 'Automotive' },
  { symbol: 'NVDA', name: 'NVIDIA', value: '$768.62', change: '+4.45%', positive: true, sector: 'Semiconductors' },
]

export default function AssetsList() {
  return (
    <div className="glass-morphism rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Watchlist</h2>
        <button className="text-cyber-blue text-sm font-semibold hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {stocks.map((stock, index) => (
          <motion.div
            key={stock.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className="flex items-center justify-between p-3 rounded-xl glass-morphism border border-white/10 hover:border-cyber-blue/50 transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-neon-gradient flex items-center justify-center font-bold">
                {stock.symbol.substring(0, 1)}
              </div>
              <div>
                <div className="font-semibold">{stock.symbol}</div>
                <div className="text-xs text-gray-400">{stock.sector}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-semibold">{stock.value}</div>
              <div className={`text-xs font-semibold ${stock.positive ? 'text-green-400' : 'text-red-400'}`}>
                {stock.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-6 py-3 rounded-lg bg-neon-gradient font-semibold"
      >
        Add to Watchlist
      </motion.button>
    </div>
  )
}
