const mongoose = require('mongoose');
require('dotenv').config();
const Question = require('./src/models/Question');
const { demoQuestions } = require('./src/data/demoQuestions');

const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://daoudtajeldeinn_db_user:9xEajIUAs9eAVg1p@sudanqualityplateform2.hkq9hs1.mongodb.net/sudan_quality_db?retryWrites=true&w=majority";

const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB for seeding...');

        // Clear existing questions to avoid duplicates
        await Question.deleteMany({});
        console.log('🗑️ Cleared existing questions.');

        // Insert new questions
        // Note: demoQuestions is the flat array of all questions from demoQuestions.js
        const questionsToInsert = demoQuestions.map(q => {
            const { _id, ...rest } = q;
            const newQ = { ...rest, category: q.unitId };
            // Ensure correctAnswer exists for fill type if it relies on correctAnswers
            if (q.type === 'fill' && q.correctAnswer === undefined) {
                newQ.correctAnswer = q.correctAnswers[0] || '';
            }
            return newQ;
        });

        const result = await Question.insertMany(questionsToInsert);
        console.log(`✅ Successfully seeded ${result.length} questions into MongoDB Atlas!`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
};

seedDB();
