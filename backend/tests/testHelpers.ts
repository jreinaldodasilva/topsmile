import { User } from '../src/models/User';
import { Clinic } from '../src/models/Clinic';
import { Contact } from '../src/models/Contact';

export const createTestUser = async (overrides = {}) => {
  const defaultUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPassword123!',
    role: 'admin' as const,
  };

  const userData = { ...defaultUser, ...overrides };
  const user = new User(userData);
  return await user.save();
};

export const createTestClinic = async (overrides = {}) => {
  const defaultClinic = {
    name: 'Test Clinic',
    email: 'clinic@example.com',
    phone: '(11) 99999-9999',
    address: {
      street: 'Rua Teste',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    subscription: {
      plan: 'basic',
      status: 'active',
      startDate: new Date()
    },
    settings: {
      timezone: 'America/Sao_Paulo',
      workingHours: {
        monday: { start: '08:00', end: '18:00', isWorking: true },
        tuesday: { start: '08:00', end: '18:00', isWorking: true },
        wednesday: { start: '08:00', end: '18:00', isWorking: true },
        thursday: { start: '08:00', end: '18:00', isWorking: true },
        friday: { start: '08:00', end: '18:00', isWorking: true },
        saturday: { start: '08:00', end: '12:00', isWorking: false },
        sunday: { start: '08:00', end: '12:00', isWorking: false }
      },
      appointmentDuration: 60,
      allowOnlineBooking: true
    }
  };

  const clinicData = { ...defaultClinic, ...overrides };
  const clinic = new Clinic(clinicData);
  return await clinic.save();
};

export const createTestContact = async (overrides = {}) => {
  const defaultContact = {
    name: 'João Silva',
    email: 'joao@example.com',
    clinic: 'Clínica Odontológica ABC',
    specialty: 'Ortodontia',
    phone: '(11) 99999-9999',
    source: 'website_contact_form',
    status: 'new',
    priority: 'medium'
  };

  const contactData = { ...defaultContact, ...overrides };
  const contact = new Contact(contactData);
  return await contact.save();
};

export const generateAuthToken = (userId: string, role = 'admin') => {
  // This would normally use your JWT service
  // For testing, we'll create a simple mock
  return `mock-jwt-token-${userId}-${role}`;
};
