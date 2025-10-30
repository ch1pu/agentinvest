import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChartDataPoint } from '../services/mockData'

interface StockChartProps {
  data: ChartDataPoint[]
  symbol: string
}

export default function StockChart({ data, symbol }: StockChartProps) {
  const [timeframe, setTimeframe] = useState('1M')
  const timeframes = ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL']

  // Calculate min/max for better scaling
  const prices = data.map(d => d.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const padding = (maxPrice - minPrice) * 0.1

  // Determine if stock is up or down
  const isPositive = data[data.length - 1]?.price >= data[0]?.price

  return (
    <div className="space-y-4">
      {/* Timeframe Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gradient">Price Chart</h3>
        <div className="flex gap-2">
          {timeframes.map((tf) => (
            <motion.button
              key={tf}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                timeframe === tf
                  ? 'bg-neon-gradient hover-glow'
                  : 'glass-morphism border border-white/10 hover:border-cyber-blue/50'
              }`}
            >
              {tf}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism-strong rounded-xl p-4 sm:p-6 border border-white/10"
      >
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`colorPrice-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? "#00ff41" : "#ff006e"} stopOpacity={0.3} />
                <stop offset="95%" stopColor={isPositive ? "#00ff41" : "#ff006e"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="date"
              stroke="#666"
              tick={{ fill: '#888', fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return `${date.getMonth() + 1}/${date.getDate()}`
              }}
            />
            <YAxis
              stroke="#666"
              tick={{ fill: '#888', fontSize: 12 }}
              domain={[minPrice - padding, maxPrice + padding]}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(13, 13, 13, 0.95)',
                border: '1px solid rgba(0, 217, 255, 0.3)',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)',
              }}
              labelStyle={{ color: '#00d9ff' }}
              itemStyle={{ color: isPositive ? '#00ff41' : '#ff006e' }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
              labelFormatter={(label) => {
                const date = new Date(label)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? "#00ff41" : "#ff006e"}
              strokeWidth={2}
              fill={`url(#colorPrice-${symbol})`}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Chart Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-morphism rounded-xl p-4 border border-white/10"
        >
          <div className="text-xs text-gray-400 mb-1">High</div>
          <div className="text-lg font-bold text-green-400">${maxPrice.toFixed(2)}</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-morphism rounded-xl p-4 border border-white/10"
        >
          <div className="text-xs text-gray-400 mb-1">Low</div>
          <div className="text-lg font-bold text-red-400">${minPrice.toFixed(2)}</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-morphism rounded-xl p-4 border border-white/10"
        >
          <div className="text-xs text-gray-400 mb-1">Avg Volume</div>
          <div className="text-lg font-bold text-cyber-blue">
            {(data.reduce((sum, d) => sum + d.volume, 0) / data.length / 1000000).toFixed(1)}M
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-morphism rounded-xl p-4 border border-white/10"
        >
          <div className="text-xs text-gray-400 mb-1">Change</div>
          <div className={`text-lg font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}
            {((data[data.length - 1].price - data[0].price) / data[0].price * 100).toFixed(2)}%
          </div>
        </motion.div>
      </div>
    </div>
  )
}
