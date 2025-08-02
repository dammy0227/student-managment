const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
    default: function () {
      return `/uploads/${this.fileName}`;
    },
  },

     status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  version: {
    type: Number,
    default: 1,
  },
  isReadBySupervisor: {
  type: Boolean,
  default: false,
},

  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;
