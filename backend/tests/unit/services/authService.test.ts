import { authService } from '../../../src/services/authService';
import { User } from '../../../src/models/User';
import { createTestUser, createTestClinic } from '../../testHelpers';

// Test constants to avoid hardcoded credentials
const TEST_PASSWORDS = {
  SECURE: 'SecurePass123!',
  LOGIN: 'LoginPass123!',
  OLD: 'OldPass123!',
  NEW: 'NewPass123!',
  CORRECT: 'CorrectPass123!',
  WRONG: 'WrongPass123!',
  GET_USER: 'GetUserPass123!',
  CHANGE: 'ChangePass123!'
};

describe('AuthService', () => {
  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'João Silva',
        email: 'joao.silva@example.com',
        password: TEST_PASSWORDS.SECURE,
      };

      const result = await authService.register(userData);

      expect(result.success).toBe(true);
      expect(result.data.user).toBeDefined();
      expect(result.data.user.name).toBe(userData.name);
      expect(result.data.user.email).toBe(userData.email);
      expect(result.data.accessToken).toBeDefined();
      expect(result.data.refreshToken).toBeDefined();
    });

    it('should hash the password', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: TEST_PASSWORDS.SECURE,
      };

      await authService.register(userData);

      const user = await User.findOne({ email: userData.email }).select('+password');
      expect(user?.password).not.toBe(userData.password);
      expect(user?.password).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash pattern
    });

    it('should throw error for duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'duplicate@example.com',
        password: TEST_PASSWORDS.SECURE,
      };

      await authService.register(userData);

      await expect(authService.register(userData)).rejects.toThrow('Usuário já existe');
    });

    it('should create clinic when clinic data is provided', async () => {
      const userData = {
        name: 'Dr. Maria Santos',
        email: 'maria@example.com',
        password: TEST_PASSWORDS.SECURE,
        clinic: {
          name: 'Clínica Odontológica Maria Santos',
          phone: '(11) 99999-9999',
          address: {
            street: 'Rua das Flores',
            number: '456',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234-567'
          }
        }
      };

      const result = await authService.register(userData);

      expect(result.success).toBe(true);
      expect(result.data.user.clinic).toBeDefined();
    });
  });

  describe('login', () => {
    it('should login user with correct credentials', async () => {
      const userData = {
        name: 'Login Test',
        email: 'login@example.com',
        password: TEST_PASSWORDS.LOGIN,
      };

      await authService.register(userData);

      const loginData = {
        email: userData.email,
        password: userData.password,
      };

      const result = await authService.login(loginData);

      expect(result.success).toBe(true);
      expect(result.data.user.email).toBe(userData.email);
      expect(result.data.accessToken).toBeDefined();
      expect(result.data.refreshToken).toBeDefined();
    });

    it('should throw error for invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      await expect(authService.login(loginData)).rejects.toThrow('E-mail ou senha inválidos');
    });

    it('should throw error for invalid password', async () => {
      const userData = {
        name: 'Password Test',
        email: 'password@example.com',
        password: TEST_PASSWORDS.CORRECT,
      };

      await authService.register(userData);

      const loginData = {
        email: userData.email,
        password: TEST_PASSWORDS.WRONG,
      };

      await expect(authService.login(loginData)).rejects.toThrow('E-mail ou senha inválidos');
    });
  });

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      const userData = {
        name: 'Get User Test',
        email: 'getuser@example.com',
        password: TEST_PASSWORDS.GET_USER,
      };

      const registeredUser = await authService.register(userData);
      const userId = (registeredUser.data.user._id as any).toString();

      const user = await authService.getUserById(userId);

      expect(user).toBeDefined();
      expect(user?.name).toBe(userData.name);
      expect(user?.email).toBe(userData.email);
    });

    it('should throw error for non-existent user', async () => {
      await expect(authService.getUserById('507f1f77bcf86cd799439011')).rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const userData = {
        name: 'Change Password Test',
        email: 'changepass@example.com',
        password: TEST_PASSWORDS.OLD,
      };

      const registeredUser = await authService.register(userData);
      const userId = (registeredUser.data.user._id as any).toString();

      await expect(
        authService.changePassword(userId, userData.password, TEST_PASSWORDS.NEW)
      ).resolves.not.toThrow();

      // Verify new password works
      const loginResult = await authService.login({
        email: userData.email,
        password: TEST_PASSWORDS.NEW,
      });

      expect(loginResult.success).toBe(true);
    });

    it('should throw error for incorrect current password', async () => {
      const userData = {
        name: 'Wrong Current Password Test',
        email: 'wrongcurrent@example.com',
        password: TEST_PASSWORDS.CORRECT,
      };

      const registeredUser = await authService.register(userData);
      const userId = (registeredUser.data.user._id as any).toString();

      await expect(
        authService.changePassword(userId, TEST_PASSWORDS.WRONG, TEST_PASSWORDS.NEW)
      ).rejects.toThrow('Senha atual incorreta');
    });
  });
});