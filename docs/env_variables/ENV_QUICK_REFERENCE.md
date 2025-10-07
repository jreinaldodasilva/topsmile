# Environment Variables - Quick Reference

## 🚀 Quick Setup

```bash
# 1. Copy example files
cp .env.example .env
cp backend/.env.example backend/.env

# 2. Generate secrets
npm run generate-env-secrets

# 3. Update .env files with generated secrets

# 4. Start development
npm run dev
```

## 📋 Essential Variables

### Frontend (`.env`)
```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Backend (`backend/.env`)
```bash
# Database
DATABASE_URL=mongodb://localhost:27017/topsmile

# JWT Secrets (64+ chars - use npm run generate-env-secrets)
JWT_SECRET=your_64_char_secret_here
JWT_REFRESH_SECRET=your_64_char_secret_here
PATIENT_JWT_SECRET=your_64_char_secret_here

# Frontend
FRONTEND_URL=http://localhost:3000

# Email (Development)
MOCK_EMAIL_SERVICE=true
# OR configure Ethereal:
# ETHEREAL_USER=user@ethereal.email
# ETHEREAL_PASS=password
```

## 🔧 Common Tasks

### Generate Secure Secrets
```bash
npm run generate-env-secrets
```

### Check Configuration
```bash
npm run dev
# Look for validation warnings in console
```

### Test Environment
```bash
# Backend tests use backend/.env.test
npm run test:backend
```

## 🔐 Security Checklist

- [ ] JWT secrets are 64+ characters
- [ ] Different secrets per environment
- [ ] `.env` files NOT committed to git
- [ ] `COOKIE_SECURE=true` in production
- [ ] `DETAILED_ERRORS=false` in production

## 📚 Full Documentation

See `docs/ENVIRONMENT_SETUP.md` for complete guide.

## ⚠️ Common Issues

### "JWT_SECRET must be set in production"
→ Generate with: `npm run generate-env-secrets`

### "Database connection failed"
→ Check MongoDB is running: `mongod`

### "CORS blocked origin"
→ Verify `FRONTEND_URL` matches your frontend URL

### Email not sending
→ Set `MOCK_EMAIL_SERVICE=true` for development

## 🆘 Need Help?

1. Check `docs/ENVIRONMENT_SETUP.md`
2. Review `.env.example` files
3. Contact: contato@topsmile.com
