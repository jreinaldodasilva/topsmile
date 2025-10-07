// backend/scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/topsmile');
    console.log('✅ Connected to MongoDB');

    // Get or create default clinic
    const Clinic = mongoose.model('Clinic', new mongoose.Schema({
      name: String,
      isActive: Boolean,
      createdAt: Date
    }));

    let clinic = await Clinic.findOne();
    if (!clinic) {
      clinic = await Clinic.create({
        name: 'TopSmile Clinic',
        isActive: true,
        createdAt: new Date()
      });
      console.log('✅ Default clinic created');
    }

    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      clinic: mongoose.Schema.Types.ObjectId,
      isActive: Boolean,
      createdAt: Date,
      updatedAt: Date
    }));

    const adminEmail = 'admin@topsmile.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('📧 Email:', adminEmail);
      process.exit(0);
    }

    const admin = await User.create({
      name: 'Admin TopSmile',
      email: adminEmail,
      password: 'Admin123!',
      role: 'super_admin',
      clinic: clinic._id,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password: Admin123!');
    console.log('\n⚠️  Please change the password after first login');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
