const mongoose = require('mongoose');
const dns = require('dns');

// Fix for DNS resolution in restricted networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

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
    // Filter from the flat array exported by demoQuestions.js
    const questions = demoQuestions.filter(q => q.unitId === unitId);

    if (!questions || questions.length === 0) {
      console.error(`No questions found for ${unitId} in demoQuestions.js. Array length: ${demoQuestions.length}`);
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
        if (!newQ.category) newQ.category = 'Intermediate';
        
        // Handle 'fill' type questions for schema validation
        if (newQ.type === 'fill' && (!newQ.correctAnswer && newQ.correctAnswers)) {
            newQ.correctAnswer = newQ.correctAnswers[0];
        }
        
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
