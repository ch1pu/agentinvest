import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getStock, generateChartData, Stock } from '../services/mockData'
import StockChart from '../components/StockChart'

// Mock data for demonstration
const priceData = [
  { date: 'Jan', price: 650 },
  { date: 'Feb', price: 680 },
  { date: 'Mar', price: 720 },
  { date: 'Apr', price: 690 },
  { date: 'May', price: 735 },
  { date: 'Jun', price: 768 },
]

const stockDetails = {
  symbol: 'NVDA',
  name: 'NVIDIA Corporation',
  price: '$768.62',
  change: '+4.45%',
  positive: true,
  aiScore: 94,
  rating: 'STRONG BUY',
  targetPrice: '$920',
  upside: '+19.7%',
  riskLevel: 'Medium',
  marketCap: '$1.89T',
  pe: '68.5',
  volume: '42.5M',
  avgVolume: '38.2M',
  week52High: '$785.42',
  week52Low: '$385.21',
  description: 'NVIDIA Corporation is a leading designer of graphics processing units (GPUs) that enhance the experience on computing platforms. The company operates in two segments: GPU and Tegra Processor.',
  keyMetrics: [
    { label: 'EPS', value: '$11.24' },
    { label: 'Dividend', value: '$0.16' },
    { label: 'Beta', value: '1.68' },
    { label: 'Revenue', value: '$79.77B' },
  ],
  aiInsights: [
    'AI chip demand at record highs with no signs of slowing',
    'Strong Q4 earnings beat expectations by 15%',
    'Data center revenue up 217% YoY',
    'Strategic partnerships with major tech companies expanding',
    'Technical indicators showing strong bullish momentum',
  ],
  news: [
    { title: 'NVIDIA Announces New AI Chip Architecture', date: '2 hours ago', sentiment: 'Bullish' },
    { title: 'Data Center Revenue Hits New Record', date: '5 hours ago', sentiment: 'Bullish' },
    { title: 'Analyst Raises Price Target to $950', date: '1 day ago', sentiment: 'Bullish' },
  ],
}

