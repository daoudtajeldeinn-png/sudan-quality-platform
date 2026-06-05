const mongoose = require('mongoose');
const fs = require('fs');

// نموذج السؤال
const questionSchema = new mongoose.Schema({
  unitId: {
    type: String,
    required: true,
    index: true
  },
  questionText: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
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

const Question = mongoose.model('Question', questionSchema);

// الاتصال بقاعدة البيانات
mongoose.connect('mongodb://localhost:27017/qualityplatform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
  
  try {
    // قراءة ملف الأسئلة العينة
    const questionsData = JSON.parse(fs.readFileSync('sample-questions.json', 'utf8'));
    
    // حذف الأسئلة الحالية
    await Question.deleteMany({});
    console.log('Previous questions deleted');
    
    // إدخال الأسئلة الجديدة
    const insertedQuestions = await Question.insertMany(questionsData);
    console.log(`Inserted ${insertedQuestions.length} questions`);
    
    // إغلاق الاتصال
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error inserting questions:', error);
    mongoose.connection.close();
  }
});
