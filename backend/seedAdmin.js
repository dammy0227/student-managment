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

    let admin = await User.findOne({ role: 'admin' });

    // Always hash the password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    if (admin) {
      // 🔄 Update existing admin password
      admin.password = hashedPassword;
      admin.email = ADMIN_EMAIL;
      admin.fullName = 'System Admin';

      await admin.save();

      console.log('🔄 Admin already existed — password RESET');
    } else {
      // ✅ Create new admin
      admin = new User({
        fullName: 'System Admin',
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
      });

      await admin.save();
      console.log('✅ Admin CREATED');
    }

    // 🔐 SHOW LOGIN DETAILS
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
