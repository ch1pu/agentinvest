import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-neon-gradient flex items-center justify-center shadow-2xl z-50 animate-glow"
      >
        <span className="text-2xl">🤖</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-28 right-8 w-96 h-[500px] glass-morphism rounded-2xl p-6 z-50 flex flex-col border border-cyber-blue/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gradient">AI Stock Advisor</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              <div className="glass-morphism rounded-xl p-3 border border-white/10">
                <p className="text-sm text-gray-300">
                  Hello! I'm your AI stock advisor. I can help you discover investment opportunities, analyze stocks, and provide personalized recommendations.
                </p>
              </div>
              <div className="glass-morphism rounded-xl p-3 border border-cyber-blue/30 ml-8">
                <p className="text-sm">What stocks should I consider right now?</p>
              </div>
              <div className="glass-morphism rounded-xl p-3 border border-white/10">
                <p className="text-sm text-gray-300">
                  Based on current market analysis, NVDA shows exceptional potential with a 94% AI confidence score. The stock has strong fundamentals with AI chip demand at record highs and impressive earnings growth.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-3 rounded-lg glass-morphism border border-white/10 focus:border-cyber-blue/50 outline-none"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-lg bg-neon-gradient font-semibold"
              >
                Send
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
