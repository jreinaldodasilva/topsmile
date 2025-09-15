export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} não encontrado`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden') {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 429);
  }
}

// Database specific errors
export class DatabaseError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(message, 500, false);
    if (originalError && originalError.stack) {
      this.stack = originalError.stack;
    }
  }
}

// Email service errors
export class EmailError extends AppError {
  constructor(message: string) {
    super(message, 500, false);
  }
}

// Type guards
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

export const isDatabaseError = (error: unknown): error is DatabaseError => {
  return error instanceof DatabaseError;
};

// Error response interfaces
export interface ErrorResponse {
  success: false;
  message: string;
  errors?: string[];
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface SuccessResponse<T = any> {
  success: true;
  message?: string;
  data?: T;
  meta?: {
    pagination?: any; // Placeholder for PaginationInfo
    timestamp: string;
    requestId?: string;
  };
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;
