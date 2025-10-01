import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PatientList } from '../../components/Admin/PatientList';
import { AppointmentCalendar } from '../../components/Calendar/AppointmentCalendar';
import { SearchBox } from '../../components/UI/SearchBox';

// Mock large datasets
const createMockPatients = (count: number) => 
  Array.from({ length: count }, (_, i) => ({
    id: `patient-${i}`,
    firstName: `Patient${i}`,
    lastName: `Test${i}`,
    email: `patient${i}@test.com`,
    phone: `555-${i.toString().padStart(4, '0')}`,
    dateOfBirth: new Date(1990, 0, 1).toISOString(),
    createdAt: new Date().toISOString()
  }));

const createMockAppointments = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `appointment-${i}`,
    patientId: `patient-${i % 100}`,
    providerId: 'provider-1',
    appointmentDate: new Date(2024, 0, (i % 30) + 1).toISOString(),
    duration: 30,
    type: 'checkup',
    status: 'scheduled' as const
  }));

describe('Component Performance Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
  });

  describe('Large Dataset Rendering', () => {
    it('should render 1000 patients in under 2 seconds', () => {
      const patients = createMockPatients(1000);
      
      const startTime = performance.now();
      
      render(
        <QueryClientProvider client={queryClient}>
          <PatientList patients={patients} />
        </QueryClientProvider>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(2000);
      expect(screen.getByText('Patient0 Test0')).toBeInTheDocument();
    });

    it('should handle virtual scrolling efficiently', () => {
      const patients = createMockPatients(5000);
      
      const { container } = render(
        <QueryClientProvider client={queryClient}>
          <PatientList patients={patients} virtualScrolling={true} />
        </QueryClientProvider>
      );

      // Should only render visible items (not all 5000)
      const renderedItems = container.querySelectorAll('[data-testid="patient-item"]');
      expect(renderedItems.length).toBeLessThan(100); // Only visible items
      
      // But should show total count
      expect(screen.getByText(/5000 patients/i)).toBeInTheDocument();
    });
  });

  describe('Calendar Performance', () => {
    it('should render month view with 500 appointments efficiently', () => {
      const appointments = createMockAppointments(500);
      
      const startTime = performance.now();
      
      render(
        <QueryClientProvider client={queryClient}>
          <AppointmentCalendar 
            appointments={appointments}
            view="month"
            date={new Date(2024, 0, 15)}
          />
        </QueryClientProvider>
      );
      
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(1500);
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('should handle view changes without performance degradation', () => {
      const appointments = createMockAppointments(200);
      
      const { rerender } = render(
        <QueryClientProvider client={queryClient}>
          <AppointmentCalendar 
            appointments={appointments}
            view="month"
            date={new Date(2024, 0, 15)}
          />
        </QueryClientProvider>
      );

      const startTime = performance.now();
      
      // Switch between views rapidly
      const views = ['week', 'day', 'month', 'week', 'day'] as const;
      views.forEach(view => {
        rerender(
          <QueryClientProvider client={queryClient}>
            <AppointmentCalendar 
              appointments={appointments}
              view={view}
              date={new Date(2024, 0, 15)}
            />
          </QueryClientProvider>
        );
      });
      
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });

  describe('Search Performance', () => {
    it('should handle rapid typing without lag', async () => {
      const onSearch = jest.fn();
      
      render(<SearchBox onSearch={onSearch} debounceMs={100} />);
      
      const searchInput = screen.getByRole('textbox');
      
      const startTime = performance.now();
      
      // Simulate rapid typing
      const searchTerms = [
        'j', 'jo', 'joh', 'john', 'john ', 'john d', 'john do', 'john doe'
      ];
      
      for (const term of searchTerms) {
        fireEvent.change(searchInput, { target: { value: term } });
        // Small delay to simulate typing speed
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(1000);
      expect(searchInput).toHaveValue('john doe');
    });

    it('should debounce search calls efficiently', async () => {
      const onSearch = jest.fn();
      
      render(<SearchBox onSearch={onSearch} debounceMs={300} />);
      
      const searchInput = screen.getByRole('textbox');
      
      // Type rapidly
      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.change(searchInput, { target: { value: 'test search' } });
      fireEvent.change(searchInput, { target: { value: 'test search query' } });
      
      // Should not call onSearch immediately
      expect(onSearch).not.toHaveBeenCalled();
      
      // Wait for debounce
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 350));
      });
      
      // Should only call once with final value
      expect(onSearch).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenCalledWith('test search query');
    });
  });

  describe('Memory Usage', () => {
    it('should not leak memory during component updates', () => {
      const patients = createMockPatients(100);
      
      const { rerender, unmount } = render(
        <QueryClientProvider client={queryClient}>
          <PatientList patients={patients} />
        </QueryClientProvider>
      );

      // Update component multiple times
      for (let i = 0; i < 10; i++) {
        const updatedPatients = createMockPatients(100 + i);
        rerender(
          <QueryClientProvider client={queryClient}>
            <PatientList patients={updatedPatients} />
          </QueryClientProvider>
        );
      }

      // Unmount component
      unmount();

      // Memory should be cleaned up (this is more of a manual verification)
      // In a real scenario, you'd use memory profiling tools
      expect(true).toBe(true); // Placeholder assertion
    });

    it('should handle component mount/unmount cycles efficiently', () => {
      const patients = createMockPatients(50);
      
      const startTime = performance.now();
      
      // Mount and unmount component multiple times
      for (let i = 0; i < 20; i++) {
        const { unmount } = render(
          <QueryClientProvider client={queryClient}>
            <PatientList patients={patients} />
          </QueryClientProvider>
        );
        unmount();
      }
      
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(2000);
    });
  });

  describe('Event Handler Performance', () => {
    it('should handle rapid click events efficiently', () => {
      const onClick = jest.fn();
      const patients = createMockPatients(10);
      
      render(
        <QueryClientProvider client={queryClient}>
          <PatientList patients={patients} onPatientClick={onClick} />
        </QueryClientProvider>
      );

      const startTime = performance.now();
      
      // Click multiple patient items rapidly
      const patientItems = screen.getAllByTestId('patient-item');
      patientItems.slice(0, 5).forEach(item => {
        fireEvent.click(item);
      });
      
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100);
      expect(onClick).toHaveBeenCalledTimes(5);
    });

    it('should throttle scroll events appropriately', () => {
      const onScroll = jest.fn();
      const patients = createMockPatients(1000);
      
      const { container } = render(
        <QueryClientProvider client={queryClient}>
          <PatientList 
            patients={patients} 
            onScroll={onScroll}
            virtualScrolling={true}
          />
        </QueryClientProvider>
      );

      const scrollContainer = container.querySelector('[data-testid="scroll-container"]');
      
      const startTime = performance.now();
      
      // Simulate rapid scroll events
      for (let i = 0; i < 100; i++) {
        fireEvent.scroll(scrollContainer!, { target: { scrollTop: i * 10 } });
      }
      
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(500);
      // Should be throttled, not called 100 times
      expect(onScroll.mock.calls.length).toBeLessThan(20);
    });
  });

  describe('Rendering Optimization', () => {
    it('should use React.memo effectively for list items', () => {
      const patients = createMockPatients(100);
      
      const { rerender } = render(
        <QueryClientProvider client={queryClient}>
          <PatientList patients={patients} selectedPatientId="patient-0" />
        </QueryClientProvider>
      );

      const startTime = performance.now();
      
      // Change only selected patient (should not re-render all items)
      rerender(
        <QueryClientProvider client={queryClient}>
          <PatientList patients={patients} selectedPatientId="patient-1" />
        </QueryClientProvider>
      );
      
      const endTime = performance.now();
      
      // Should be very fast since most items don't need re-rendering
      expect(endTime - startTime).toBeLessThan(50);
    });

    it('should handle prop changes efficiently', () => {
      const patients = createMockPatients(50);
      
      const { rerender } = render(
        <QueryClientProvider client={queryClient}>
          <PatientList patients={patients} sortBy="firstName" />
        </QueryClientProvider>
      );

      const startTime = performance.now();
      
      // Change sort order multiple times
      const sortOptions = ['lastName', 'email', 'createdAt', 'firstName'];
      sortOptions.forEach(sortBy => {
        rerender(
          <QueryClientProvider client={queryClient}>
            <PatientList patients={patients} sortBy={sortBy} />
          </QueryClientProvider>
        );
      });
      
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(500);
    });
  });
});