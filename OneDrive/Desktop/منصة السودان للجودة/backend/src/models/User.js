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
  password: { // Added for local auth compatibility
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
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  badges: [{
    id: String,
    name: String,
    icon: String,
    date: Date
  }],
  stats: {
    totalQuizzes: { type: Number, default: 0 },
    perfectScores: { type: Number, default: 0 },
    lecturesCompleted: { type: Number, default: 0 }
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
