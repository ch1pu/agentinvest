import { motion } from 'framer-motion'

interface TimeframeSelectorProps {
  selected: 'short' | 'medium' | 'long'
  onSelect: (timeframe: 'short' | 'medium' | 'long') => void
}

export default function TimeframeSelector({ selected, onSelect }: TimeframeSelectorProps) {
  const timeframes = [
    {
      value: 'short' as const,
      label: 'Short Term',
      duration: '< 6 months',
      description: 'Quick gains, higher volatility',
      icon: '⚡',
      color: 'yellow'
    },
    {
      value: 'medium' as const,
      label: 'Medium Term',
      duration: '6-12 months',
      description: 'Balanced growth strategy',
      icon: '📊',
      color: 'blue'
    },
    {
      value: 'long' as const,
      label: 'Long Term',
      duration: '> 12 months',
      description: 'Stable compound growth',
      icon: '🎯',
      color: 'green'
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {timeframes.map((timeframe, index) => (
        <motion.button
          key={timeframe.value}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(timeframe.value)}
          className={`relative p-4 sm:p-6 rounded-xl text-left transition-all duration-300 group overflow-hidden ${
            selected === timeframe.value
              ? 'glass-morphism-strong neon-border'
              : 'glass-morphism border-2 border-white/10 hover:border-cyber-blue/50'
          }`}
        >
          {/* Background Gradient */}
          {selected === timeframe.value && (
            <motion.div
              layoutId="selectedBg"
              className="absolute inset-0 bg-gradient-to-br from-cyber-blue/10 via-transparent to-cyber-purple/10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-2">
              <span className="text-3xl sm:text-4xl">{timeframe.icon}</span>
              {selected === timeframe.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full bg-cyber-blue flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
            </div>
            <div className="font-bold text-base sm:text-lg mb-1">{timeframe.label}</div>
            <div className="text-xs sm:text-sm text-cyber-blue font-semibold mb-2">{timeframe.duration}</div>
            <div className="text-xs text-gray-400">{timeframe.description}</div>
          </div>

          {/* Hover Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyber-blue/5 to-cyber-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </motion.button>
      ))}
    </div>
  )
}
