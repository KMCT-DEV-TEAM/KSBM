import mongoose from 'mongoose';
import connectDB from '../src/config/db.js';
import User from '../src/modules/users/user.model.js';

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if an admin already exists to prevent duplication
    const adminExists = await User.findOne({ email: 'admin@ksbm.ac.in' });
    
    if (adminExists) {
      console.log('Admin user already exists!');
      process.exit();
    }

    const adminUser = new User({
      name: 'KSBM Administrator',
      email: 'admin@ksbm.ac.in',
      password: 'adminpassword123', // This will automatically be hashed by the model's pre-save middleware
      role: 'admin',
    });

    await adminUser.save();
    console.log('Admin user successfully seeded!');
    
    process.exit();
  } catch (error) {
    console.error(`Error seeding admin: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
