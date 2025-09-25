const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { PatientUser } = require('./dist/backend/src/models/PatientUser');
const { Patient } = require('./dist/backend/src/models/Patient');
const { Clinic } = require('./dist/backend/src/models/Clinic'); // Import Clinic model
const patientAuthRoutes = require('./dist/backend/src/routes/patientAuth').default;

async function simpleTest() {
  try {
    // Connect to test database
    await mongoose.connect('mongodb://localhost:27017/topsmile-test');
    console.log('Connected to database');

    // Clean up
    await PatientUser.deleteMany({});
    await Patient.deleteMany({});
    console.log('Cleaned up collections');

    // Create Express app
    const app = express();
    app.use(express.json());
    app.use('/api/patient/auth', patientAuthRoutes);

    // Create a patient
    const patient = await Patient.create({
      firstName: 'Test',
      lastName: 'Patient',
      phone: '(11) 99999-9999',
      email: 'patient@example.com',
      clinic: '507f1f77bcf86cd799439011',
      status: 'active',
      address: {
        zipCode: '00000-000'
      },
      medicalHistory: {
        allergies: [],
        medications: [],
        conditions: [],
        notes: ''
      }
    });
    console.log('Created patient:', patient._id);

    // Register a new patient user
    console.log('Attempting registration...');
    const registerRes = await request(app)
      .post('/api/patient/auth/register')
      .send({
        patientId: patient._id.toString(),
        email: 'testpatient@example.com',
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'Patient',
        phone: '(11) 99999-9999',
        clinicId: patient.clinic.toString()
      });

    console.log('Registration response:', registerRes.statusCode, registerRes.body);

    // Check if user was created
    const createdUser = await PatientUser.findOne({ email: 'testpatient@example.com' });
    console.log('User created:', createdUser ? createdUser._id : 'NOT FOUND');

    // Try login
    console.log('Attempting login...');
    const loginRes = await request(app)
      .post('/api/patient/auth/login')
      .send({
        email: 'testpatient@example.com',
        password: 'TestPassword123!'
      });

    console.log('Login response:', loginRes.statusCode, loginRes.body);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
  }
}

simpleTest();