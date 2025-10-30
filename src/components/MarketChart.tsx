import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

const data = [
  { time: '00:00', value: 120000, ai_prediction: 121000 },
  { time: '04:00', value: 118500, ai_prediction: 119500 },
  { time: '08:00', value: 122000, ai_prediction: 123000 },
  { time: '12:00', value: 121000, ai_prediction: 122500 },
  { time: '16:00', value: 123500, ai_prediction: 124000 },
  { time: '20:00', value: 124583, ai_prediction: 125500 },
]

export default function MarketChart() {
  return (
    <div className="glass-morphism rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Market Performance</h2>
        <div className="flex space-x-2">
          {['1D', '1W', '1M', '1Y', 'ALL'].map((period) => (
            <button
              key={period}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                period === '1D'
                  ? 'bg-cyber-blue text-cyber-darker'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#b030ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#b030ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="time" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(10, 14, 39, 0.95)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00f0ff"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
            <Area
              type="monotone"
              dataKey="ai_prediction"
              stroke="#b030ff"
              strokeWidth={2}
              strokeDasharray="5 5"
              fillOpacity={1}
              fill="url(#colorPrediction)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-cyber-blue"></div>
          <span className="text-gray-400">Actual Value</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-cyber-purple"></div>
          <span className="text-gray-400">AI Prediction</span>
        </div>
      </div>
    </div>
  )
}
