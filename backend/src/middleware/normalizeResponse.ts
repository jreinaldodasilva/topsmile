import { Request, Response, NextFunction } from 'express';

// Normalize MongoDB _id to id for frontend compatibility
const normalizeIds = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(normalizeIds);
  }
  
  const normalized = { ...obj };
  
  if (normalized._id) {
    normalized.id = normalized._id;
    delete normalized._id;
  }
  
  // Recursively normalize nested objects
  Object.keys(normalized).forEach(key => {
    if (normalized[key] && typeof normalized[key] === 'object') {
      normalized[key] = normalizeIds(normalized[key]);
    }
  });
  
  return normalized;
};

export const responseWrapper = (req: Request, res: Response, next: NextFunction) => {
  const oldJson = res.json.bind(res);

  res.json = (payload: any) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      if (payload && typeof payload === 'object' && 'success' in payload) {
        // Normalize existing success response
        const normalized = { ...payload };
        if (normalized.data) {
          normalized.data = normalizeIds(normalized.data);
        }
        return oldJson(normalized);
      }
      // Wrap and normalize new response
      return oldJson({ success: true, data: normalizeIds(payload) });
    }
    return oldJson(payload);
  };

  next();
};