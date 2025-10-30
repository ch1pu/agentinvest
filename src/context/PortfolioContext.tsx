import { createContext, useContext, useState, ReactNode } from 'react'
import { mockPortfolio, PortfolioAsset } from '../services/mockData'

interface PortfolioContextType {
  portfolio: PortfolioAsset[]
  addToPortfolio: (asset: Partial<PortfolioAsset>) => void
  removeFromPortfolio: (symbol: string) => void
  updateAsset: (symbol: string, shares: number) => void
  getPortfolioValue: () => number
  getPortfolioGain: () => number
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolio, setPortfolio] = useState<PortfolioAsset[]>(mockPortfolio)

  const addToPortfolio = (asset: Partial<PortfolioAsset>) => {
    const existingIndex = portfolio.findIndex(a => a.symbol === asset.symbol)

    if (existingIndex !== -1) {
      // Update existing asset
      setPortfolio(prev => {
        const updated = [...prev]
        const existing = updated[existingIndex]
        const totalShares = existing.shares + (asset.shares || 0)
        const totalCost = existing.avgPrice * existing.shares + (asset.avgPrice || 0) * (asset.shares || 0)
        updated[existingIndex] = {
          ...existing,
          shares: totalShares,
          avgPrice: totalCost / totalShares,
          value: totalShares * (asset.currentPrice || existing.currentPrice),
        }
        return updated
      })
    } else {
      // Add new asset
      const newAsset: PortfolioAsset = {
        symbol: asset.symbol!,
        name: asset.name!,
        shares: asset.shares || 0,
        avgPrice: asset.avgPrice || 0,
        currentPrice: asset.currentPrice || 0,
        value: (asset.shares || 0) * (asset.currentPrice || 0),
        gain: 0,
        gainPercent: 0,
      }
      newAsset.gain = newAsset.value - (newAsset.avgPrice * newAsset.shares)
      newAsset.gainPercent = (newAsset.gain / (newAsset.avgPrice * newAsset.shares)) * 100

      setPortfolio(prev => [...prev, newAsset])
    }
  }

  const removeFromPortfolio = (symbol: string) => {
    setPortfolio(prev => prev.filter(asset => asset.symbol !== symbol))
  }

  const updateAsset = (symbol: string, shares: number) => {
    setPortfolio(prev => prev.map(asset => {
      if (asset.symbol === symbol) {
        const value = shares * asset.currentPrice
        const gain = value - (asset.avgPrice * shares)
        const gainPercent = (gain / (asset.avgPrice * shares)) * 100
        return { ...asset, shares, value, gain, gainPercent }
      }
      return asset
    }))
  }

  const getPortfolioValue = () => {
    return portfolio.reduce((sum, asset) => sum + asset.value, 0)
  }

  const getPortfolioGain = () => {
    return portfolio.reduce((sum, asset) => sum + asset.gain, 0)
  }

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        addToPortfolio,
        removeFromPortfolio,
        updateAsset,
        getPortfolioValue,
        getPortfolioGain,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider')
  }
  return context
}
