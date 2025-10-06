// backend/src/services/providerService.ts
import { Provider as IProvider } from '@topsmile/types';
import { Provider as ProviderModel } from '../models/Provider';
import { User as UserModel } from '../models/User';
import { BaseService } from './base/BaseService';
import { ValidationError, ConflictError, NotFoundError } from '../utils/errors';
import { cacheService, CacheKeys } from '../utils/cache';
import { CacheInvalidator } from '../utils/cacheInvalidation';
import mongoose from 'mongoose';

export interface CreateProviderData {
    name: string;
    email?: string;
    phone?: string;
    specialties: string[];
    licenseNumber?: string;
    workingHours?: any;
    timeZone?: string;
    bufferTimeBefore?: number;
    bufferTimeAfter?: number;
    appointmentTypes?: string[];
    clinicId: string;
    userId?: string;
}

export interface UpdateProviderData extends Partial<CreateProviderData> {
    isActive?: boolean;
}

export interface ProviderSearchFilters {
    clinicId: string;
    search?: string;
    isActive?: boolean;
    specialties?: string[];
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface ProviderSearchResult {
    providers: IProvider[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

class ProviderService extends BaseService<IProvider> {
    constructor() {
        super(ProviderModel);
    }

    private getDefaultWorkingHours() {
        return {
            monday: { start: '08:00', end: '18:00', isWorking: true },
            tuesday: { start: '08:00', end: '18:00', isWorking: true },
            wednesday: { start: '08:00', end: '18:00', isWorking: true },
            thursday: { start: '08:00', end: '18:00', isWorking: true },
            friday: { start: '08:00', end: '18:00', isWorking: true },
            saturday: { start: '08:00', end: '12:00', isWorking: false },
            sunday: { start: '08:00', end: '12:00', isWorking: false }
        };
    }

    async createProvider(data: CreateProviderData): Promise<IProvider> {
        if (!data.name || !data.clinicId) {
            throw new ValidationError('Nome e clínica são obrigatórios');
        }

        if (!mongoose.Types.ObjectId.isValid(data.clinicId)) {
            throw new ValidationError('ID da clínica inválido');
        }

        if (data.userId && !mongoose.Types.ObjectId.isValid(data.userId)) {
            throw new ValidationError('ID do usuário inválido');
        }

        if (data.email) {
            const existingProvider = await ProviderModel.findOne({
                email: data.email.toLowerCase(),
                clinic: data.clinicId,
                isActive: true
            });

            if (existingProvider) {
                throw new ConflictError('Já existe um profissional ativo com este e-mail nesta clínica');
            }
        }

        if (data.userId) {
            const user = await UserModel.findOne({ _id: data.userId, clinic: data.clinicId, isActive: true });
            if (!user) {
                throw new NotFoundError('Usuário não encontrado ou não pertence a esta clínica');
            }

            const existingProviderWithUser = await ProviderModel.findOne({
                user: data.userId,
                clinic: data.clinicId,
                isActive: true
            });

            if (existingProviderWithUser) {
                throw new ConflictError('Este usuário já está vinculado a outro profissional');
            }
        }

        const provider = new ProviderModel({
            ...data,
            clinic: data.clinicId,
            user: data.userId || undefined,
            email: data.email?.toLowerCase(),
            workingHours: data.workingHours || this.getDefaultWorkingHours(),
            timeZone: data.timeZone || 'America/Sao_Paulo',
            bufferTimeBefore: data.bufferTimeBefore || 15,
            bufferTimeAfter: data.bufferTimeAfter || 15,
            appointmentTypes: data.appointmentTypes || [],
            isActive: true
        });

        return await provider.save();
    }

    async getProviderById(providerId: string, clinicId: string): Promise<IProvider | null> {
        if (!mongoose.Types.ObjectId.isValid(providerId)) {
            throw new ValidationError('ID do profissional inválido');
        }

        // Try cache first
        const cacheKey = CacheKeys.provider(providerId);
        const cached = await cacheService.get<IProvider>(cacheKey);
        if (cached) return cached;

        const provider = await ProviderModel.findOne({ _id: providerId, clinic: clinicId })
            .populate('clinic', 'name')
            .populate('user', 'name email role')
            .populate('appointmentTypes', 'name duration color category');

        if (provider) {
            await cacheService.set(cacheKey, provider, 600);
        }

        return provider;
    }

    async updateProvider(providerId: string, clinicId: string, data: UpdateProviderData): Promise<IProvider | null> {
        if (!mongoose.Types.ObjectId.isValid(providerId)) {
            throw new ValidationError('ID do profissional inválido');
        }

        const provider = await ProviderModel.findOne({ _id: providerId, clinic: clinicId });
        if (!provider) return null;

        if (data.email && data.email.toLowerCase() !== provider.email) {
            const existingProvider = await ProviderModel.findOne({
                email: data.email.toLowerCase(),
                clinic: clinicId,
                isActive: true,
                _id: { $ne: providerId }
            });

            if (existingProvider) {
                throw new ConflictError('Já existe um profissional ativo com este e-mail nesta clínica');
            }
        }

        Object.keys(data).forEach(key => {
            if (key === 'email' && data.email) {
                (provider as any)[key] = data.email.toLowerCase();
            } else if (key === 'userId') {
                (provider as any).user = data.userId ? new mongoose.Types.ObjectId(data.userId) : undefined;
            } else if (data[key as keyof UpdateProviderData] !== undefined) {
                (provider as any)[key] = data[key as keyof UpdateProviderData];
            }
        });

        const updated = await provider.save();
        
        // Invalidate cache
        await CacheInvalidator.invalidateProvider(providerId);
        
        return updated;
    }

    async deleteProvider(providerId: string, clinicId: string): Promise<boolean> {
        if (!mongoose.Types.ObjectId.isValid(providerId)) {
            throw new ValidationError('ID do profissional inválido');
        }

        const provider = await ProviderModel.findOneAndUpdate(
            { _id: providerId, clinic: clinicId },
            { isActive: false },
            { new: true }
        );

        if (provider) {
            await CacheInvalidator.invalidateProvider(providerId);
        }

        return !!provider;
    }

    async searchProviders(filters: ProviderSearchFilters): Promise<ProviderSearchResult> {
        const { clinicId, search, isActive = true, specialties, page = 1, limit = 20, sortBy = 'name', sortOrder = 'asc' } = filters;

        if (!mongoose.Types.ObjectId.isValid(clinicId)) {
            throw new ValidationError('ID da clínica inválido');
        }

        const query: any = { clinic: clinicId, isActive };

        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), 'i');
            query.$or = [
                { name: searchRegex },
                { email: searchRegex },
                { phone: searchRegex },
                { licenseNumber: searchRegex },
                { specialties: { $in: [searchRegex] } }
            ];
        }

        if (specialties && specialties.length > 0) {
            query.specialties = { $in: specialties };
        }

        const skip = (page - 1) * limit;
        const sortOptions: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        const [providers, total] = await Promise.all([
            ProviderModel.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .populate('clinic', 'name')
                .populate('user', 'name email role')
                .populate('appointmentTypes', 'name duration color category'),
            ProviderModel.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            providers,
            total,
            page,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        };
    }

    async getProvidersByClinic(clinicId: string, isActive: boolean = true): Promise<IProvider[]> {
        if (!mongoose.Types.ObjectId.isValid(clinicId)) {
            throw new ValidationError('ID da clínica inválido');
        }

        return await ProviderModel.find({ clinic: clinicId, isActive })
            .sort({ name: 1 })
            .populate('clinic', 'name')
            .populate('user', 'name email role')
            .populate('appointmentTypes', 'name duration color category');
    }

    async updateWorkingHours(providerId: string, clinicId: string, workingHours: any): Promise<IProvider | null> {
        if (!mongoose.Types.ObjectId.isValid(providerId)) {
            throw new ValidationError('ID do profissional inválido');
        }

        return await ProviderModel.findOneAndUpdate(
            { _id: providerId, clinic: clinicId },
            { workingHours },
            { new: true, runValidators: true }
        )
        .populate('clinic', 'name')
        .populate('user', 'name email role')
        .populate('appointmentTypes', 'name duration color category');
    }

    async getProviderStats(clinicId: string): Promise<{
        total: number;
        active: number;
        inactive: number;
        bySpecialty: { specialty: string; count: number }[];
        withSystemAccess: number;
        recentlyAdded: number;
    }> {
        if (!mongoose.Types.ObjectId.isValid(clinicId)) {
            throw new ValidationError('ID da clínica inválido');
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [total, active, inactive, withSystemAccess, recentlyAdded, specialtyStats] = await Promise.all([
            ProviderModel.countDocuments({ clinic: clinicId }),
            ProviderModel.countDocuments({ clinic: clinicId, isActive: true }),
            ProviderModel.countDocuments({ clinic: clinicId, isActive: false }),
            ProviderModel.countDocuments({ clinic: clinicId, user: { $exists: true, $ne: null } }),
            ProviderModel.countDocuments({ clinic: clinicId, createdAt: { $gte: thirtyDaysAgo } }),
            ProviderModel.aggregate([
                { $match: { clinic: new mongoose.Types.ObjectId(clinicId) } },
                { $unwind: '$specialties' },
                { $group: { _id: '$specialties', count: { $sum: 1 } } },
                { $project: { specialty: '$_id', count: 1, _id: 0 } },
                { $sort: { count: -1 } }
            ])
        ]);

        return { total, active, inactive, bySpecialty: specialtyStats, withSystemAccess, recentlyAdded };
    }
}

export const providerService = new ProviderService();
