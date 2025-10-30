import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AddToPortfolioModal from './AddToPortfolioModal'

const allStockPicks = {
  short: [
    {
      symbol: 'COIN',
      name: 'Coinbase Global',
      price: '$187.45',
      change: '+8.23%',
      rating: 'STRONG BUY',
      aiScore: 91,
      reasons: [
        'High volatility creating trading opportunities',
        'Strong momentum in crypto markets',
        'Increased retail trading volume',
        'Technical indicators showing upward trend'
      ],
      targetPrice: '$215',
      upside: '+14.7%',
      riskLevel: 'High' as const,
      recommendedTimeframe: 'short' as const,
    },
    {
      symbol: 'PLTR',
      name: 'Palantir Technologies',
      price: '$28.92',
      change: '+6.45%',
      rating: 'BUY',
      aiScore: 88,
      reasons: [
        'Recent major contract wins',
        'Strong quarterly earnings momentum',
        'AI platform adoption accelerating',
        'Short-term price catalysts identified'
      ],
      targetPrice: '$33',
      upside: '+14.1%',
      riskLevel: 'Medium' as const,
      recommendedTimeframe: 'short' as const,
    },
    {
      symbol: 'SHOP',
      name: 'Shopify Inc.',
      price: '$79.84',
      change: '+5.12%',
      rating: 'BUY',
      aiScore: 86,
      reasons: [
        'E-commerce boom continuing',
        'New product launches scheduled',
        'Seasonal shopping trends favorable',
        'Technical breakout patterns forming'
      ],
      targetPrice: '$92',
      upside: '+15.2%',
      riskLevel: 'Medium' as const,
      recommendedTimeframe: 'short' as const,
    },
  ],
  medium: [
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      price: '$768.62',
      change: '+4.45%',
      rating: 'STRONG BUY',
      aiScore: 94,
      reasons: [
        'AI chip demand at record highs',
        'Strong Q4 earnings beat expectations',
        'Data center revenue up 217% YoY',
        'Strategic partnerships expanding'
      ],
      targetPrice: '$920',
      upside: '+19.7%',
      riskLevel: 'Medium' as const,
      recommendedTimeframe: 'medium' as const,
    },
    {
      symbol: 'AMD',
      name: 'Advanced Micro Devices',
      price: '$168.34',
      change: '+3.21%',
      rating: 'BUY',
      aiScore: 89,
      reasons: [
        'Market share gains in server CPUs',
        'New GPU lineup competitive with NVIDIA',
        'AI accelerator adoption growing',
        'Attractive valuation vs competitors'
      ],
      targetPrice: '$205',
      upside: '+21.8%',
      riskLevel: 'Medium' as const,
      recommendedTimeframe: 'medium' as const,
    },
    {
      symbol: 'SNOW',
      name: 'Snowflake Inc.',
      price: '$168.92',
      change: '+2.87%',
      rating: 'BUY',
      aiScore: 85,
      reasons: [
        'Cloud data platform leader',
        'Enterprise customer base expanding',
        'Strong revenue growth trajectory',
        'AI integration driving adoption'
      ],
      targetPrice: '$210',
      upside: '+24.3%',
      riskLevel: 'Medium' as const,
      recommendedTimeframe: 'medium' as const,
    },
  ],
  long: [
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: '$142.38',
      change: '+1.85%',
      rating: 'STRONG BUY',
      aiScore: 92,
      reasons: [
        'Undervalued compared to tech peers',
        'AI integration in search & cloud',
        'Strong cash flow generation',
        'Cloud revenue growing 28% YoY'
      ],
      targetPrice: '$195',
      upside: '+37.0%',
      riskLevel: 'Low' as const,
      recommendedTimeframe: 'long' as const,
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: '$412.15',
      change: '+1.67%',
      rating: 'BUY',
      aiScore: 90,
      reasons: [
        'Azure cloud platform leader',
        'OpenAI partnership driving growth',
        'Enterprise software dominance',
        'Consistent dividend growth'
      ],
      targetPrice: '$520',
      upside: '+26.2%',
      riskLevel: 'Low' as const,
      recommendedTimeframe: 'long' as const,
    },
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: '$178.42',
      change: '+1.24%',
      rating: 'BUY',
      aiScore: 88,
      reasons: [
        'Services revenue growing steadily',
        'Strong brand loyalty and ecosystem',
        'Vision Pro and AI initiatives',
        'Reliable dividend and buybacks'
      ],
      targetPrice: '$225',
      upside: '+26.1%',
      riskLevel: 'Low' as const,
      recommendedTimeframe: 'long' as const,
    },
  ],
}

interface TopRecommendationsProps {
  selectedTimeframe: 'short' | 'medium' | 'long'
  onAddToPortfolio?: (stock: any, data: any) => void
}

