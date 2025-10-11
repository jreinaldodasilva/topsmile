import { authService } from '../../../../src/services/auth/authService';
import { User } from '../../../../src/models/User';

describe('AuthService - Login & Register', () => {
    describe('register', () => {
        it('should register new user', async () => {
            const result = await authService.register({
                name: 'New User',
                email: 'newuser@example.com',
                password: 'password123'
            });

            expect(result.success).toBe(true);
            expect(result.data.user.email).toBe('newuser@example.com');
            expect(result.data.accessToken).toBeDefined();
            expect(result.data.refreshToken).toBeDefined();
        });

        it('should reject duplicate email', async () => {
            await User.create({
                name: 'Existing',
                email: 'existing@example.com',
                password: 'password123'
            });

            await expect(authService.register({
                name: 'Duplicate',
                email: 'existing@example.com',
                password: 'password123'
            })).rejects.toThrow('já existe');
        });

        it('should reject short password', async () => {
            await expect(authService.register({
                name: 'User',
                email: 'short@example.com',
                password: 'short'
            })).rejects.toThrow('pelo menos 8 caracteres');
        });
    });

    describe('login', () => {
        beforeEach(async () => {
            await User.create({
                name: 'Login User',
                email: 'login@example.com',
                password: 'password123'
            });
        });

        it('should login with valid credentials', async () => {
            const result = await authService.login({
                email: 'login@example.com',
                password: 'password123'
            });

            expect(result.success).toBe(true);
            expect(result.data.user.email).toBe('login@example.com');
            expect(result.data.accessToken).toBeDefined();
        });

        it('should reject invalid password', async () => {
            await expect(authService.login({
                email: 'login@example.com',
                password: 'wrongpassword'
            })).rejects.toThrow('inválidos');
        });

        it('should reject non-existent user', async () => {
            await expect(authService.login({
                email: 'nonexistent@example.com',
                password: 'password123'
            })).rejects.toThrow('inválidos');
        });
    });
});
