# Docker Setup Guide

This guide covers how to set up and manage the AgentInvest database infrastructure using Docker.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Database Services](#database-services)
4. [Admin Interfaces](#admin-interfaces)
5. [Environment Configuration](#environment-configuration)
6. [Container Management](#container-management)
7. [Database Connections](#database-connections)
8. [Troubleshooting](#troubleshooting)
9. [Data Persistence](#data-persistence)
10. [Production Considerations](#production-considerations)

---

## Prerequisites

Before starting, ensure you have the following installed:

- **Docker**: Version 20.10 or higher
  - Install from [docker.com](https://www.docker.com/get-started)
- **Docker Compose**: Version 2.0 or higher
  - Included with Docker Desktop on Windows/Mac
  - Linux users: `sudo apt install docker-compose-plugin`

Verify installation:

```bash
docker --version
docker compose version
```

## Quick Start

### 1. Clone the Repository

```bash
cd /path/to/AgentInvest
```

### 2. Configure Environment Variables

Copy the example environment file and update with your credentials:

```bash
cp .env.example .env
```

**Important**: Open `.env` and change all default passwords:

```env
POSTGRES_PASSWORD=your_secure_password_here
TIMESCALE_PASSWORD=your_secure_password_here
REDIS_PASSWORD=your_secure_password_here
MONGO_PASSWORD=your_secure_password_here
```

### 3. Start All Databases

Start the core database services:

```bash
docker compose up -d
```

Start with development admin tools:

```bash
docker compose --profile dev up -d
```

### 4. Verify Services

Check that all containers are running:

```bash
docker compose ps
```

Expected output:

```
NAME                          STATUS    PORTS
agentinvest-postgres          Up        0.0.0.0:5432->5432/tcp
agentinvest-timescaledb       Up        0.0.0.0:5433->5432/tcp
agentinvest-redis             Up        0.0.0.0:6379->6379/tcp
agentinvest-mongodb           Up        0.0.0.0:27017->27017/tcp
```

### 5. Check Logs

View logs for all services:

```bash
docker compose logs -f
```

View logs for a specific service:

```bash
docker compose logs -f postgres
```

---

## Database Services

### PostgreSQL (Primary Database)

**Purpose**: Main relational database for user data, portfolios, transactions

**Port**: 5432
**Database**: `agentinvest`
**User**: Set in `POSTGRES_USER` env var
**Password**: Set in `POSTGRES_PASSWORD` env var

**Connection String**:
```
postgresql://agentinvest:your_password@localhost:5432/agentinvest
```

**Initialization**: Runs scripts from `docker/init-scripts/postgres/` on first startup

**Schema Includes**:
- Users and authentication
- Portfolios and assets
- Transactions
- Watchlists
- Price alerts
- AI insights

### TimescaleDB (Time-Series Database)

**Purpose**: High-performance storage for time-series market data

**Port**: 5433
**Database**: `agentinvest_timeseries`
**User**: Set in `TIMESCALE_USER` env var
**Password**: Set in `TIMESCALE_PASSWORD` env var

**Connection String**:
```
postgresql://agentinvest:your_password@localhost:5433/agentinvest_timeseries
```

**Initialization**: Runs scripts from `docker/init-scripts/timescaledb/` on first startup

**Hypertables**:
- `stock_prices` - Daily OHLCV data
- `intraday_prices` - 1-minute bars
- `portfolio_snapshots` - Portfolio performance history
- `market_indices` - Market index tracking

**Features**:
- Automatic data compression (7-30 days)
- Data retention policies
- Continuous aggregates for 5-minute bars

### Redis (Cache & Session Store)

**Purpose**: High-speed caching and session management

**Port**: 6379
**Password**: Set in `REDIS_PASSWORD` env var

**Connection String**:
```
redis://:your_password@localhost:6379
```

**Configuration**:
- Max memory: 512MB
- Eviction policy: `allkeys-lru`
- Persistence: RDB snapshots to `/data`

**Use Cases**:
- Session storage
- Market data caching
- API rate limiting
- Real-time stock quotes
- User preferences

### MongoDB (Logs & Analytics)

**Purpose**: Flexible schema storage for logs, analytics, and ML results

**Port**: 27017
**Database**: `agentinvest_logs`
**User**: Set in `MONGO_USER` env var
**Password**: Set in `MONGO_PASSWORD` env var

**Connection String**:
```
mongodb://agentinvest:your_password@localhost:27017/agentinvest_logs
```

**Initialization**: Runs scripts from `docker/init-scripts/mongodb/` on first startup

**Collections**:
- `logs` - System logs (30-day TTL)
- `analytics` - User analytics events (90-day TTL)
- `ml_results` - ML model predictions (180-day TTL)
- `news_articles` - News data (60-day TTL)
- `api_requests` - API request logs (30-day TTL)

**Features**:
- Automatic TTL-based data deletion
- Full-text search on news articles
- JSON schema validation

---

## Admin Interfaces

Admin interfaces are optional development tools. Start them with:

```bash
docker compose --profile dev up -d
```

### pgAdmin (PostgreSQL/TimescaleDB UI)

**URL**: http://localhost:5050
**Email**: Set in `PGADMIN_EMAIL` env var (default: `admin@agentinvest.local`)
**Password**: Set in `PGADMIN_PASSWORD` env var (default: `admin`)

**First-time Setup**:
1. Open http://localhost:5050
2. Login with credentials from `.env`
3. Right-click "Servers" → "Register" → "Server"
4. **PostgreSQL Connection**:
   - Name: AgentInvest PostgreSQL
   - Host: postgres
   - Port: 5432
   - Database: agentinvest
   - Username/Password: From `.env`
5. **TimescaleDB Connection**:
   - Name: AgentInvest TimescaleDB
   - Host: timescaledb
   - Port: 5432
   - Database: agentinvest_timeseries
   - Username/Password: From `.env`

### Redis Commander (Redis UI)

**URL**: http://localhost:8081
**Authentication**: None required in dev mode

**Features**:
- View all keys and values
- Execute Redis commands
- Monitor real-time statistics
- Export/import data

### Mongo Express (MongoDB UI)

**URL**: http://localhost:8082
**Username**: Set in `MONGO_EXPRESS_USER` env var (default: `admin`)
**Password**: Set in `MONGO_EXPRESS_PASSWORD` env var (default: `admin`)

**Features**:
- Browse collections and documents
- Execute queries
- View indexes
- Import/export data

---

## Environment Configuration

### Required Variables

Edit `.env` and set these required variables:

```env
# Database Passwords (CHANGE THESE!)
POSTGRES_PASSWORD=your_secure_password_here
TIMESCALE_PASSWORD=your_secure_password_here
REDIS_PASSWORD=your_secure_password_here
MONGO_PASSWORD=your_secure_password_here

# JWT Secrets (Generate secure random strings)
JWT_SECRET=your_jwt_secret_key_min_32_chars_long
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_min_32_chars

# External API Keys (Get from providers)
POLYGON_API_KEY=your_polygon_api_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Optional Variables

These have sensible defaults but can be customized:

```env
# Database Users
POSTGRES_USER=agentinvest
TIMESCALE_USER=agentinvest
MONGO_USER=agentinvest

# Application Settings
NODE_ENV=development
PORT=3000
LOG_LEVEL=info

# Admin Tool Credentials
PGADMIN_EMAIL=admin@agentinvest.local
PGADMIN_PASSWORD=admin
MONGO_EXPRESS_USER=admin
MONGO_EXPRESS_PASSWORD=admin
```

### Generating Secure Secrets

Generate random secure strings for JWT secrets:

```bash
# Linux/Mac
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Container Management

### Start Services

Start all core databases:
```bash
docker compose up -d
```

Start with admin tools:
```bash
docker compose --profile dev up -d
```

Start specific service:
```bash
docker compose up -d postgres
```

### Stop Services

Stop all services:
```bash
docker compose down
```

Stop and remove volumes (⚠️ deletes all data):
```bash
docker compose down -v
```

Stop specific service:
```bash
docker compose stop postgres
```

### Restart Services

Restart all services:
```bash
docker compose restart
```

Restart specific service:
```bash
docker compose restart postgres
```

### View Logs

Follow logs for all services:
```bash
docker compose logs -f
```

View logs for specific service:
```bash
docker compose logs -f postgres
```

View last 100 lines:
```bash
docker compose logs --tail 100 postgres
```

### Check Status

View running containers:
```bash
docker compose ps
```

View detailed container info:
```bash
docker inspect agentinvest-postgres
```

### Execute Commands in Containers

#### PostgreSQL
```bash
docker exec -it agentinvest-postgres psql -U agentinvest -d agentinvest
```

#### TimescaleDB
```bash
docker exec -it agentinvest-timescaledb psql -U agentinvest -d agentinvest_timeseries
```

#### Redis
```bash
docker exec -it agentinvest-redis redis-cli -a your_password
```

#### MongoDB
```bash
docker exec -it agentinvest-mongodb mongosh -u agentinvest -p your_password
```

---

## Database Connections

### From Backend Services (Node.js)

When backend services run in Docker, use service names as hostnames:

```javascript
// PostgreSQL
const pgConfig = {
  host: 'postgres',  // Service name in docker-compose.yml
  port: 5432,
  database: 'agentinvest',
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
}

// TimescaleDB
const tsConfig = {
  host: 'timescaledb',
  port: 5432,  // Internal port, not 5433
  database: 'agentinvest_timeseries',
  user: process.env.TIMESCALE_USER,
  password: process.env.TIMESCALE_PASSWORD,
}

// Redis
const redisUrl = `redis://:${process.env.REDIS_PASSWORD}@redis:6379`

// MongoDB
const mongoUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@mongodb:27017/agentinvest_logs`
```

### From Local Development (localhost)

When connecting from your local machine (outside Docker):

```javascript
// PostgreSQL
const pgConfig = {
  host: 'localhost',
  port: 5432,
  database: 'agentinvest',
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
}

// TimescaleDB
const tsConfig = {
  host: 'localhost',
  port: 5433,  // Mapped port
  database: 'agentinvest_timeseries',
  user: process.env.TIMESCALE_USER,
  password: process.env.TIMESCALE_PASSWORD,
}

// Redis
const redisUrl = `redis://:${process.env.REDIS_PASSWORD}@localhost:6379`

// MongoDB
const mongoUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@localhost:27017/agentinvest_logs`
```

---

## Troubleshooting

### Container Won't Start

**Check logs**:
```bash
docker compose logs postgres
```

**Common issues**:
- Port already in use → Change port mapping in `docker-compose.yml`
- Permission denied → Run with `sudo` or add user to docker group
- Invalid credentials → Check `.env` file

### Can't Connect to Database

**Verify container is running**:
```bash
docker compose ps
```

**Check health status**:
```bash
docker inspect agentinvest-postgres | grep -A 10 Health
```

**Test connection**:
```bash
# PostgreSQL
docker exec -it agentinvest-postgres pg_isready -U agentinvest

# Redis
docker exec -it agentinvest-redis redis-cli -a your_password ping

# MongoDB
docker exec -it agentinvest-mongodb mongosh --eval "db.adminCommand('ping')"
```

### Port Already in Use

Find what's using the port:
```bash
# Linux/Mac
sudo lsof -i :5432

# Windows
netstat -ano | findstr :5432
```

Kill the process or change port in `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Changed from 5432:5432
```

### Out of Memory

Increase Docker memory limit:
- Docker Desktop → Settings → Resources → Memory
- Minimum recommended: 4GB

Or reduce Redis max memory in `docker-compose.yml`:
```yaml
command: redis-server --requirepass ${REDIS_PASSWORD} --maxmemory 256mb --maxmemory-policy allkeys-lru
```

### Database Initialization Failed

**Remove volumes and restart**:
```bash
docker compose down -v
docker compose up -d
```

**Check init script syntax**:
```bash
# PostgreSQL
docker exec -i agentinvest-postgres psql -U agentinvest < docker/init-scripts/postgres/01-init-database.sql

# MongoDB
docker exec -i agentinvest-mongodb mongosh < docker/init-scripts/mongodb/01-init-collections.js
```

### Permission Denied on Volumes

**Linux users**: Fix volume permissions
```bash
sudo chown -R $USER:$USER .
```

Or run Docker commands with `sudo`:
```bash
sudo docker compose up -d
```

### Slow Performance

**Enable compression** (TimescaleDB):
```sql
SELECT add_compression_policy('stock_prices', INTERVAL '7 days');
```

**Clear old Redis data**:
```bash
docker exec -it agentinvest-redis redis-cli -a your_password FLUSHALL
```

**Optimize PostgreSQL**:
```sql
VACUUM ANALYZE;
REINDEX DATABASE agentinvest;
```

---

## Data Persistence

### Volume Locations

Docker volumes persist data even when containers are stopped:

- `postgres_data` - PostgreSQL data
- `timescaledb_data` - TimescaleDB data
- `redis_data` - Redis snapshots
- `mongodb_data` - MongoDB data
- `mongodb_config` - MongoDB config
- `pgadmin_data` - pgAdmin settings

### Backup Data

#### PostgreSQL Backup
```bash
docker exec agentinvest-postgres pg_dump -U agentinvest agentinvest > backup_postgres.sql
```

#### TimescaleDB Backup
```bash
docker exec agentinvest-timescaledb pg_dump -U agentinvest agentinvest_timeseries > backup_timescale.sql
```

#### MongoDB Backup
```bash
docker exec agentinvest-mongodb mongodump --username agentinvest --password your_password --out /backup
docker cp agentinvest-mongodb:/backup ./backup_mongodb
```

#### Redis Backup
```bash
docker exec agentinvest-redis redis-cli -a your_password SAVE
docker cp agentinvest-redis:/data/dump.rdb ./backup_redis.rdb
```

### Restore Data

#### PostgreSQL Restore
```bash
docker exec -i agentinvest-postgres psql -U agentinvest agentinvest < backup_postgres.sql
```

#### TimescaleDB Restore
```bash
docker exec -i agentinvest-timescaledb psql -U agentinvest agentinvest_timeseries < backup_timescale.sql
```

#### MongoDB Restore
```bash
docker cp ./backup_mongodb agentinvest-mongodb:/backup
docker exec agentinvest-mongodb mongorestore --username agentinvest --password your_password /backup
```

#### Redis Restore
```bash
docker compose stop redis
docker cp ./backup_redis.rdb agentinvest-redis:/data/dump.rdb
docker compose start redis
```

---

## Production Considerations

### Security

1. **Change Default Passwords**: Never use default passwords in production
2. **Use Secrets Management**: Use Docker secrets or environment variable encryption
3. **Network Isolation**: Create separate networks for frontend/backend/databases
4. **Firewall Rules**: Only expose necessary ports
5. **SSL/TLS**: Enable SSL for all database connections

### High Availability

1. **PostgreSQL Replication**:
   - Set up primary-replica configuration
   - Use tools like Patroni for automatic failover

2. **Redis Cluster**:
   - Use Redis Sentinel for HA
   - Configure master-slave replication

3. **MongoDB Replica Set**:
   - Deploy 3-node replica set
   - Enable automatic failover

### Monitoring

1. **Health Checks**: Already configured in `docker-compose.yml`
2. **Metrics**: Export metrics to Prometheus/Grafana
3. **Alerts**: Set up alerts for:
   - Container restarts
   - High memory usage
   - Slow queries
   - Connection pool exhaustion

### Scaling

1. **Horizontal Scaling**:
   - Use Docker Swarm or Kubernetes for orchestration
   - Scale read replicas for databases

2. **Vertical Scaling**:
   - Increase container resource limits
   - Use larger Docker host instances

### Backup Strategy

1. **Automated Backups**: Schedule daily backups with cron
2. **Retention Policy**: Keep 7 daily, 4 weekly, 12 monthly backups
3. **Off-site Storage**: Upload backups to S3 or cloud storage
4. **Test Restores**: Regularly test backup restoration process

### Example Production docker-compose.yml

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_DB: agentinvest
      POSTGRES_USER_FILE: /run/secrets/postgres_user
      POSTGRES_PASSWORD_FILE: /run/secrets/postgres_password
    secrets:
      - postgres_user
      - postgres_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - backend
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G

secrets:
  postgres_user:
    external: true
  postgres_password:
    external: true

networks:
  backend:
    driver: overlay
    internal: true
```

---

## Useful Commands Cheat Sheet

```bash
# Start all services
docker compose up -d

# Start with dev tools
docker compose --profile dev up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f

# Check status
docker compose ps

# Restart service
docker compose restart postgres

# Execute command in container
docker exec -it agentinvest-postgres bash

# Connect to PostgreSQL
docker exec -it agentinvest-postgres psql -U agentinvest -d agentinvest

# Connect to Redis
docker exec -it agentinvest-redis redis-cli -a password

# Connect to MongoDB
docker exec -it agentinvest-mongodb mongosh -u agentinvest -p password

# View container stats
docker stats

# Clean up everything (⚠️ DELETES ALL DATA)
docker compose down -v
docker system prune -a
```

---

## Next Steps

1. **Start the databases**: `docker compose --profile dev up -d`
2. **Verify connections**: Check admin interfaces
3. **Configure backend**: Update backend services with connection strings
4. **Run migrations**: Execute any additional schema migrations
5. **Load test data**: Populate databases with test data
6. **Monitor logs**: Watch for errors or warnings

For backend implementation, see [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md).

For API documentation, see [API_SPECIFICATION.md](./API_SPECIFICATION.md).

For database schemas, see [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md).
