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

  // Add debug info in development
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.debug = error.message;
    errorResponse.stack = error.stack;
  }

    return res.status(error.statusCode).json(errorResponse);
  }

  // Handle unknown errors
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const errorResponse: ErrorResponse = {
    success: false,
    message: 'Erro interno do servidor',
  };

  if (isDevelopment) {
    errorResponse.debug = error.message;
    errorResponse.stack = error.stack;
  }

  return res.status(500).json(errorResponse);
};
