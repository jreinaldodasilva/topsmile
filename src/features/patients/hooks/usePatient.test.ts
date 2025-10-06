// src/features/patients/hooks/usePatient.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { usePatient } from './usePatient';
import { patientService } from '../services/patientService';

jest.mock('../services/patientService');

describe('usePatient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with empty state', () => {
    const { result } = renderHook(() => usePatient());
    expect(result.current.patients).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('searches patients successfully', async () => {
    const mockPatients = [{ id: '1', name: 'John Doe' }];
    (patientService.search as jest.Mock).mockResolvedValue({
      data: mockPatients
    });

    const { result } = renderHook(() => usePatient());

    await act(async () => {
      await result.current.search('John');
    });

    await waitFor(() => {
      expect(result.current.patients).toEqual(mockPatients);
      expect(result.current.loading).toBe(false);
    });
  });

  it('gets patient by id', async () => {
    const mockPatient = { id: '1', name: 'John Doe' };
    (patientService.getById as jest.Mock).mockResolvedValue({
      data: mockPatient
    });

    const { result } = renderHook(() => usePatient());

    await act(async () => {
      await result.current.getById('1');
    });

    await waitFor(() => {
      expect(result.current.patient).toEqual(mockPatient);
    });
  });

  it('handles error', async () => {
    (patientService.search as jest.Mock).mockRejectedValue(
      new Error('Search failed')
    );

    const { result } = renderHook(() => usePatient());

    await act(async () => {
      await result.current.search('John');
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Search failed');
    });
  });
});
