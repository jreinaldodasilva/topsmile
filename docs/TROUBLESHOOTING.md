# TopSmile Troubleshooting Guide

## Common Issues

### Database Connection Failed
**Symptoms:** `MongoDB connection error`

**Solutions:**
1. Check DATABASE_URL in .env
2. Verify MongoDB is running: `mongosh`
3. Check network connectivity
4. Verify credentials

### Authentication Errors
**Symptoms:** `401 Unauthorized` or `Invalid token`

**Solutions:**
1. Check JWT_SECRET is set (min 64 chars)
2. Clear browser cookies
3. Verify token expiration settings
4. Check CORS configuration

### Cache Issues
**Symptoms:** Stale data or cache errors

**Solutions:**
1. Verify Redis is running: `redis-cli ping`
2. Clear cache: `redis-cli FLUSHDB`
3. Check REDIS_URL in .env
4. Restart Redis service

### Performance Issues
**Symptoms:** Slow response times

**Solutions:**
1. Check database indexes: `db.collection.getIndexes()`
2. Monitor Redis hit rate
3. Enable compression
4. Check network latency

### Build Failures
**Symptoms:** `npm run build` fails

**Solutions:**
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Check Node version: `node -v` (requires 18+)
3. Clear build cache: `rm -rf build`
4. Check TypeScript errors: `npm run type-check`

## Error Codes

- **400:** Bad request - check request payload
- **401:** Unauthorized - check authentication
- **403:** Forbidden - check user permissions
- **404:** Not found - verify endpoint exists
- **429:** Rate limited - wait and retry
- **500:** Server error - check logs

## Logs

**Backend logs:** `backend/logs/`
**Frontend console:** Browser DevTools
**Database logs:** MongoDB logs directory

## Support

For additional help, check:
- README.md
- API documentation: `/api/docs`
- GitHub issues
