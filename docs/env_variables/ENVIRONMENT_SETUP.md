# Environment Variables Setup Guide

## Overview

TopSmile uses environment variables for configuration across different environments (development, test, production). This guide explains how to properly configure your environment.

## Quick Start

### 1. Frontend Setup

```bash
# Copy example file
cp .env.example .env

# Edit .env and configure:
# - REACT_APP_API_URL (backend URL)
# - REACT_APP_STRIPE_PUBLISHABLE_KEY (Stripe key)
```

### 2. Backend Setup

```bash
# Copy example file
cd backend
cp .env.example .env

# Generate secure JWT secrets
openssl rand -hex 32  # Copy output for JWT_SECRET
openssl rand -hex 32  # Copy output for JWT_REFRESH_SECRET
openssl rand -hex 32  # Copy output for PATIENT_JWT_SECRET

# Edit .env and configure all required variables
```

### 3. Test Environment Setup

```bash
cd backend
cp .env.test.example .env.test

# Test environment uses separate database and mock services
```

## Environment Files

| File | Purpose | Committed |
|------|---------|-----------|
| `.env.example` | Template with all variables | ✅ Yes |
| `.env` | Local development config | ❌ No |
| `.env.local` | Local overrides | ❌ No |
| `.env.production.example` | Production template | ✅ Yes |
| `.env.test` | Test configuration | ❌ No |

## Required Variables

### Frontend (`.env`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `REACT_APP_API_URL` | ✅ Yes | Backend API URL | `http://localhost:5000` |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | ✅ Yes | Stripe public key | `pk_test_...` |

### Backend (`.env`)

#### Critical (Required in Production)

| Variable | Required | Description | Min Length |
|----------|----------|-------------|------------|
| `JWT_SECRET` | ✅ Yes | JWT signing secret | 64 chars |
| `JWT_REFRESH_SECRET` | ✅ Yes | Refresh token secret | 64 chars |
| `PATIENT_JWT_SECRET` | ✅ Yes | Patient JWT secret | 64 chars |
| `DATABASE_URL` | ✅ Yes | MongoDB connection string | - |
| `SENDGRID_API_KEY` | ✅ Yes (prod) | SendGrid API key | - |
| `FRONTEND_URL` | ✅ Yes | Frontend URL for CORS | - |

#### Important (Recommended)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Server port |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection |
| `FROM_EMAIL` | `noreply@topsmile.com` | Sender email |
| `ADMIN_EMAIL` | `contato@topsmile.com` | Admin email |
| `COOKIE_SECURE` | `false` | Secure cookies (true in prod) |

#### Optional (Development)

| Variable | Default | Description |
|----------|---------|-------------|
| `ETHEREAL_USER` | - | Ethereal email user (dev) |
| `ETHEREAL_PASS` | - | Ethereal email password (dev) |
| `MOCK_EMAIL_SERVICE` | `false` | Mock email in development |
| `MOCK_SMS_SERVICE` | `false` | Mock SMS in development |
| `LOG_LEVEL` | `info` | Logging level |

## Generating Secrets

### JWT Secrets (64+ characters required)

```bash
# Generate secure random secrets
openssl rand -hex 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Example Output
```
7641fe273ed3d4866c2c4f9da62196f87fd619064c59f67d2ca64263f66aaaa0
```

## Environment-Specific Configuration

### Development

```bash
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/topsmile
FRONTEND_URL=http://localhost:3000
COOKIE_SECURE=false
LOG_LEVEL=debug
DETAILED_ERRORS=true
MOCK_EMAIL_SERVICE=true
```

### Production

```bash
NODE_ENV=production
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/topsmile
FRONTEND_URL=https://topsmile.com
COOKIE_SECURE=true
LOG_LEVEL=warn
DETAILED_ERRORS=false
TRUST_PROXY=1
```

### Test

```bash
NODE_ENV=test
DATABASE_URL=mongodb://localhost:27017/topsmile_test
MOCK_EMAIL_SERVICE=true
MOCK_SMS_SERVICE=true
LOG_LEVEL=error
```

## Email Configuration

### Development (Ethereal)

1. Create account at [ethereal.email](https://ethereal.email)
2. Copy credentials to `.env`:

```bash
ETHEREAL_USER=your.user@ethereal.email
ETHEREAL_PASS=your_password
```

### Production (SendGrid)

1. Create SendGrid account
2. Generate API key
3. Add to `.env`:

```bash
SENDGRID_API_KEY=SG.your_api_key_here
```

## SMS Configuration (Twilio)

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+5511999999999
```

## Validation

The backend automatically validates environment variables on startup:

- **Production**: Strict validation, exits if critical variables missing
- **Development**: Warnings only, uses defaults

### Manual Validation

```bash
cd backend
npm run type-check
```

## Security Best Practices

### ✅ DO

- Use strong, random secrets (64+ characters)
- Rotate secrets regularly
- Use different secrets per environment
- Enable `COOKIE_SECURE=true` in production
- Set `DETAILED_ERRORS=false` in production
- Use managed services (MongoDB Atlas, Redis Cloud)

### ❌ DON'T

- Commit `.env` files to version control
- Use default/example secrets in production
- Share secrets via email or chat
- Reuse secrets across environments
- Expose secrets in logs or error messages

## Troubleshooting

### "JWT_SECRET must be set in production"

Generate a secure secret:
```bash
openssl rand -hex 32
```

### "Database connection failed"

Check:
- MongoDB is running
- `DATABASE_URL` is correct
- Network connectivity
- Firewall rules (production)

### "CORS blocked origin"

Ensure `FRONTEND_URL` matches your frontend URL exactly.

### Email not sending

Development:
- Set `MOCK_EMAIL_SERVICE=true` or configure Ethereal

Production:
- Verify `SENDGRID_API_KEY` is valid
- Check SendGrid dashboard for errors

## Environment Variables Reference

See example files for complete reference:
- Frontend: `.env.example`
- Backend: `backend/.env.example`
- Production: `backend/.env.production.example`
- Test: `backend/.env.test.example`

## Support

For issues or questions:
- Check logs: `npm run dev` (shows validation warnings)
- Review `backend/src/config/env.ts` for validation logic
- Contact: contato@topsmile.com
