// backend/src/middleware/correlationId.ts
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export interface RequestWithCorrelation extends Request {
  correlationId: string;
  requestId: string;
}

export const correlationIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();
  const requestId = uuidv4();
  
  (req as RequestWithCorrelation).correlationId = correlationId;
  (req as RequestWithCorrelation).requestId = requestId;
  
  res.setHeader('x-correlation-id', correlationId);
  res.setHeader('x-request-id', requestId);
  
  next();
};
