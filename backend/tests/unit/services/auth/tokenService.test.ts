import { authService } from '../../../../src/services/auth/authService';
import { User } from '../../../../src/models/User';
import { RefreshToken } from '../../../../src/models/RefreshToken';

describe('AuthService - Token Management', () => {
    describe('verifyAccessToken', () => {
        it('should verify valid token', async () => {
            const user = await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'admin'
            });

            const result = await authService.login({
                email: 'test@example.com',
                password: 'password123'
            });

            const payload = await authService.verifyAccessToken(result.data.accessToken);
            expect(payload.userId).toBe(user._id.toString());
            expect(payload.email).toBe('test@example.com');
        });

        it('should reject invalid token', async () => {
            await expect(authService.verifyAccessToken('invalid-token'))
                .rejects.toThrow('Token inválido');
        });

        it('should reject empty token', async () => {
            await expect(authService.verifyAccessToken(''))
                .rejects.toThrow('Token inválido');
        });
    });

    describe('refreshAccessToken', () => {
        it('should refresh valid token', async () => {
            await User.create({
                name: 'Test User',
                email: 'refresh@example.com',
                password: 'password123'
            });

            const loginResult = await authService.login({
                email: 'refresh@example.com',
                password: 'password123'
            });

            const refreshResult = await authService.refreshAccessToken(loginResult.data.refreshToken);
            expect(refreshResult.accessToken).toBeDefined();
            expect(refreshResult.refreshToken).toBeDefined();
            expect(refreshResult.refreshToken).not.toBe(loginResult.data.refreshToken);
        });

        it('should reject invalid refresh token', async () => {
            await expect(authService.refreshAccessToken('invalid-refresh-token'))
                .rejects.toThrow();
        });
    });

    describe('logout', () => {
        it('should revoke refresh token', async () => {
            await User.create({
                name: 'Test User',
                email: 'logout@example.com',
                password: 'password123'
            });

            const result = await authService.login({
                email: 'logout@example.com',
                password: 'password123'
            });

            await authService.logout(result.data.refreshToken);

            const token = await RefreshToken.findOne({ token: result.data.refreshToken });
            expect(token?.isRevoked).toBe(true);
        });
    });
});
