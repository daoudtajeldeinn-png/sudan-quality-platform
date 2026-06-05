const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  unitId: {
    type: String,
    required: true,
    index: true
  },
  questionText: {
    ar: { type: String, required: true },
    en: { type: String, required: true }
  },
  options: {
    ar: [{ type: String, required: true }],
    en: [{ type: String, required: true }]
  },
  correctAnswer: {
    type: Number,
    required: true
  },
  explanation: {
    type: String
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  category: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Question', questionSchema);
