// backend/tests/helpers/factories.ts
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import { Patient } from '../../src/models/Patient';
import { Provider } from '../../src/models/Provider';
import { AppointmentType } from '../../src/models/AppointmentType';
import { User } from '../../src/models/User';
import { Clinic } from '../../src/models/Clinic';

// Individual factory functions that create and save models
export const createTestPatient = async (overrides = {}) => {
    const patient = new Patient({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: '(11) 98765-4321',
        dateOfBirth: faker.date.past({ years: 30 }),
        clinic: new Types.ObjectId(),
        status: 'active',
        ...overrides
    });
    return await patient.save();
};

export const createTestProvider = async (overrides = {}) => {
    const provider = new Provider({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        specialties: ['Dentista'],
        clinic: new Types.ObjectId(),
        isActive: true,
        ...overrides
    });
    return await provider.save();
};

export const createTestAppointmentType = async (overrides = {}) => {
    const appointmentType = new AppointmentType({
        name: faker.lorem.words(2),
        duration: 30,
        color: faker.color.rgb(),
        clinic: new Types.ObjectId(),
        isActive: true,
        ...overrides
    });
    return await appointmentType.save();
};

export const createTestUser = async (overrides = {}) => {
    const user = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: 'Test@1234',
        role: 'receptionist',
        clinic: new Types.ObjectId(),
        isActive: true,
        ...overrides
    });
    return await user.save();
};

export const createTestClinic = async (overrides = {}) => {
    const clinic = new Clinic({
        name: faker.company.name(),
        email: faker.internet.email(),
        phone: '(11) 98765-4321',
        address: {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state({ abbreviated: true }),
            zipCode: faker.location.zipCode(),
            country: 'Brasil'
        },
        isActive: true,
        ...overrides
    });
    return await clinic.save();
};

// Data-only factories (don't save to DB)
export const createTestAppointment = (overrides = {}) => ({
    patient: new Types.ObjectId(),
    provider: new Types.ObjectId(),
    clinic: new Types.ObjectId(),
    appointmentType: new Types.ObjectId(),
    scheduledStart: faker.date.future(),
    scheduledEnd: faker.date.future(),
    status: 'scheduled',
    priority: 'routine',
    createdBy: new Types.ObjectId(),
    ...overrides
});

export const createTestTreatmentPlan = (overrides = {}) => ({
    patient: new Types.ObjectId(),
    provider: new Types.ObjectId(),
    clinic: new Types.ObjectId(),
    diagnosis: faker.lorem.sentence(),
    status: 'draft',
    phases: [],
    ...overrides
});

export const createTestContact = (overrides = {}) => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: '(11) 98765-4321',
    clinic: faker.company.name(),
    specialty: 'Ortodontia',
    status: 'new',
    ...overrides
});

// Legacy factories object for backward compatibility
export const factories = {
    appointment: createTestAppointment,
    patient: createTestPatient,
    provider: createTestProvider,
    user: createTestUser,
    clinic: createTestClinic,
    appointmentType: createTestAppointmentType,
    treatmentPlan: createTestTreatmentPlan,
    contact: createTestContact
};
