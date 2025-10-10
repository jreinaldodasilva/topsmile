# TopSmile Deployment Guide

**Version:** 1.0.0 | **Date:** 2024-01-15 | **Status:** ✅ Complete

---

## Deployment Environments

| Environment | Purpose | URL |
|-------------|---------|-----|
| Development | Local development | http://localhost:3000 |
| Staging | Pre-production testing | https://staging.topsmile.com |
| Production | Live application | https://topsmile.com |

---

## Prerequisites

### Required Services
- MongoDB (Atlas recommended for production)
- Redis (managed service recommended)
- Stripe account (payment processing)
- SendGrid account (email)
- Twilio account (SMS)

### Required Tools
- Node.js ≥18.0.0
- npm ≥9.0.0
- Git
- Docker (optional)

---

## Environment Configuration

### Production Environment Variables

**Backend (.env.production):**
```env
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/topsmile
DATABASE_NAME=topsmile

# Redis
REDIS_HOST=redis.example.com
REDIS_PORT=6379
REDIS_PASSWORD=secure_password

# JWT Secrets (64+ characters)
JWT_SECRET=<generate-secure-secret>
JWT_REFRESH_SECRET=<generate-secure-secret>
PATIENT_JWT_SECRET=<generate-secure-secret>
PATIENT_JWT_REFRESH_SECRET=<generate-secure-secret>

# External Services
STRIPE_SECRET_KEY=sk_live_...
SENDGRID_API_KEY=SG....
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...

# URLs
FRONTEND_URL=https://topsmile.com
API_URL=https://api.topsmile.com

# Security
TRUST_PROXY=1
```

**Frontend (.env.production):**
```env
REACT_APP_API_URL=https://api.topsmile.com
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_...
```

---

## Build Process

### Frontend Build
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Output: /build directory
```

### Backend Build
```bash
# Install dependencies
cd backend
npm install

# Build TypeScript
npm run build

# Output: /backend/dist directory
```

---

## Deployment Methods

### Method 1: Traditional Server

**1. Prepare Server:**
```bash
# Update system
sudo apt update && sudo apt upgrade

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2
```

**2. Deploy Application:**
```bash
# Clone repository
git clone <repo-url> /var/www/topsmile
cd /var/www/topsmile

# Install dependencies
npm install
cd backend && npm install && cd ..

# Build applications
npm run build:all

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**3. Configure Nginx:**
```nginx
# /etc/nginx/sites-available/topsmile
server {
    listen 80;
    server_name topsmile.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name topsmile.com;

    ssl_certificate /etc/letsencrypt/live/topsmile.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/topsmile.com/privkey.pem;

    # Frontend
    location / {
        root /var/www/topsmile/build;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

### Method 2: Docker Deployment

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=http://backend:5000

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - REDIS_HOST=redis
    depends_on:
      - mongodb
      - redis

  mongodb:
    image: mongo:latest
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:alpine
    volumes:
      - redis_data:/data

volumes:
  mongodb_data:
  redis_data:
```

**Deploy:**
```bash
docker-compose up -d
```

---

### Method 3: Cloud Platform (Vercel/Heroku)

**Vercel (Frontend):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Heroku (Backend):**
```bash
# Install Heroku CLI
npm i -g heroku

# Login
heroku login

# Create app
heroku create topsmile-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=...

# Deploy
git push heroku main
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

**.github/workflows/deploy.yml:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run test:ci

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Staging
        run: |
          # Deploy commands

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Production
        run: |
          # Deploy commands
```

---

## Database Migration

### Pre-Deployment
```bash
# Backup database
mongodump --uri="mongodb://..." --out=backup-$(date +%Y%m%d)

# Run migrations
npm run migrate
```

### Post-Deployment
```bash
# Verify migration
npm run migrate:status

# Rollback if needed
npm run migrate:rollback
```

---

## Health Checks

### Application Health
```bash
# Check backend
curl https://api.topsmile.com/api/health

# Check database
curl https://api.topsmile.com/api/health/database
```

### Monitoring
```bash
# PM2 status
pm2 status

# View logs
pm2 logs

# Monitor resources
pm2 monit
```

---

## Rollback Procedure

### Quick Rollback
```bash
# PM2 rollback
pm2 reload ecosystem.config.js --update-env

# Git rollback
git revert HEAD
git push origin main

# Database rollback
npm run migrate:rollback
```

---

## SSL/TLS Configuration

### Let's Encrypt (Certbot)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d topsmile.com -d www.topsmile.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## Performance Optimization

### Frontend
- Enable gzip compression
- Set cache headers
- Use CDN for static assets
- Implement service workers

### Backend
- Enable response compression
- Configure connection pooling
- Implement Redis caching
- Use load balancer

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] Firewall configured
- [ ] Rate limiting enabled
- [ ] Security headers set
- [ ] Secrets rotated regularly
- [ ] Backups automated

---

## Monitoring Setup

### Application Monitoring
```bash
# Install monitoring agent
npm install -g pm2
pm2 install pm2-logrotate

# Configure alerts
pm2 set pm2-logrotate:max_size 10M
```

---

## Backup Strategy

### Automated Backups
```bash
# Daily database backup
0 2 * * * mongodump --uri="$MONGODB_URI" --out=/backups/$(date +\%Y\%m\%d)

# Weekly full backup
0 3 * * 0 tar -czf /backups/full-$(date +\%Y\%m\%d).tar.gz /var/www/topsmile
```

---

## Troubleshooting

### Common Issues

**Application won't start:**
```bash
# Check logs
pm2 logs

# Check environment
pm2 env 0

# Restart
pm2 restart all
```

**Database connection failed:**
```bash
# Test connection
mongo "$MONGODB_URI"

# Check firewall
sudo ufw status
```

---

## Improvement Recommendations

### 🟥 Critical
1. **Implement Blue-Green Deployment** - Zero downtime (1 week)
2. **Add Automated Rollback** - On health check failure (3 days)

### 🟧 High Priority
3. **Implement Canary Deployment** - Gradual rollout (1 week)
4. **Add Deployment Notifications** - Slack/email alerts (2 days)
5. **Automate Database Migrations** - In CI/CD (3 days)

---

**Related:** [17-Monitoring-Logging.md](./17-Monitoring-Logging.md), [01-System-Architecture-Overview.md](../architecture/01-System-Architecture-Overview.md)