export default function TopRecommendations({ selectedTimeframe, onAddToPortfolio }: TopRecommendationsProps) {
  const topPicks = allStockPicks[selectedTimeframe]
  const navigate = useNavigate()
  const [selectedStock, setSelectedStock] = useState<typeof topPicks[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddToPortfolio = (stock: typeof topPicks[0]) => {
    setSelectedStock(stock)
    setIsModalOpen(true)
  }

  const handleModalAdd = (data: any) => {
    if (selectedStock && onAddToPortfolio) {
      onAddToPortfolio(selectedStock, data)
    }
    setIsModalOpen(false)
  }

  const handleViewAnalysis = (symbol: string) => {
    navigate(`/stock/${symbol}`)
  }
  const getTimeframeInfo = () => {
    switch (selectedTimeframe) {
      case 'short':
        return { label: 'Short Term', description: 'High-momentum stocks for quick gains (< 6 months)' }
      case 'medium':
        return { label: 'Medium Term', description: 'Balanced growth opportunities (6-12 months)' }
      case 'long':
        return { label: 'Long Term', description: 'Stable investments for compound growth (> 12 months)' }
    }
  }

  const timeframeInfo = getTimeframeInfo()

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient">
            {timeframeInfo.label} Recommendations
          </h2>
          <p className="text-sm text-gray-400 mt-1">{timeframeInfo.description}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <div className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse"></div>
          <span>Updated 2 min ago</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {topPicks.map((stock, index) => (
          <motion.div
            key={stock.symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="glass-morphism-strong rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-cyber-blue hover-glow transition-all relative overflow-hidden group"
          >
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-blue/5 rounded-full blur-3xl group-hover:bg-cyber-blue/10 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyber-purple/5 rounded-full blur-3xl group-hover:bg-cyber-purple/10 transition-all duration-500" />

            <div className="relative z-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4">
              <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-neon-gradient flex items-center justify-center font-bold text-lg sm:text-xl shimmer relative overflow-hidden"
                >
                  <span className="relative z-10">{stock.symbol.substring(0, 2)}</span>
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold mb-1">{stock.symbol}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 mb-2">{stock.name}</p>
                  <div className="flex items-center space-x-2 flex-wrap gap-1">
                    <span className="text-xl sm:text-3xl font-bold">{stock.price}</span>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-sm sm:text-base font-semibold text-green-400 px-2 py-1 rounded-lg bg-green-500/10"
                    >
                      {stock.change}
                    </motion.span>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2 w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500/20 to-green-400/20 text-green-400 font-bold text-xs sm:text-sm border border-green-400/30 shimmer"
                >
                  {stock.rating}
                </motion.div>
                <div className="text-center sm:text-right">
                  <div className="text-xs text-gray-400 mb-1">AI Confidence</div>
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="text-2xl sm:text-3xl font-bold text-gradient"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {stock.aiScore}
                    </motion.div>
                    <div className="text-gray-400 text-sm">/100</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="space-y-3 mb-4">
              <h4 className="text-sm font-semibold text-gray-300">AI Analysis:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {stock.reasons.map((reason, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + i * 0.05 }}
                    className="flex items-start space-x-2 text-sm"
                  >
                    <svg className="w-5 h-5 text-cyber-blue flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">{reason}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-white/10 mb-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-morphism rounded-xl p-3 border border-white/10 hover:border-cyber-blue/50 transition-all"
              >
                <div className="text-xs text-gray-400 mb-1">Target Price</div>
                <div className="text-lg sm:text-xl font-bold text-cyber-blue">{stock.targetPrice}</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-morphism rounded-xl p-3 border border-white/10 hover:border-green-400/50 transition-all"
              >
                <div className="text-xs text-gray-400 mb-1">Potential Upside</div>
                <div className="text-lg sm:text-xl font-bold text-green-400">{stock.upside}</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-morphism rounded-xl p-3 border border-white/10 hover:border-yellow-400/50 transition-all"
              >
                <div className="text-xs text-gray-400 mb-1">Risk Level</div>
                <div className={`text-lg sm:text-xl font-bold ${
                  stock.riskLevel === 'Low' ? 'text-green-400' :
                  stock.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {stock.riskLevel}
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-morphism rounded-xl p-3 border border-white/10 hover:border-purple-400/50 transition-all"
              >
                <div className="text-xs text-gray-400 mb-1">Timeframe</div>
                <div className="text-lg sm:text-xl font-bold text-cyber-purple">
                  {stock.recommendedTimeframe === 'short' ? '< 6mo' :
                   stock.recommendedTimeframe === 'medium' ? '6-12mo' : '> 12mo'}
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAddToPortfolio(stock)}
                className="py-3 sm:py-4 rounded-xl bg-neon-gradient font-semibold hover-glow relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add to Portfolio
                </span>
                <motion.div
                  className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleViewAnalysis(stock.symbol)}
                className="py-3 sm:py-4 rounded-xl border-2 border-cyber-blue/50 hover:bg-cyber-blue/10 font-semibold transition-all relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Analysis
                </span>
                <motion.div
                  className="absolute inset-0 bg-cyber-blue/5 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </motion.button>
            </div>
          </div>
          </motion.div>
        ))}
      </div>

      {selectedStock && (
        <AddToPortfolioModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          stock={selectedStock}
          onAdd={handleModalAdd}
        />
      )}
    </div>
  )
}
