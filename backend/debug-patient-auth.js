const mongoose = require('mongoose');
const { PatientUser } = require('./dist/backend/src/models/PatientUser');
const { Patient } = require('./dist/backend/src/models/Patient');

async function debugPatientAuth() {
  try {
    // Connect to test database
    await mongoose.connect('mongodb://localhost:27017/topsmile-test');
    console.log('Connected to database');

    // Clean up
    await PatientUser.deleteMany({});
    await Patient.deleteMany({});
    console.log('Cleaned up collections');

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

    // Create a patient user
    const patientUser = new PatientUser({
      patient: patient._id,
      email: 'testpatient@example.com',
      password: 'TestPassword123!',
      isActive: true,
      emailVerified: false
    });

    await patientUser.save();
    console.log('Created patient user:', patientUser._id);

    // Try to find the patient user
    const foundUser = await PatientUser.findOne({ email: 'testpatient@example.com' });
    console.log('Found user:', foundUser ? foundUser._id : 'NOT FOUND');

    // Try password comparison
    if (foundUser) {
      const isMatch = await foundUser.comparePassword('TestPassword123!');
      console.log('Password match:', isMatch);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
  }
}

debugPatientAuth();