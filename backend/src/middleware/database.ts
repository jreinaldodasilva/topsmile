import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export const checkDatabaseConnection = (req: Request, res: Response, next: NextFunction) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database connection unavailable'
    });
  }
  return next();
};

// Middleware to handle mongoose validation and duplicate key errors
export const handleValidationError = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (isMongooseValidationError(err)) {
    const errors = Object.values(err.errors).map((e: any) => ({ param: e.path, msg: e.message }));
    return res.status(400).json({ success: false, message: 'Dados inválidos', errors });
  }

  if (isMongoDuplicateKeyError(err)) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} já está em uso`,
      errors: [{ param: field, msg: 'Valor duplicado' }]
    });
  }

  return next(err);
};

function isMongooseValidationError(err: unknown): err is mongoose.Error.ValidationError {
  return !!err && typeof err === 'object' && (err as any).name === 'ValidationError';
}

function isMongoDuplicateKeyError(err: unknown): err is { code: number; keyValue: Record<string, string> } {
  return !!err && typeof err === 'object' && (err as any).code === 11000;
}
