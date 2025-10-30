-- AgentInvest PostgreSQL Initialization Script
-- This script creates the main database schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- Users Table
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  last_login TIMESTAMP,
  subscription_tier VARCHAR(20) DEFAULT 'free',
  subscription_expires TIMESTAMP,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,

  CONSTRAINT check_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscription_tier);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ============================================
-- Sessions Table
-- ============================================

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token VARCHAR(500) NOT NULL,
  device_info JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT check_expires_future CHECK (expires_at > created_at)
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(refresh_token);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

-- ============================================
-- Portfolios Table
-- ============================================

CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) DEFAULT 'Main Portfolio',
  description TEXT,
  is_default BOOLEAN DEFAULT TRUE,
  currency VARCHAR(3) DEFAULT 'USD',
  initial_value DECIMAL(15,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT check_initial_value CHECK (initial_value >= 0)
);

CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE UNIQUE INDEX idx_portfolios_user_default ON portfolios(user_id, is_default)
  WHERE is_default = TRUE;

-- ============================================
-- Portfolio Assets Table
-- ============================================

CREATE TABLE IF NOT EXISTS portfolio_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  name VARCHAR(255) NOT NULL,
  asset_type VARCHAR(20) DEFAULT 'stock',
  shares DECIMAL(15,6) NOT NULL,
  avg_purchase_price DECIMAL(10,2) NOT NULL,
  current_price DECIMAL(10,2),
  total_cost DECIMAL(15,2) GENERATED ALWAYS AS (shares * avg_purchase_price) STORED,
  current_value DECIMAL(15,2),
  unrealized_gain DECIMAL(15,2),
  unrealized_gain_percent DECIMAL(7,4),
  last_price_update TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT check_shares_positive CHECK (shares > 0),
  CONSTRAINT check_avg_price_positive CHECK (avg_purchase_price > 0),
  CONSTRAINT unique_portfolio_symbol UNIQUE(portfolio_id, symbol)
);

CREATE INDEX idx_portfolio_assets_portfolio ON portfolio_assets(portfolio_id);
CREATE INDEX idx_portfolio_assets_symbol ON portfolio_assets(symbol);

-- ============================================
-- Transactions Table
-- ============================================

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  transaction_type VARCHAR(10) NOT NULL,
  shares DECIMAL(15,6) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(15,2) GENERATED ALWAYS AS (shares * price) STORED,
  fees DECIMAL(10,2) DEFAULT 0.00,
  transaction_date TIMESTAMP NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT check_transaction_type CHECK (transaction_type IN ('buy', 'sell', 'dividend')),
  CONSTRAINT check_shares_positive CHECK (shares > 0),
  CONSTRAINT check_price_positive CHECK (price > 0),
  CONSTRAINT check_fees_non_negative CHECK (fees >= 0)
);

CREATE INDEX idx_transactions_portfolio ON transactions(portfolio_id);
CREATE INDEX idx_transactions_symbol ON transactions(symbol);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);

-- ============================================
-- Watchlists Table
-- ============================================

CREATE TABLE IF NOT EXISTS watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_watchlists_user_id ON watchlists(user_id);

-- ============================================
-- Watchlist Items Table
-- ============================================

CREATE TABLE IF NOT EXISTS watchlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  watchlist_id UUID NOT NULL REFERENCES watchlists(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,

  CONSTRAINT unique_watchlist_symbol UNIQUE(watchlist_id, symbol)
);

CREATE INDEX idx_watchlist_items_watchlist ON watchlist_items(watchlist_id);

-- ============================================
-- Price Alerts Table
-- ============================================

CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  alert_type VARCHAR(20) NOT NULL,
  target_price DECIMAL(10,2) NOT NULL,
  condition VARCHAR(10) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  triggered_at TIMESTAMP,
  notified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,

  CONSTRAINT check_alert_type CHECK (alert_type IN ('price', 'percent_change', 'volume')),
  CONSTRAINT check_condition CHECK (condition IN ('above', 'below', 'equals'))
);

CREATE INDEX idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX idx_price_alerts_symbol ON price_alerts(symbol);
CREATE INDEX idx_price_alerts_active ON price_alerts(is_active) WHERE is_active = TRUE;

-- ============================================
-- AI Insights Table
-- ============================================

CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  insight_type VARCHAR(20) NOT NULL,
  symbol VARCHAR(10),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  confidence DECIMAL(5,2) NOT NULL,
  recommendation VARCHAR(20),
  target_price DECIMAL(10,2),
  time_horizon VARCHAR(20),
  is_actionable BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,

  CONSTRAINT check_insight_type CHECK (insight_type IN ('bullish', 'bearish', 'neutral', 'market', 'portfolio')),
  CONSTRAINT check_confidence CHECK (confidence >= 0 AND confidence <= 100)
);

CREATE INDEX idx_ai_insights_user_id ON ai_insights(user_id);
CREATE INDEX idx_ai_insights_symbol ON ai_insights(symbol);
CREATE INDEX idx_ai_insights_type ON ai_insights(insight_type);
CREATE INDEX idx_ai_insights_created ON ai_insights(created_at);

-- ============================================
-- User Activity Log
-- ============================================

CREATE TABLE IF NOT EXISTS user_activity_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  activity_type VARCHAR(50) NOT NULL,
  resource_type VARCHAR(50),
  resource_id VARCHAR(100),
  details JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX idx_activity_log_type ON user_activity_log(activity_type);
CREATE INDEX idx_activity_log_created ON user_activity_log(created_at);

-- ============================================
-- Trigger for updated_at timestamps
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_assets_updated_at BEFORE UPDATE ON portfolio_assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_watchlists_updated_at BEFORE UPDATE ON watchlists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Seed Data (Development Only)
-- ============================================

-- Create a test user (password: Test123!)
INSERT INTO users (email, password_hash, first_name, last_name, email_verified)
VALUES (
  'test@agentinvest.com',
  '$2b$10$XYZ...hash...ABC',  -- This would be a real bcrypt hash
  'Test',
  'User',
  TRUE
) ON CONFLICT (email) DO NOTHING;

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'AgentInvest database schema initialized successfully';
END $$;
