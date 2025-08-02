const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();
connectDB();

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: 'Admin' });

    if (existingAdmin) {
      console.log('Admin already exists!');
    } else {
      const admin = new User({
        fullName: 'System Admin',
        email: 'admin@example.com',
        password: 'admin123', // will be hashed by pre-save hook
        role: 'admin',
      });

      await admin.save();
      console.log('✅ Admin user created');
    }

    process.exit();
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
    process.exit(1);
  }
};

seedAdmin();
