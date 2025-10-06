// src/utils/errors.test.ts
import {
  ApiError,
  NetworkError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  handleApiError
} from './errors';

describe('Error Classes', () => {
  describe('ApiError', () => {
    it('should create ApiError with all properties', () => {
      const error = new ApiError('Test error', 500, 'ERR_CODE', { detail: 'info' });
      
      expect(error.name).toBe('ApiError');
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('ERR_CODE');
      expect(error.details).toEqual({ detail: 'info' });
    });
  });

  describe('NetworkError', () => {
    it('should create NetworkError with default message', () => {
      const error = new NetworkError();
      
      expect(error.name).toBe('NetworkError');
      expect(error.message).toBe('Erro de conexão. Verifique sua internet.');
    });

    it('should create NetworkError with custom message', () => {
      const error = new NetworkError('Custom network error');
      
      expect(error.message).toBe('Custom network error');
    });
  });

  describe('ValidationError', () => {
    it('should create ValidationError with fields', () => {
      const fields = { email: 'Invalid email', name: 'Required' };
      const error = new ValidationError('Validation failed', fields);
      
      expect(error.name).toBe('ValidationError');
      expect(error.message).toBe('Validation failed');
      expect(error.fields).toEqual(fields);
    });
  });

  describe('AuthenticationError', () => {
    it('should create AuthenticationError with default message', () => {
      const error = new AuthenticationError();
      
      expect(error.name).toBe('AuthenticationError');
      expect(error.message).toBe('Sessão expirada. Faça login novamente.');
    });
  });

  describe('AuthorizationError', () => {
    it('should create AuthorizationError with default message', () => {
      const error = new AuthorizationError();
      
      expect(error.name).toBe('AuthorizationError');
      expect(error.message).toBe('Você não tem permissão para esta ação.');
    });
  });
});

describe('handleApiError', () => {
  it('should return NetworkError when no response', () => {
    const error = handleApiError({ message: 'Network failed' });
    
    expect(error).toBeInstanceOf(NetworkError);
  });

  it('should return AuthenticationError for 401 status', () => {
    const error = handleApiError({
      response: {
        status: 401,
        data: { error: { message: 'Unauthorized' } }
      }
    });
    
    expect(error).toBeInstanceOf(AuthenticationError);
    expect(error.message).toBe('Unauthorized');
  });

  it('should return AuthorizationError for 403 status', () => {
    const error = handleApiError({
      response: {
        status: 403,
        data: { error: { message: 'Forbidden' } }
      }
    });
    
    expect(error).toBeInstanceOf(AuthorizationError);
    expect(error.message).toBe('Forbidden');
  });

  it('should return ValidationError for 400 status', () => {
    const error = handleApiError({
      response: {
        status: 400,
        data: {
          error: {
            message: 'Invalid data',
            details: { email: 'Invalid' }
          }
        }
      }
    });
    
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.message).toBe('Invalid data');
    expect((error as ValidationError).fields).toEqual({ email: 'Invalid' });
  });

  it('should return ApiError for other status codes', () => {
    const error = handleApiError({
      response: {
        status: 500,
        data: { error: { message: 'Server error', code: 'ERR_500' } }
      }
    });
    
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe('Server error');
    expect((error as ApiError).statusCode).toBe(500);
    expect((error as ApiError).code).toBe('ERR_500');
  });

  it('should use default message when no error message provided', () => {
    const error = handleApiError({
      response: {
        status: 500,
        data: {}
      }
    });
    
    expect(error.message).toBe('Erro ao processar requisição');
  });
});
