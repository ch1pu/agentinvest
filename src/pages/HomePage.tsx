import { PortfolioStock } from '../types'
import Dashboard from '../components/Dashboard'

interface HomePageProps {
  portfolioStocks: PortfolioStock[]
  onAddToPortfolio: (stock: any, data: any) => void
  onRemoveFromPortfolio: (symbol: string) => void
}

export default function HomePage({ portfolioStocks, onAddToPortfolio, onRemoveFromPortfolio }: HomePageProps) {
  return (
    <Dashboard
      portfolioStocks={portfolioStocks}
      onAddToPortfolio={onAddToPortfolio}
      onRemoveFromPortfolio={onRemoveFromPortfolio}
    />
  )
}
