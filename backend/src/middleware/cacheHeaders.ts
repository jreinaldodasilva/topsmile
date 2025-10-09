import { Request, Response, NextFunction } from 'express';

export const setCacheHeaders = (maxAge: number = 300) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET') {
      res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
      res.setHeader('Expires', new Date(Date.now() + maxAge * 1000).toUTCString());
    } else {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
    }
    next();
  };
};

export const noCache = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};
