const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  unitId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['mcq', 'tf', 'fill'],
    default: 'mcq'
  },
  questionText: {
    ar: { type: String, required: true },
    en: { type: String, required: true }
  },
  options: {
    ar: [String],
    en: [String]
  },
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed, // Can be Number (MCQ/TF) or String (Fill)
    required: true
  },
  correctAnswers: {
    type: [String], // Used for fill-in-the-blank (multiple valid options)
    default: []
  },
  explanation: {
    ar: { type: String },
    en: { type: String }
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
