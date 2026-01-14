// seedAdmin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js'; // ⚠️ must include .js
import User from './models/User.js';    // ⚠️ must include .js

dotenv.config();
connectDB();

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' }); // lowercase 'admin'

    if (existingAdmin) {
      console.log('✅ Admin already exists!');
    } else {
      const hashedPassword = await bcrypt.hash('dammy123', 10);

      const admin = new User({
        fullName: 'System Admin',
        email: 'dammy123@example.com', // ⚠️ use valid email format
        password: hashedPassword,
        role: 'admin',
      });

      await admin.save();
      console.log('✅ Admin user created');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
    process.exit(1);
  }
};

seedAdmin();
