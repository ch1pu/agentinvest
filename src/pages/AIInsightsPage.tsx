import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { generateAIInsights, AIInsight } from '../services/mockData'

const marketInsights = [
  {
    title: 'AI-Powered Semiconductors Surge',
    category: 'Technology',
    sentiment: 'Bullish',
    confidence: 92,
    summary: 'AI chip demand continues to drive semiconductor stocks higher, with data center investments accelerating.',
    impact: ['NVDA', 'AMD', 'INTC'],
    date: '2025-10-02',
  },
  {
    title: 'Federal Reserve Rate Decision Ahead',
    category: 'Economics',
    sentiment: 'Neutral',
    confidence: 78,
    summary: 'Markets anticipate potential rate adjustments as inflation data shows mixed signals.',
    impact: ['SPY', 'QQQ', 'IWM'],
    date: '2025-10-01',
  },
  {
    title: 'Cloud Computing Growth Accelerates',
    category: 'Technology',
    sentiment: 'Bullish',
    confidence: 88,
    summary: 'Enterprise cloud adoption reaches new highs, benefiting major cloud service providers.',
    impact: ['MSFT', 'GOOGL', 'AMZN'],
    date: '2025-09-30',
  },
]

const trendingTopics = [
  { topic: 'Artificial Intelligence', momentum: 95, stocks: ['NVDA', 'MSFT', 'GOOGL'] },
  { topic: 'Electric Vehicles', momentum: 72, stocks: ['TSLA', 'RIVN', 'LCID'] },
  { topic: 'Renewable Energy', momentum: 68, stocks: ['ENPH', 'SEDG', 'FSLR'] },
  { topic: 'Cryptocurrency', momentum: 81, stocks: ['COIN', 'MSTR', 'RIOT'] },
]

export default function AIInsightsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])

  useEffect(() => {
    setAiInsights(generateAIInsights())
  }, [])

  const categories = ['All', 'Technology', 'Economics', 'Markets', 'Global']

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-2">AI Market Insights</h1>
          <p className="text-gray-400">Real-time AI-powered market analysis and trends</p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-3 h-3 rounded-full bg-cyber-blue animate-pulse shimmer"></div>
          <span className="text-gray-400">AI analyzing 10,000+ sources</span>
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3"
      >
        {categories.map((category, index) => (
          <motion.button
            key={category}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              selectedCategory === category
                ? 'bg-neon-gradient hover-glow'
                : 'glass-morphism border border-white/10 hover:border-cyber-blue/50'
            }`}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>

      {/* Trending Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-morphism-strong rounded-xl p-4 sm:p-6 border border-white/10"
      >
        <h2 className="text-2xl font-bold mb-4 text-gradient">Trending Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trendingTopics.map((item, index) => (
            <motion.div
              key={item.topic}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="glass-morphism rounded-xl p-4 border border-white/10 hover:border-cyber-blue/50 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg">{item.topic}</h3>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl font-bold text-gradient"
                >
                  {item.momentum}
                </motion.div>
              </div>
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1">Momentum</div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.momentum}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    className="h-2 rounded-full bg-gradient-to-r from-cyber-blue to-cyber-purple"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.stocks.map(symbol => (
                  <span
                    key={symbol}
                    className="px-3 py-1 rounded-lg bg-cyber-blue/20 text-cyber-blue text-xs font-bold border border-cyber-blue/30"
                  >
                    {symbol}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Market Insights */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gradient">Latest Insights</h2>
        {marketInsights.map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ y: -5 }}
            className="glass-morphism-strong rounded-xl p-4 sm:p-6 border border-white/10 hover:border-cyber-blue hover-glow transition-all relative overflow-hidden group"
          >
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-blue/5 rounded-full blur-3xl group-hover:bg-cyber-blue/10 transition-all duration-500" />

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-xs font-bold border border-purple-500/30">
                      {insight.category}
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                      insight.sentiment === 'Bullish'
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : insight.sentiment === 'Bearish'
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {insight.sentiment}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">{insight.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{insight.summary}</p>
                  <p className="text-xs text-gray-500">{insight.date}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">AI Confidence</div>
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-3xl font-bold text-gradient"
                    >
                      {insight.confidence}
                    </motion.div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div>
                  <div className="text-xs text-gray-400 mb-2">Impacted Stocks</div>
                  <div className="flex flex-wrap gap-2">
                    {insight.impact.map(symbol => (
                      <span
                        key={symbol}
                        className="px-3 py-1 rounded-lg bg-cyber-blue/20 text-cyber-blue text-sm font-bold border border-cyber-blue/30"
                      >
                        {symbol}
                      </span>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-lg border-2 border-cyber-blue/50 hover:bg-cyber-blue/10 font-semibold transition-all"
                >
                  Read Full Analysis
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
