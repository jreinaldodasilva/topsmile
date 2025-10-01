import { User } from '../src/models/User';
import { Clinic } from '../src/models/Clinic';
import { Contact } from '../src/models/Contact';
import { Patient } from '../src/models/Patient';
import { PatientUser } from '../src/models/PatientUser';
import { User as IUser, Clinic as IClinic, Contact as IContact, Patient as IPatient } from '@topsmile/types';
import jwt from 'jsonwebtoken';
// Important: @faker-js/faker v8 is ESM-only. We avoid a top-level import so this file works under CommonJS test runners.
import type { Faker } from '@faker-js/faker';

// Test constants from environment variables
const TEST_PASSWORDS = {
  DEFAULT: process.env.TEST_DEFAULT_PASSWORD || 'TestPassword123!',
  PATIENT: process.env.TEST_PATIENT_PASSWORD || 'PatientPass123!',
  PROVIDER: process.env.TEST_PROVIDER_PASSWORD || 'ProviderPass123!'
};

let fakerInstance: Faker | undefined;

/**
 * Lazily loads the ESM-only @faker-js/faker into CommonJS tests using dynamic import.
 * Keeps typing via a type-only import and avoids top-level ESM import errors.
 */
async function ensureFaker(): Promise<Faker> {
  if (!fakerInstance) {
    const mod = await import('@faker-js/faker');
    fakerInstance = mod.faker;
    // Optional: seed for deterministic test data
    // fakerInstance.seed(123);
  }
  return fakerInstance;
}

let userCounter = 0;

export const createTestUser = async (overrides = {}): Promise<IUser> => {
  userCounter++;
  const defaultUser = {
    name: 'Test User',
    email: `test${userCounter}@example.com`,
    password: TEST_PASSWORDS.DEFAULT,
    role: 'admin' as const,
  };

  const userData = { ...defaultUser, ...overrides };
  const user = new User(userData);
  return await user.save();
};

