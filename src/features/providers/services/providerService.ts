// src/features/providers/services/providerService.ts
import { BaseApiService } from '../../../services/base/BaseApiService';

class ProviderService extends BaseApiService {
    private endpoint = '/api/providers';

    async getProviders(params?: any): Promise<{ success: boolean; data: any[] }> {
        return this.get(this.endpoint, params);
    }

    async getById(id: string): Promise<{ success: boolean; data: any }> {
        return this.get(`${this.endpoint}/${id}`);
    }
}

export const providerService = new ProviderService();
