# API Versioning Implementation

## Overview
Implemented API versioning to support backward compatibility and enable breaking changes without affecting existing clients.

## Implementation

### Versioning Strategy
**URL Path Versioning**: `/api/v1/`, `/api/v2/`, etc.

**Advantages:**
- Clear and explicit
- Easy to cache
- Simple to implement
- Works with all HTTP clients

### Middleware

#### apiVersionMiddleware
Extracts version from URL path or header:
```typescript
app.use('/api', apiVersionMiddleware);
// Sets req.apiVersion to 'v1', 'v2', etc.
```

**Version Detection:**
1. URL path: `/api/v1/patients` → `v1`
2. Header: `api-version: v2` → `v2`
3. Default: `v1`

#### requireVersion
Enforces specific version for routes:
```typescript
router.use(requireVersion('v2'));
```

#### deprecatedVersion
Marks versions as deprecated:
```typescript
router.use(deprecatedVersion('v1', '2025-12-31'));
// Adds headers: Deprecation, Sunset, Link
```

## Route Structure

### Current Routes (v1)
```
/api/auth              → v1 (default)
/api/patients          → v1 (default)
/api/v1/auth           → v1 (explicit)
/api/v1/patients       → v1 (explicit)
```

### Future Routes (v2+)
```
/api/v2/patients       → v2 (new version)
/api/v2/appointments   → v2 (new version)
```

## Usage Examples

### Client Usage
```typescript
// Default version (v1)
fetch('/api/patients')

// Explicit version
fetch('/api/v1/patients')

// New version
fetch('/api/v2/patients')

// Header-based
fetch('/api/patients', {
  headers: { 'api-version': 'v2' }
})
```

### Creating New Version
```typescript
// backend/src/routes/v2/patients.ts
import { Router } from 'express';
import { requireVersion } from '../../middleware/apiVersion';

const router = Router();
router.use(requireVersion('v2'));

// New v2 endpoints with breaking changes
router.get('/', async (req, res) => {
  // New response format
  res.json({
    version: 'v2',
    data: { /* new structure */ }
  });
});

export default router;
```

### Deprecating Version
```typescript
// Mark v1 as deprecated
import { deprecatedVersion } from '../../middleware/apiVersion';

router.use(deprecatedVersion('v1', '2025-12-31'));
```

**Response Headers:**
```
Deprecation: true
Sunset: 2025-12-31
Link: </api-docs>; rel="deprecation"
```

## Version Management

### Version Lifecycle
1. **Active** - Current production version
2. **Deprecated** - Still works but marked for removal
3. **Sunset** - Scheduled removal date announced
4. **Removed** - No longer available

### Deprecation Policy
- **Notice Period**: 6 months minimum
- **Headers**: Deprecation warnings in responses
- **Documentation**: Update API docs with migration guide
- **Communication**: Email notifications to API consumers

## Migration Guide

### For API Consumers

**Step 1: Check Current Version**
```bash
curl -I https://api.topsmile.com/api/patients
# Check for Deprecation header
```

**Step 2: Test New Version**
```bash
curl https://api.topsmile.com/api/v2/patients
```

**Step 3: Update Client**
```typescript
// Before
const response = await fetch('/api/patients');

// After
const response = await fetch('/api/v2/patients');
```

**Step 4: Monitor Sunset Date**
- Watch for Sunset header
- Plan migration before date

### For Developers

**Creating Breaking Changes:**
1. Create new version directory: `routes/v2/`
2. Copy relevant routes from v1
3. Implement breaking changes
4. Update tests
5. Document changes
6. Mark old version as deprecated

**Example Breaking Change:**
```typescript
// v1: Returns array
GET /api/v1/patients
Response: [{ id: 1, name: "John" }]

// v2: Returns paginated object
GET /api/v2/patients
Response: {
  data: [{ id: 1, name: "John" }],
  pagination: { page: 1, total: 100 }
}
```

## Benefits

### For Clients
- **Stability**: Existing integrations continue working
- **Flexibility**: Upgrade at own pace
- **Predictability**: Clear deprecation timeline

### For Developers
- **Freedom**: Make breaking changes safely
- **Clarity**: Version-specific code is isolated
- **Maintenance**: Easier to remove old code

## Best Practices

### DO
✅ Use semantic versioning (v1, v2, v3)
✅ Document all breaking changes
✅ Provide migration guides
✅ Give adequate deprecation notice
✅ Test all versions independently

### DON'T
❌ Change v1 behavior (create v2 instead)
❌ Remove versions without notice
❌ Mix versions in same endpoint
❌ Use version for minor changes
❌ Skip version numbers

## Monitoring

### Metrics to Track
- Requests per version
- Deprecated version usage
- Migration progress
- Error rates by version

### Logging
```typescript
logger.info({
  version: req.apiVersion,
  endpoint: req.path,
  deprecated: res.getHeader('Deprecation')
});
```

## Future Enhancements

### Planned Features
- [ ] Automatic version detection from Accept header
- [ ] Version-specific rate limiting
- [ ] Version analytics dashboard
- [ ] Automated migration testing

### Potential Versions
- **v2**: Paginated responses, new error format
- **v3**: GraphQL support, real-time subscriptions

## Files Created

### New Files
- `backend/src/middleware/apiVersion.ts` - Versioning middleware
- `backend/src/routes/v1/index.ts` - v1 route aggregator
- `docs/phase2/api-versioning.md` - This documentation

### Modified Files
- `backend/src/app.ts` - Added versioning middleware and v1 routes

## Testing

### Test Version Detection
```typescript
describe('API Versioning', () => {
  it('should detect version from URL', async () => {
    const res = await request(app).get('/api/v1/patients');
    expect(res.body.version).toBe('v1');
  });

  it('should detect version from header', async () => {
    const res = await request(app)
      .get('/api/patients')
      .set('api-version', 'v2');
    expect(res.body.version).toBe('v2');
  });

  it('should default to v1', async () => {
    const res = await request(app).get('/api/patients');
    expect(res.body.version).toBe('v1');
  });
});
```

## Status
✅ **Completed** - Task 2.2 from Phase 2 Action Plan

## Related Documentation
- [Action Plan Phase 2](../review/05-TopSmile-Action-Plan.md)
- [API Documentation](../api/swagger-setup.md)
