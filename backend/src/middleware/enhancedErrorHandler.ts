// backend/src/middleware/enhancedErrorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { CONSTANTS } from '../config/constants';
import logger from '../config/logger';
import { AuthenticatedRequest } from './auth/auth';
import { RequestWithCorrelation } from './correlationId';

interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const enhancedErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authReq = req as AuthenticatedRequest & RequestWithCorrelation;
  
  // Log error with context
  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode || 500,
    correlationId: authReq.correlationId,
    requestId: authReq.requestId,
    userId: authReq.user?.id,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });

  // Determine status code
  const statusCode = err.statusCode || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR;

  // Send response
  res.status(statusCode).json({
    success: false,
    message: err.message || CONSTANTS.ERRORS.INTERNAL_ERROR,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    meta: {
      correlationId: authReq.correlationId,
      requestId: authReq.requestId,
      timestamp: new Date().toISOString(),
    },
  });
};
