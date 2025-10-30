# AgentInvest API Specification

## Base URL
- **Production**: `https://api.agentinvest.com/v1`
- **Staging**: `https://api-staging.agentinvest.com/v1`
- **Development**: `http://localhost:3000/v1`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2025-10-02T19:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Detailed error message",
    "field": "optional field name"
  },
  "timestamp": "2025-10-02T19:30:00Z"
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Invalid or missing authentication |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| INVALID_REQUEST | 400 | Validation error |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |
| SERVICE_UNAVAILABLE | 503 | Temporary service outage |

---

## Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "acceptedTerms": true
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2025-10-02T19:30:00Z"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 900
  }
}
```

### Login
```http
POST /auth/login
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response**: Same as Register

### Refresh Token
```http
POST /auth/refresh
```

**Request Body**:
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "expiresIn": 900
  }
}
```

### Logout
```http
POST /auth/logout
```

**Headers**: Requires Authentication

**Response**:
```json
{
  "success": true,
  "data": {
    "message": "Successfully logged out"
  }
}
```

---

## Market Data Endpoints

### Get Stock Quote
```http
GET /market/stocks/:symbol
```

**Parameters**:
- `symbol` (path): Stock ticker symbol (e.g., AAPL)

**Response**:
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 178.42,
    "change": 4.15,
    "changePercent": 2.38,
    "volume": 52847392,
    "marketCap": "2800000000000",
    "pe": 29.5,
    "eps": 6.05,
    "high": 179.25,
    "low": 176.80,
    "open": 177.10,
    "previousClose": 174.27,
    "week52High": 199.62,
    "week52Low": 164.08,
    "avgVolume": 58200000,
    "dividend": 0.96,
    "dividendYield": 0.54,
    "sector": "Technology",
    "industry": "Consumer Electronics",
    "lastUpdated": "2025-10-02T19:30:00Z"
  }
}
```

### Get Historical Data
```http
GET /market/stocks/:symbol/history
```

**Query Parameters**:
- `interval` (optional): `1d`, `1w`, `1m` (default: `1d`)
- `range` (optional): `1d`, `5d`, `1mo`, `3mo`, `6mo`, `1y`, `5y`, `max` (default: `1mo`)
- `includeExtendedHours` (optional): boolean (default: false)

**Response**:
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "interval": "1d",
    "range": "1mo",
    "prices": [
      {
        "date": "2025-09-02",
        "open": 175.50,
        "high": 176.80,
        "low": 174.20,
        "close": 176.40,
        "volume": 45000000,
        "adjustedClose": 176.40
      }
    ]
  }
}
```

### Search Stocks
```http
GET /market/stocks/search
```

**Query Parameters**:
- `q` (required): Search query (min 1 char)
- `limit` (optional): Max results (default: 10, max: 50)

**Response**:
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "symbol": "AAPL",
        "name": "Apple Inc.",
        "type": "stock",
        "exchange": "NASDAQ",
        "currency": "USD",
        "sector": "Technology"
      }
    ],
    "count": 1
  }
}
```

### Get Market News
```http
GET /market/stocks/:symbol/news
```

**Query Parameters**:
- `limit` (optional): Max articles (default: 10, max: 50)
- `from` (optional): Start date (ISO 8601)
- `to` (optional): End date (ISO 8601)

**Response**:
```json
{
  "success": true,
  "data": {
    "news": [
      {
        "id": "news_123",
        "title": "Apple Announces New Product Line",
        "summary": "Apple unveiled...",
        "source": "Reuters",
        "url": "https://...",
        "publishedAt": "2025-10-02T15:30:00Z",
        "sentiment": "positive",
        "sentimentScore": 0.85,
        "relatedSymbols": ["AAPL"]
      }
    ],
    "count": 1
  }
}
```

### Get Real-Time Updates (WebSocket)
```
ws://api.agentinvest.com/v1/market/realtime
```

**Subscribe Message**:
```json
{
  "action": "subscribe",
  "symbols": ["AAPL", "MSFT", "GOOGL"]
}
```

**Price Update Message**:
```json
{
  "type": "price_update",
  "symbol": "AAPL",
  "price": 178.42,
  "change": 4.15,
  "changePercent": 2.38,
  "volume": 52847392,
  "timestamp": "2025-10-02T19:30:00Z"
}
```

