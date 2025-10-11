// backend/src/services/base/IBaseService.ts
import type { FilterQuery, UpdateQuery } from 'mongoose';

/**
 * Standard service interface for consistent method signatures
 * All services should follow this pattern: (id, clinicId, data)
 */
export interface IBaseService<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>> {
    /**
     * Create new entity
     * @param data - Entity data
     * @param clinicId - Clinic ID for multi-tenant isolation
     * @returns Created entity
     */
    create(data: CreateDTO, clinicId: string): Promise<T>;

    /**
     * Find entity by ID
     * @param id - Entity ID
     * @param clinicId - Clinic ID for multi-tenant isolation
     * @returns Entity or null if not found
     */
    findById(id: string, clinicId: string): Promise<T | null>;

    /**
     * Update entity by ID
     * @param id - Entity ID
     * @param clinicId - Clinic ID for multi-tenant isolation
     * @param data - Update data
     * @returns Updated entity or null if not found
     */
    update(id: string, clinicId: string, data: UpdateDTO): Promise<T | null>;

    /**
     * Delete entity (soft delete)
     * @param id - Entity ID
     * @param clinicId - Clinic ID for multi-tenant isolation
     * @returns True if deleted, false otherwise
     */
    delete(id: string, clinicId: string): Promise<boolean>;

    /**
     * Find all entities for clinic
     * @param clinicId - Clinic ID for multi-tenant isolation
     * @param filter - Additional filter criteria
     * @returns Array of entities
     */
    findAll(clinicId: string, filter?: FilterQuery<T>): Promise<T[]>;
}
