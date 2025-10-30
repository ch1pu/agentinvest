// Mock data service for prototyping
export interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: string
  pe: string
  sector: string
  high52Week: number
  low52Week: number
  avgVolume: string
  dividend: string
}

export interface PortfolioAsset {
  symbol: string
  name: string
  shares: number
  avgPrice: number
  currentPrice: number
  value: number
  gain: number
  gainPercent: number
}

export interface AIInsight {
  id: string
  type: 'bullish' | 'bearish' | 'neutral'
  title: string
  description: string
  confidence: number
  timestamp: Date
  symbol?: string
}

export interface ChartDataPoint {
  date: string
  price: number
  volume: number
}

// Mock stock data
export const mockStocks: Record<string, Stock> = {
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 178.42,
    change: 4.15,
    changePercent: 2.38,
    volume: 52847392,
    marketCap: '$2.8T',
    pe: '29.5',
    sector: 'Technology',
    high52Week: 199.62,
    low52Week: 164.08,
    avgVolume: '58.2M',
    dividend: '0.96%'
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 412.15,
    change: 6.78,
    changePercent: 1.67,
    volume: 24583019,
    marketCap: '$3.1T',
    pe: '35.8',
    sector: 'Technology',
    high52Week: 430.82,
    low52Week: 309.45,
    avgVolume: '23.4M',
    dividend: '0.82%'
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 142.38,
    change: 2.59,
    changePercent: 1.85,
    volume: 28194738,
    marketCap: '$1.8T',
    pe: '27.2',
    sector: 'Technology',
    high52Week: 155.27,
    low52Week: 121.46,
    avgVolume: '25.7M',
    dividend: 'N/A'
  },
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 768.62,
    change: 32.74,
    changePercent: 4.45,
    volume: 41938274,
    marketCap: '$1.9T',
    pe: '97.3',
    sector: 'Semiconductors',
    high52Week: 974.27,
    low52Week: 338.24,
    avgVolume: '44.1M',
    dividend: '0.03%'
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 241.35,
    change: -3.01,
    changePercent: -1.23,
    volume: 95847362,
    marketCap: '$765B',
    pe: '51.2',
    sector: 'Automotive',
    high52Week: 299.29,
    low52Week: 152.37,
    avgVolume: '103.2M',
    dividend: 'N/A'
  },
  META: {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 312.44,
    change: 6.57,
    changePercent: 2.15,
    volume: 18293847,
    marketCap: '$793B',
    pe: '28.5',
    sector: 'Technology',
    high52Week: 384.33,
    low52Week: 224.26,
    avgVolume: '16.8M',
    dividend: 'N/A'
  },
  AMZN: {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 168.74,
    change: 3.82,
    changePercent: 2.31,
    volume: 45382910,
    marketCap: '$1.7T',
    pe: '54.7',
    sector: 'E-commerce',
    high52Week: 191.70,
    low52Week: 118.35,
    avgVolume: '48.9M',
    dividend: 'N/A'
  },
  AMD: {
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    price: 124.56,
    change: 5.23,
    changePercent: 4.38,
    volume: 62847291,
    marketCap: '$201B',
    pe: '186.4',
    sector: 'Semiconductors',
    high52Week: 164.46,
    low52Week: 93.12,
    avgVolume: '65.3M',
    dividend: 'N/A'
  }
}

// Generate chart data for a stock
export function generateChartData(symbol: string, days: number = 30): ChartDataPoint[] {
  const stock = mockStocks[symbol]
  if (!stock) return []

  const data: ChartDataPoint[] = []
  const today = new Date()
  let currentPrice = stock.price

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Random walk with slight upward bias
    const change = (Math.random() - 0.48) * 5
    currentPrice = Math.max(currentPrice + change, stock.price * 0.8)

    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(currentPrice.toFixed(2)),
      volume: Math.floor(stock.volume * (0.7 + Math.random() * 0.6))
    })
  }

  // Ensure last price matches current
  data[data.length - 1].price = stock.price

  return data
}

// Mock portfolio data
export const mockPortfolio: PortfolioAsset[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 50,
    avgPrice: 165.30,
    currentPrice: 178.42,
    value: 8921.00,
    gain: 656.00,
    gainPercent: 7.94
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft',
    shares: 25,
    avgPrice: 385.20,
    currentPrice: 412.15,
    value: 10303.75,
    gain: 673.75,
    gainPercent: 6.99
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA',
    shares: 15,
    avgPrice: 512.40,
    currentPrice: 768.62,
    value: 11529.30,
    gain: 3843.30,
    gainPercent: 50.02
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet',
    shares: 40,
    avgPrice: 132.15,
    currentPrice: 142.38,
    value: 5695.20,
    gain: 409.20,
    gainPercent: 7.74
  }
]

// Generate AI insights
export function generateAIInsights(): AIInsight[] {
  return [
    {
      id: '1',
      type: 'bullish',
      title: 'Strong Buy Signal for NVDA',
      description: 'AI analysis detects strong momentum in NVIDIA based on recent earnings beat and increased institutional buying. Technical indicators show bullish divergence.',
      confidence: 87,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      symbol: 'NVDA'
    },
    {
      id: '2',
      type: 'neutral',
      title: 'Market Consolidation Expected',
      description: 'Multiple indices showing signs of consolidation. Recommend holding current positions and watching for breakout patterns.',
      confidence: 72,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
    },
    {
      id: '3',
      type: 'bullish',
      title: 'Tech Sector Strength Continues',
      description: 'AI models predict continued strength in technology sector based on earnings momentum, chip demand, and cloud adoption trends.',
      confidence: 81,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      symbol: 'MSFT'
    },
    {
      id: '4',
      type: 'bearish',
      title: 'Profit-Taking Alert for TSLA',
      description: 'Technical analysis suggests TSLA may face near-term resistance. Consider taking partial profits or setting stop-losses.',
      confidence: 68,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
      symbol: 'TSLA'
    },
    {
      id: '5',
      type: 'bullish',
      title: 'AAPL Breaking Resistance',
      description: 'Apple stock breaking through key resistance level at $175. AI models show 73% probability of continued uptrend to $185.',
      confidence: 79,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
      symbol: 'AAPL'
    }
  ]
}

// Get stock by symbol
export function getStock(symbol: string): Stock | undefined {
  return mockStocks[symbol]
}

// Search stocks
export function searchStocks(query: string): Stock[] {
  const lowerQuery = query.toLowerCase()
  return Object.values(mockStocks).filter(
    stock =>
      stock.symbol.toLowerCase().includes(lowerQuery) ||
      stock.name.toLowerCase().includes(lowerQuery)
  )
}

// Get trending stocks
export function getTrendingStocks(): Stock[] {
  return Object.values(mockStocks)
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, 5)
}

// Get top gainers
export function getTopGainers(): Stock[] {
  return Object.values(mockStocks)
    .filter(stock => stock.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5)
}

// Get top losers
export function getTopLosers(): Stock[] {
  return Object.values(mockStocks)
    .filter(stock => stock.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5)
}

// Portfolio calculations
export function getPortfolioStats() {
  const totalValue = mockPortfolio.reduce((sum, asset) => sum + asset.value, 0)
  const totalGain = mockPortfolio.reduce((sum, asset) => sum + asset.gain, 0)
  const totalCost = totalValue - totalGain
  const gainPercent = (totalGain / totalCost) * 100

  return {
    totalValue,
    totalGain,
    totalCost,
    gainPercent,
    assets: mockPortfolio.length
  }
}
