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

  const rawErrors = (error as any).errors;
  let normalizedErrors = Array.isArray(rawErrors)
    ? rawErrors.map((e: any) => (typeof e === 'string' ? { msg: e } : e))
    : undefined;

  if (!normalizedErrors && error.message) {
    normalizedErrors = [{ msg: error.message, param: 'general' }];
  }

  // Handle known AppErrors
  if (isAppError(error)) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: error.message,
      errors: normalizedErrors,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId // Assuming requestId is attached to req
      }
    };

    return res.status(error.statusCode).json(errorResponse);
  }

  // Handle unknown errors
  const errorResponse: ErrorResponse = {
    success: false,
    message: 'Erro interno do servidor',
    errors: normalizedErrors,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId // Assuming requestId is attached to req
    }
  };

  // In development, provide more details for debugging purposes, but not in production.
  if (process.env.NODE_ENV !== 'production') {
    (errorResponse as any).debug = error.message;
    (errorResponse as any).stack = error.stack;
  }

  return res.status(500).json(errorResponse);
};
