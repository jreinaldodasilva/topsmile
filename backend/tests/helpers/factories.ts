// backend/tests/helpers/factories.ts
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';

export const factories = {
    appointment: (overrides = {}) => ({
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
    }),

    patient: (overrides = {}) => ({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: '(11) 98765-4321',
        dateOfBirth: faker.date.past({ years: 30 }),
        clinic: new Types.ObjectId(),
        status: 'active',
        ...overrides
    }),

    provider: (overrides = {}) => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        specialties: ['Dentista'],
        clinic: new Types.ObjectId(),
        isActive: true,
        ...overrides
    }),

    user: (overrides = {}) => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: 'Test@1234',
        role: 'receptionist',
        clinic: new Types.ObjectId(),
        isActive: true,
        ...overrides
    }),

    treatmentPlan: (overrides = {}) => ({
        patient: new Types.ObjectId(),
        provider: new Types.ObjectId(),
        clinic: new Types.ObjectId(),
        diagnosis: faker.lorem.sentence(),
        status: 'draft',
        phases: [],
        ...overrides
    }),

    contact: (overrides = {}) => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: '(11) 98765-4321',
        clinic: faker.company.name(),
        specialty: 'Ortodontia',
        status: 'new',
        ...overrides
    })
};