export default function StockDetailPage() {
  const { symbol } = useParams<{ symbol: string }>()
  const [stock, setStock] = useState<Stock | null>(null)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    if (symbol) {
      const stockData = getStock(symbol.toUpperCase())
      if (stockData) {
        setStock(stockData)
        setChartData(generateChartData(symbol.toUpperCase(), 30))
      }
    }
  }, [symbol])

  if (!stock) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-400">Stock not found</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Enhanced Effects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start justify-between gap-6 glass-morphism-strong rounded-2xl p-6 border border-cyber-blue/30 relative overflow-hidden group"
      >
        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/5 via-cyber-purple/5 to-cyber-pink/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="flex items-start space-x-4 flex-1 relative z-10">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.15 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-neon-gradient flex items-center justify-center font-bold text-2xl shimmer perspective-card relative"
            style={{
              boxShadow: '0 0 30px rgba(0, 240, 255, 0.3), 0 0 60px rgba(176, 48, 255, 0.2)'
            }}
          >
            {stock.symbol.substring(0, 2)}
            <div className="absolute inset-0 rounded-xl holographic opacity-50" />
          </motion.div>
          <div>
            <motion.h1
              className="text-3xl sm:text-4xl font-bold mb-2 text-gradient"
              animate={{
                textShadow: ['0 0 10px rgba(0,240,255,0.3)', '0 0 20px rgba(0,240,255,0.5)', '0 0 10px rgba(0,240,255,0.3)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {stock.symbol}
            </motion.h1>
            <p className="text-gray-400 mb-3">{stock.name}</p>
            <div className="flex items-center space-x-3">
              <motion.span
                className="text-3xl sm:text-4xl font-bold"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ${stock.price.toFixed(2)}
              </motion.span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`text-lg font-semibold px-4 py-2 rounded-lg relative overflow-hidden ${
                  stock.changePercent > 0 ? 'text-green-400 bg-green-500/20 border border-green-400/30' : 'text-red-400 bg-red-500/20 border border-red-400/30'
                }`}
              >
                <span className="relative z-10">{stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: stockDetails.positive
                      ? ['rgba(34,197,94,0.1)', 'rgba(34,197,94,0.2)', 'rgba(34,197,94,0.1)']
                      : ['rgba(239,68,68,0.1)', 'rgba(239,68,68,0.2)', 'rgba(239,68,68,0.1)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto relative z-10">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl bg-neon-gradient font-semibold hover-glow relative overflow-hidden group/btn"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add to Portfolio
            </span>
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl border-2 border-cyber-blue/50 hover:bg-cyber-blue/10 font-semibold transition-all relative overflow-hidden group/btn"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Add to Watchlist
            </span>
            <motion.div
              className="absolute inset-0 bg-cyber-blue/5"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
          </motion.button>
        </div>

        {/* Animated Border */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.3), transparent)',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Chart & AI Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-morphism-strong rounded-xl p-4 sm:p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gradient">Price Chart</h2>
              <div className="flex gap-2">
                {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map(period => (
                  <button
                    key={period}
                    className="px-3 py-1 rounded-lg glass-morphism text-xs font-semibold hover:bg-cyber-blue/20 transition-all"
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    border: '1px solid rgba(0, 240, 255, 0.3)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#00f0ff"
                  strokeWidth={2}
                  dot={{ fill: '#00f0ff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* AI Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-morphism-strong rounded-xl p-4 sm:p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gradient">AI Analysis</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">AI Confidence</span>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-3xl font-bold text-gradient"
                >
                  {stockDetails.aiScore}
                </motion.div>
              </div>
            </div>
            <div className="space-y-3">
              {stockDetails.aiInsights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-start space-x-3 p-3 rounded-lg glass-morphism"
                >
                  <svg className="w-5 h-5 text-cyber-blue flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">{insight}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* News */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-morphism-strong rounded-xl p-4 sm:p-6 border border-white/10"
          >
            <h2 className="text-2xl font-bold text-gradient mb-4">Latest News</h2>
            <div className="space-y-3">
              {stockDetails.news.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  whileHover={{ x: 5 }}
                  className="p-4 rounded-lg glass-morphism border border-white/10 hover:border-cyber-blue/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      item.sentiment === 'Bullish' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {item.sentiment}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Stats & Metrics */}
        <div className="space-y-6">
          {/* Rating Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-morphism-strong rounded-xl p-4 sm:p-6 border border-white/10 text-center"
          >
            <div className="text-sm text-gray-400 mb-2">AI Rating</div>
            <div className="text-2xl font-bold text-green-400 mb-4">{stockDetails.rating}</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Target Price</span>
                <span className="font-bold text-cyber-blue">{stockDetails.targetPrice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Upside</span>
                <span className="font-bold text-green-400">{stockDetails.upside}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Risk Level</span>
                <span className="font-bold text-yellow-400">{stockDetails.riskLevel}</span>
              </div>
            </div>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-morphism-strong rounded-xl p-4 sm:p-6 border border-white/10"
          >
            <h3 className="text-xl font-bold text-gradient mb-4">Key Metrics</h3>
            <div className="space-y-3">
              {stockDetails.keyMetrics.map((metric, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg glass-morphism"
                >
                  <span className="text-sm text-gray-400">{metric.label}</span>
                  <span className="font-bold">{metric.value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Market Data */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-morphism-strong rounded-xl p-4 sm:p-6 border border-white/10"
          >
            <h3 className="text-xl font-bold text-gradient mb-4">Market Data</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Market Cap</span>
                <span className="font-bold">{stockDetails.marketCap}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">P/E Ratio</span>
                <span className="font-bold">{stockDetails.pe}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Volume</span>
                <span className="font-bold">{stockDetails.volume}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Avg Volume</span>
                <span className="font-bold">{stockDetails.avgVolume}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">52W High</span>
                <span className="font-bold text-green-400">{stockDetails.week52High}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">52W Low</span>
                <span className="font-bold text-red-400">{stockDetails.week52Low}</span>
              </div>
            </div>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-morphism-strong rounded-xl p-4 sm:p-6 border border-white/10"
          >
            <h3 className="text-xl font-bold text-gradient mb-3">About</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{stockDetails.description}</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