---

## Portfolio Endpoints

### Get Portfolio
```http
GET /portfolio
```

**Headers**: Requires Authentication

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "pf_abc123",
    "userId": "usr_abc123",
    "totalValue": 36449.25,
    "totalCost": 31500.00,
    "totalGain": 4949.25,
    "totalGainPercent": 15.71,
    "dayChange": 523.40,
    "dayChangePercent": 1.46,
    "assets": [
      {
        "symbol": "AAPL",
        "name": "Apple Inc.",
        "shares": 50,
        "avgPrice": 165.30,
        "currentPrice": 178.42,
        "totalValue": 8921.00,
        "totalCost": 8265.00,
        "gain": 656.00,
        "gainPercent": 7.94,
        "dayChange": 207.50,
        "dayChangePercent": 2.38,
        "allocation": 24.48
      }
    ],
    "lastUpdated": "2025-10-02T19:30:00Z"
  }
}
```

### Add Asset to Portfolio
```http
POST /portfolio/assets
```

**Headers**: Requires Authentication

**Request Body**:
```json
{
  "symbol": "AAPL",
  "shares": 10,
  "purchasePrice": 175.50,
  "purchaseDate": "2025-10-01",
  "notes": "Buying the dip"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "txn_abc123",
      "type": "buy",
      "symbol": "AAPL",
      "shares": 10,
      "price": 175.50,
      "totalCost": 1755.00,
      "date": "2025-10-01T09:30:00Z"
    }
  }
}
```

### Update Portfolio Asset
```http
PUT /portfolio/assets/:symbol
```

**Headers**: Requires Authentication

**Request Body**:
```json
{
  "shares": 60,
  "avgPrice": 170.25
}
```

### Remove Asset from Portfolio
```http
DELETE /portfolio/assets/:symbol
```

**Headers**: Requires Authentication

**Query Parameters**:
- `shares` (optional): Partial sell (default: all shares)
- `price` (optional): Sell price (default: current market price)

**Response**:
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "txn_xyz789",
      "type": "sell",
      "symbol": "AAPL",
      "shares": 10,
      "price": 178.42,
      "totalProceeds": 1784.20,
      "gain": 29.20,
      "gainPercent": 1.66,
      "date": "2025-10-02T19:30:00Z"
    }
  }
}
```

### Get Portfolio Performance
```http
GET /portfolio/performance
```

**Headers**: Requires Authentication

**Query Parameters**:
- `range` (optional): `1d`, `1w`, `1m`, `3m`, `6m`, `1y`, `all` (default: `1m`)

**Response**:
```json
{
  "success": true,
  "data": {
    "range": "1m",
    "startValue": 35000.00,
    "endValue": 36449.25,
    "gain": 1449.25,
    "gainPercent": 4.14,
    "dataPoints": [
      {
        "date": "2025-09-02",
        "value": 35000.00
      },
      {
        "date": "2025-10-02",
        "value": 36449.25
      }
    ]
  }
}
```

### Get Transaction History
```http
GET /portfolio/transactions
```

**Headers**: Requires Authentication

**Query Parameters**:
- `limit` (optional): Max transactions (default: 50)
- `offset` (optional): Pagination offset (default: 0)
- `type` (optional): Filter by `buy` or `sell`
- `symbol` (optional): Filter by symbol

