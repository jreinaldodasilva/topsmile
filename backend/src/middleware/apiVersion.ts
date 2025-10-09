import { Request, Response, NextFunction } from 'express';

export const API_VERSION = 'v1';

export const apiVersionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const version = req.headers['api-version'] || req.query.version || API_VERSION;
  (req as any).apiVersion = version;
  res.setHeader('API-Version', API_VERSION);
  next();
};

export const requireVersion = (minVersion: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestVersion = (req as any).apiVersion || API_VERSION;
    
    if (requestVersion < minVersion) {
      return res.status(400).json({
        success: false,
        message: `API version ${minVersion} or higher required`,
        currentVersion: requestVersion,
        requiredVersion: minVersion
      });
    }
    
    return next();
  };
};
