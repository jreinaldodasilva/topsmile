export class MockStripeClient {
  private paymentIntentsList: any[] = [];
  private customersList: any[] = [];
  private shouldFail = false;

  paymentIntents = {
    create: jest.fn().mockImplementation((params: any) => {
      if (this.shouldFail) {
        throw new Error('Payment failed');
      }
      
      const intent = {
        id: `pi_test_${Date.now()}`,
        amount: params.amount,
        currency: params.currency,
        status: 'requires_confirmation',
        client_secret: `pi_test_${Date.now()}_secret`,
        ...params
      };
      
      this.paymentIntentsList.push(intent);
      return Promise.resolve(intent);
    }),

    confirm: jest.fn().mockImplementation((id: string) => {
      const intent = this.paymentIntentsList.find(p => p.id === id);
      if (!intent) throw new Error('Payment intent not found');
      
      intent.status = this.shouldFail ? 'requires_payment_method' : 'succeeded';
      return Promise.resolve(intent);
    }),

    retrieve: jest.fn().mockImplementation((id: string) => {
      const intent = this.paymentIntentsList.find(p => p.id === id);
      if (!intent) throw new Error('Payment intent not found');
      return Promise.resolve(intent);
    })
  };

  customers = {
    create: jest.fn().mockImplementation((params: any) => {
      const customer = {
        id: `cus_test_${Date.now()}`,
        email: params.email,
        name: params.name,
        ...params
      };
      
      this.customersList.push(customer);
      return Promise.resolve(customer);
    })
  };

  simulateFailure(): void {
    this.shouldFail = true;
  }

  simulateSuccess(): void {
    this.shouldFail = false;
  }

  clear(): void {
    this.paymentIntentsList = [];
    this.customersList = [];
    this.shouldFail = false;
  }

  getPaymentIntents(): any[] {
    return this.paymentIntentsList;
  }

  getCustomers(): any[] {
    return this.customersList;
  }
}

export const mockStripe = new MockStripeClient();