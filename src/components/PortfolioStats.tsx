import { motion } from 'framer-motion'

export default function PortfolioStats() {
  const stats = [
    { label: 'Stocks Analyzed', value: '2,847', change: '+156 today', positive: true },
    { label: 'AI Recommendations', value: '24', change: '8 high confidence', positive: true },
    { label: 'Success Rate', value: '87.3%', change: '+2.1%', positive: true },
  ]

  return (
    <div className="glass-morphism rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gradient">AI Analysis Overview</h2>
        <div className="px-3 py-1 rounded-full bg-cyber-blue/20 text-cyber-blue text-sm font-semibold">
          Live
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="glass-morphism rounded-xl p-4 border border-white/10 hover:border-cyber-blue/50 transition-all"
          >
            <div className="text-gray-400 text-sm mb-1">{stat.label}</div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className={`text-sm font-semibold ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
              {stat.change}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '75%' }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-full bg-neon-gradient rounded-full"
        />
      </div>
      <div className="text-sm text-gray-400 text-center">
        AI Accuracy Score: High Confidence
      </div>
    </div>
  )
}
