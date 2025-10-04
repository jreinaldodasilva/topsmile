# TopSmile - Production Deployment Checklist

## 📋 Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All TypeScript compilation errors resolved
- [ ] ESLint warnings addressed
- [ ] Code review completed
- [ ] No console.log statements in production code
- [ ] All TODO comments addressed or documented

### ✅ Testing
- [ ] Unit tests written and passing (target: 80% coverage)
- [ ] Integration tests written and passing (target: 70% coverage)
- [ ] E2E tests for critical user flows passing
- [ ] Manual testing completed for all features
- [ ] Performance testing completed
- [ ] Security testing completed
- [ ] Accessibility testing completed

### ✅ Database
- [ ] Migration scripts created and tested
- [ ] All indexes created (50+ indexes)
- [ ] Database backup strategy implemented
- [ ] Connection pooling configured
- [ ] Query performance optimized

### ✅ Security
- [ ] JWT_SECRET is strong (64+ characters)
- [ ] All environment variables secured
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Helmet security headers configured
- [ ] MongoDB injection prevention enabled
- [ ] CSRF protection enabled for state-changing operations
- [ ] Password policies enforced
- [ ] MFA tested and working
- [ ] Session management tested
- [ ] Audit logging verified

### ✅ Configuration
- [ ] Environment variables documented
- [ ] Production environment variables set
- [ ] Database connection string configured
- [ ] Redis connection configured (if using)
- [ ] Twilio credentials configured
- [ ] SendGrid API key configured
- [ ] Stripe keys configured
- [ ] Frontend URL configured
- [ ] Trust proxy enabled for production

### ✅ Documentation
- [ ] API documentation updated (Swagger)
- [ ] User manuals created
- [ ] Training materials prepared
- [ ] README updated
- [ ] Deployment guide created
- [ ] Troubleshooting guide created

---

## 🔧 Environment Variables

### Required Variables
```env
# Database
DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/topsmile?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/topsmile?retryWrites=true&w=majority

# Authentication (CRITICAL - Must be strong)
JWT_SECRET=<64-character-hex-string-minimum>
JWT_REFRESH_SECRET=<64-character-hex-string-minimum>
ACCESS_TOKEN_EXPIRES=1h
REFRESH_TOKEN_EXPIRES_DAYS=7

# MFA
MFA_ISSUER=TopSmile

# SMS (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890

# Email (SendGrid)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@topsmile.com
ADMIN_EMAIL=admin@topsmile.com

# Frontend
FRONTEND_URL=https://app.topsmile.com
ADMIN_URL=https://admin.topsmile.com

# Redis (Optional but recommended)
REDIS_URL=redis://user:password@host:port

# Application
NODE_ENV=production
PORT=5000
TRUST_PROXY=1

# Monitoring (Optional)
SENTRY_DSN=https://...
```

### Generate Strong Secrets
```bash
# Generate JWT secrets (64 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🗄️ Database Migration

### Pre-Migration Backup
```bash
# Backup current database
mongodump --uri="mongodb://..." --out=/backup/pre-migration-$(date +%Y%m%d)

# Verify backup
mongorestore --uri="mongodb://..." --dryRun /backup/pre-migration-YYYYMMDD
```

### Migration Steps

#### 1. User Model Migration
```javascript
// Add new fields to existing users
db.users.updateMany(
  { mfaEnabled: { $exists: false } },
  {
    $set: {
      mfaEnabled: false,
      mfaSecret: null,
      mfaBackupCodes: [],
      phone: null,
      phoneVerified: false,
      passwordHistory: [],
      passwordChangedAt: new Date(),
      passwordExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      forcePasswordChange: false
    }
  }
);
```

#### 2. Patient Model Migration
```javascript
// Add insurance and family fields
db.patients.updateMany(
  { insurance: { $exists: false } },
  {
    $set: {
      insurance: {
        primary: null,
        secondary: null
      },
      familyMembers: [],
      photoUrl: null,
      consentForms: []
    }
  }
);
```

#### 3. Appointment Model Migration
```javascript
// Add new appointment fields
db.appointments.updateMany(
  { operatory: { $exists: false } },
  {
    $set: {
      operatory: null,
      room: null,
      colorCode: null,
      treatmentDuration: null,
      isRecurring: false,
      recurringPattern: null,
      equipment: [],
      followUpRequired: false,
      followUpDate: null,
      billingStatus: 'pending',
      billingAmount: null,
      insuranceInfo: null,
      patientSatisfactionScore: null,
      patientFeedback: null,
      noShowReason: null
    }
  }
);
```

#### 4. Create Indexes
```javascript
// Run index creation scripts
// See backend/src/models/ for all index definitions
```

### Post-Migration Verification
```bash
# Verify all collections exist
db.getCollectionNames()

