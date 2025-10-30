# AgentInvest Database Schema

## Database Overview

AgentInvest uses a multi-database architecture for optimal performance:
- **PostgreSQL**: Primary relational database for user data, portfolios, transactions
- **TimescaleDB**: Time-series data for market prices, historical data
- **Redis**: Caching and session management
- **MongoDB**: Logs, analytics events, unstructured data

---

## PostgreSQL Schema

### Users Table
```sql
CREATE TABLE users (
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
```

### Sessions Table
```sql
CREATE TABLE sessions (
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
```

### Portfolios Table
```sql
CREATE TABLE portfolios (
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
```

### Portfolio Assets Table
```sql
CREATE TABLE portfolio_assets (
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
```

### Transactions Table
```sql
CREATE TABLE transactions (
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
```

### Watchlists Table
```sql
CREATE TABLE watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_watchlists_user_id ON watchlists(user_id);
```

### Watchlist Items Table
```sql
CREATE TABLE watchlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  watchlist_id UUID NOT NULL REFERENCES watchlists(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,

  CONSTRAINT unique_watchlist_symbol UNIQUE(watchlist_id, symbol)
);

CREATE INDEX idx_watchlist_items_watchlist ON watchlist_items(watchlist_id);
```

### Price Alerts Table
```sql
CREATE TABLE price_alerts (
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
```

### AI Insights Table
```sql
CREATE TABLE ai_insights (
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
```

### User Activity Log
```sql
CREATE TABLE user_activity_log (
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
```

---

## TimescaleDB Schema (Time-Series Data)

### Stock Prices (Hypertable)
```sql
CREATE TABLE stock_prices (
  time TIMESTAMPTZ NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  open DECIMAL(10,2) NOT NULL,
  high DECIMAL(10,2) NOT NULL,
  low DECIMAL(10,2) NOT NULL,
  close DECIMAL(10,2) NOT NULL,
  volume BIGINT NOT NULL,
  adjusted_close DECIMAL(10,2),

  CONSTRAINT check_price_positive CHECK (
    open > 0 AND high > 0 AND low > 0 AND close > 0
  ),
  CONSTRAINT check_high_low CHECK (high >= low),
  CONSTRAINT check_volume_positive CHECK (volume >= 0)
);

SELECT create_hypertable('stock_prices', 'time');

CREATE INDEX idx_stock_prices_symbol_time ON stock_prices (symbol, time DESC);
CREATE INDEX idx_stock_prices_time ON stock_prices (time DESC);
```

### Intraday Prices (Hypertable - 1-minute bars)
```sql
CREATE TABLE intraday_prices (
  time TIMESTAMPTZ NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  volume BIGINT NOT NULL,
  bid DECIMAL(10,2),
  ask DECIMAL(10,2),

  CONSTRAINT check_price_positive CHECK (price > 0)
);

SELECT create_hypertable('intraday_prices', 'time',
  chunk_time_interval => INTERVAL '1 day'
);

CREATE INDEX idx_intraday_symbol_time ON intraday_prices (symbol, time DESC);

-- Continuous aggregate for 5-minute bars
CREATE MATERIALIZED VIEW stock_prices_5min
WITH (timescaledb.continuous) AS
SELECT time_bucket('5 minutes', time) AS bucket,
       symbol,
       FIRST(price, time) AS open,
       MAX(price) AS high,
       MIN(price) AS low,
       LAST(price, time) AS close,
       SUM(volume) AS volume
FROM intraday_prices
GROUP BY bucket, symbol;
```

### Portfolio Performance History (Hypertable)
```sql
CREATE TABLE portfolio_snapshots (
  time TIMESTAMPTZ NOT NULL,
  portfolio_id UUID NOT NULL,
  total_value DECIMAL(15,2) NOT NULL,
  cash_balance DECIMAL(15,2) DEFAULT 0.00,
  total_gain DECIMAL(15,2),
  total_gain_percent DECIMAL(7,4),
  day_change DECIMAL(15,2),
  day_change_percent DECIMAL(7,4),
  asset_allocation JSONB,

  CONSTRAINT check_total_value CHECK (total_value >= 0)
);

SELECT create_hypertable('portfolio_snapshots', 'time');

CREATE INDEX idx_portfolio_snapshots_id_time ON portfolio_snapshots (portfolio_id, time DESC);
```

### Market Indices (Hypertable)
```sql
CREATE TABLE market_indices (
  time TIMESTAMPTZ NOT NULL,
  index_symbol VARCHAR(10) NOT NULL,
  value DECIMAL(12,2) NOT NULL,
  change DECIMAL(12,2),
  change_percent DECIMAL(7,4),
  volume BIGINT
);

SELECT create_hypertable('market_indices', 'time');

CREATE INDEX idx_market_indices_symbol_time ON market_indices (index_symbol, time DESC);
```

---

## Redis Data Structures

### Session Storage
```
Key: session:{session_id}
Type: Hash
TTL: 30 days
Fields:
  - user_id: UUID
  - refresh_token: string
  - device_info: JSON string
  - created_at: timestamp
```

### Stock Price Cache
```
Key: stock:{symbol}:quote
Type: Hash
TTL: 1 minute
Fields:
  - price: decimal
  - change: decimal
  - change_percent: decimal
  - volume: integer
  - updated_at: timestamp
```

