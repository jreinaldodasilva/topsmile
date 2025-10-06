// src/utils/errors.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message = 'Erro de conexão. Verifique sua internet.') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public fields?: Record<string, string>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message = 'Sessão expirada. Faça login novamente.') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message = 'Você não tem permissão para esta ação.') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export const handleApiError = (error: any): Error => {
  if (!error.response) {
    return new NetworkError();
  }

  const { status, data } = error.response;

  switch (status) {
    case 401:
      return new AuthenticationError(data?.error?.message);
    case 403:
      return new AuthorizationError(data?.error?.message);
    case 400:
      return new ValidationError(
        data?.error?.message || 'Dados inválidos',
        data?.error?.details
      );
    default:
      return new ApiError(
        data?.error?.message || 'Erro ao processar requisição',
        status,
        data?.error?.code
      );
  }
};
