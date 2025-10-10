import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/apiService';
import type { Contact, ContactFilters } from '@topsmile/types';

export const useContacts = (filters: ContactFilters) => {
    return useQuery({
        queryKey: ['contacts', filters],
        queryFn: () => apiService.contacts.getAll(filters),
        retry: (failureCount, error) => {
            if (error instanceof Error && 'status' in error && (error as any).status === 404) {
                return false;
            }
            return failureCount < 3;
        },
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
    });
};

export const useMutateContact = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (contact: Partial<Contact> & { id?: string }) => {
            if (contact.id) {
                return apiService.contacts.update(contact.id, contact);
            }
            return apiService.contacts.create(contact);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
        }
    });
};

export const useDeleteContact = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => apiService.contacts.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
        }
    });
};
