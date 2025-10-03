import { Clinic } from '../../src/models/Clinic';
import { User } from '../../src/models/User';
import { Patient } from '../../src/models/Patient';
import { Provider } from '../../src/models/Provider';
import { AppointmentType } from '../../src/models/AppointmentType';

export const createTestClinic = async (overrides = {}) => {
  return await Clinic.create({
    name: 'Test Clinic',
    email: 'clinic@test.com',
    phone: '(11) 99999-9999',
    address: {
      street: 'Rua Teste',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    subscription: { plan: 'basic', status: 'active', startDate: new Date() },
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
    },
    ...overrides
  });
};

export const createTestUser = async (clinic: any, overrides = {}) => {
  return await User.create({
    name: 'Test User',
    email: `user${Date.now()}@test.com`,
    password: 'Password123!',
    role: 'admin',
    clinic: clinic._id,
    ...overrides
  });
};

export const createTestPatient = async (clinic: any, overrides = {}) => {
  return await Patient.create({
    firstName: 'Test',
    lastName: 'Patient',
    email: `patient${Date.now()}@test.com`,
    phone: `(11) 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    clinic: clinic._id,
    status: 'active',
    ...overrides
  });
};

export const createTestProvider = async (clinic: any, overrides = {}) => {
  return await Provider.create({
    name: 'Dr. Test',
    email: `provider${Date.now()}@test.com`,
    clinic: clinic._id,
    specialties: ['general_dentistry'],
    isActive: true,
    workingHours: {
      monday: { start: '08:00', end: '18:00', isWorking: true },
      tuesday: { start: '08:00', end: '18:00', isWorking: true },
      wednesday: { start: '08:00', end: '18:00', isWorking: true },
      thursday: { start: '08:00', end: '18:00', isWorking: true },
      friday: { start: '08:00', end: '18:00', isWorking: true },
      saturday: { start: '08:00', end: '12:00', isWorking: false },
      sunday: { start: '08:00', end: '12:00', isWorking: false }
    },
    ...overrides
  });
};

export const createTestAppointmentType = async (clinic: any, overrides = {}) => {
  return await AppointmentType.create({
    clinic: clinic._id,
    name: 'Consulta',
    duration: 60,
    price: 150,
    color: '#4CAF50',
    category: 'consultation',
    ...overrides
  });
};
