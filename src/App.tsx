import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import AIAssistant from './components/AIAssistant'
import AnimatedBackground from './components/AnimatedBackground'
import HomePage from './pages/HomePage'
import WatchlistPage from './pages/WatchlistPage'
import ScreenerPage from './pages/ScreenerPage'
import AIInsightsPage from './pages/AIInsightsPage'
import StockDetailPage from './pages/StockDetailPage'
import { PortfolioStock } from './types'

function App() {
  const [portfolioStocks, setPortfolioStocks] = useState<PortfolioStock[]>([])

  const handleAddToPortfolio = (stock: any, purchaseData: any) => {
    const currentPrice = parseFloat(stock.price.replace('$', ''))
    const purchasePrice = purchaseData.purchasePrice
    const shares = purchaseData.shares
    const currentValue = currentPrice * shares
    const invested = purchasePrice * shares
    const gainLoss = currentValue - invested
    const gainLossPercent = ((gainLoss / invested) * 100)

    // Calculate target sell date
    const date = new Date()
    if (purchaseData.investmentTimeframe === 'short') {
      date.setMonth(date.getMonth() + 3)
    } else if (purchaseData.investmentTimeframe === 'medium') {
      date.setMonth(date.getMonth() + 9)
    } else {
      date.setFullYear(date.getFullYear() + 1)
      date.setMonth(date.getMonth() + 6)
    }

    const newStock: PortfolioStock = {
      symbol: stock.symbol,
      name: stock.name,
      price: currentPrice,
      change: stock.change,
      positive: stock.change.includes('+'),
      sector: 'Technology',
      purchasePrice: purchasePrice,
      purchaseDate: new Date().toISOString(),
      shares: shares,
      targetSellDate: date.toLocaleDateString(),
      investmentTimeframe: purchaseData.investmentTimeframe,
      currentValue: currentValue,
      gainLoss: gainLoss,
      gainLossPercent: gainLossPercent,
    }

    setPortfolioStocks([...portfolioStocks, newStock])
  }

  const handleRemoveFromPortfolio = (symbol: string) => {
    setPortfolioStocks(portfolioStocks.filter(stock => stock.symbol !== symbol))
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-darker relative">
        <AnimatedBackground />

        <Header />

        <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  portfolioStocks={portfolioStocks}
                  onAddToPortfolio={handleAddToPortfolio}
                  onRemoveFromPortfolio={handleRemoveFromPortfolio}
                />
              }
            />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/screener" element={<ScreenerPage />} />
            <Route path="/insights" element={<AIInsightsPage />} />
            <Route path="/stock/:symbol" element={<StockDetailPage />} />
          </Routes>
        </main>

        <AIAssistant />
      </div>
    </Router>
  )
}

export default App
