import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'Student', 'Supervisor'],
    default: 'Student',
  },
    supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  students: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
],


  matricNumber: {
  type: String,
  required: function () {
    return this.role === 'Student'; // required for students
  },
  unique: true,
  sparse: true, // allow nulls for supervisors/admins
},
  createdAt: {
    type: Date,
    default: Date.now,
  },



});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); 

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

