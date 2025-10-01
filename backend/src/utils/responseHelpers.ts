import { Response } from 'express';

export interface ValidationError {
  msg: string;
  param: string;
  value?: unknown;
}

export interface ApiResponseData<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  code?: string;
  errors?: ValidationError[];
}

export class ApiResponse {
  static success<T = unknown>(res: Response, data?: T, message?: string): void {
    const response: ApiResponseData<T> = {
      success: true,
      data,
      message
    };
    res.json(response);
  }

  static error(res: Response, status: number, message: string, code?: string, errors?: ValidationError[]): void {
    const response: ApiResponseData<never> = {
      success: false,
      message,
      code,
      errors
    };
    res.status(status).json(response);
  }

  // Common error responses
  static unauthorized(res: Response, message = 'Token de acesso obrigatório', code = 'UNAUTHORIZED'): void {
    ApiResponse.error(res, 401, message, code);
  }

  static forbidden(res: Response, message = 'Acesso negado', code = 'FORBIDDEN'): void {
    ApiResponse.error(res, 403, message, code);
  }

  static notFound(res: Response, message = 'Recurso não encontrado', code = 'NOT_FOUND'): void {
    ApiResponse.error(res, 404, message, code);
  }

  static badRequest(res: Response, message = 'Dados inválidos', code = 'BAD_REQUEST', errors?: ValidationError[]): void {
    ApiResponse.error(res, 400, message, code, errors);
  }

  static internalError(res: Response, message = 'Erro interno do servidor', code = 'INTERNAL_ERROR'): void {
    ApiResponse.error(res, 500, message, code);
  }

  // Authentication specific responses
  static invalidToken(res: Response, message = 'Token inválido', code = 'INVALID_TOKEN'): void {
    ApiResponse.error(res, 401, message, code);
  }

  static tokenExpired(res: Response, message = 'Token expirado', code = 'TOKEN_EXPIRED'): void {
    ApiResponse.error(res, 401, message, code);
  }

  static insufficientRole(res: Response, message = 'Acesso negado: permissão insuficiente', code = 'INSUFFICIENT_ROLE'): void {
    ApiResponse.error(res, 403, message, code);
  }
}