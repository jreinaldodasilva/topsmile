import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, Contact, ContactFilters } from '../services/apiService';

export const useContacts = (filters: ContactFilters) => {
  return useQuery({
    queryKey: ['contacts', filters],
    queryFn: () => apiService.contacts.getAll(filters),
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
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.contacts.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};
