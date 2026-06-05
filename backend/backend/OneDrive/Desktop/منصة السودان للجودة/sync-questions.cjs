const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Define Question Schema (must match model)
const questionSchema = new mongoose.Schema({
  unitId: { type: String, required: true },
  type: { type: String, enum: ['mcq', 'tf', 'fill'], default: 'mcq' },
  questionText: { ar: String, en: String },
  options: { ar: [String], en: [String] },
  correctAnswer: mongoose.Schema.Types.Mixed,
  correctAnswers: [String],
  explanation: { ar: String, en: String },
  difficulty: { type: String, default: 'medium' },
  category: { type: String, required: true }
});

const Question = mongoose.model('Question', questionSchema);

const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://daoudtajeldeinn113_db_user:HbdStyeaJyk5DaVz@sudanqualityplatform.xmr9cgw.mongodb.net/?appName=SUDANQUALITYPLATFORM&retryWrites=true&w=majority";

async function syncQuestions() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Dynamic import for ESM content
    const contentPath = path.resolve(__dirname, '../../frontend/src/data/content_new.js');
    console.log(`Importing content from: ${contentPath}`);
    
    // Convert path to file URL for Windows compatibility with import()
    const contentUrl = `file://${contentPath.replace(/\\/g, '/')}`;
    const { educationalContent } = await import(contentUrl);

    if (!educationalContent) {
        throw new Error('educationalContent not found in content_new.js');
    }

    const allQuestions = educationalContent.allQuestions;
    const units = educationalContent.units;

    // Create mapping of question ID to unit ID
    const qToUnitMapping = {};
    Object.keys(units).forEach(uId => {
      if (units[uId].examQuestionPool) {
        units[uId].examQuestionPool.forEach(qId => {
          qToUnitMapping[qId] = uId;
        });
      }
    });

    console.log(`Found ${Object.keys(allQuestions).length} questions in content_new.js`);

    // Prepare for bulk insert
    const questionDocs = [];
    for (const [qId, qData] of Object.entries(allQuestions)) {
      const unitId = qToUnitMapping[qId];
      if (!unitId) {
        // Skip questions not in any pool
        continue;
      }

      questionDocs.push({
        unitId: unitId,
        type: qData.type || 'mcq',
        questionText: qData.questionText,
        options: qData.options || { ar: [], en: [] },
        correctAnswer: qData.correctAnswer,
        correctAnswers: qData.correctAnswers || [],
        explanation: qData.explanation || { ar: '', en: '' },
        difficulty: qData.difficulty || 'medium',
        category: unitId
      });
    }

    // Clear existing questions and insert new ones
    console.log('Clearing existing questions...');
    await Question.deleteMany({});
    
    console.log(`Inserting ${questionDocs.length} questions...`);
    await Question.insertMany(questionDocs);
    console.log('Sync successful!');

    process.exit(0);
  } catch (err) {
    console.error('Sync failed:', err);
    process.exit(1);
  }
}

syncQuestions();
