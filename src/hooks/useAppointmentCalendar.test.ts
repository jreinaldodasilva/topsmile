import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useAppointmentCalendar } from './useAppointmentCalendar';
import { apiService } from '../services/apiService';

jest.mock('../services/apiService');

const mockApiService = apiService as jest.Mocked<typeof apiService>;

describe('useAppointmentCalendar', () => {
    const mockAppointments = [
        {
            _id: '1',
            patient: { _id: 'p1', fullName: 'John Doe' },
            provider: { _id: 'pr1', name: 'Dr. Smith' },
            scheduledStart: '2024-01-15T10:00:00',
            scheduledEnd: '2024-01-15T11:00:00',
            status: 'scheduled'
        },
        {
            _id: '2',
            patient: { _id: 'p2', fullName: 'Jane Smith' },
            provider: { _id: 'pr1', name: 'Dr. Smith' },
            scheduledStart: '2024-01-15T14:00:00',
            scheduledEnd: '2024-01-15T15:00:00',
            status: 'confirmed'
        }
    ];

    const mockProviders = [
        { _id: 'pr1', name: 'Dr. Smith', isActive: true },
        { _id: 'pr2', name: 'Dr. Jones', isActive: true }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        mockApiService.appointments = {
            getAll: jest.fn().mockResolvedValue({
                success: true,
                data: mockAppointments
            })
        } as any;
        mockApiService.providers = {
            getAll: jest.fn().mockResolvedValue({
                success: true,
                data: mockProviders
            })
        } as any;
    });

    it('should fetch appointments and providers on mount', async () => {
        const { result } = renderHook(() => useAppointmentCalendar());

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.appointments).toEqual(mockAppointments);
        expect(result.current.providers).toEqual(mockProviders);
    });

    it('should handle filter change', async () => {
        const { result } = renderHook(() => useAppointmentCalendar());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        act(() => {
            result.current.handleFilterChange('providerId', 'pr1');
        });

        expect(result.current.filters.providerId).toBe('pr1');
    });

    it('should handle view change', async () => {
        const { result } = renderHook(() => useAppointmentCalendar());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        act(() => {
            result.current.handleFilterChange('view', 'day');
        });

        expect(result.current.filters.view).toBe('day');
    });

    it('should navigate to next period', async () => {
        const { result } = renderHook(() => useAppointmentCalendar());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        const initialDate = result.current.currentDate;

        act(() => {
            result.current.navigateDate('next');
        });

        expect(result.current.currentDate.getTime()).toBeGreaterThan(initialDate.getTime());
    });

    it('should navigate to previous period', async () => {
        const { result } = renderHook(() => useAppointmentCalendar());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        const initialDate = result.current.currentDate;

        act(() => {
            result.current.navigateDate('prev');
        });

        expect(result.current.currentDate.getTime()).toBeLessThan(initialDate.getTime());
    });

    it('should go to today', async () => {
        const { result } = renderHook(() => useAppointmentCalendar());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        act(() => {
            result.current.navigateDate('next');
        });

        act(() => {
            result.current.goToToday();
        });

        const today = new Date();
        expect(result.current.currentDate.toDateString()).toBe(today.toDateString());
    });

    it('should generate date range label for day view', async () => {
        const { result } = renderHook(() => useAppointmentCalendar());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        act(() => {
            result.current.handleFilterChange('view', 'day');
        });

        const label = result.current.getDateRangeLabel();
        expect(label).toBeTruthy();
    });

    it('should generate date range label for week view', async () => {
        const { result } = renderHook(() => useAppointmentCalendar());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        const label = result.current.getDateRangeLabel();
        expect(label).toContain('-');
    });

    it('should add appointment', async () => {
        const { result } = renderHook(() => useAppointmentCalendar());
        const newAppointment = { ...mockAppointments[0], _id: '3' };

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        act(() => {
            result.current.addAppointment(newAppointment as any);
        });

        expect(result.current.appointments[0]).toEqual(newAppointment);
    });

    it('should update appointment', async () => {
        const { result } = renderHook(() => useAppointmentCalendar());
        const updatedAppointment = { ...mockAppointments[0], status: 'completed' };

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        act(() => {
            result.current.updateAppointment(updatedAppointment as any);
        });

        expect(result.current.appointments[0].status).toBe('completed');
    });

    it('should handle API error', async () => {
        mockApiService.appointments.getAll = jest.fn().mockResolvedValue({
            success: false,
            message: 'API Error'
        });

        const { result } = renderHook(() => useAppointmentCalendar());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('API Error');
        expect(result.current.appointments).toEqual([]);
    });
});
