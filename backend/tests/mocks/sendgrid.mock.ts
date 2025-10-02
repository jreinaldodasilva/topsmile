export interface MockEmail {
  to: string | string[];
  from: string;
  subject: string;
  html?: string;
  text?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
  timestamp: number;
}

export class MockSendGridClient {
  public sentEmails: MockEmail[] = [];
  private shouldFail = false;
  private failureError: Error | null = null;

  async send(msg: any): Promise<any> {
    if (this.shouldFail) {
      throw this.failureError || new Error('SendGrid API Error');
    }

    const email: MockEmail = {
      to: msg.to,
      from: msg.from,
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
      templateId: msg.templateId,
      dynamicTemplateData: msg.dynamicTemplateData,
      timestamp: Date.now(),
    };

    this.sentEmails.push(email);

    return [
      {
        statusCode: 202,
        body: '',
        headers: {},
      },
    ];
  }

  // Test utilities
  getSentEmails(to?: string): MockEmail[] {
    if (to) {
      return this.sentEmails.filter(email => 
        Array.isArray(email.to) 
          ? email.to.includes(to)
          : email.to === to
      );
    }
    return this.sentEmails;
  }

  getLastEmail(): MockEmail | undefined {
    return this.sentEmails[this.sentEmails.length - 1];
  }

  clear(): void {
    this.sentEmails = [];
    this.shouldFail = false;
    this.failureError = null;
  }

  simulateFailure(error?: Error): void {
    this.shouldFail = true;
    this.failureError = error || new Error('SendGrid API Error: 429 Too Many Requests');
  }

  simulateSuccess(): void {
    this.shouldFail = false;
    this.failureError = null;
  }

  getEmailCount(): number {
    return this.sentEmails.length;
  }

  hasEmailBeenSent(to: string, subject?: string): boolean {
    return this.sentEmails.some(email => {
      const toMatch = Array.isArray(email.to) 
        ? email.to.includes(to)
        : email.to === to;
      
      if (subject) {
        return toMatch && email.subject.includes(subject);
      }
      
      return toMatch;
    });
  }
}

// Global mock instance
export const mockSendGridClient = new MockSendGridClient();

// Jest mock setup
export const setupSendGridMock = (): MockSendGridClient => {
  return mockSendGridClient;
};

// Test helper functions
export const expectEmailSent = (to: string, subject?: string): void => {
  expect(mockSendGridClient.hasEmailBeenSent(to, subject)).toBe(true);
};

export const expectEmailNotSent = (to: string): void => {
  expect(mockSendGridClient.hasEmailBeenSent(to)).toBe(false);
};

export const expectEmailCount = (count: number): void => {
  expect(mockSendGridClient.getEmailCount()).toBe(count);
};