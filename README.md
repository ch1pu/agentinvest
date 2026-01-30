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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Adolfo Lopez

---

## ⚠️ Disclaimers

### Portfolio Project Notice

This is a portfolio demonstration project developed to showcase full-stack development skills, AI integration, microservices architecture, and financial data handling. It is **NOT intended for production use or actual investment decisions.**

**Use at your own risk.** While functional, this project prioritizes demonstrating development capabilities over production-ready robustness.

### Financial & Investment Disclaimer

**IMPORTANT: This application is for educational and demonstration purposes only.**

- **NOT FINANCIAL ADVICE:** This software does not provide financial, investment, tax, or legal advice
- **NO WARRANTIES:** No guarantees on accuracy of calculations, predictions, or data
- **NOT FOR ACTUAL INVESTING:** Do not make real investment decisions based on this tool
- **CONSULT PROFESSIONALS:** Always consult qualified financial advisors for investment decisions
- **DEMONSTRATION ONLY:** Features demonstrate technical capabilities, not investment strategies
- **NO RECOMMENDATIONS:** Stock suggestions are algorithmic demonstrations, not professional recommendations
- **RISK WARNING:** Investing involves risk, including potential loss of principal
- **PAST PERFORMANCE:** Historical data does not guarantee future results

The developer assumes no liability for any financial losses or decisions made using this software.

### AI/Machine Learning Disclaimer

AI-generated analysis, predictions, and recommendations in this project are experimental and may be inaccurate, biased, or misleading. AI models have limitations and should not be relied upon for financial decisions.

**AI Limitations:**
- Predictions may be wrong or outdated
- Training data may contain biases
- Models cannot predict market changes or black swan events
- Not a substitute for professional financial analysis
- Results are for technical demonstration only
- No warranty on AI model accuracy or reliability

### Privacy & Data Handling

**Portfolio Demonstration Notice:**
- This project uses mock/sample data for demonstration
- Not designed for production use with real financial data
- No encryption or security guarantees for sensitive information
- Not compliant with financial regulations (GDPR, SOC 2, PCI-DSS, etc.)
- Data may be stored locally - review code before entering real information
- No guarantees of data security or privacy
- Developer not responsible for data breaches or loss

**If you run this locally:**
- Review code before entering real personal information
- API keys and credentials are your responsibility
- No data transmitted to external servers by default (except API calls)
- Database stored locally on your machine

### Third-Party APIs

This project may integrate with external APIs for demonstration:
- **OpenAI API** - AI analysis features (requires your own API key)
- **Anthropic API** - Alternative AI provider (requires your own API key)
- **Polygon.io** - Market data provider (requires your own API key)
- **Alpha Vantage** - Financial data provider (requires your own API key)
- **News API** - News articles (requires your own API key)

**Important:**
- API keys NOT included - you must provide your own
- Rate limits and costs apply per provider terms
- Data accuracy depends on third-party services
- No guarantees on API availability or accuracy
- Review each API provider's terms of service before use
- Developer not responsible for API costs or issues
- API usage may incur charges from providers

---

## 📚 Third-Party Libraries

This project uses the following open-source libraries:

**Frontend:**
- [React](https://reactjs.org/) 18.x - MIT License
- [TypeScript](https://www.typescriptlang.org/) - Apache 2.0 License
- [Tailwind CSS](https://tailwindcss.com/) - MIT License
- [Framer Motion](https://www.framer.com/motion/) - MIT License
- [Recharts](https://recharts.org/) - MIT License
- [Vite](https://vitejs.dev/) - MIT License
- [React Router](https://reactrouter.com/) v7 - MIT License

**Backend - Microservices:**
- [Node.js](https://nodejs.org/) 20.x - MIT License
- [Express](https://expressjs.com/) - MIT License
- [Python](https://www.python.org/) 3.11 - PSF License
- [FastAPI](https://fastapi.tiangolo.com/) - MIT License

**AI/ML:**
- [OpenAI Python Client](https://github.com/openai/openai-python) - MIT License

**Databases:**
- [PostgreSQL](https://www.postgresql.org/) 15 - PostgreSQL License
- [TimescaleDB](https://www.timescale.com/) - Apache 2.0 License (Timescale License for enterprise features)
- [Redis](https://redis.io/) 7 - BSD License
- [MongoDB](https://www.mongodb.com/) 7 - Server Side Public License (SSPL)

**Infrastructure:**
- [Docker](https://www.docker.com/) - Apache 2.0 License
- [Docker Compose](https://docs.docker.com/compose/) - Apache 2.0 License

Full dependency list available in `package.json`, `requirements.txt`, and `docker-compose.yml`.

### License Compatibility Note

All dependencies are compatible with the MIT License under which this project is released.

---

## 🤝 Contributing

This is a portfolio project, but suggestions and feedback are welcome! Feel free to:
- Open issues for bugs or suggestions
- Submit pull requests for improvements
- Fork for your own modifications

By contributing, you agree that your contributions will be licensed under the MIT License.

## 👨‍💻 Contact

**Adolfo Lopez**
- GitHub: [@ch1pu](https://github.com/ch1pu)
- Twitter: [@2006_adolfo](https://twitter.com/2006_adolfo)

---

**Built as part of my software development portfolio to demonstrate:**
- Microservices architecture (Node.js + Python)
- AI/ML integration (OpenAI API)
- Multi-database strategy (PostgreSQL, TimescaleDB, MongoDB, Redis)
- Real-time financial data handling
- Full-stack development (React + TypeScript)
- Modern UI/UX with Tailwind CSS and Framer Motion
- RESTful and WebSocket API design
- Docker multi-container orchestration

*This project is not affiliated with any financial institution, investment firm, or AI company.*

---

**Portfolio project for developers and data enthusiasts**
