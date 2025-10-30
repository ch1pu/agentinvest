import { motion } from 'framer-motion'

const recommendations = [
  {
    action: 'STRONG BUY',
    asset: 'NVDA',
    confidence: 94,
    reason: 'AI chip demand surge, strong fundamentals',
    color: 'text-green-400',
  },
  {
    action: 'BUY',
    asset: 'GOOGL',
    confidence: 87,
    reason: 'Undervalued P/E ratio, AI integration growth',
    color: 'text-green-400',
  },
  {
    action: 'WATCH',
    asset: 'TSLA',
    confidence: 72,
    reason: 'High volatility, wait for price stabilization',
    color: 'text-yellow-400',
  },
]

export default function AIRecommendations() {
  return (
    <div className="glass-morphism rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">AI Insights</h2>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 rounded-full border-2 border-cyber-blue border-t-transparent"
        />
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.asset}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 5 }}
            className="glass-morphism rounded-xl p-4 border border-white/10 hover:border-cyber-blue/50 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className={`font-bold ${rec.color}`}>{rec.action}</span>
                <span className="text-white font-semibold">{rec.asset}</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rec.confidence}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-cyber-blue rounded-full"
                  />
                </div>
                <span className="text-xs text-gray-400">{rec.confidence}%</span>
              </div>
            </div>
            <p className="text-sm text-gray-400">{rec.reason}</p>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-6 py-3 rounded-lg neon-border bg-cyber-blue/10 hover:bg-cyber-blue/20 transition-all font-semibold"
      >
        View All Insights
      </motion.button>
    </div>
  )
}
