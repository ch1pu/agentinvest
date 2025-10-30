# AgentInvest - AI-Powered Investment Platform

A comprehensive AI-driven investment platform with real-time market data, ML-powered predictions, portfolio management, and advanced analytics.

## 🎯 Overview

AgentInvest combines cutting-edge AI technology with modern financial data infrastructure to provide:

- **Personalized Stock Recommendations**: ML models analyze market trends for short, medium, and long-term strategies
- **Real-Time Market Data**: Live stock quotes, charts, and market indicators
- **Portfolio Management**: Track investments, performance, and get AI-powered optimization suggestions
- **Sentiment Analysis**: News aggregation and sentiment scoring for informed decisions
- **AI Chat Assistant**: Natural language interface for market insights and portfolio queries

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript - Type-safe component architecture
- **Vite** - Lightning-fast build tool and HMR
- **Tailwind CSS** - AI-themed design system (black + neon green/cyan/blue/purple)
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Interactive stock charts and data visualization
- **React Router v7** - Client-side routing

### Backend (Microservices)
- **API Gateway** (Node.js + Express) - Request routing and authentication
- **Auth Service** (Node.js) - JWT-based authentication and user management
- **Market Data Service** (Node.js) - Stock data aggregation (Polygon, Alpha Vantage)
- **Portfolio Service** (Node.js) - Portfolio tracking and calculations
- **AI/ML Service** (Python + FastAPI) - TensorFlow/PyTorch models for predictions
- **Trading Service** (Node.js) - Order management and broker integration

### Databases
- **PostgreSQL** - Primary relational database (users, portfolios, transactions)
- **TimescaleDB** - Time-series data for market prices and performance history
- **Redis** - High-speed caching and session management
- **MongoDB** - Logs, analytics, ML results, and news articles

### Infrastructure
- **Docker** - Containerized database services
- **Docker Compose** - Local development orchestration
- **Kubernetes** (Production) - Container orchestration and scaling

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/agentinvest.git
cd agentinvest
```

### 2. Start Databases

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your API keys and passwords
nano .env

# Start all database containers
docker compose --profile dev up -d

# Verify containers are running
docker compose ps
```

### 3. Start Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### 4. API Keys Required

