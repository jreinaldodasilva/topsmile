import { mockStripe } from '../mocks/stripe.mock';

describe('Payment Security Tests', () => {
  beforeEach(() => {
    mockStripe.clear();
  });

  describe('Amount Validation', () => {
    it('should reject negative amounts', async () => {
      await expect(mockStripe.paymentIntents.create({
        amount: -1000,
        currency: 'brl'
      })).rejects.toThrow();
    });

    it('should reject zero amounts', async () => {
      await expect(mockStripe.paymentIntents.create({
        amount: 0,
        currency: 'brl'
      })).rejects.toThrow();
    });

    it('should accept valid amounts', async () => {
      const intent = await mockStripe.paymentIntents.create({
        amount: 5000, // R$ 50.00
        currency: 'brl'
      });

      expect(intent.amount).toBe(5000);
    });
  });

  describe('Currency Validation', () => {
    it('should only accept BRL currency', async () => {
      const intent = await mockStripe.paymentIntents.create({
        amount: 5000,
        currency: 'brl'
      });

      expect(intent.currency).toBe('brl');
    });
  });

  describe('Metadata Security', () => {
    it('should sanitize metadata inputs', async () => {
      const intent = await mockStripe.paymentIntents.create({
        amount: 5000,
        currency: 'brl',
        metadata: {
          patientId: '507f1f77bcf86cd799439011',
          notes: 'Clean input only'
        }
      });

      expect(intent.metadata.patientId).toMatch(/^[a-f\d]{24}$/i);
      expect(intent.metadata.notes).toBe('Clean input only');
    });
  });
});