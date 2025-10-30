# API Gateway

The API Gateway serves as the single entry point for all client requests to the AgentInvest platform. It handles routing, authentication, rate limiting, and proxying requests to appropriate microservices.

## Features

- 🔐 JWT-based authentication
- 🚦 Rate limiting
- 🛡️ Security headers (Helmet)
- 🔄 Request proxying to microservices
- 📊 Request logging
- 🌐 CORS configuration
- ❤️ Health check endpoints

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment | development |
| API_VERSION | API version | v1 |
| JWT_SECRET | JWT secret key | - |
| REDIS_HOST | Redis hostname | localhost |
| REDIS_PORT | Redis port | 6379 |
| AUTH_SERVICE_URL | Auth service URL | http://localhost:3001 |
| MARKET_SERVICE_URL | Market service URL | http://localhost:3002 |
| PORTFOLIO_SERVICE_URL | Portfolio service URL | http://localhost:3003 |
| AI_SERVICE_URL | AI service URL | http://localhost:3004 |
| TRADING_SERVICE_URL | Trading service URL | http://localhost:3005 |
| CORS_ORIGIN | Allowed origins | http://localhost:5173 |
| RATE_LIMIT_WINDOW_MS | Rate limit window | 60000 |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100 |

## API Routes

### Health Check

```
GET /health
GET /api/health
```

### Authentication (Public)

```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

### Market Data (Public)

```
GET /api/v1/market/stocks/:symbol
GET /api/v1/market/stocks/:symbol/history
GET /api/v1/market/search
```

### Portfolio (Protected)

```
GET /api/v1/portfolio
POST /api/v1/portfolio/assets
PUT /api/v1/portfolio/assets/:symbol
DELETE /api/v1/portfolio/assets/:symbol
```

### AI/ML (Protected)

```
POST /api/v1/ai/analyze/:symbol
POST /api/v1/ai/predict/:symbol
POST /api/v1/ai/chat
```

### Trading (Protected)

```
POST /api/v1/trading/orders
GET /api/v1/trading/orders
GET /api/v1/trading/orders/:id
DELETE /api/v1/trading/orders/:id
```

## Authentication

Protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Rate Limiting

Default rate limit: 100 requests per minute per IP address.

Rate limit headers:
- `RateLimit-Limit`: Maximum requests per window
- `RateLimit-Remaining`: Remaining requests
- `RateLimit-Reset`: Time when the limit resets

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "timestamp": "2025-10-02T20:00:00.000Z",
  "path": "/api/v1/endpoint"
}
```

Common HTTP status codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error
- 503: Service Unavailable

## Logging

Logs are written to:
- `logs/combined.log`: All logs
- `logs/error.log`: Error logs only
- Console: Development environment

Log format: JSON with timestamp, level, message, and service name.

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

## Architecture

```
Client
  ↓
API Gateway (Port 3000)
  ↓
  ├── Auth Service (Port 3001)
  ├── Market Service (Port 3002)
  ├── Portfolio Service (Port 3003)
  ├── AI Service (Port 3004)
  └── Trading Service (Port 3005)
```

## Middleware Stack

1. Helmet (Security headers)
2. CORS
3. Body parsing (JSON, URL-encoded)
4. Morgan (Request logging)
5. Rate limiting
6. JWT authentication (protected routes)
7. Service proxying
8. Error handling

## Security

- Helmet.js for security headers
- CORS whitelisting
- JWT token validation
- Rate limiting per IP
- Request validation
- Error message sanitization

## Deployment

### Docker

```bash
docker build -t agentinvest-api-gateway .
docker run -p 3000:3000 --env-file .env agentinvest-api-gateway
```

### Kubernetes

See `k8s/` directory for Kubernetes manifests.

## Troubleshooting

### Service Unavailable (503)

If you get 503 errors, check that microservices are running:

```bash
# Check service URLs in .env
# Verify services are accessible:
curl http://localhost:3001/health  # Auth service
curl http://localhost:3002/health  # Market service
# etc...
```

### Authentication Errors

- Verify JWT_SECRET is set in .env
- Check token expiration
- Ensure Authorization header format: `Bearer <token>`

### Rate Limit Exceeded

Wait for the rate limit window to reset or increase limits in .env:

```env
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=200
```

## License

MIT
