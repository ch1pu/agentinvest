export interface Stock {
  symbol: string
  name: string
  price: number
  change: string
  positive: boolean
  sector: string
}

export interface PortfolioStock extends Stock {
  purchasePrice: number
  purchaseDate: string
  shares: number
  targetSellDate?: string
  investmentTimeframe: 'short' | 'medium' | 'long' // short: <6mo, medium: 6-12mo, long: >12mo
  currentValue: number
  gainLoss: number
  gainLossPercent: number
}

export interface Recommendation {
  symbol: string
  name: string
  price: string
  change: string
  rating: string
  aiScore: number
  reasons: string[]
  targetPrice: string
  upside: string
  riskLevel: 'Low' | 'Medium' | 'High'
  recommendedTimeframe: 'short' | 'medium' | 'long'
  estimatedSellDate?: string
}
