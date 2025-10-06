// src/features/appointments/hooks/useAppointments.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAppointments } from './useAppointments';
import { appointmentService } from '../services/appointmentService';

jest.mock('../services/appointmentService');

describe('useAppointments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useAppointments());
    expect(result.current.appointments).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('fetches appointments successfully', async () => {
    const mockAppointments = [{ id: '1', patient: 'John' }];
    (appointmentService.getAppointments as jest.Mock).mockResolvedValue({
      data: mockAppointments
    });

    const { result } = renderHook(() => useAppointments());

    await act(async () => {
      await result.current.getAppointments({ startDate: '2024-01-01', endDate: '2024-01-31' });
    });

    await waitFor(() => {
      expect(result.current.appointments).toEqual(mockAppointments);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('handles fetch error', async () => {
    (appointmentService.getAppointments as jest.Mock).mockRejectedValue(
      new Error('Network error')
    );

    const { result } = renderHook(() => useAppointments());

    await act(async () => {
      await result.current.getAppointments({ startDate: '2024-01-01', endDate: '2024-01-31' });
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Network error');
      expect(result.current.loading).toBe(false);
    });
  });

  it('creates appointment', async () => {
    const mockAppointment = { id: '1', patient: 'John' };
    (appointmentService.create as jest.Mock).mockResolvedValue({
      data: mockAppointment
    });

    const { result } = renderHook(() => useAppointments());

    await act(async () => {
      await result.current.create({ patient: 'John', provider: 'Dr. Smith' });
    });

    await waitFor(() => {
      expect(result.current.appointment).toEqual(mockAppointment);
    });
  });

  it('updates appointment status', async () => {
    const mockAppointment = { id: '1', status: 'confirmed' };
    (appointmentService.updateStatus as jest.Mock).mockResolvedValue({
      data: mockAppointment
    });

    const { result } = renderHook(() => useAppointments());

    await act(async () => {
      await result.current.updateStatus('1', 'confirmed');
    });

    await waitFor(() => {
      expect(result.current.appointment).toEqual(mockAppointment);
    });
  });
});
