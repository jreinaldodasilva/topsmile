import { User } from '../src/models/User';
import { Clinic } from '../src/models/Clinic';
import { Contact } from '../src/models/Contact';
import jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';

export const createTestUser = async (overrides = {}): Promise<any> => {
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

export const createTestClinic = async (overrides = {}): Promise<any> => {
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

export const createTestUserWithClinic = async (overrides = {}) => {
  const clinic = await createTestClinic();
  const defaultUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPassword123!',
    role: 'admin' as const,
    clinic: clinic._id,
  };

  const userData = { ...defaultUser, ...overrides };
  const user = new User(userData);
  return await user.save();
};

export const createTestContact = async (overrides = {}): Promise<any> => {
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

// Enhanced test data factories using faker
export const createRealisticPatient = async (overrides = {}) => {
  const defaultPatient = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number({ style: 'national' }),
    birthDate: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode('#####-###')
    },
    medicalHistory: {
      allergies: faker.helpers.arrayElements(['Penicillin', 'Latex', 'Ibuprofen', 'None'], { min: 0, max: 2 }),
      medications: faker.helpers.arrayElements(['Aspirin', 'Lisinopril', 'Metformin', 'None'], { min: 0, max: 2 }),
      conditions: faker.helpers.arrayElements(['Hypertension', 'Diabetes', 'Asthma', 'None'], { min: 0, max: 2 })
    },
    emergencyContact: {
      name: faker.person.fullName(),
      phone: faker.phone.number({ style: 'national' }),
      relationship: faker.helpers.arrayElement(['Spouse', 'Parent', 'Sibling', 'Friend'])
    }
  };

  const patientData = { ...defaultPatient, ...overrides };
  const user = new User({
    ...patientData,
    password: 'TestPassword123!',
    role: 'patient'
  });
  return await user.save();
};

export const createRealisticProvider = async (overrides = {}) => {
  const specialties = ['General Dentistry', 'Orthodontics', 'Oral Surgery', 'Periodontics', 'Endodontics'];
  const defaultProvider = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number({ style: 'national' }),
    specialty: faker.helpers.arrayElement(specialties),
    licenseNumber: faker.string.alphanumeric(8).toUpperCase(),
    experience: faker.number.int({ min: 5, max: 30 }),
    workingHours: {
      monday: { start: '08:00', end: '18:00', isWorking: true },
      tuesday: { start: '08:00', end: '18:00', isWorking: true },
      wednesday: { start: '08:00', end: '18:00', isWorking: true },
      thursday: { start: '08:00', end: '18:00', isWorking: true },
      friday: { start: '08:00', end: '18:00', isWorking: true },
      saturday: { start: '08:00', end: '12:00', isWorking: faker.datatype.boolean() },
      sunday: { start: '08:00', end: '12:00', isWorking: false }
    }
  };

  const providerData = { ...defaultProvider, ...overrides };
  const user = new User({
    ...providerData,
    password: 'TestPassword123!',
    role: 'provider'
  });
  return await user.save();
};

export const createRealisticAppointment = async (patientId: string, providerId: string, overrides = {}) => {
  const appointmentTypes = ['Consulta', 'Limpeza', 'Tratamento de Canal', 'Extração', 'Ortodontia'];
  const statuses = ['scheduled', 'confirmed', 'completed', 'cancelled'];

  const startTime = faker.date.future();
  const duration = faker.number.int({ min: 30, max: 120 });
  const endTime = new Date(startTime.getTime() + duration * 60000); // Add duration in minutes

  const defaultAppointment = {
    patient: patientId,
    provider: providerId,
    scheduledStart: startTime,
    scheduledEnd: endTime,
    type: faker.helpers.arrayElement(appointmentTypes),
    status: faker.helpers.arrayElement(statuses),
    notes: faker.lorem.sentence(),
    price: faker.number.int({ min: 100, max: 500 }),
    duration: duration
  };

  const appointmentData = { ...defaultAppointment, ...overrides };
  // Note: This would need the Appointment model to be imported and used
  // For now, returning the data structure
  return appointmentData;
};

export const generateAuthToken = (userId: string, role = 'admin', clinicId?: string) => {
  const payload: any = {
    userId,
    role,
  };
  if (clinicId) {
    payload.clinicId = clinicId;
  }
  const secret = process.env.JWT_SECRET || 'test-jwt-secret-key';
  return jwt.sign(payload, secret, {
    expiresIn: '1h',
    issuer: 'topsmile-api',
    audience: 'topsmile-client',
    algorithm: 'HS256'
  });
};