Get free API keys from:
- [Polygon.io](https://polygon.io/) - Stock market data
- [Alpha Vantage](https://www.alphavantage.co/) - Financial data
- [News API](https://newsapi.org/) - News articles
- [OpenAI](https://openai.com/) or [Anthropic](https://anthropic.com/) - AI chat

## 📁 Project Structure

```
AgentInvest/
├── src/                          # Frontend source code
│   ├── components/              # React components
│   ├── pages/                   # Page components
│   ├── context/                 # React Context providers
│   ├── services/                # API and mock data services
│   ├── types/                   # TypeScript type definitions
│   └── App.tsx                  # Main app component
├── docker/                      # Docker configuration
│   └── init-scripts/            # Database initialization scripts
│       ├── postgres/            # PostgreSQL schema
│       ├── timescaledb/         # TimescaleDB hypertables
│       └── mongodb/             # MongoDB collections
├── docs/                        # Documentation
│   ├── BACKEND_ARCHITECTURE.md  # Backend system design
│   ├── API_SPECIFICATION.md     # API documentation
│   ├── DATABASE_SCHEMA.md       # Database schemas
│   └── DOCKER_SETUP.md          # Docker setup guide
├── docker-compose.yml           # Docker services configuration
├── .env.example                 # Environment variables template
└── README.md                    # This file
```

## 🎨 Features

### Current (MVP)
- ✨ AI-themed UI with neon color palette
- 📊 Interactive stock charts with multiple timeframes
- 🤖 AI-powered stock recommendations
- 💼 Portfolio tracking and performance metrics
- 📈 Market sentiment analysis
- 🔍 Stock search and filtering
- 💬 AI chatbot assistant
- 📱 Fully responsive design
- 🎯 Watchlist management
- ⚡ Real-time price updates (mock data)

### Planned (Future Releases)
- 🔐 User authentication and authorization
- 📡 WebSocket integration for live market data
- 🧠 Advanced ML models (LSTM, transformers)
- 📰 News sentiment analysis
- 🎯 Price alerts and notifications
- 📊 Advanced portfolio analytics
- 🔄 Portfolio rebalancing suggestions
- 📈 Backtesting strategies
- 🌐 Multi-currency support
- 📱 Mobile app (React Native)

## 🛠️ Development

### Frontend Commands

```bash
# Install dependencies
npm install

# Start dev server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Database Commands

```bash
# Start all databases
docker compose up -d

# Start with admin tools (pgAdmin, Redis Commander, Mongo Express)
docker compose --profile dev up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f

# Connect to databases
docker exec -it agentinvest-postgres psql -U agentinvest -d agentinvest
docker exec -it agentinvest-redis redis-cli -a your_password
docker exec -it agentinvest-mongodb mongosh -u agentinvest -p your_password
```

### Admin Interfaces (Dev Mode)

- **pgAdmin**: http://localhost:5050 - PostgreSQL/TimescaleDB management
- **Redis Commander**: http://localhost:8081 - Redis data viewer
- **Mongo Express**: http://localhost:8082 - MongoDB collections browser

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[Development Progress](./docs/DEVELOPMENT_PROGRESS.md)** - Current development status, completed features, next steps, and project timeline
- **[Backend Architecture](./docs/BACKEND_ARCHITECTURE.md)** - Complete system design with microservices architecture, technology stack, data flow, and scalability strategies
- **[API Specification](./docs/API_SPECIFICATION.md)** - Full REST API documentation with 30+ endpoints covering authentication, market data, portfolio, AI/ML, and trading
- **[Database Schema](./docs/DATABASE_SCHEMA.md)** - Multi-database schema design for PostgreSQL, TimescaleDB, Redis, and MongoDB with detailed table structures and relationships
- **[Docker Setup](./docs/DOCKER_SETUP.md)** - Complete guide for setting up and managing Docker containers including troubleshooting and production considerations

## 🔐 Security

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt (10 rounds)
- Rate limiting on API endpoints
- SQL injection protection via parameterized queries
- XSS protection with input sanitization
- CORS configuration for allowed origins
- Secrets management via environment variables

## 📊 Database Schema Highlights

### PostgreSQL Tables
- `users` - User accounts and authentication
- `portfolios` - User investment portfolios
- `portfolio_assets` - Individual stock holdings
- `transactions` - Buy/sell transaction history
- `watchlists` - Custom stock watchlists
- `price_alerts` - Price notification settings

### TimescaleDB Hypertables
- `stock_prices` - Daily OHLCV data with 90-day compression
- `intraday_prices` - 1-minute bars with 7-day compression
- `portfolio_snapshots` - Performance tracking over time
- `market_indices` - Major market index tracking

### Redis Caching
- Stock quotes (5-minute TTL)
- User sessions (30-day TTL)
- Rate limiting counters
- WebSocket connections

### MongoDB Collections
- `logs` - System logs (30-day TTL)
- `analytics` - User events (90-day TTL)
- `ml_results` - AI predictions (180-day TTL)
- `news_articles` - News with sentiment (60-day TTL)

## 🔄 API Endpoints (Summary)

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token

### Market Data
- `GET /api/v1/market/stocks/:symbol` - Get stock details
- `GET /api/v1/market/stocks/:symbol/history` - Historical prices
- `GET /api/v1/market/search` - Search stocks
- `WS /api/v1/market/realtime/:symbols` - Live price updates

### Portfolio
- `GET /api/v1/portfolio` - Get user portfolio
- `POST /api/v1/portfolio/assets` - Add stock to portfolio
- `PUT /api/v1/portfolio/assets/:symbol` - Update holdings
- `DELETE /api/v1/portfolio/assets/:symbol` - Remove stock

### AI/ML
- `POST /api/v1/ai/analyze/:symbol` - AI stock analysis
- `POST /api/v1/ai/predict/:symbol` - Price predictions
- `POST /api/v1/ai/chat` - AI assistant chat
- `POST /api/v1/ai/portfolio-optimize` - Portfolio optimization

See [API_SPECIFICATION.md](./docs/API_SPECIFICATION.md) for complete documentation.

## 🚢 Deployment

### Development
```bash
# Start frontend
npm run dev

# Start databases
docker compose --profile dev up -d
```

### Production
```bash
# Build frontend
npm run build

# Serve with production server (nginx/caddy)
# Backend services run in Kubernetes/Docker Swarm
# Databases use managed services or HA configurations
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

**Required**:
- Database credentials (PostgreSQL, TimescaleDB, Redis, MongoDB)
- JWT secrets (minimum 32 characters)
- External API keys (Polygon, Alpha Vantage, OpenAI/Anthropic)

**Optional**:
- SMTP configuration for email notifications
- AWS S3 for file storage
- Sentry DSN for error tracking

## 🧪 Testing

```bash
# Run unit tests (coming soon)
npm run test

# Run E2E tests (coming soon)
npm run test:e2e

# Run type checking
npm run type-check
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Market data provided by Polygon.io and Alpha Vantage
- AI models powered by OpenAI and Anthropic
- Icons and design inspiration from the cyberpunk aesthetic
- Built with modern web technologies and best practices

## ⚠️ Disclaimer

**This is an educational project and not financial advice.**

- AgentInvest provides recommendations for informational purposes only
- Always conduct your own research before making investment decisions
- Past performance does not guarantee future results
- Investing involves risk, including potential loss of principal
- Consult with a licensed financial advisor for personalized advice

---

Built with ❤️ and AI by the AgentInvest team
