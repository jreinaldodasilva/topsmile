# TopSmile Integration Architecture

**Version:** 1.0.0 | **Date:** 2024-01-15 | **Status:** ✅ Complete

---

## External Services

| Service | Purpose | Integration Type |
|---------|---------|------------------|
| Stripe | Payment processing | REST API |
| SendGrid | Email notifications | REST API |
| Twilio | SMS notifications | REST API |

---

## Stripe Integration

### Payment Flow
```typescript
// services/payment/stripeService.ts
class StripeService {
  async createPaymentIntent(amount: number, currency: string) {
    return await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      automatic_payment_methods: { enabled: true }
    });
  }

  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object);
        break;
    }
  }
}
```

### Webhook Configuration
```typescript
// routes/webhooks/stripe.ts
router.post('/stripe', 
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    await stripeService.handleWebhook(event);
    res.json({ received: true });
  }
);
```

---

## SendGrid Integration

### Email Service
```typescript
// services/external/emailService.ts
class EmailService {
  async sendAppointmentConfirmation(data: AppointmentData) {
    const msg = {
      to: data.patientEmail,
      from: process.env.FROM_EMAIL,
      subject: 'Confirmação de Agendamento',
      html: this.renderTemplate('appointment-confirmation', data)
    };
    
    await sgMail.send(msg);
  }

  async sendAppointmentReminder(data: AppointmentData) {
    const msg = {
      to: data.patientEmail,
      from: process.env.FROM_EMAIL,
      subject: 'Lembrete de Consulta',
      html: this.renderTemplate('appointment-reminder', data),
      sendAt: this.calculateReminderTime(data.scheduledStart)
    };
    
    await sgMail.send(msg);
  }
}
```

---

## Twilio Integration

### SMS Service
```typescript
// services/external/smsService.ts
class SmsService {
  async sendAppointmentReminder(phone: string, appointmentData: any) {
    await twilioClient.messages.create({
      body: `Lembrete: Consulta agendada para ${appointmentData.date} às ${appointmentData.time}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
  }

  async sendVerificationCode(phone: string, code: string) {
    await twilioClient.messages.create({
      body: `Seu código de verificação: ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
  }
}
```

---

## Integration Patterns

### Service Abstraction
```typescript
// Abstract interface
interface EmailService {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}

// SendGrid implementation
class SendGridEmailService implements EmailService {
  async sendEmail(to: string, subject: string, body: string) {
    await sgMail.send({ to, from: process.env.FROM_EMAIL, subject, html: body });
  }
}

// Mock implementation for testing
class MockEmailService implements EmailService {
  async sendEmail(to: string, subject: string, body: string) {
    console.log(`Mock email sent to ${to}`);
  }
}
```

### Circuit Breaker
```typescript
class CircuitBreaker {
  private failures = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      throw new Error('Circuit breaker is OPEN');
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }
  
  private onFailure() {
    this.failures++;
    if (this.failures >= 5) {
      this.state = 'OPEN';
      setTimeout(() => { this.state = 'HALF_OPEN'; }, 60000);
    }
  }
}
```

### Retry Logic
```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

## Error Handling

### External Service Errors
```typescript
class ExternalServiceError extends Error {
  constructor(
    public service: string,
    public originalError: any,
    message: string
  ) {
    super(message);
    this.name = 'ExternalServiceError';
  }
}

// Usage
try {
  await stripeService.createPayment(data);
} catch (error) {
  throw new ExternalServiceError('Stripe', error, 'Falha ao processar pagamento');
}
```

---

## Improvement Recommendations

### 🟥 Critical
1. **Implement Circuit Breaker** - All external services (2 days)
2. **Add Webhook Verification** - Security (4 hours)

### 🟧 High Priority
3. **Implement Retry Logic** - With exponential backoff (1 day)
4. **Add Service Health Checks** - Monitor availability (1 day)
5. **Implement Rate Limiting** - For external APIs (4 hours)

### 🟨 Medium Priority
6. **Add Request Logging** - For debugging (4 hours)
7. **Implement Fallback Services** - Alternative providers (1 week)

---

**Related:** [01-System-Architecture-Overview.md](./01-System-Architecture-Overview.md)
