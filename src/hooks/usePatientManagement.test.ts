import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { usePatientManagement } from './usePatientManagement';
import { apiService } from '../services/apiService';

jest.mock('../services/apiService');

const mockApiService = apiService as jest.Mocked<typeof apiService>;

describe('usePatientManagement', () => {
    const mockPatients = [
        {
            _id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '1234567890',
            fullName: 'John Doe',
            isActive: true
        },
        {
            _id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            phone: '0987654321',
            fullName: 'Jane Smith',
            isActive: true
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        mockApiService.patients = {
            getAll: jest.fn().mockResolvedValue({
                success: true,
                data: {
                    patients: mockPatients,
                    total: 2,
                    page: 1,
                    totalPages: 1,
                    hasNext: false,
                    hasPrev: false
                }
            }),
            delete: jest.fn().mockResolvedValue({ success: true })
        } as any;
    });

    it('should fetch patients on mount', async () => {
        const { result } = renderHook(() => usePatientManagement());

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.patients).toEqual(mockPatients);
        expect(result.current.total).toBe(2);
    });

    it('should handle search filter change', async () => {
        const { result } = renderHook(() => usePatientManagement());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        act(() => {
            const event = { target: { value: 'John' } } as React.ChangeEvent<HTMLInputElement>;
            result.current.handleSearchChange(event);
        });

        expect(result.current.filters.search).toBe('John');
        expect(result.current.filters.page).toBe(1);
    });

    it('should handle filter change', async () => {
        const { result } = renderHook(() => usePatientManagement());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        act(() => {
            result.current.handleFilterChange('isActive', false);
        });

        expect(result.current.filters.isActive).toBe(false);
        expect(result.current.filters.page).toBe(1);
    });

    it('should handle page change', async () => {
        const { result } = renderHook(() => usePatientManagement());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        act(() => {
            result.current.handlePageChange(2);
        });

        expect(result.current.filters.page).toBe(2);
    });

    it('should handle sort change', async () => {
        const { result } = renderHook(() => usePatientManagement());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        act(() => {
            result.current.handleSort('fullName');
        });

        expect(result.current.sort).toEqual({ fullName: 1 });

        act(() => {
            result.current.handleSort('fullName');
        });

        expect(result.current.sort).toEqual({ fullName: -1 });
    });

    it('should handle delete patient with confirmation', async () => {
        global.confirm = jest.fn(() => true);
        const { result } = renderHook(() => usePatientManagement());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        await act(async () => {
            await result.current.handleDeletePatient('1');
        });

        expect(mockApiService.patients.delete).toHaveBeenCalledWith('1');
        expect(global.confirm).toHaveBeenCalled();
    });

    it('should not delete patient without confirmation', async () => {
        global.confirm = jest.fn(() => false);
        const { result } = renderHook(() => usePatientManagement());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        await act(async () => {
            await result.current.handleDeletePatient('1');
        });

        expect(mockApiService.patients.delete).not.toHaveBeenCalled();
    });

    it('should add patient', async () => {
        const { result } = renderHook(() => usePatientManagement());
        const newPatient = { ...mockPatients[0], _id: '3' };

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        act(() => {
            result.current.addPatient(newPatient as any);
        });

        expect(result.current.patients[0]).toEqual(newPatient);
        expect(result.current.total).toBe(3);
    });

    it('should update patient', async () => {
        const { result } = renderHook(() => usePatientManagement());
        const updatedPatient = { ...mockPatients[0], firstName: 'Updated' };

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        act(() => {
            result.current.updatePatient(updatedPatient as any);
        });

        expect(result.current.patients[0].firstName).toBe('Updated');
    });

    it('should handle API error', async () => {
        mockApiService.patients.getAll = jest.fn().mockResolvedValue({
            success: false,
            message: 'API Error'
        });

        const { result } = renderHook(() => usePatientManagement());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('API Error');
        expect(result.current.patients).toEqual([]);
    });
});
