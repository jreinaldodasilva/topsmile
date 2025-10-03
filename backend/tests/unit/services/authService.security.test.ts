import { authService } from '../../../src/services/authService';
import { User } from '../../../src/models/User';
import { RefreshToken } from '../../../src/models/RefreshToken';
import jwt from 'jsonwebtoken';
import { createTestUser } from '../../testHelpers';

// Security-focused tests for AuthService
describe('AuthService Security Tests', () => {
  const TEST_PASSWORDS = {
    SECURE: 'SecurePass123!',
    WEAK: '123',
    COMMON: 'password',
    LONG: 'a'.repeat(1000)
  };

  describe('Token Security', () => {
    it('should reject tokens with invalid signatures', () => {
      const fakeToken = jwt.sign(
        { userId: '123', email: 'test@example.com', role: 'admin' },
        'wrong-secret'
      );

      expect(() => {
        authService.verifyAccessToken(fakeToken);
      }).toThrow('Token inválido');
    });

    it('should reject expired tokens', () => {
      const expiredToken = jwt.sign(
        { userId: '123', email: 'test@example.com', role: 'admin' },
        process.env.JWT_SECRET!,
        { expiresIn: '-1h' }
      );

      expect(() => {
        authService.verifyAccessToken(expiredToken);
      }).toThrow('Token expirado');
    });

    it('should reject tokens with missing required fields', () => {
      const incompleteToken = jwt.sign(
        { userId: '123' }, // Missing email and role
        process.env.JWT_SECRET!
      );

      expect(() => {
        authService.verifyAccessToken(incompleteToken);
      }).toThrow('Token com dados incompletos');
    });

    it('should reject malformed tokens', () => {
      expect(() => {
        authService.verifyAccessToken('not.a.valid.jwt');
      }).toThrow('Token inválido');

      expect(() => {
        authService.verifyAccessToken('');
      }).toThrow('Token inválido');

      expect(() => {
        authService.verifyAccessToken('invalid-format');
      }).toThrow('Token inválido');
    });

    it('should reject tokens with wrong algorithm', () => {
      // Create token with different algorithm
      const wrongAlgToken = jwt.sign(
        { userId: '123', email: 'test@example.com', role: 'admin' },
        process.env.JWT_SECRET!,
        { algorithm: 'HS512' } // Different from expected HS256
      );

      expect(() => {
        authService.verifyAccessToken(wrongAlgToken);
      }).toThrow('Token inválido');
    });

    it('should validate token issuer and audience', () => {
      const tokenWithWrongIssuer = jwt.sign(
        { userId: '123', email: 'test@example.com', role: 'admin' },
        process.env.JWT_SECRET!,
        { issuer: 'wrong-issuer', audience: 'topsmile-client' }
      );

      expect(() => {
        authService.verifyAccessToken(tokenWithWrongIssuer);
      }).toThrow('Token inválido');
    });
  });

  describe('Password Security', () => {
    it('should enforce minimum password length', async () => {
      const userData = {
        name: 'Test User',
        email: 'weak@example.com',
        password: TEST_PASSWORDS.WEAK
      };

      await expect(authService.register(userData))
        .rejects.toThrow('Senha deve ter pelo menos 8 caracteres');
    });

    it('should handle extremely long passwords', async () => {
      const userData = {
        name: 'Test User',
        email: 'long@example.com',
        password: TEST_PASSWORDS.LONG
      };

      // Should not crash, but may have reasonable limits
      await expect(authService.register(userData))
        .resolves.toBeDefined();
    });

    it('should not expose password in user objects', async () => {
      const userData = {
        name: 'Test User',
        email: 'nopass@example.com',
        password: TEST_PASSWORDS.SECURE
      };

      const result = await authService.register(userData);

      expect(result.data.user).not.toHaveProperty('password');
      expect(result.data.user.password).toBeUndefined();
    });

    it('should use same error message for invalid email and password', async () => {
      // Register a user first
      await authService.register({
        name: 'Test User',
        email: 'security@example.com',
        password: TEST_PASSWORDS.SECURE
      });

      // Test invalid email
      const invalidEmailPromise = authService.login({
        email: 'nonexistent@example.com',
        password: 'anypassword'
      });

      // Test invalid password
      const invalidPasswordPromise = authService.login({
        email: 'security@example.com',
        password: 'WrongPassword!'
      });

      const [emailError, passwordError] = await Promise.allSettled([
        invalidEmailPromise,
        invalidPasswordPromise
      ]);

      expect(emailError.status).toBe('rejected');
      expect(passwordError.status).toBe('rejected');
      
      const emailMessage = emailError.status === 'rejected' ? emailError.reason.message : '';
      const passwordMessage = passwordError.status === 'rejected' ? passwordError.reason.message : '';
      
      expect(emailMessage).toBe('E-mail ou senha inválidos');
      expect(passwordMessage).toBe('E-mail ou senha inválidos');
      expect(emailMessage).toBe(passwordMessage);
    });
  });

  describe('Account Lockout Protection', () => {
    it('should lock account after multiple failed attempts', async () => {
      const userData = {
        name: 'Lockout Test',
        email: 'lockout@example.com',
        password: TEST_PASSWORDS.SECURE
      };

      await authService.register(userData);

      // Make multiple failed login attempts
      const failedAttempts = Array(6).fill(null).map(() =>
        authService.login({
          email: userData.email,
          password: 'WrongPassword!'
        }).catch(e => e)
      );

      await Promise.all(failedAttempts);

      // Next attempt should indicate account is locked
      await expect(authService.login({
        email: userData.email,
        password: userData.password // Even correct password should be rejected
      })).rejects.toThrow(/bloqueada|locked/i);
    });

    it('should reset login attempts after successful login', async () => {
      const userData = {
        name: 'Reset Test',
        email: 'reset@example.com',
        password: TEST_PASSWORDS.SECURE
      };

      await authService.register(userData);

      // Make some failed attempts
      for (let i = 0; i < 3; i++) {
        await authService.login({
          email: userData.email,
          password: 'WrongPassword!'
        }).catch(() => {});
      }

      // Successful login should reset attempts
      const result = await authService.login({
        email: userData.email,
        password: userData.password
      });

      expect(result.success).toBe(true);

      // Verify user can still login (attempts were reset)
      const secondLogin = await authService.login({
        email: userData.email,
        password: userData.password
      });

      expect(secondLogin.success).toBe(true);
    });
  });

  describe('Refresh Token Security', () => {
    it('should rotate refresh tokens on use', async () => {
      const userData = {
        name: 'Rotation Test',
        email: 'rotation@example.com',
        password: TEST_PASSWORDS.SECURE
      };

      const loginResult = await authService.register(userData);
      const originalRefreshToken = loginResult.data.refreshToken;

      // Use refresh token
      const refreshResult = await authService.refreshAccessToken(originalRefreshToken);

      expect(refreshResult.refreshToken).not.toBe(originalRefreshToken);

      // Original token should no longer work
      await expect(authService.refreshAccessToken(originalRefreshToken))
        .rejects.toThrow('Token de atualização inválido ou expirado');
    });

    it('should limit number of refresh tokens per user', async () => {
      const userData = {
        name: 'Limit Test',
        email: 'limit@example.com',
        password: TEST_PASSWORDS.SECURE
      };

      await authService.register(userData);

      // Create multiple login sessions (each creates a refresh token)
      const loginPromises = Array(10).fill(null).map(() =>
        authService.login({
          email: userData.email,
          password: userData.password
        })
      );

      const results = await Promise.all(loginPromises);

      // Check that old tokens are revoked when limit is exceeded
      const user = await User.findOne({ email: userData.email });
      const activeTokens = await RefreshToken.find({
        userId: user!._id,
        isRevoked: false
      });

      expect(activeTokens.length).toBeLessThanOrEqual(5); // MAX_REFRESH_TOKENS_PER_USER
    });

    it('should reject refresh tokens for inactive users', async () => {
      const userData = {
        name: 'Inactive Test',
        email: 'inactive@example.com',
        password: TEST_PASSWORDS.SECURE
      };

      const loginResult = await authService.register(userData);
      const refreshToken = loginResult.data.refreshToken;

      // Deactivate user
      await User.findOneAndUpdate(
        { email: userData.email },
        { isActive: false }
      );

      await expect(authService.refreshAccessToken(refreshToken))
        .rejects.toThrow('Usuário inválido ou inativo');
    });
  });

  describe('Input Validation and Sanitization', () => {
    it('should handle SQL injection attempts in email', async () => {
      const maliciousEmail = "'; DROP TABLE users; --";

      await expect(authService.login({
        email: maliciousEmail,
        password: 'password'
      })).rejects.toThrow('E-mail ou senha inválidos');
    });

    it('should handle XSS attempts in name field', async () => {
      const xssName = '<script>alert("xss")</script>';

      const userData = {
        name: xssName,
        email: 'xss@example.com',
        password: TEST_PASSWORDS.SECURE
      };

      const result = await authService.register(userData);

      // Name should be sanitized or escaped
      expect(result.data.user.name).not.toContain('<script>');
    });

    it('should handle null and undefined inputs gracefully', async () => {
      await expect(authService.login({
        email: null as any,
        password: 'password'
      })).rejects.toThrow();

      await expect(authService.login({
        email: 'test@example.com',
        password: undefined as any
      })).rejects.toThrow();

      await expect(authService.register({
        name: undefined as any,
        email: 'test@example.com',
        password: TEST_PASSWORDS.SECURE
      })).rejects.toThrow();
    });

    it('should handle extremely long input strings', async () => {
      const longString = 'a'.repeat(10000);

      await expect(authService.register({
        name: longString,
        email: 'long@example.com',
        password: TEST_PASSWORDS.SECURE
      })).rejects.toThrow();

      await expect(authService.login({
        email: longString,
        password: 'password'
      })).rejects.toThrow();
    });
  });

  describe('Concurrent Access Security', () => {
    it('should handle concurrent login attempts safely', async () => {
      const userData = {
        name: 'Concurrent Test',
        email: 'concurrent@example.com',
        password: TEST_PASSWORDS.SECURE
      };

      await authService.register(userData);

      // Simulate concurrent login attempts
      const concurrentLogins = Array(10).fill(null).map(() =>
        authService.login({
          email: userData.email,
          password: userData.password
        })
      );

      const results = await Promise.all(concurrentLogins);

      // All should succeed
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });

    it('should handle concurrent password changes safely', async () => {
      const userData = {
        name: 'Password Change Test',
        email: 'passchange@example.com',
        password: TEST_PASSWORDS.SECURE
      };

      const registerResult = await authService.register(userData);
      const userId = registerResult.data.user.id!;

      // Simulate concurrent password change attempts
      const concurrentChanges = Array(5).fill(null).map((_, index) =>
        authService.changePassword(
          userId,
          TEST_PASSWORDS.SECURE,
          `NewPass${index}123!`
        ).catch(e => e)
      );

      const results = await Promise.all(concurrentChanges);

      // Only one should succeed, others should fail
      const successes = results.filter(r => r === true);
      expect(successes.length).toBe(1);
    });
  });

  describe('Password Reset Security', () => {
    it('should generate secure reset tokens', async () => {
      const userData = {
        name: 'Reset Token Test',
        email: 'resettoken@example.com',
        password: TEST_PASSWORDS.SECURE
      };

      await authService.register(userData);

      const token1 = await authService.forgotPassword(userData.email);
      const token2 = await authService.forgotPassword(userData.email);

      // Tokens should be different and sufficiently long
      expect(token1).not.toBe(token2);
      expect(token1.length).toBeGreaterThan(32);
      expect(token2.length).toBeGreaterThan(32);
    });

    it('should not reveal if email exists during password reset', async () => {
      // Test with non-existent email
      const result1 = await authService.forgotPassword('nonexistent@example.com');
      
      // Register user and test with existing email
      await authService.register({
        name: 'Test User',
        email: 'existing@example.com',
        password: TEST_PASSWORDS.SECURE
      });
      
      const result2 = await authService.forgotPassword('existing@example.com');

      // Both should return similar responses (empty string for security)
      expect(typeof result1).toBe('string');
      expect(typeof result2).toBe('string');
    });

    it('should expire reset tokens after time limit', async () => {
      const userData = {
        name: 'Token Expiry Test',
        email: 'tokenexpiry@example.com',
        password: TEST_PASSWORDS.SECURE
      };

      await authService.register(userData);
      const resetToken = await authService.forgotPassword(userData.email);

      // Manually expire the token by updating the database
      await User.findOneAndUpdate(
        { email: userData.email },
        { passwordResetExpires: new Date(Date.now() - 1000) } // 1 second ago
      );

      await expect(authService.resetPasswordWithToken(resetToken, 'NewPass123!'))
        .rejects.toThrow('Token de redefinição de senha inválido ou expirado');
    });
  });
});