### User Portfolio Cache
```
Key: portfolio:{user_id}
Type: Hash
TTL: 5 minutes
Fields:
  - total_value: decimal
  - total_gain: decimal
  - assets: JSON string
```

### Rate Limiting
```
Key: ratelimit:{user_id}:{endpoint}
Type: String (counter)
TTL: 1 minute
Value: request count
```

### Real-time Subscriptions
```
Key: subscriptions:{symbol}
Type: Set
Members: list of user_ids subscribed to this symbol
```

### AI Analysis Cache
```
Key: ai:analysis:{symbol}
Type: Hash
TTL: 1 hour
Fields:
  - recommendation: string
  - confidence: decimal
  - analysis: JSON string
  - analyzed_at: timestamp
```

---

## MongoDB Collections

### System Logs
```javascript
{
  _id: ObjectId,
  timestamp: ISODate,
  level: "info" | "warn" | "error",
  service: "auth" | "market" | "portfolio" | "ai",
  message: String,
  metadata: Object,
  userId: UUID,
  requestId: UUID,
  stackTrace: String  // for errors
}

// Indexes
db.logs.createIndex({ timestamp: -1 })
db.logs.createIndex({ service: 1, timestamp: -1 })
db.logs.createIndex({ level: 1, timestamp: -1 })
db.logs.createIndex({ userId: 1, timestamp: -1 })
```

### Analytics Events
```javascript
{
  _id: ObjectId,
  eventType: String,
  userId: UUID,
  sessionId: UUID,
  timestamp: ISODate,
  properties: {
    page: String,
    action: String,
    symbol: String,
    // ... custom properties
  },
  context: {
    userAgent: String,
    ip: String,
    referrer: String,
    deviceType: String
  }
}

// Indexes
db.analytics.createIndex({ eventType: 1, timestamp: -1 })
db.analytics.createIndex({ userId: 1, timestamp: -1 })
```

### ML Model Results
```javascript
{
  _id: ObjectId,
  modelName: String,
  modelVersion: String,
  symbol: String,
  timestamp: ISODate,
  prediction: {
    targetPrice: Number,
    confidence: Number,
    horizon: String,
    range: { low: Number, high: Number }
  },
  features: Object,
  accuracy: Number
}

// Indexes
db.ml_results.createIndex({ symbol: 1, timestamp: -1 })
db.ml_results.createIndex({ modelName: 1, modelVersion: 1 })
```

---

## Database Relationships

```
users (1) ──── (N) portfolios
         │
         └──── (N) watchlists
         │
         └──── (N) sessions
         │
         └──── (N) price_alerts
         │
         └──── (N) ai_insights

portfolios (1) ──── (N) portfolio_assets
           │
           └──── (N) transactions
           │
           └──── (N) portfolio_snapshots

watchlists (1) ──── (N) watchlist_items
```

---

## Data Retention Policies

### PostgreSQL
- User accounts: Indefinite (until user deletion)
- Transactions: 7 years (regulatory compliance)
- User activity logs: 90 days
- AI insights: 30 days (expired insights deleted)

### TimescaleDB
- Intraday prices (1-min): 30 days → compress & downsample
- Daily prices: Indefinite
- Portfolio snapshots: 1 year → compress

**Compression Policy** (TimescaleDB):
```sql
SELECT add_compression_policy('intraday_prices', INTERVAL '7 days');
SELECT add_retention_policy('intraday_prices', INTERVAL '30 days');
```

### MongoDB
- System logs: 30 days (automatically deleted)
- Analytics events: 90 days
- ML results: 180 days

### Redis
- Session data: 30 days (auto-expire)
- Cache data: 1-60 minutes (auto-expire)
- Rate limit counters: 1 minute (auto-expire)

---

## Database Performance Optimization

### Partitioning Strategy
```sql
-- Partition transactions by year
CREATE TABLE transactions_2025 PARTITION OF transactions
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Partition user_activity_log by month
CREATE TABLE user_activity_log_202510 PARTITION OF user_activity_log
  FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');
```

### Materialized Views
```sql
-- Portfolio summary for quick access
CREATE MATERIALIZED VIEW portfolio_summary AS
SELECT
  p.id,
  p.user_id,
  COUNT(pa.id) AS asset_count,
  SUM(pa.current_value) AS total_value,
  SUM(pa.unrealized_gain) AS total_gain
FROM portfolios p
LEFT JOIN portfolio_assets pa ON p.id = pa.portfolio_id
GROUP BY p.id, p.user_id;

CREATE UNIQUE INDEX idx_portfolio_summary_id ON portfolio_summary(id);

-- Refresh strategy
REFRESH MATERIALIZED VIEW CONCURRENTLY portfolio_summary;
```

### Query Optimization
- Use prepared statements
- Implement connection pooling (pg-pool, redis connection pool)
- Index foreign keys
- Analyze slow queries with EXPLAIN ANALYZE
- Use partial indexes for filtered queries
- Implement query result caching in Redis

---

## Backup Strategy

### PostgreSQL
- Full backup: Daily at 2 AM UTC
- Incremental backup: Every 6 hours
- Point-in-time recovery (PITR): WAL archiving
- Retention: 30 days

### TimescaleDB
- Full backup: Weekly
- Continuous archiving
- Retention: 90 days

### Redis
- RDB snapshots: Every hour
- AOF (Append-Only File): Enabled
- Retention: 7 days

### MongoDB
- Full backup: Daily
- Oplog backup: Continuous
- Retention: 30 days
