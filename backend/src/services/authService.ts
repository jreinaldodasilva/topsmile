// backend/src/services/authService.ts
import jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/User';
import { Clinic } from '../models/Clinic';

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    clinic?: {
        name: string;
        phone: string;
        address: {
            street: string;
            number: string;
            neighborhood: string;
            city: string;
            state: string;
            zipCode: string;
        };
    };
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: true;
    data: {
        user: IUser;
        token: string;
        expiresIn: string;
    };
}

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
    clinicId?: string;
}

class AuthService {
    private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

    // Generate JWT token
    private generateToken(payload: TokenPayload): string {
        const cleanPayload: TokenPayload = {
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
            ...(payload.clinicId ? { clinicId: payload.clinicId } : {})
        };

        const options: SignOptions = {
            expiresIn: this.JWT_EXPIRES_IN as SignOptions['expiresIn'],
            issuer: 'topsmile-api',
            audience: 'topsmile-client'
        };

        return jwt.sign(
            cleanPayload,
            this.JWT_SECRET as string, // ✅ Ensure it's typed as string
            options
        );
    }

    // Verify JWT token
    verifyToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, this.JWT_SECRET, {
                issuer: 'topsmile-api',
                audience: 'topsmile-client'
            }) as TokenPayload;
        } catch (error) {
            throw new Error('Token inválido');
        }
    }

    // Register new user with clinic
    async register(data: RegisterData): Promise<AuthResponse> {
        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email: data.email });
            if (existingUser) {
                throw new Error('E-mail já está em uso');
            }

            let clinicId;

            // Create clinic if provided
            if (data.clinic) {
                const clinic = new Clinic({
                    name: data.clinic.name,
                    email: data.email, // Use user email as clinic email
                    phone: data.clinic.phone,
                    address: data.clinic.address,
                    subscription: {
                        plan: 'basic',
                        status: 'active',
                        startDate: new Date()
                    },
                    settings: {
                        timezone: 'America/Sao_Paulo',
                        workingHours: {
                            monday: { start: '08:00', end: '18:00', isWorking: true },
                            tuesday: { start: '08:00', end: '18:00', isWorking: true },
                            wednesday: { start: '08:00', end: '18:00', isWorking: true },
                            thursday: { start: '08:00', end: '18:00', isWorking: true },
                            friday: { start: '08:00', end: '18:00', isWorking: true },
                            saturday: { start: '08:00', end: '12:00', isWorking: false },
                            sunday: { start: '08:00', end: '12:00', isWorking: false }
                        },
                        appointmentDuration: 60,
                        allowOnlineBooking: true
                    }
                });

                const savedClinic = await clinic.save();
                clinicId = savedClinic._id;
            }

            // Create user
            const user = new User({
                name: data.name,
                email: data.email,
                password: data.password,
                role: clinicId ? 'admin' : 'super_admin', // First user is admin of their clinic
                clinic: clinicId,
                isActive: true
            });

            const savedUser = await user.save();

            // Generate token
            const token = this.generateToken({
                userId: (savedUser as any)._id.toString(),
                email: savedUser.email,
                role: savedUser.role,
                clinicId: clinicId?.toString()
            });

            // Update last login
            savedUser.lastLogin = new Date();
            await savedUser.save();

            return {
                success: true,
                data: {
                    user: savedUser,
                    token,
                    expiresIn: this.JWT_EXPIRES_IN
                }
            };
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro ao criar usuário');
        }
    }

    // Login user
    async login(data: LoginData): Promise<AuthResponse> {
        try {
            // Find user with password field included
            const user = await User.findOne({ email: data.email })
                .select('+password')
                .populate('clinic', 'name subscription');

            if (!user) {
                throw new Error('E-mail ou senha inválidos');
            }

            if (!user.isActive) {
                throw new Error('Usuário desativado. Entre em contato com o suporte');
            }

            // Check password
            const isPasswordValid = await user.comparePassword(data.password);
            if (!isPasswordValid) {
                throw new Error('E-mail ou senha inválidos');
            }

            // Generate token
            const token = this.generateToken({
                userId: (user as any)._id.toString(),
                email: user.email,
                role: user.role,
                clinicId: user.clinic?._id.toString()
            });

            // Update last login
            user.lastLogin = new Date();
            await user.save();

            // Remove password from response
            const userResponse = user.toJSON();

            return {
                success: true,
                data: {
                    user: userResponse as IUser,
                    token,
                    expiresIn: this.JWT_EXPIRES_IN
                }
            };
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro ao fazer login');
        }
    }

    // Get user by ID with clinic info
    async getUserById(userId: string): Promise<IUser | null> {
        try {
            return await User.findById(userId).populate('clinic', 'name subscription settings');
        } catch (error) {
            throw new Error('Erro ao buscar usuário');
        }
    }

    // Change password
    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
        try {
            const user = await User.findById(userId).select('+password');
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            const isCurrentPasswordValid = await user.comparePassword(currentPassword);
            if (!isCurrentPasswordValid) {
                throw new Error('Senha atual incorreta');
            }

            user.password = newPassword;
            await user.save();

            return true;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro ao alterar senha');
        }
    }

    // Reset password (for forgot password feature)
    async resetPassword(email: string): Promise<string> {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('E-mail não encontrado');
            }

            // Generate temporary password
            const tempPassword = Math.random().toString(36).slice(-8);
            user.password = tempPassword;
            await user.save();

            return tempPassword;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro ao resetar senha');
        }
    }

    // Refresh token
    async refreshToken(oldToken: string): Promise<string> {
        try {
            const decoded = this.verifyToken(oldToken);
            const user = await this.getUserById(decoded.userId);

            if (!user || !user.isActive) {
                throw new Error('Usuário inválido');
            }

            return this.generateToken({
                userId: (user as any)._id.toString(),
                email: user.email,
                role: user.role,
                clinicId: user.clinic?._id.toString()
            });
        } catch (error) {
            throw new Error('Erro ao renovar token');
        }
    }
}

export const authService = new AuthService();
