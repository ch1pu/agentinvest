import { useState } from 'react'
import { motion } from 'framer-motion'
import PortfolioStats from './PortfolioStats'
import MarketChart from './MarketChart'
import AIRecommendations from './AIRecommendations'
import AssetsList from './AssetsList'
import StockSearch from './StockSearch'
import TopRecommendations from './TopRecommendations'
import MarketSentiment from './MarketSentiment'
import MyPortfolio from './MyPortfolio'
import TimeframeSelector from './TimeframeSelector'
import { PortfolioStock } from '../types'

interface DashboardProps {
  portfolioStocks: PortfolioStock[]
  onAddToPortfolio: (stock: any, data: any) => void
  onRemoveFromPortfolio: (symbol: string) => void
}

export default function Dashboard({ portfolioStocks, onAddToPortfolio, onRemoveFromPortfolio }: DashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'short' | 'medium' | 'long'>('medium')
  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StockSearch />
      </motion.div>

      {/* My Portfolio - Show only if user has stocks */}
      {portfolioStocks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <MyPortfolio stocks={portfolioStocks} onRemove={onRemoveFromPortfolio} />
        </motion.div>
      )}

      {/* Stats and Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <PortfolioStats />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AIRecommendations />
        </motion.div>
      </div>

      {/* Timeframe Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="glass-morphism rounded-2xl p-6 border border-cyber-blue/30">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gradient mb-2">Select Your Investment Strategy</h2>
            <p className="text-gray-400">Choose your timeframe to see AI-curated stock recommendations</p>
          </div>
          <TimeframeSelector selected={selectedTimeframe} onSelect={setSelectedTimeframe} />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <TopRecommendations
            selectedTimeframe={selectedTimeframe}
            onAddToPortfolio={onAddToPortfolio}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <MarketSentiment />
          <AssetsList />
        </motion.div>
      </div>

      {/* Market Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <MarketChart />
      </motion.div>
    </div>
  )
}
