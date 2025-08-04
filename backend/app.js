// app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

// app.js
app.use(cors({
  origin: ['http://localhost:5173', 'https://student-managment-lovat.vercel.app'],
  credentials: true
}));



app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/files', require('./routes/fileRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/calendar', require('./routes/calendarRoutes'));

// Error handler
app.use(errorHandler);

module.exports = app;