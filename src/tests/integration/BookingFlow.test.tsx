// src/tests/integration/BookingFlow.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { bookingService } from '../../features/booking/services/bookingService';
import { providerService } from '../../features/providers/services/providerService';

jest.mock('../../features/booking/services/bookingService');
jest.mock('../../features/providers/services/providerService');

const BookingFlow = () => {
  const [step, setStep] = React.useState(1);
  const [selectedProvider, setSelectedProvider] = React.useState<string | null>(null);
  const [providers, setProviders] = React.useState([]);

  React.useEffect(() => {
    if (step === 1) {
      providerService.getProviders().then((res: any) => setProviders(res.data));
    }
  }, [step]);

  return (
    <div>
      {step === 1 && (
        <div>
          <h2>Select Provider</h2>
          {providers.map((p: any) => (
            <button key={p.id} onClick={() => { setSelectedProvider(p.id); setStep(2); }}>
              {p.name}
            </button>
          ))}
        </div>
      )}
      {step === 2 && (
        <div>
          <h2>Booking Confirmed</h2>
          <p>Provider: {selectedProvider}</p>
        </div>
      )}
    </div>
  );
};

describe('Booking Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('completes booking flow', async () => {
    const mockProviders = [
      { id: '1', name: 'Dr. Smith' },
      { id: '2', name: 'Dr. Jones' }
    ];

    (providerService.getProviders as jest.Mock).mockResolvedValue({
      data: mockProviders
    });

    render(<BookingFlow />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Dr. Smith'));

    await waitFor(() => {
      expect(screen.getByText('Booking Confirmed')).toBeInTheDocument();
      expect(screen.getByText('Provider: 1')).toBeInTheDocument();
    });
  });
});
