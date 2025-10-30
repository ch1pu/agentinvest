import { motion } from 'framer-motion'

export default function MarketSentiment() {
  const sentimentData = {
    overall: 72,
    label: 'Bullish',
    color: 'text-green-400',
  }

  const sectors = [
    { name: 'Technology', sentiment: 85, change: '+5', trending: 'up' },
    { name: 'Healthcare', sentiment: 68, change: '+2', trending: 'up' },
    { name: 'Finance', sentiment: 62, change: '-3', trending: 'down' },
    { name: 'Energy', sentiment: 58, change: '-8', trending: 'down' },
  ]

  return (
    <div className="glass-morphism rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-6">Market Sentiment</h2>

      {/* Overall Sentiment */}
      <div className="mb-6 text-center">
        <div className="relative inline-block">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: `0 ${2 * Math.PI * 56}` }}
              animate={{ strokeDasharray: `${(sentimentData.overall / 100) * 2 * Math.PI * 56} ${2 * Math.PI * 56}` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="100%" stopColor="#b030ff" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold">{sentimentData.overall}</div>
            <div className={`text-sm font-semibold ${sentimentData.color}`}>
              {sentimentData.label}
            </div>
          </div>
        </div>
      </div>

      {/* Sector Breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-400">Sector Analysis</h3>
        {sectors.map((sector, index) => (
          <motion.div
            key={sector.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-morphism rounded-lg p-3 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{sector.name}</span>
                <span className={`text-xs ${sector.trending === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {sector.change}
                </span>
              </div>
              <span className="text-sm font-semibold">{sector.sentiment}</span>
            </div>
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${sector.sentiment}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`h-full rounded-full ${
                  sector.sentiment >= 70 ? 'bg-green-400' :
                  sector.sentiment >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                }`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
