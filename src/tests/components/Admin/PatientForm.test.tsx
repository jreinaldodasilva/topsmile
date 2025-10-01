import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PatientForm from '../../../components/Admin/Forms/PatientForm';
import { apiService } from '../../../services/apiService';
import type { Patient } from '../../../../packages/types/src/index';

// Mock the API service
jest.mock('../../../services/apiService', () => ({
  apiService: {
    patients: {
      create: jest.fn(),
      update: jest.fn()
    }
  }
}));

const mockApiService = apiService as jest.Mocked<typeof apiService>;

describe('PatientForm Component', () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps = {
    onSave: mockOnSave,
    onCancel: mockOnCancel,
    loading: false
  };

  const mockPatient: Patient = {
    _id: '507f1f77bcf86cd799439011',
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao@example.com',
    phone: '(11) 99999-9999',
    dateOfBirth: new Date('1990-01-01'),
    gender: 'male',
    cpf: '123.456.789-00',
    address: {
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    emergencyContact: {
      name: 'Maria Silva',
      phone: '(11) 88888-8888',
      relationship: 'Mãe'
    },
    medicalHistory: {
      allergies: ['Penicilina'],
      medications: ['Aspirina'],
      conditions: ['Hipertensão'],
      notes: 'Paciente com histórico de alergias'
    },
    status: 'active',
    clinic: '507f1f77bcf86cd799439012',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all form sections', () => {
      render(<PatientForm {...defaultProps} />);

      expect(screen.getByText('Informações Básicas')).toBeInTheDocument();
      expect(screen.getByText('Endereço')).toBeInTheDocument();
      expect(screen.getByText('Contato de Emergência')).toBeInTheDocument();
      expect(screen.getByText('Histórico Médico')).toBeInTheDocument();
    });

    it('should render form actions', () => {
      render(<PatientForm {...defaultProps} />);

      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /criar paciente/i })).toBeInTheDocument();
    });

    it('should show update button when editing existing patient', () => {
      render(<PatientForm {...defaultProps} patient={mockPatient} />);

      expect(screen.getByRole('button', { name: /atualizar paciente/i })).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for required fields', async () => {
      const user = userEvent.setup();
      render(<PatientForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /criar paciente/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
        expect(screen.getByText('Telefone é obrigatório')).toBeInTheDocument();
        expect(screen.getByText('CEP é obrigatório')).toBeInTheDocument();
      });
    });

    it('should validate email format', async () => {
      const user = userEvent.setup();
      render(<PatientForm {...defaultProps} />);

      const emailInput = screen.getByLabelText(/e-mail/i);
      const submitButton = screen.getByRole('button', { name: /criar paciente/i });

      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('E-mail inválido')).toBeInTheDocument();
      });
    });

    it('should validate phone format', async () => {
      const user = userEvent.setup();
      render(<PatientForm {...defaultProps} />);

      const phoneInput = screen.getByLabelText(/telefone \*/i);
      const submitButton = screen.getByRole('button', { name: /criar paciente/i });

      await user.type(phoneInput, '123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Telefone inválido')).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should create new patient with valid data', async () => {
      const user = userEvent.setup();
      mockApiService.patients.create.mockResolvedValue({
        success: true,
        data: mockPatient
      });

      render(<PatientForm {...defaultProps} />);

      // Fill required fields
      await user.type(screen.getByLabelText(/nome \*/i), 'João');
      await user.type(screen.getByLabelText(/telefone \*/i), '(11) 99999-9999');
      await user.type(screen.getByLabelText(/cep/i), '01234-567');

      const submitButton = screen.getByRole('button', { name: /criar paciente/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockApiService.patients.create).toHaveBeenCalledWith(
          expect.objectContaining({
            firstName: 'João',
            phone: '(11) 99999-9999'
          })
        );
        expect(mockOnSave).toHaveBeenCalledWith(mockPatient);
      });
    });

    it('should handle API errors during submission', async () => {
      const user = userEvent.setup();
      mockApiService.patients.create.mockResolvedValue({
        success: false,
        message: 'Email já existe'
      });

      render(<PatientForm {...defaultProps} />);

      // Fill required fields
      await user.type(screen.getByLabelText(/nome \*/i), 'João');
      await user.type(screen.getByLabelText(/telefone \*/i), '(11) 99999-9999');
      await user.type(screen.getByLabelText(/cep/i), '01234-567');

      const submitButton = screen.getByRole('button', { name: /criar paciente/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Email já existe')).toBeInTheDocument();
      });
    });
  });

  describe('Form Actions', () => {
    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<PatientForm {...defaultProps} />);

      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });
});