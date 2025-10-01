import { Response } from 'express';

export interface ApiResponseData {
  success: boolean;
  message?: string;
  data?: any;
  code?: string;
  errors?: any;
}

export class ApiResponse {
  static success(res: Response, data?: any, message?: string): void {
    res.json({
      success: true,
      data,
      message
    });
  }

  static error(res: Response, status: number, message: string, code?: string, errors?: any): void {
    res.status(status).json({
      success: false,
      message,
      code,
      errors
    });
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

  static badRequest(res: Response, message = 'Dados inválidos', code = 'BAD_REQUEST', errors?: any): void {
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