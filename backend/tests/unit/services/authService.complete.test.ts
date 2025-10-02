import { AuthService } from '../../../src/services/authService';
import { User } from '../../../src/models/User';
import { RefreshToken } from '../../../src/models/RefreshToken';
import { TEST_CREDENTIALS } from '../../testConstants';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../../src/models/User');
jest.mock('../../../src/models/RefreshToken');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  const mockUser = {
    _id: 'user123',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: 'admin',
    save: jest.fn(),
    comparePassword: jest.fn()
  };

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register new user successfully', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.prototype.save as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const result = await authService.register({
        email: 'test@example.com',
        password: TEST_CREDENTIALS.DEFAULT_PASSWORD,
        name: 'Test User'
      });

      expect(result.user.email).toBe('test@example.com');
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw error for existing email', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(authService.register({
        email: 'test@example.com',
        password: TEST_CREDENTIALS.DEFAULT_PASSWORD,
        name: 'Test User'
      })).rejects.toThrow('Email already exists');
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      mockUser.comparePassword.mockResolvedValue(true);
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.login('test@example.com', TEST_CREDENTIALS.DEFAULT_PASSWORD);

      expect(result.user.email).toBe('test@example.com');
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw error for invalid credentials', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(authService.login('test@example.com', 'wrongpassword'))
        .rejects.toThrow('Invalid credentials');
    });

    it('should throw error for wrong password', async () => {
      mockUser.comparePassword.mockResolvedValue(false);
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(authService.login('test@example.com', 'wrongpassword'))
        .rejects.toThrow('Invalid credentials');
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const mockRefreshToken = {
        userId: 'user123',
        isValid: true,
        save: jest.fn()
      };
      (jwt.verify as jest.Mock).mockReturnValue({ userId: 'user123' });
      (RefreshToken.findOne as jest.Mock).mockResolvedValue(mockRefreshToken);
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.refreshToken('validRefreshToken');

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw error for invalid refresh token', async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.refreshToken('invalidToken'))
        .rejects.toThrow('Invalid refresh token');
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      mockUser.comparePassword.mockResolvedValue(true);
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');

      await authService.changePassword('user123', 'oldPassword', 'newPassword');

      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should throw error for wrong current password', async () => {
      mockUser.comparePassword.mockResolvedValue(false);
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      await expect(authService.changePassword('user123', 'wrongPassword', 'newPassword'))
        .rejects.toThrow('Current password is incorrect');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const mockRefreshToken = {
        isValid: true,
        save: jest.fn()
      };
      (RefreshToken.findOne as jest.Mock).mockResolvedValue(mockRefreshToken);

      await authService.logout('validRefreshToken');

      expect(mockRefreshToken.isValid).toBe(false);
      expect(mockRefreshToken.save).toHaveBeenCalled();
    });
  });
});