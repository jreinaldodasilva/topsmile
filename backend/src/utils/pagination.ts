// backend/src/utils/pagination.ts
import { Model, Document, FilterQuery } from 'mongoose';

export interface PaginationOptions {
    page?: number;
    limit?: number;
    sort?: string;
}

export interface PaginatedResult<T> {
    items: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export async function paginate<T extends Document>(
    model: Model<T>,
    filter: FilterQuery<T>,
    options: PaginationOptions = {}
): Promise<PaginatedResult<T>> {
    const { page = 1, limit = 20, sort = '-createdAt' } = options;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        model.find(filter).sort(sort).skip(skip).limit(limit).lean(),
        model.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        items,
        pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    };
}