# Verify indexes
db.users.getIndexes()
db.patients.getIndexes()
db.appointments.getIndexes()
# ... check all collections

# Verify data integrity
db.users.countDocuments()
db.patients.countDocuments()
db.appointments.countDocuments()
```

---

## 🚀 Deployment Steps

### 1. Build Application
```bash
# Build frontend
npm run build

# Build backend
cd backend && npm run build

# Verify builds
ls -la build/
ls -la backend/dist/
```

### 2. Deploy Backend

#### Option A: Traditional Server
```bash
# Copy files to server
scp -r backend/dist/ user@server:/var/www/topsmile-api/
scp backend/package.json user@server:/var/www/topsmile-api/
scp backend/.env.production user@server:/var/www/topsmile-api/.env

# SSH to server
ssh user@server

# Install dependencies
cd /var/www/topsmile-api
npm install --production

# Start with PM2
pm2 start dist/app.js --name topsmile-api
pm2 save
pm2 startup
```

#### Option B: Docker
```bash
# Build Docker image
docker build -t topsmile-api:latest ./backend

# Run container
docker run -d \
  --name topsmile-api \
  -p 5000:5000 \
  --env-file backend/.env.production \
  topsmile-api:latest
```

#### Option C: Cloud Platform (Heroku, AWS, etc.)
```bash
# Follow platform-specific deployment guide
```

### 3. Deploy Frontend

#### Option A: Static Hosting (Netlify, Vercel)
```bash
# Deploy build folder
netlify deploy --prod --dir=build

# Or
vercel --prod
```

#### Option B: Traditional Server
```bash
# Copy build to server
scp -r build/ user@server:/var/www/topsmile-app/

