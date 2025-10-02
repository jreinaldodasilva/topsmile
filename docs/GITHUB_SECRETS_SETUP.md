# GitHub Secrets Setup for TopSmile

## Required Secrets

Set these secrets in GitHub repository settings (Settings > Secrets and variables > Actions):

### Test Credentials
```
TEST_JWT_SECRET=your-super-secure-jwt-secret-for-tests-64-chars-minimum
TEST_PATIENT_JWT_SECRET=your-patient-jwt-secret-for-tests-64-chars-minimum
TEST_DEFAULT_PASSWORD=SecureTestPass123!
TEST_PATIENT_PASSWORD=PatientTestPass123!
TEST_ADMIN_PASSWORD=AdminTestPass123!
```

### Optional (for E2E recording)
```
CYPRESS_RECORD_KEY=your-cypress-dashboard-key
```

## Generate Secure Secrets

Use this script to generate secure secrets:

```bash
# Generate JWT secrets (64 characters)
node -e "console.log('TEST_JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('TEST_PATIENT_JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# Or use OpenSSL
openssl rand -hex 32
```

## Local Development

Create `.env.test` files:

### Backend `.env.test`
```bash
NODE_ENV=test
TEST_JWT_SECRET=your-local-jwt-secret
TEST_PATIENT_JWT_SECRET=your-local-patient-jwt-secret
TEST_DEFAULT_PASSWORD=LocalTestPass123!
TEST_PATIENT_PASSWORD=LocalPatientPass123!
TEST_ADMIN_PASSWORD=LocalAdminPass123!
```

### Load in tests
```bash
cd backend
npm test -- --env-file=.env.test
```

## Security Notes

- Never commit real secrets to repository
- Use different secrets for different environments
- Rotate secrets regularly
- Use minimum 64-character secrets for JWT
- Ensure passwords meet complexity requirements