import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { usePatientForm } from './usePatientForm';
import { apiService } from '../services/apiService';

jest.mock('../services/apiService');

const mockApiService = apiService as jest.Mocked<typeof apiService>;

describe('usePatientForm', () => {
    const mockPatient = {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        dateOfBirth: '2000-01-15',
        gender: 'male' as const,
        cpf: '123.456.789-00',
        address: {
            street: 'Main St',
            number: '123',
            neighborhood: 'Downtown',
            city: 'City',
            state: 'ST',
            zipCode: '12345-678'
        },
        emergencyContact: {
            name: 'Jane Doe',
            phone: '0987654321',
            relationship: 'Spouse'
        },
        medicalHistory: {
            allergies: ['Penicillin'],
            medications: ['Aspirin'],
            conditions: ['Hypertension'],
            notes: 'Test notes'
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockApiService.patients = {
            create: jest.fn().mockResolvedValue({ success: true, data: mockPatient }),
            update: jest.fn().mockResolvedValue({ success: true, data: mockPatient })
        } as any;
    });

    it('should initialize with empty form data', () => {
        const { result } = renderHook(() => usePatientForm());

        expect(result.current.formData.firstName).toBe('');
        expect(result.current.formData.email).toBe('');
        expect(result.current.errors).toEqual({});
        expect(result.current.submitting).toBe(false);
    });

    it('should populate form data when patient is provided', () => {
        const { result } = renderHook(() => usePatientForm(mockPatient));

        expect(result.current.formData.firstName).toBe('John');
        expect(result.current.formData.lastName).toBe('Doe');
        expect(result.current.formData.email).toBe('john@example.com');
    });

    it('should handle input change', () => {
        const { result } = renderHook(() => usePatientForm());

        act(() => {
            const event = {
                target: { name: 'firstName', value: 'Jane' }
            } as React.ChangeEvent<HTMLInputElement>;
            result.current.handleInputChange(event);
        });

        expect(result.current.formData.firstName).toBe('Jane');
    });

    it('should handle nested input change', () => {
        const { result } = renderHook(() => usePatientForm());

        act(() => {
            const event = {
                target: { name: 'address.street', value: 'New Street' }
            } as React.ChangeEvent<HTMLInputElement>;
            result.current.handleInputChange(event);
        });

        expect(result.current.formData.address.street).toBe('New Street');
    });

    it('should handle array input change', () => {
        const { result } = renderHook(() => usePatientForm());

        act(() => {
            result.current.handleArrayInputChange('allergies', 'Penicillin, Aspirin');
        });

        expect(result.current.formData.medicalHistory.allergies).toEqual(['Penicillin', 'Aspirin']);
    });

    it('should validate required fields', async () => {
        const { result } = renderHook(() => usePatientForm());

        await act(async () => {
            const event = { preventDefault: jest.fn() } as any;
            await result.current.handleSubmit(event);
        });

        expect(result.current.errors.firstName).toBe('Nome é obrigatório');
        expect(result.current.errors.phone).toBe('Telefone é obrigatório');
    });

    it('should validate email format', async () => {
        const { result } = renderHook(() => usePatientForm());

        act(() => {
            result.current.handleInputChange({
                target: { name: 'firstName', value: 'John' }
            } as any);
            result.current.handleInputChange({
                target: { name: 'phone', value: '1234567890' }
            } as any);
            result.current.handleInputChange({
                target: { name: 'email', value: 'invalid-email' }
            } as any);
            result.current.handleInputChange({
                target: { name: 'address.zipCode', value: '12345-678' }
            } as any);
        });

        await act(async () => {
            const event = { preventDefault: jest.fn() } as any;
            await result.current.handleSubmit(event);
        });

        expect(result.current.errors.email).toBe('E-mail inválido');
    });

    it('should create new patient on submit', async () => {
        const onSave = jest.fn();
        const { result } = renderHook(() => usePatientForm(null, onSave));

        act(() => {
            result.current.handleInputChange({ target: { name: 'firstName', value: 'John' } } as any);
            result.current.handleInputChange({ target: { name: 'phone', value: '1234567890' } } as any);
            result.current.handleInputChange({ target: { name: 'address.zipCode', value: '12345-678' } } as any);
        });

        await act(async () => {
            const event = { preventDefault: jest.fn() } as any;
            await result.current.handleSubmit(event);
        });

        await waitFor(() => {
            expect(mockApiService.patients.create).toHaveBeenCalled();
            expect(onSave).toHaveBeenCalledWith(mockPatient);
        });
    });

    it('should update existing patient on submit', async () => {
        const onSave = jest.fn();
        const { result } = renderHook(() => usePatientForm(mockPatient, onSave));

        await act(async () => {
            const event = { preventDefault: jest.fn() } as any;
            await result.current.handleSubmit(event);
        });

        await waitFor(() => {
            expect(mockApiService.patients.update).toHaveBeenCalledWith('1', expect.any(Object));
            expect(onSave).toHaveBeenCalledWith(mockPatient);
        });
    });

    it('should handle API error on submit', async () => {
        mockApiService.patients.create = jest.fn().mockResolvedValue({
            success: false,
            message: 'API Error'
        });

        const { result } = renderHook(() => usePatientForm());

        act(() => {
            result.current.handleInputChange({ target: { name: 'firstName', value: 'John' } } as any);
            result.current.handleInputChange({ target: { name: 'phone', value: '1234567890' } } as any);
            result.current.handleInputChange({ target: { name: 'address.zipCode', value: '12345-678' } } as any);
        });

        await act(async () => {
            const event = { preventDefault: jest.fn() } as any;
            await result.current.handleSubmit(event);
        });

        await waitFor(() => {
            expect(result.current.errors.submit).toBe('API Error');
        });
    });
});
