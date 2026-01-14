import mongoose from 'mongoose';

const calendarEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  type: {
    type: String,
    enum: ['deadline', 'meeting', 'milestone'],
    default: 'deadline',
  },
  isReadBySupervisor: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model('CalendarEvent', calendarEventSchema);
