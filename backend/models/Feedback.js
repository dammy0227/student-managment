const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  chapterTitle: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    min: 0,
    max: 20,
    default: 0,
  },
  isReadByStudent: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
