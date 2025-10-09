#!/usr/bin/env node

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/topsmile';

// Define minimal schemas
const ClinicSchema = new Schema({ name: String, email: String, phone: String, address: Object, isActive: Boolean }, { strict: false });
const UserSchema = new Schema({ email: String, password: String, name: String, role: String, clinic: { type: Schema.Types.ObjectId, required: false }, isActive: Boolean }, { strict: false });
const ProviderSchema = new Schema({ user: Schema.Types.ObjectId, clinic: Schema.Types.ObjectId, firstName: String, lastName: String, email: String, phone: String, specialties: [String], licenseNumber: String, isActive: Boolean }, { strict: false });
const PatientSchema = new Schema({ clinic: Schema.Types.ObjectId, firstName: String, lastName: String, email: String, phone: String, dateOfBirth: Date, isActive: Boolean }, { strict: false });
const PatientUserSchema = new Schema({ patient: Schema.Types.ObjectId, email: String, password: String, isActive: Boolean, emailVerified: Boolean }, { strict: false });

const Clinic = mongoose.models.Clinic || mongoose.model('Clinic', ClinicSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Provider = mongoose.models.Provider || mongoose.model('Provider', ProviderSchema);
const Patient = mongoose.models.Patient || mongoose.model('Patient', PatientSchema);
const PatientUser = mongoose.models.PatientUser || mongoose.model('PatientUser', PatientUserSchema);

async function seedTestUsers() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Create test clinic
        let clinic = await Clinic.findOne({ name: 'Test Clinic 1' });
        if (!clinic) {
            clinic = await Clinic.create({
                name: 'Test Clinic 1',
                email: 'clinic@test.topsmile.com',
                phone: '(11) 98765-0000',
                address: {
                    street: 'Rua Teste',
                    number: '123',
                    city: 'São Paulo',
                    state: 'SP',
                    zipCode: '01000-000'
                },
                isActive: true
            });
            console.log('✅ Created test clinic');
        }

        // Staff users
        const staffUsers = [
            {
                email: 'superadmin@test.topsmile.com',
                password: 'SuperAdmin123!',
                name: 'Super Admin',
                role: 'super_admin',
                clinic: clinic._id
            },
            {
                email: 'admin@test.topsmile.com',
                password: 'Admin123!',
                name: 'Admin User',
                role: 'admin',
                clinic: clinic._id
            },
            {
                email: 'dentist@test.topsmile.com',
                password: 'Dentist123!',
                name: 'Dr. João Silva',
                role: 'provider',
                clinic: clinic._id
            },
            {
                email: 'staff@test.topsmile.com',
                password: 'Staff123!',
                name: 'Maria Santos',
                role: 'staff',
                clinic: clinic._id
            }
        ];

        for (const userData of staffUsers) {
            const existing = await User.findOne({ email: userData.email });
            if (!existing) {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                await User.create({
                    ...userData,
                    password: hashedPassword,
                    isActive: true
                });
                console.log(`✅ Created staff user: ${userData.email}`);
            } else {
                console.log(`⏭️  Staff user already exists: ${userData.email}`);
            }
        }

        // Create provider profile for dentist
        const dentistUser = await User.findOne({ email: 'dentist@test.topsmile.com' });
        if (dentistUser) {
            const existingProvider = await Provider.findOne({ user: dentistUser._id });
            if (!existingProvider) {
                await Provider.create({
                    user: dentistUser._id,
                    clinic: clinic._id,
                    firstName: 'Dr. João',
                    lastName: 'Silva',
                    email: 'dentist@test.topsmile.com',
                    phone: '(11) 98765-1111',
                    specialties: ['General Dentistry'],
                    licenseNumber: 'CRO-SP-12345',
                    isActive: true
                });
                console.log('✅ Created provider profile for dentist');
            }
        }

        // Patient users
        const patientData = [
            {
                email: 'patient1@test.topsmile.com',
                password: 'Patient123!',
                firstName: 'João',
                lastName: 'Silva',
                phone: '(11) 98765-4321',
                dateOfBirth: new Date('1990-01-15')
            },
            {
                email: 'patient2@test.topsmile.com',
                password: 'Patient123!',
                firstName: 'Maria',
                lastName: 'Santos',
                phone: '(11) 98765-4322',
                dateOfBirth: new Date('1985-05-20')
            }
        ];

        for (const patData of patientData) {
            const existingPatientUser = await PatientUser.findOne({ email: patData.email });
            if (!existingPatientUser) {
                const hashedPassword = await bcrypt.hash(patData.password, 10);
                
                // Create Patient record
                const patient = await Patient.create({
                    clinic: clinic._id,
                    firstName: patData.firstName,
                    lastName: patData.lastName,
                    email: patData.email,
                    phone: patData.phone,
                    dateOfBirth: patData.dateOfBirth,
                    isActive: true
                });

                // Create PatientUser record
                await PatientUser.create({
                    patient: patient._id,
                    email: patData.email,
                    password: hashedPassword,
                    isActive: true,
                    emailVerified: true
                });

                console.log(`✅ Created patient: ${patData.email}`);
            } else {
                console.log(`⏭️  Patient already exists: ${patData.email}`);
            }
        }

        console.log('\n🎉 Test users seeded successfully!\n');
        console.log('📋 Test Credentials:');
        console.log('\nStaff Users:');
        console.log('  Super Admin: superadmin@test.topsmile.com / SuperAdmin123!');
        console.log('  Admin:       admin@test.topsmile.com / Admin123!');
        console.log('  Provider:    dentist@test.topsmile.com / Dentist123!');
        console.log('  Staff:       staff@test.topsmile.com / Staff123!');
        console.log('\nPatient Users:');
        console.log('  Patient 1:   patient1@test.topsmile.com / Patient123!');
        console.log('  Patient 2:   patient2@test.topsmile.com / Patient123!');

    } catch (error) {
        console.error('❌ Error seeding users:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
    }
}

seedTestUsers();
