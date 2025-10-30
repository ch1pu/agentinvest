# Authentication Service

JWT-based authentication and user management microservice for the AgentInvest platform.

## Features

- 🔐 User registration and login
- 🎫 JWT access and refresh tokens
- ✉️ Email verification
- 🔑 Password reset functionality
- 👤 User profile management
- 📱 Session management
- 🔒 Secure password hashing (bcrypt)
- 🗄️ PostgreSQL for user data
- ⚡ Redis for token storage

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
| PORT | Server port | 3001 |
| NODE_ENV | Environment | development |
| POSTGRES_HOST | PostgreSQL host | localhost |
| POSTGRES_PORT | PostgreSQL port | 5432 |
| POSTGRES_DB | Database name | agentinvest |
| POSTGRES_USER | Database user | agentinvest |
| POSTGRES_PASSWORD | Database password | - |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRES_IN | Access token expiry | 15m |
| JWT_REFRESH_SECRET | Refresh token secret | - |
| JWT_REFRESH_EXPIRES_IN | Refresh token expiry | 30d |
| REDIS_HOST | Redis host | localhost |
| REDIS_PORT | Redis port | 6379 |
| REDIS_PASSWORD | Redis password | - |
| BCRYPT_ROUNDS | Bcrypt hash rounds | 10 |
| SMTP_HOST | SMTP server | smtp.gmail.com |
| SMTP_PORT | SMTP port | 587 |
| SMTP_USER | SMTP username | - |
| SMTP_PASSWORD | SMTP password | - |
| EMAIL_FROM | From email address | noreply@agentinvest.com |

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "message": "User registered successfully. Please check your email to verify your account.",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "email_verified": false,
    "subscription_tier": "free"
  },
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { ... },
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**
```json
{
  "message": "Token refreshed successfully",
  "accessToken": "new_jwt_access_token",
  "refreshToken": "new_jwt_refresh_token"
}
```

#### Logout
```http
POST /api/auth/logout
Content-Type: application/json

{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**
```json
{
  "message": "Logout successful"
}
```

#### Verify Email
```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "email": "user@example.com",
  "token": "verification_token"
}
```

#### Request Password Reset
```http
POST /api/auth/request-password-reset
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com",
  "token": "reset_token",
  "newPassword": "NewSecurePass123!"
}
```

### User Management

All user endpoints require authentication (Bearer token in Authorization header).

#### Get Current User
```http
GET /api/users/me
Authorization: Bearer {access_token}
```

#### Update User Profile
```http
PUT /api/users/me
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "first_name": "Jane",
  "last_name": "Smith",
  "phone": "+1987654321",
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}
```

#### Delete Account
```http
DELETE /api/users/me
Authorization: Bearer {access_token}
```

#### Get Active Sessions
```http
GET /api/users/me/sessions
Authorization: Bearer {access_token}
```

#### Revoke Session
```http
DELETE /api/users/me/sessions/{sessionId}
Authorization: Bearer {access_token}
```

## Password Requirements

Passwords must:
- Be at least 8 characters long
- Contain at least one uppercase letter
- Contain at least one lowercase letter
- Contain at least one number
- Contain at least one special character (@$!%*?&)

## Token Flow

1. **Registration/Login**: User receives access token (15 min) and refresh token (30 days)
2. **Access Protected Resources**: Use access token in Authorization header
3. **Token Expiry**: When access token expires, use refresh token to get new tokens
4. **Logout**: Refresh token is invalidated

## Database Schema

### users Table
```sql
- id (UUID, PK)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- first_name (VARCHAR)
- last_name (VARCHAR)
- phone (VARCHAR)
- avatar_url (TEXT)
- email_verified (BOOLEAN)
- email_verification_token (VARCHAR)
- password_reset_token (VARCHAR)
- password_reset_expires (TIMESTAMP)
- last_login (TIMESTAMP)
- subscription_tier (VARCHAR)
- subscription_expires (TIMESTAMP)
- preferences (JSONB)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- deleted_at (TIMESTAMP)
```

### sessions Table
```sql
- id (UUID, PK)
- user_id (UUID, FK -> users)
- refresh_token (VARCHAR)
- device_info (JSONB)
- ip_address (VARCHAR)
- user_agent (TEXT)
- expires_at (TIMESTAMP)
- created_at (TIMESTAMP)
```

## Redis Keys

- `refresh_token:{userId}` - Refresh token storage
- `verify_email:{email}` - Email verification tokens (1 hour TTL)
- `reset_password:{email}` - Password reset tokens (1 hour TTL)

## Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens signed with HS256
- Refresh tokens stored in Redis with expiry
- Sessions track IP and user agent
- Soft delete for user accounts
- Email verification for new accounts
- Password reset with time-limited tokens

## Error Responses

```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

Common errors:
- 400: Bad Request (validation error)
- 401: Unauthorized (invalid/expired token)
- 404: Not Found
- 500: Internal Server Error

## Validation Errors

```json
{
  "error": "Validation Error",
  "details": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Database Migrations
```bash
npm run migrate
```

## Deployment

### Docker
```bash
docker build -t agentinvest-auth-service .
docker run -p 3001:3001 --env-file .env agentinvest-auth-service
```

### Environment-specific Considerations

**Development:**
- Detailed error messages
- Console logging
- Email tokens logged to console

**Production:**
- Sanitized error messages
- File logging only
- Email delivery via SMTP
- Use secure JWT secrets (32+ characters)
- Enable HTTPS only
- Set secure cookie flags

## Dependencies

### Core
- express - Web framework
- pg - PostgreSQL client
- ioredis - Redis client
- bcrypt - Password hashing
- jsonwebtoken - JWT tokens
- joi - Validation

### Utilities
- winston - Logging
- nodemailer - Email sending
- uuid - UUID generation
- dotenv - Environment variables

## License

MIT