export const createTestClinic = async (overrides = {}): Promise<IClinic> => {
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

export const createTestUserWithClinic = async (overrides = {}): Promise<IUser> => {
  const clinic = await createTestClinic();
  userCounter++;
  const defaultUser = {
    name: 'Test User',
    email: `test${userCounter}@example.com`,
    password: TEST_PASSWORDS.DEFAULT,
    role: 'admin' as const,
    clinic: clinic._id,
  };

  const userData = { ...defaultUser, ...overrides };
  const user = new User(userData);
  return await user.save();
};

export const createTestContact = async (overrides = {}): Promise<IContact> => {
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

export const createTestPatient = async (overrides = {}): Promise<IPatient> => {
  const defaultPatient = {
    firstName: 'Test',
    lastName: 'Patient',
    email: 'patient@example.com',
    phone: '(11) 99999-9999',
    dateOfBirth: new Date('1990-01-01'),
    gender: 'male' as const,
    address: {
      zipCode: '01234-567'
    },
    status: 'active',
    medicalHistory: {
      allergies: [],
      medications: [],
      conditions: [],
      notes: ''
    }
  };

  const patientData = { ...defaultPatient, ...overrides };
  const patient = new Patient(patientData);
  return await patient.save();
};

export const createTestPatientWithClinic = async (overrides = {}): Promise<IPatient> => {
  const clinic = await createTestClinic();
  const defaultPatient = {
    firstName: 'Test',
    lastName: 'Patient',
    email: 'patient@example.com',
    phone: '(11) 99999-9999',
    clinic: clinic._id,
    dateOfBirth: new Date('1990-01-01'),
    gender: 'male' as const,
    address: {
      zipCode: '01234-567'
    },
    status: 'active',
    medicalHistory: {
      allergies: [],
      medications: [],
      conditions: [],
      notes: ''
    }
  };

  const patientData = { ...defaultPatient, ...overrides };
  const patient = new Patient(patientData);
  return await patient.save();
};

export const createTestPatientUser = async (patientId: string, overrides = {}) => {
  const defaultPatientUser = {
    patient: patientId,
    email: 'patient.user@example.com',
    password: TEST_PASSWORDS.PATIENT,
    isActive: true,
    emailVerified: false
  };

  const patientUserData = { ...defaultPatientUser, ...overrides };
  const patientUser = new PatientUser(patientUserData);
  return await patientUser.save();
};

// Enhanced test data factories using faker
export const createRealisticPatient = async (overrides = {}) => {
  const f = await ensureFaker();
  const fullName = f.person.fullName();
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || 'Silva';
  
  const defaultPatient = {
    firstName,
    lastName,
    email: f.internet.email(),
    phone: f.phone.number({ style: 'national' }),
    dateOfBirth: f.date.birthdate({ min: 18, max: 80, mode: 'age' }),
    gender: f.helpers.arrayElement(['male', 'female', 'other'] as const),
    address: {
      street: f.location.streetAddress(),
      city: f.location.city(),
      state: f.location.state({ abbreviated: true }),
      zipCode: f.location.zipCode('#####-###')
    },
    medicalHistory: {
      allergies: f.helpers.arrayElements(['Penicillin', 'Latex', 'Ibuprofen', 'None'], { min: 0, max: 2 }),
      medications: f.helpers.arrayElements(['Aspirin', 'Lisinopril', 'Metformin', 'None'], { min: 0, max: 2 }),
      conditions: f.helpers.arrayElements(['Hypertension', 'Diabetes', 'Asthma', 'None'], { min: 0, max: 2 })
    },
    emergencyContact: {
      name: f.person.fullName(),
      phone: f.phone.number({ style: 'national' }),
      relationship: f.helpers.arrayElement(['Spouse', 'Parent', 'Sibling', 'Friend'])
    }
  };

  const patientData = { ...defaultPatient, ...overrides };
  const patient = new Patient(patientData);
  return await patient.save();
};

export const createRealisticProvider = async (overrides = {}) => {
  const f = await ensureFaker();
  const specialties = ['General Dentistry', 'Orthodontics', 'Oral Surgery', 'Periodontics', 'Endodontics'];
  const defaultProvider = {
    name: f.person.fullName(),
    email: f.internet.email(),
    phone: f.phone.number({ style: 'national' }),
    specialty: f.helpers.arrayElement(specialties),
    licenseNumber: f.string.alphanumeric(8).toUpperCase(),
    experience: f.number.int({ min: 5, max: 30 }),
    workingHours: {
      monday: { start: '08:00', end: '18:00', isWorking: true },
      tuesday: { start: '08:00', end: '18:00', isWorking: true },
      wednesday: { start: '08:00', end: '18:00', isWorking: true },
      thursday: { start: '08:00', end: '18:00', isWorking: true },
      friday: { start: '08:00', end: '18:00', isWorking: true },
      saturday: { start: '08:00', end: '12:00', isWorking: f.datatype.boolean() },
      sunday: { start: '08:00', end: '12:00', isWorking: false }
    }
  };

  const providerData = { ...defaultProvider, ...overrides };
  const user = new User({
    ...providerData,
    password: TEST_PASSWORDS.PROVIDER,
    role: 'dentist'
  });
  return await user.save();
};

export const createRealisticAppointment = async (patientId: string, providerId: string, overrides = {}) => {
  const f = await ensureFaker();
  const appointmentTypes = ['Consulta', 'Limpeza', 'Tratamento de Canal', 'Extração', 'Ortodontia'];
  const statuses = ['scheduled', 'confirmed', 'completed', 'cancelled'];

  const startTime = f.date.future();
  const duration = f.number.int({ min: 30, max: 120 });
  const endTime = new Date(startTime.getTime() + duration * 60000); // Add duration in minutes

  const defaultAppointment = {
    patient: patientId,
    provider: providerId,
    scheduledStart: startTime,
    scheduledEnd: endTime,
    type: f.helpers.arrayElement(appointmentTypes),
    status: f.helpers.arrayElement(statuses),
    notes: f.lorem.sentence(),
    price: f.number.int({ min: 100, max: 500 }),
    duration: duration
  };

  const appointmentData = { ...defaultAppointment, ...overrides };
  // Note: This would need the Appointment model to be imported and used
  // For now, returning the data structure
  return appointmentData;
};

interface AuthTokenPayload {
  userId: string;
  email: string;
  role: string;
  clinicId?: string;
}

export const generateAuthToken = (userId: string, role = 'admin', clinicId?: string, email = 'test@example.com') => {
  const payload: AuthTokenPayload = {
    userId,
    email,
    role,
  };
  if (clinicId) {
    payload.clinicId = clinicId;
  }
  const secret = process.env.TEST_JWT_SECRET || process.env.JWT_SECRET || 'test-jwt-secret-key';
  return jwt.sign(payload, secret, {
    expiresIn: '1h',
    issuer: 'topsmile-api',
    audience: 'topsmile-client',
    algorithm: 'HS256'
  });
};

interface PatientTokenPayload {
  patientUserId: string;
  patientId: string;
  email: string;
  clinicId: string;
  type: 'patient';
}

export const generatePatientAuthToken = (patientUserId: string, patientId: string, clinicId: string, email: string) => {
  const payload: PatientTokenPayload = {
    patientUserId,
    patientId,
    email,
    clinicId,
    type: 'patient'
  };
  const secret = process.env.TEST_PATIENT_JWT_SECRET || process.env.PATIENT_JWT_SECRET || process.env.JWT_SECRET || 'test-patient-jwt-secret-key';
  return jwt.sign(payload, secret, {
    expiresIn: '15m',
    issuer: 'topsmile-patient-portal',
    audience: 'topsmile-patients',
    algorithm: 'HS256'
  });
};