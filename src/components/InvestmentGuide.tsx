import { motion } from 'framer-motion'

export default function InvestmentGuide() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism rounded-2xl p-6 border border-cyber-blue/30"
    >
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-lg bg-cyber-blue/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-cyber-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2 text-cyber-blue">How Investment Timeframes Work</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p>
              <span className="font-semibold text-yellow-400">Short Term (&lt; 6 months):</span> Quick opportunities with higher volatility.
              AI will recommend review dates around 3 months for optimal exit timing.
            </p>
            <p>
              <span className="font-semibold text-blue-400">Medium Term (6-12 months):</span> Balanced growth strategy.
              Review dates set around 9 months to capture steady gains.
            </p>
            <p>
              <span className="font-semibold text-green-400">Long Term (&gt; 12 months):</span> Stable investments for compound growth.
              Review dates around 18 months, ideal for low-risk strategies.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
