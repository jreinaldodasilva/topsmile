import { Request, Response, NextFunction } from 'express';

export const responseWrapper = (req: Request, res: Response, next: NextFunction) => {
  const oldJson = res.json.bind(res);

  res.json = (payload: any) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      if (payload && typeof payload === 'object' && 'success' in payload) {
        return oldJson(payload);
      }
      return oldJson({ success: true, data: payload });
    }
    return oldJson(payload);
  };

  next();
};