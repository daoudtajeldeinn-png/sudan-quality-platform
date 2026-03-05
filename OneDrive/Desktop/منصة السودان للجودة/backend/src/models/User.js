const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  photoURL: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  progress: {
    completedUnits: [{
      type: String
    }],
    currentUnit: {
      type: String
    },
    totalScore: {
      type: Number,
      default: 0
    },
    certificates: [{
      certificateId: String,
      issueDate: Date,
      score: Number,
      unitType: String
    }]
  }
});

module.exports = mongoose.model('User', userSchema);
