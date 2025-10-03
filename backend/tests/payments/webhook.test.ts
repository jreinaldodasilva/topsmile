import request from 'supertest';
import express from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.raw({ type: 'application/json' }));

// Mock webhook endpoint
app.post('/webhook/stripe', (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const payload = req.body;
  
  try {
    // Simulate webhook signature verification
    const expectedSig = crypto
      .createHmac('sha256', 'test_webhook_secret')
      .update(payload)
      .digest('hex');
    
    if (!sig.includes(expectedSig)) {
      return res.status(400).send('Invalid signature');
    }
    
    const event = JSON.parse(payload.toString());
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        res.json({ received: true });
        break;
      case 'payment_intent.payment_failed':
        // Handle failed payment
        res.json({ received: true });
        break;
      default:
        res.json({ received: true });
    }
  } catch (err) {
    res.status(400).send('Webhook error');
  }
});

describe('Stripe Webhook Integration', () => {
  const createWebhookPayload = (eventType: string, data: any) => {
    return JSON.stringify({
      id: `evt_test_${Date.now()}`,
      type: eventType,
      data: { object: data },
      created: Math.floor(Date.now() / 1000)
    });
  };

  const createSignature = (payload: string) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto
      .createHmac('sha256', 'test_webhook_secret')
      .update(payload)
      .digest('hex');
    
    return `t=${timestamp},v1=${signature}`;
  };

  it('should handle successful payment webhook', async () => {
    const payload = createWebhookPayload('payment_intent.succeeded', {
      id: 'pi_test_123',
      amount: 15000,
      currency: 'brl',
      status: 'succeeded'
    });

    const signature = createSignature(payload);

    const response = await request(app)
      .post('/webhook/stripe')
      .set('stripe-signature', signature)
      .send(payload)
      .expect(200);

    expect(response.body.received).toBe(true);
  });

  it('should reject webhook with invalid signature', async () => {
    const payload = createWebhookPayload('payment_intent.succeeded', {});

    await request(app)
      .post('/webhook/stripe')
      .set('stripe-signature', 'invalid_signature')
      .send(payload)
      .expect(400);
  });

  it('should handle payment failure webhook', async () => {
    const payload = createWebhookPayload('payment_intent.payment_failed', {
      id: 'pi_test_456',
      last_payment_error: {
        message: 'Your card was declined.'
      }
    });

    const signature = createSignature(payload);

    const response = await request(app)
      .post('/webhook/stripe')
      .set('stripe-signature', signature)
      .send(payload)
      .expect(200);

    expect(response.body.received).toBe(true);
  });
});