// src/tests/components/AdminDashboard.test.tsx
import React from "react";
import { screen } from "@testing-library/react";
import AdminDashboard from "../../components/Admin/Dashboard/Dashboard";
import { render } from "../utils/test-utils";
import { apiService } from "../../services/apiService";
import {
  createMockApiResponse,
  createMockAppointment,
  createMockPatient,
} from "../utils/testHelpers";

jest.mock("../../services/apiService");

describe("AdminDashboard", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    (apiService.dashboard.getStats as jest.Mock).mockResolvedValue(
      createMockApiResponse({
        contacts: {
          total: 10,
          byStatus: [],
          bySource: [],
          recentCount: 2,
          monthlyTrend: [],
        },
        summary: {
          totalContacts: 10,
          newThisWeek: 3,
          conversionRate: 0.25,
          revenue: "1500",
        },
        user: {
          name: "Admin",
          role: "admin",
          clinicId: "clinic123",
          lastActivity: "",
        },
      })
    );

    (apiService.appointments.getAll as jest.Mock).mockResolvedValue(
      createMockApiResponse([createMockAppointment()])
    );

    (apiService.patients.getAll as jest.Mock).mockResolvedValue(
      createMockApiResponse([createMockPatient()])
    );
  });

  it("renders dashboard title", async () => {
    render(<AdminDashboard />);
    expect(await screen.findByText(/Dashboard/i)).toBeInTheDocument();
  });

  it("renders stats cards after loading", async () => {
    render(<AdminDashboard />);
    expect(await screen.findByText(/Total de Contatos/i)).toBeInTheDocument();
    expect(await screen.findByText(/Novos Esta Semana/i)).toBeInTheDocument();

    // multiple matches for "Taxa de Conversão"
    const conversionTexts = await screen.findAllByText(/Taxa de Conversão/i);
    expect(conversionTexts.length).toBeGreaterThan(0);

    // multiple matches for "Receita"
    const revenueTexts = await screen.findAllByText(/Receita/i);
    expect(revenueTexts.length).toBeGreaterThan(0);
  });

  it("renders upcoming appointments section", async () => {
    render(<AdminDashboard />);
    expect(await screen.findByText(/Próximas Consultas/i)).toBeInTheDocument();
  });

  it("renders recent patients section", async () => {
    render(<AdminDashboard />);
    expect(await screen.findByText(/Pacientes Recentes/i)).toBeInTheDocument();
  });

  it("renders pending tasks section", async () => {
    render(<AdminDashboard />);
    expect(await screen.findByText(/Tarefas Pendentes/i)).toBeInTheDocument();
  });

  it("renders quick actions section", async () => {
    render(<AdminDashboard />);
    expect(await screen.findByText(/Ações Rápidas/i)).toBeInTheDocument();
    expect(await screen.findByText(/Novo Paciente/i)).toBeInTheDocument();
    expect(await screen.findByText(/Agendar Consulta/i)).toBeInTheDocument();
  });
});
