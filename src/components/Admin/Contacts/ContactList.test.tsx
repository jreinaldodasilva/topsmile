import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../../mocks/server';
import ContactList from './ContactList';
import type { Clinic } from '@topsmile/types';

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('ContactList', () => {
    it('should render a list of contacts', async () => {
        server.use(
            http.get('*/api/admin/contacts', () => {
                return HttpResponse.json({
                    contacts: [
                        {
                            id: '1',
                            name: 'John Doe',
                            email: 'john.doe@example.com',
                            clinic: 'Test Clinic 1',
                            phone: '111111111',
                            specialty: 'Test Specialty 1',
                            status: 'new',
                            createdAt: new Date().toISOString()
                        },
                        {
                            id: '2',
                            name: 'Jane Doe',
                            email: 'jane.doe@example.com',
                            clinic: 'Test Clinic 2',
                            phone: '222222222',
                            specialty: 'Test Specialty 2',
                            status: 'contacted',
                            createdAt: new Date().toISOString()
                        }
                    ],
                    total: 2,
                    page: 1,
                    totalPages: 1
                });
            })
        );

        render(<ContactList />, { wrapper });

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Doe')).toBeInTheDocument();
        });
    });
});
