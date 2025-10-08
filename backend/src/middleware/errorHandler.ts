import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ErrorLogger } from '../utils/errors/errorLogger';

interface ErrorResponse {
  success: false;
  message: string;
  errors?: any[];
  code?: string;
  meta: {
    timestamp: string;
    requestId?: string;
  };
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response<ErrorResponse> => {
  ErrorLogger.log(error, `${req.method} ${req.path}`);

  // Handle custom AppError
  if (error instanceof AppError) {
    return res.status(error.statusCode).json(error.toJSON());
  }

  // Handle Mongoose validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      errors: Object.values((error as any).errors).map((e: any) => e.message),
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      }
    });
  }

  // Handle Mongoose CastError
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID inválido',
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      }
    });
  }

  // Handle unknown errors
  const errorResponse: ErrorResponse = {
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Erro interno do servidor' : error.message,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    }
  };

  if (process.env.NODE_ENV === 'development') {
    (errorResponse as any).stack = error.stack;
  }

  return res.status(500).json(errorResponse);
};
