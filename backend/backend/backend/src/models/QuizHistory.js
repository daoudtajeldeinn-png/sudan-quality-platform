const mongoose = require('mongoose');

const quizHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  unitId: {
    type: String,
    required: true,
    index: true
  },
  seenQuestions: [{
    type: String // Array of question IDs
  }],
  lastReset: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound index for fast lookups per user per unit
quizHistorySchema.index({ userId: 1, unitId: 1 }, { unique: true });

module.exports = mongoose.model('QuizHistory', quizHistorySchema);
