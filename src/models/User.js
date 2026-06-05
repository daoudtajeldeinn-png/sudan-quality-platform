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
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'google'
  },
  password: { // Added for local auth compatibility
    type: String,
    required: false
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
    completedUnits: [String],
    currentUnit: String,
    unitScores: {
      type: Map,
      of: Number,
      default: {}
    },
    unitStates: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {}
    },
    lastPlayed: String,
    totalScore: {
      type: Number,
      default: 0
    },
    level: { type: Number, default: 1 }, // 1=basic, 2=advanced
    certificates: [{
      certificateId: String,
      issueDate: Date,
      score: Number,
      unitType: String,
      unitId: String,
      level: Number
    }]
  }
});

module.exports = mongoose.model('User', userSchema);
