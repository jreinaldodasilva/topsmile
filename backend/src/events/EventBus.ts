type EventHandler = (data: any) => void | Promise<void>;

class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();

  on(event: string, handler: EventHandler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);
  }

  off(event: string, handler: EventHandler): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  async emit(event: string, data?: any): Promise<void> {
    const handlers = this.handlers.get(event);
    if (handlers) {
      await Promise.all(handlers.map(handler => handler(data)));
    }
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.handlers.delete(event);
    } else {
      this.handlers.clear();
    }
  }
}

export const eventBus = new EventBus();

export const Events = {
  APPOINTMENT_CREATED: 'appointment.created',
  APPOINTMENT_UPDATED: 'appointment.updated',
  APPOINTMENT_CANCELLED: 'appointment.cancelled',
  PATIENT_CREATED: 'patient.created',
  PATIENT_UPDATED: 'patient.updated',
  USER_LOGGED_IN: 'user.logged_in',
  USER_LOGGED_OUT: 'user.logged_out'
};
