// backend/tests/unit/errorLogger.test.ts
import { ErrorLogger } from '../../src/utils/errors/errorLogger';
import { AppError } from '../../src/utils/errors/errors';

describe('ErrorLogger', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logs operational errors as warnings', () => {
    const error = new AppError('Test error', 400);
    ErrorLogger.log(error, 'test-context');
    
    expect(console.warn).toHaveBeenCalledWith(
      'Operational Error:',
      expect.stringContaining('Test error')
    );
  });

  it('logs programming errors as errors', () => {
    const error = new Error('Programming error');
    ErrorLogger.log(error, 'test-context');
    
    expect(console.error).toHaveBeenCalledWith(
      'Programming Error:',
      expect.stringContaining('Programming error')
    );
  });

  it('includes context in log', () => {
    const error = new AppError('Test error');
    ErrorLogger.log(error, 'POST /api/users');
    
    expect(console.warn).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('POST /api/users')
    );
  });
});
