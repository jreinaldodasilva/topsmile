import { authService } from '../../../../src/services/auth/authService';
import { User } from '../../../../src/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../../../../src/models/User');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'admin',
        clinicId: 'clinic123',
        isActive: true,
        save: jest.fn()
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('accessToken');

      const result = await authService.login('test@example.com', 'password123');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    });

    it('should throw error for invalid credentials', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(authService.login('wrong@example.com', 'password'))
        .rejects.toThrow('Credenciais inválidas');
    });

    it('should throw error for inactive user', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPassword',
        isActive: false
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(authService.login('test@example.com', 'password'))
        .rejects.toThrow('Usuário inativo');
    });
  });

  describe('register', () => {
    it('should register new user', async () => {
      const userData = {
        email: 'new@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'admin',
        clinicId: 'clinic123'
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (User.prototype.save as jest.Mock).mockResolvedValue({
        _id: 'user123',
        ...userData,
        password: 'hashedPassword'
      });

      const result = await authService.register(userData);

      expect(result).toHaveProperty('_id');
      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
    });

    it('should throw error for duplicate email', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ email: 'existing@example.com' });

      await expect(authService.register({
        email: 'existing@example.com',
        password: 'password',
        name: 'Test',
        role: 'admin',
        clinicId: 'clinic123'
      })).rejects.toThrow('E-mail já cadastrado');
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', async () => {
      const payload = { userId: 'user123', email: 'test@example.com' };
      (jwt.verify as jest.Mock).mockReturnValue(payload);

      const result = await authService.verifyAccessToken('validToken');

      expect(result).toEqual(payload);
      expect(jwt.verify).toHaveBeenCalled();
    });

    it('should throw error for invalid token', async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.verifyAccessToken('invalidToken'))
        .rejects.toThrow();
    });
  });
});
