import { mockStripe } from '../mocks/stripe.mock';
import { createTestPatient } from '../testHelpers';

// Mock Stripe module
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => mockStripe);
});

describe('Stripe Payment Integration', () => {
  beforeEach(() => {
    mockStripe.clear();
    mockStripe.simulateSuccess();
  });

  describe('Payment Intent Creation', () => {
    it('should create payment intent successfully', async () => {
      const patient = await createTestPatient();
      
      const paymentIntent = await mockStripe.paymentIntents.create({
        amount: 15000, // R$ 150.00
        currency: 'brl',
        metadata: {
          patientId: patient._id?.toString(),
          appointmentType: 'Consulta'
        }
      });

      expect(paymentIntent.id).toMatch(/^pi_test_/);
      expect(paymentIntent.amount).toBe(15000);
      expect(paymentIntent.currency).toBe('brl');
      expect(paymentIntent.status).toBe('requires_confirmation');
    });

    it('should handle payment creation failure', async () => {
      mockStripe.simulateFailure();

      await expect(mockStripe.paymentIntents.create({
        amount: 15000,
        currency: 'brl'
      })).rejects.toThrow('Payment failed');
    });
  });

  describe('Payment Confirmation', () => {
    it('should confirm payment successfully', async () => {
      const paymentIntent = await mockStripe.paymentIntents.create({
        amount: 15000,
        currency: 'brl'
      });

      const confirmed = await mockStripe.paymentIntents.confirm(paymentIntent.id);
      
      expect(confirmed.status).toBe('succeeded');
      expect(confirmed.id).toBe(paymentIntent.id);
    });

    it('should handle payment confirmation failure', async () => {
      const paymentIntent = await mockStripe.paymentIntents.create({
        amount: 15000,
        currency: 'brl'
      });

      mockStripe.simulateFailure();
      const failed = await mockStripe.paymentIntents.confirm(paymentIntent.id);
      
      expect(failed.status).toBe('requires_payment_method');
    });
  });

  describe('Customer Management', () => {
    it('should create customer for patient', async () => {
      const patient = await createTestPatient();
      
      const customer = await mockStripe.customers.create({
        email: patient.email,
        name: `${patient.firstName} ${patient.lastName}`,
        metadata: {
          patientId: patient._id?.toString()
        }
      });

      expect(customer.id).toMatch(/^cus_test_/);
      expect(customer.email).toBe(patient.email);
    });
  });
});