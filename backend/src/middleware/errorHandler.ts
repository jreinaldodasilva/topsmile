import { Request, Response, NextFunction } from 'express';
import { isAppError, AppError, ErrorResponse } from '../types/errors';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response<ErrorResponse> => {
  // Log error with context
  console.error('Error occurred:', {
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Handle known AppErrors
  if (isAppError(error)) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: error.message,
    };

    return res.status(error.statusCode).json(errorResponse);
  }

  // Handle unknown errors
  const errorResponse: ErrorResponse = {
    success: false,
    message: 'Erro interno do servidor',
  };

  // In development, provide more details for debugging purposes, but not in production.
  if (process.env.NODE_ENV !== 'production') {
    (errorResponse as any).debug = error.message;
    (errorResponse as any).stack = error.stack;
  }

  return res.status(500).json(errorResponse);
};
