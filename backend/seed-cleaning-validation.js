const mongoose = require('mongoose');
const { demoQuestions } = require('./src/data/demoQuestions');
const Question = require('./src/models/Question');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://daoudtajeldeinn_db_user:9xEajIUAs9eAVg1p@sudanqualityplateform2.hkq9hs1.mongodb.net/sudan_quality_db?retryWrites=true&w=majority";

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected successfully!');

    const unitId = 'cleaning-validation';
    const questions = demoQuestions[unitId];

    if (!questions || questions.length === 0) {
      console.error('No questions found for cleaning-validation in demoQuestions.js');
      process.exit(1);
    }

    console.log(`Found ${questions.length} questions. Updating database...`);

    // Remove existing questions for this unit to avoid duplicates
    await Question.deleteMany({ unitId });
    console.log('Cleaned old questions.');

    // Insert new questions
    const formatted = questions.map(q => {
        const newQ = { ...q };
        delete newQ._id; // Let MongoDB generate new IDs
        return newQ;
    });

    await Question.insertMany(formatted);
    console.log(`✅ Successfully seeded ${formatted.length} questions to MongoDB!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