# Configure Nginx
# See nginx configuration below
```

### 4. Configure Nginx (if applicable)

#### Backend Proxy
```nginx
server {
    listen 80;
    server_name api.topsmile.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Frontend
```nginx
server {
    listen 80;
    server_name app.topsmile.com;
    root /var/www/topsmile-app/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 5. SSL/TLS Configuration
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificates
sudo certbot --nginx -d api.topsmile.com
sudo certbot --nginx -d app.topsmile.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 🔍 Post-Deployment Verification

### Health Checks
```bash
# API Health
curl https://api.topsmile.com/api/health

# Database Health
curl https://api.topsmile.com/api/health/database

# Expected Response
{
  "success": true,
  "data": {
    "timestamp": "...",
    "uptime": "...",
    "database": {
      "status": "connected",
      "name": "topsmile"
    },
    "memory": {...},
    "environment": "production",
    "version": "1.2.0"
  }
}
```

### Functional Tests
- [ ] User can login
- [ ] User can register
- [ ] MFA setup works
- [ ] SMS verification works
- [ ] Patient creation works
- [ ] Appointment booking works
- [ ] Dental chart creation works
- [ ] Treatment plan creation works
- [ ] Clinical note creation works
- [ ] Medical history creation works
- [ ] Insurance creation works
- [ ] Family linking works
- [ ] Consent form signing works
- [ ] Document upload works

### Performance Tests
```bash
# Load testing with k6 (if available)
k6 run load-test.js

# Monitor response times
# Target: < 200ms for API calls
# Target: < 1s for page loads
```

### Security Verification
- [ ] HTTPS enforced
- [ ] Security headers present (check with securityheaders.com)
- [ ] CORS properly configured
- [ ] Rate limiting working
- [ ] SQL injection prevention working
- [ ] XSS prevention working
- [ ] CSRF protection working

---

## 📊 Monitoring Setup

### Application Monitoring
```bash
# PM2 Monitoring
pm2 monit

# PM2 Logs
pm2 logs topsmile-api

# PM2 Status
pm2 status
```

### Error Tracking (Sentry - Optional)
```javascript
// backend/src/app.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Log Aggregation
- [ ] Centralized logging configured (e.g., CloudWatch, Papertrail)
- [ ] Log rotation configured
- [ ] Alert rules configured

### Uptime Monitoring
- [ ] Uptime monitoring service configured (e.g., UptimeRobot, Pingdom)
- [ ] Alert notifications configured
- [ ] Status page created (optional)

---

## 🔄 Rollback Plan

### If Deployment Fails

#### 1. Rollback Code
```bash
# PM2
pm2 stop topsmile-api
pm2 delete topsmile-api
# Deploy previous version
pm2 start previous-version/dist/app.js --name topsmile-api

# Docker
docker stop topsmile-api
docker rm topsmile-api
docker run -d --name topsmile-api topsmile-api:previous-tag
```

#### 2. Rollback Database
```bash
# Restore from backup
mongorestore --uri="mongodb://..." --drop /backup/pre-migration-YYYYMMDD
```

#### 3. Verify Rollback
- [ ] Application starts successfully
- [ ] Health checks pass
- [ ] Critical features working
- [ ] No data loss

---

## 📞 Support Contacts

### Technical Support
- **DevOps**: devops@topsmile.com
- **Backend Lead**: backend@topsmile.com
- **Frontend Lead**: frontend@topsmile.com

### Emergency Contacts
- **On-Call Engineer**: +1-XXX-XXX-XXXX
- **System Administrator**: +1-XXX-XXX-XXXX

### Service Providers
- **MongoDB Atlas**: support@mongodb.com
- **Twilio**: support@twilio.com
- **SendGrid**: support@sendgrid.com
- **Stripe**: support@stripe.com

---

## 📝 Post-Deployment Tasks

### Immediate (Day 1)
- [ ] Monitor error logs for 24 hours
- [ ] Monitor performance metrics
- [ ] Verify all critical features
- [ ] Check user feedback
- [ ] Document any issues

### Short-term (Week 1)
- [ ] Review audit logs
- [ ] Analyze performance metrics
- [ ] Gather user feedback
- [ ] Address any issues
- [ ] Update documentation

### Long-term (Month 1)
- [ ] Review security logs
- [ ] Analyze usage patterns
- [ ] Plan optimizations
- [ ] Schedule maintenance windows
- [ ] Review backup strategy

---

## 🎯 Success Criteria

### Technical Metrics
- [ ] Uptime > 99.9%
- [ ] API response time < 200ms (p95)
- [ ] Page load time < 1s (p95)
- [ ] Error rate < 0.1%
- [ ] Zero security incidents

### Business Metrics
- [ ] All users can login
- [ ] All critical features working
- [ ] No data loss
- [ ] Positive user feedback
- [ ] Support tickets < 5 per day

---

## 📚 Additional Resources

- **AWS Deployment Guide**: https://docs.aws.amazon.com/
- **MongoDB Atlas Guide**: https://docs.atlas.mongodb.com/
- **PM2 Documentation**: https://pm2.keymetrics.io/docs/
- **Nginx Documentation**: https://nginx.org/en/docs/
- **Let's Encrypt**: https://letsencrypt.org/docs/

---

**Checklist Version**: 1.0  
**Last Updated**: December 2024  
**Next Review**: Before production deployment
