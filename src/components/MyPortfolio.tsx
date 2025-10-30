import { motion } from 'framer-motion'
import { PortfolioStock } from '../types'

interface MyPortfolioProps {
  stocks: PortfolioStock[]
  onRemove?: (symbol: string) => void
}

export default function MyPortfolio({ stocks, onRemove }: MyPortfolioProps) {
  const totalValue = stocks.reduce((acc, stock) => acc + stock.currentValue, 0)
  const totalGainLoss = stocks.reduce((acc, stock) => acc + stock.gainLoss, 0)
  const totalInvested = stocks.reduce(
    (acc, stock) => acc + stock.purchasePrice * stock.shares,
    0
  )

  const getTimeframeLabel = (timeframe: string) => {
    switch (timeframe) {
      case 'short':
        return '< 6 months'
      case 'medium':
        return '6-12 months'
      case 'long':
        return '> 12 months'
      default:
        return ''
    }
  }

  const getTimeframeBadgeColor = (timeframe: string) => {
    switch (timeframe) {
      case 'short':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'medium':
        return 'bg-blue-500/20 text-blue-400'
      case 'long':
        return 'bg-green-500/20 text-green-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  if (stocks.length === 0) {
    return (
      <div className="glass-morphism rounded-2xl p-6 text-center">
        <div className="py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">No stocks in portfolio</h3>
          <p className="text-gray-400">Add stocks from recommendations to start tracking</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-morphism rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gradient">My Portfolio</h2>
        <div className="text-right">
          <div className="text-sm text-gray-400">Total Value</div>
          <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass-morphism rounded-xl p-4 border border-white/10">
          <div className="text-xs text-gray-400 mb-1">Invested</div>
          <div className="text-lg font-bold">${totalInvested.toFixed(2)}</div>
        </div>
        <div className="glass-morphism rounded-xl p-4 border border-white/10">
          <div className="text-xs text-gray-400 mb-1">Gain/Loss</div>
          <div className={`text-lg font-bold ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toFixed(2)}
          </div>
        </div>
        <div className="glass-morphism rounded-xl p-4 border border-white/10">
          <div className="text-xs text-gray-400 mb-1">Return</div>
          <div className={`text-lg font-bold ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {((totalGainLoss / totalInvested) * 100).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Holdings */}
      <div className="space-y-3">
        {stocks.map((stock, index) => (
          <motion.div
            key={stock.symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-morphism rounded-xl p-4 border border-white/10 hover:border-cyber-blue/50 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-full bg-neon-gradient flex items-center justify-center font-bold">
                  {stock.symbol.substring(0, 2)}
                </div>
                <div>
                  <div className="font-bold text-lg">{stock.symbol}</div>
                  <div className="text-xs text-gray-400">{stock.name}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded ${getTimeframeBadgeColor(stock.investmentTimeframe)}`}>
                      {getTimeframeLabel(stock.investmentTimeframe)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">${stock.currentValue.toFixed(2)}</div>
                <div className={`text-sm font-semibold ${stock.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stock.gainLoss >= 0 ? '+' : ''}${stock.gainLoss.toFixed(2)} ({stock.gainLossPercent >= 0 ? '+' : ''}{stock.gainLossPercent.toFixed(2)}%)
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 text-sm pt-3 border-t border-white/10">
              <div>
                <div className="text-xs text-gray-400">Shares</div>
                <div className="font-semibold">{stock.shares}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Avg Cost</div>
                <div className="font-semibold">${stock.purchasePrice.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Current</div>
                <div className="font-semibold">${stock.price.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Review Date</div>
                <div className="font-semibold text-xs">{stock.targetSellDate || 'N/A'}</div>
              </div>
            </div>

            {onRemove && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onRemove(stock.symbol)}
                className="w-full mt-3 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-semibold transition-all"
              >
                Remove from Portfolio
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
