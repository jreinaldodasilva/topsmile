# Swagger API Documentation

## Access

**Development:** http://localhost:5000/api-docs  
**Production:** https://api.topsmile.com/api-docs

## Example Documentation

```typescript
/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: List patients
 *     tags: [Patients]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', handler);
```

---

**Version:** 1.0
