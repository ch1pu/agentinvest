import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AddToPortfolioModalProps {
  isOpen: boolean
  onClose: () => void
  stock: {
    symbol: string
    name: string
    price: string
    recommendedTimeframe: 'short' | 'medium' | 'long'
  }
  onAdd: (data: {
    shares: number
    purchasePrice: number
    investmentTimeframe: 'short' | 'medium' | 'long'
  }) => void
}

export default function AddToPortfolioModal({ isOpen, onClose, stock, onAdd }: AddToPortfolioModalProps) {
  const [shares, setShares] = useState('')
  const [purchasePrice, setPurchasePrice] = useState(stock.price.replace('$', ''))

  const handleSubmit = () => {
    if (shares && purchasePrice) {
      onAdd({
        shares: parseFloat(shares),
        purchasePrice: parseFloat(purchasePrice),
        investmentTimeframe: stock.recommendedTimeframe,
      })
      onClose()
      setShares('')
    }
  }

  const calculateSellDate = () => {
    const date = new Date()
    if (stock.recommendedTimeframe === 'short') {
      date.setMonth(date.getMonth() + 3)
    } else if (stock.recommendedTimeframe === 'medium') {
      date.setMonth(date.getMonth() + 9)
    } else {
      date.setFullYear(date.getFullYear() + 1)
      date.setMonth(date.getMonth() + 6)
    }
    return date.toLocaleDateString()
  }

  const getTimeframeLabel = () => {
    switch (stock.recommendedTimeframe) {
      case 'short': return 'Short Term (< 6 months)'
      case 'medium': return 'Medium Term (6-12 months)'
      case 'long': return 'Long Term (> 12 months)'
    }
  }

  const totalInvestment = shares && purchasePrice
    ? (parseFloat(shares) * parseFloat(purchasePrice)).toFixed(2)
    : '0.00'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] sm:w-full max-w-lg glass-morphism-strong rounded-2xl p-4 sm:p-6 z-50 border border-cyber-blue/50 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gradient">Add to Portfolio</h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
              >
                ✕
              </motion.button>
            </div>

            {/* Stock Info */}
            <div className="glass-morphism rounded-xl p-4 border border-white/10 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-neon-gradient flex items-center justify-center font-bold text-lg">
                  {stock.symbol.substring(0, 2)}
                </div>
                <div>
                  <div className="font-bold text-lg">{stock.symbol}</div>
                  <div className="text-sm text-gray-400">{stock.name}</div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-xs sm:text-sm font-semibold text-gray-400 mb-2">
                  Number of Shares
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 sm:py-4 rounded-lg glass-morphism border border-white/10 focus:border-cyber-blue focus:neon-border outline-none text-base sm:text-lg font-semibold transition-all"
                />
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-xs sm:text-sm font-semibold text-gray-400 mb-2">
                  Purchase Price per Share
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-semibold">$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 sm:py-4 rounded-lg glass-morphism border border-white/10 focus:border-cyber-blue focus:neon-border outline-none text-base sm:text-lg font-semibold transition-all"
                  />
                </div>
              </motion.div>

              {/* Investment Timeframe Display */}
              <div className="glass-morphism rounded-lg p-4 border border-cyber-blue/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Investment Strategy</div>
                    <div className="font-bold text-cyber-blue">{getTimeframeLabel()}</div>
                  </div>
                  <svg className="w-8 h-8 text-cyber-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="glass-morphism rounded-xl p-4 border border-white/10 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Investment</span>
                <span className="font-bold text-cyber-blue">${totalInvestment}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Recommended Review Date</span>
                <span className="font-semibold">{calculateSellDate()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 py-3 sm:py-4 rounded-lg border-2 border-white/10 hover:border-white/30 font-semibold transition-all text-sm sm:text-base"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={!shares || !purchasePrice}
                className="flex-1 py-3 sm:py-4 rounded-lg bg-neon-gradient font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover-glow text-sm sm:text-base relative overflow-hidden group"
              >
                <span className="relative z-10">Add to Portfolio</span>
                <motion.div
                  className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
