type Constructor<T> = new (...args: any[]) => T;

class ServiceContainer {
  private services: Map<string, any> = new Map();
  private singletons: Map<string, any> = new Map();

  register<T>(name: string, service: T | Constructor<T>, singleton: boolean = true): void {
    if (singleton) {
      const instance = typeof service === 'function' ? new (service as Constructor<T>)() : service;
      this.singletons.set(name, instance);
    } else {
      this.services.set(name, service);
    }
  }

  get<T>(name: string): T {
    if (this.singletons.has(name)) {
      return this.singletons.get(name);
    }
    
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    
    return typeof service === 'function' ? new service() : service;
  }

  has(name: string): boolean {
    return this.services.has(name) || this.singletons.has(name);
  }
}

export const container = new ServiceContainer();
