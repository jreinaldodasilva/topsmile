// src/pages/Admin/PatientDetail.test.tsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PatientDetail from './PatientDetail';
import { apiService } from '../../services/apiService';

jest.mock('../../services/apiService');
jest.mock('../../components/Clinical/DentalChart', () => ({
  DentalChart: ({ patientId }: { patientId: string }) => <div data-testid="dental-chart">DentalChart: {patientId}</div>
}));
jest.mock('../../components/Clinical/TreatmentPlan', () => ({
  TreatmentPlanView: ({ plan }: { plan: any }) => <div data-testid="treatment-plan">{plan.title}</div>
}));
jest.mock('../../components/Clinical/ClinicalNotes', () => ({
  NotesTimeline: ({ notes }: { notes: any[] }) => <div data-testid="notes-timeline">{notes.length} notes</div>
}));
jest.mock('../../components/Clinical/MedicalHistory', () => ({
  MedicalHistoryForm: ({ patientId }: { patientId: string }) => <div data-testid="medical-history">History: {patientId}</div>
}));

const mockPatient = {
  _id: 'patient-123',
  firstName: 'João',
  lastName: 'Silva',
  email: 'joao@example.com',
  phone: '(11) 98765-4321',
  cpf: '123.456.789-00',
  dateOfBirth: '1990-01-15',
  gender: 'male',
  status: 'active',
  address: {
    street: 'Rua Teste',
    number: '123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567'
  }
};

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'patient-123' }),
  useNavigate: () => mockNavigate
}));

describe('PatientDetail Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (apiService.patients.getOne as jest.Mock).mockResolvedValue({
      success: true,
      data: mockPatient
    });
  });

  test('loads and displays patient data', async () => {
    render(
      <BrowserRouter>
        <PatientDetail />
      </BrowserRouter>
    );

    expect(screen.getByText('Carregando...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });

    expect(screen.getByText('joao@example.com')).toBeInTheDocument();
  });

  test('displays all tabs', async () => {
    render(
      <BrowserRouter>
        <PatientDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Visão Geral')).toBeInTheDocument();
    });

    expect(screen.getByText('Odontograma')).toBeInTheDocument();
    expect(screen.getByText('Plano de Tratamento')).toBeInTheDocument();
    expect(screen.getByText('Notas Clínicas')).toBeInTheDocument();
    expect(screen.getByText('Histórico Médico')).toBeInTheDocument();
  });

  test('switches between tabs', async () => {
    render(
      <BrowserRouter>
        <PatientDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });

    // Click Odontograma tab
    fireEvent.click(screen.getByText('Odontograma'));
    await waitFor(() => {
      expect(screen.getByTestId('dental-chart')).toBeInTheDocument();
    });
  });

  test('edit mode toggles correctly', async () => {
    render(
      <BrowserRouter>
        <PatientDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Editar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Editar'));

    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  test('saves patient updates', async () => {
    (apiService.patients.update as jest.Mock).mockResolvedValue({
      success: true,
      data: { ...mockPatient, firstName: 'José' }
    });

    render(
      <BrowserRouter>
        <PatientDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Editar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Editar'));

    const firstNameInput = screen.getByDisplayValue('João');
    fireEvent.change(firstNameInput, { target: { value: 'José' } });

    fireEvent.click(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(apiService.patients.update).toHaveBeenCalledWith('patient-123', expect.objectContaining({
        firstName: 'José'
      }));
    });
  });

  test('loads treatment plans on tab switch', async () => {
    (apiService.treatmentPlans.getAll as jest.Mock).mockResolvedValue({
      success: true,
      data: [{ _id: 'plan-1', title: 'Plano Ortodôntico' }]
    });

    render(
      <BrowserRouter>
        <PatientDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Plano de Tratamento'));

    await waitFor(() => {
      expect(apiService.treatmentPlans.getAll).toHaveBeenCalledWith('patient-123');
    });

    await waitFor(() => {
      expect(screen.getByTestId('treatment-plan')).toBeInTheDocument();
    });
  });

  test('loads clinical notes on tab switch', async () => {
    (apiService.clinicalNotes.getAll as jest.Mock).mockResolvedValue({
      success: true,
      data: [{ id: 'note-1', noteType: 'soap' }]
    });

    render(
      <BrowserRouter>
        <PatientDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Notas Clínicas'));

    await waitFor(() => {
      expect(apiService.clinicalNotes.getAll).toHaveBeenCalledWith('patient-123');
    });

    await waitFor(() => {
      expect(screen.getByTestId('notes-timeline')).toBeInTheDocument();
    });
  });

  test('loads medical history on tab switch', async () => {
    (apiService.medicalHistory.get as jest.Mock).mockResolvedValue({
      success: true,
      data: { chiefComplaint: 'Dor de dente' }
    });

    render(
      <BrowserRouter>
        <PatientDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Histórico Médico'));

    await waitFor(() => {
      expect(apiService.medicalHistory.get).toHaveBeenCalledWith('patient-123');
    });

    await waitFor(() => {
      expect(screen.getByTestId('medical-history')).toBeInTheDocument();
    });
  });

  test('handles patient load error', async () => {
    (apiService.patients.getOne as jest.Mock).mockResolvedValue({
      success: false,
      message: 'Paciente não encontrado'
    });

    render(
      <BrowserRouter>
        <PatientDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Paciente não encontrado')).toBeInTheDocument();
    });

    expect(screen.getByText('Voltar')).toBeInTheDocument();
  });

  test('navigates back to patient list', async () => {
    render(
      <BrowserRouter>
        <PatientDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });

    const backButton = screen.getAllByText('← Voltar')[0];
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/admin/patients');
  });
});
