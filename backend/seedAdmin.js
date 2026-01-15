// seedAdmin.js
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();
await connectDB();

const seedAdmin = async () => {
  try {
    const ADMIN_EMAIL = 'dammy123@example.com';
    const ADMIN_PASSWORD = 'dammy123';
    const ADMIN_FULLNAME = 'System Admin';

    // Hash the password once
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Check if admin exists
    let admin = await User.findOne({ role: 'admin' });

    if (admin) {
      // 🔄 Update existing admin WITHOUT double hashing
      await User.updateOne(
        { _id: admin._id },
        {
          $set: {
            fullName: ADMIN_FULLNAME,
            email: ADMIN_EMAIL,
            password: hashedPassword,
          },
        }
      );
      console.log('🔄 Admin already existed — password RESET');
    } else {
      // ✅ Create new admin using insertOne to bypass hooks
      await User.collection.insertOne({
        fullName: ADMIN_FULLNAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
      });
      console.log('✅ Admin created successfully');
    }

    // 🔐 SHOW ADMIN LOGIN DETAILS
    console.log('==============================');
    console.log('ADMIN LOGIN DETAILS');
    console.log('Email    :', ADMIN_EMAIL);
    console.log('Password :', ADMIN_PASSWORD);
    console.log('==============================');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
    process.exit(1);
  }
};

seedAdmin();
