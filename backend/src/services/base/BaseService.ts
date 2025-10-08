// backend/src/services/base/BaseService.ts
import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import { AppError } from '../../utils/errors/errors';

/**
 * Pagination options for list queries
 */
export interface PaginationOptions {
    /** Page number (1-indexed) */
    page?: number;
    /** Items per page */
    limit?: number;
    /** Sort field and direction (e.g., '-createdAt') */
    sort?: string;
}

/**
 * Paginated result with items and metadata
 */
export interface PaginatedResult<T> {
    /** Array of items for current page */
    items: T[];
    /** Pagination metadata */
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

/**
 * Base service class providing common CRUD operations
 * @template T - Document type extending Mongoose Document
 */
export abstract class BaseService<T extends Document> {
    /**
     * @param model - Mongoose model instance
     */
    constructor(protected model: Model<T>) {}

    /**
     * Find document by ID
     * @param id - Document ID
     * @returns Document or null if not found
     */
    async findById(id: string): Promise<T | null> {
        try {
            return await this.model.findById(id).lean() as any;
        } catch (error) {
            throw new AppError(`Erro ao buscar ${this.model.modelName}`, 500);
        }
    }

    /**
     * Find single document matching filter
     * @param filter - MongoDB filter query
     * @returns First matching document or null
     */
    async findOne(filter: FilterQuery<T>): Promise<T | null> {
        try {
            return await this.model.findOne(filter).lean() as any;
        } catch (error) {
            throw new AppError(`Erro ao buscar ${this.model.modelName}`, 500);
        }
    }

    /**
     * Find all documents matching filter
     * @param filter - MongoDB filter query (default: {})
     * @returns Array of matching documents
     */
    async findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
        try {
            return await this.model.find(filter).lean() as any;
        } catch (error) {
            throw new AppError(`Erro ao listar ${this.model.modelName}`, 500);
        }
    }

    /**
     * Paginate documents with metadata
     * @param filter - MongoDB filter query
     * @param options - Pagination options (page, limit, sort)
     * @returns Paginated result with items and metadata
     */
    async paginate(
        filter: FilterQuery<T>,
        options: PaginationOptions = {}
    ): Promise<PaginatedResult<T>> {
        const { page = 1, limit = 20, sort = '-createdAt' } = options;
        const skip = (page - 1) * limit;

        try {
            const [items, total] = await Promise.all([
                this.model.find(filter).sort(sort).skip(skip).limit(limit).lean() as any,
                this.model.countDocuments(filter)
            ]);

            return {
                items,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    hasNext: page * limit < total,
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            throw new AppError(`Erro ao paginar ${this.model.modelName}`, 500);
        }
    }

    /**
     * Create new document
     * @param data - Document data
     * @returns Created document
     */
    async create(data: Partial<T>): Promise<T> {
        try {
            const doc = new this.model(data);
            return await doc.save();
        } catch (error) {
            throw new AppError(`Erro ao criar ${this.model.modelName}`, 500);
        }
    }

    /**
     * Update document by ID
     * @param id - Document ID
     * @param data - Update data
     * @returns Updated document or null
     */
    async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
        try {
            return await this.model.findByIdAndUpdate(id, data, { 
                new: true,
                runValidators: true 
            }).lean() as any;
        } catch (error) {
            throw new AppError(`Erro ao atualizar ${this.model.modelName}`, 500);
        }
    }

    /**
     * Permanently delete document
     * @param id - Document ID
     * @returns True if deleted, false otherwise
     */
    async delete(id: string): Promise<boolean> {
        try {
            const result = await this.model.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new AppError(`Erro ao deletar ${this.model.modelName}`, 500);
        }
    }

    /**
     * Soft delete document (sets isDeleted flag)
     * @param id - Document ID
     * @returns Updated document or null
     */
    async softDelete(id: string): Promise<T | null> {
        try {
            return await this.model.findByIdAndUpdate(
                id,
                { isDeleted: true, deletedAt: new Date() } as any,
                { new: true }
            ).lean() as any;
        } catch (error) {
            throw new AppError(`Erro ao deletar ${this.model.modelName}`, 500);
        }
    }

    /**
     * Count documents matching filter
     * @param filter - MongoDB filter query (default: {})
     * @returns Document count
     */
    async count(filter: FilterQuery<T> = {}): Promise<number> {
        try {
            return await this.model.countDocuments(filter);
        } catch (error) {
            throw new AppError(`Erro ao contar ${this.model.modelName}`, 500);
        }
    }

    /**
     * Check if document exists matching filter
     * @param filter - MongoDB filter query
     * @returns True if exists, false otherwise
     */
    async exists(filter: FilterQuery<T>): Promise<boolean> {
        try {
            const count = await this.model.countDocuments(filter).limit(1);
            return count > 0;
        } catch (error) {
            throw new AppError(`Erro ao verificar ${this.model.modelName}`, 500);
        }
    }
}