**Response**:
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "txn_abc123",
        "type": "buy",
        "symbol": "AAPL",
        "shares": 10,
        "price": 175.50,
        "totalCost": 1755.00,
        "date": "2025-10-01T09:30:00Z",
        "notes": "Buying the dip"
      }
    ],
    "total": 45,
    "hasMore": false
  }
}
```

---

## AI/ML Endpoints

### Analyze Stock
```http
POST /ai/analyze/:symbol
```

**Headers**: Requires Authentication

**Request Body** (optional):
```json
{
  "timeframe": "1m",
  "includeNews": true,
  "includeTechnicals": true
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "analysis": {
      "recommendation": "buy",
      "confidence": 87,
      "targetPrice": 195.00,
      "upside": 9.31,
      "riskLevel": "medium",
      "timeHorizon": "3-6 months"
    },
    "technicals": {
      "trend": "bullish",
      "support": 165.00,
      "resistance": 185.00,
      "rsi": 62.5,
      "macd": "buy",
      "movingAverages": {
        "sma50": 172.30,
        "sma200": 168.50
      }
    },
    "fundamentals": {
      "score": 8.5,
      "valuation": "fair",
      "growth": "strong",
      "profitability": "excellent"
    },
    "sentiment": {
      "overall": "positive",
      "score": 0.72,
      "newsCount": 45,
      "socialMentions": 12500
    },
    "reasoning": [
      "Strong quarterly earnings beat expectations",
      "Technical indicators showing bullish momentum",
      "Positive analyst sentiment with price target upgrades"
    ],
    "analyzedAt": "2025-10-02T19:30:00Z"
  }
}
```

### Get AI Predictions
```http
POST /ai/predict/:symbol
```

**Headers**: Requires Authentication

**Request Body**:
```json
{
  "horizon": "7d",
  "confidence": 0.8
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "currentPrice": 178.42,
    "predictions": [
      {
        "date": "2025-10-03",
        "predictedPrice": 179.85,
        "confidence": 0.85,
        "range": {
          "low": 177.50,
          "high": 182.20
        }
      }
    ],
    "modelVersion": "v2.1.0",
    "accuracy": 0.82,
    "predictedAt": "2025-10-02T19:30:00Z"
  }
}
```

### Get AI Insights
```http
GET /ai/insights
```

**Headers**: Requires Authentication

**Query Parameters**:
- `limit` (optional): Max insights (default: 10)
- `type` (optional): Filter by type (`market`, `portfolio`, `stock`)

**Response**:
```json
{
  "success": true,
  "data": {
    "insights": [
      {
        "id": "ins_123",
        "type": "bullish",
        "title": "Strong Buy Signal for NVDA",
        "description": "AI analysis detects strong momentum...",
        "confidence": 87,
        "symbol": "NVDA",
        "actionable": true,
        "timestamp": "2025-10-02T18:00:00Z"
      }
    ]
  }
}
```

### Chat with AI Assistant
```http
POST /ai/chat
```

**Headers**: Requires Authentication

**Request Body**:
```json
{
  "message": "Should I buy more AAPL stock?",
  "context": {
    "includePortfolio": true,
    "symbols": ["AAPL"]
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "reply": "Based on your current portfolio allocation...",
    "suggestions": [
      {
        "action": "buy",
        "symbol": "AAPL",
        "shares": 5,
        "reasoning": "Technical analysis shows..."
      }
    ],
    "conversationId": "conv_abc123"
  }
}
```

### Optimize Portfolio
```http
POST /ai/portfolio-optimize
```

**Headers**: Requires Authentication

**Request Body**:
```json
{
  "objective": "maximize_returns",
  "riskTolerance": "moderate",
  "constraints": {
    "maxAllocationPerStock": 0.25,
    "minDiversification": 5
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "currentAllocation": [ ... ],
    "recommendedAllocation": [
      {
        "symbol": "AAPL",
        "currentShares": 50,
        "recommendedShares": 45,
        "action": "sell",
        "sharesToTrade": 5,
        "reasoning": "Reduce concentration risk"
      }
    ],
    "expectedReturn": 12.5,
    "expectedRisk": 15.2,
    "sharpeRatio": 0.82
  }
}
```

---

## Rate Limits

### Free Tier
- 100 requests per minute
- 10,000 requests per day
- 5 WebSocket connections

### Premium Tier
- 1,000 requests per minute
- 100,000 requests per day
- 50 WebSocket connections

### Headers
Response includes rate limit info:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1696269600
```

---

## Webhooks

### Available Events
- `portfolio.updated`
- `transaction.created`
- `price.alert`
- `ai.insight`
- `market.news`

### Webhook Payload
```json
{
  "id": "evt_abc123",
  "type": "portfolio.updated",
  "data": { ... },
  "timestamp": "2025-10-02T19:30:00Z",
  "userId": "usr_abc123"
}
```

### Signature Verification
All webhook requests include a signature header:
```
X-AgentInvest-Signature: sha256=...
```

Verify using HMAC-SHA256 with your webhook secret.
