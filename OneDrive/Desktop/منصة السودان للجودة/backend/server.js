const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const questionRoutes = require('./src/routes/questionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Hardcoded MongoDB URI - can be changed here
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://daoudtajeldeinn113_db_user:HbdStyeaJyk5DaVz@sudanqualityplatform.xmr9cgw.mongodb.net/?appName=SUDANQUALITYPLATFORM&retryWrites=true&w=majority";

console.log("MongoDB URI:", MONGO_URI);

// Middleware
const corsOptions = {
  origin: [
    'https://decisive-octane-472816-d3.web.app',
    'https://decisive-octane-472816-d3.firebaseapp.com',
    'http://localhost:5173',
    'http://localhost:5000'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.use(express.json());

// Demo mode flag - set to true if MongoDB is not available
let isDemoMode = false;

// In-memory storage for demo mode
const demoUsers = new Map();
const { demoQuestions, getQuestionsByUnit, checkAnswer: checkDemoAnswer } = require('./src/data/demoQuestions');

// Demo mode database simulation
const DemoDB = {
  users: demoUsers,
  
  // Helper to simulate async operations
  async findUserByEmail(email) {
    for (let user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  },

  async findUserById(id) {
    return this.users.get(id) || null;
  },

  async createUser(userData) {
    const id = 'demo_' + Date.now();
    const user = { ...userData, _id: id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  },

  async getRandomQuestions(unitId, count = 10) {
    return getQuestionsByUnit(unitId, count);
  },

  async getRotatedQuestions(unitId, count = 10, excludeIds = []) {
    return getQuestionsByUnit(unitId, count, excludeIds);
  },

  async checkAnswer(questionId, answer) {
    const result = checkDemoAnswer(questionId, answer);
    if (!result.found) return { correct: false, message: 'Question not found' };
    return {
      correct: result.isCorrect,
      correctAnswer: result.correctAnswer,
      explanation: result.explanation
    };
  }
};


// MongoDB Connection
const connectDB = async () => {
  try {
    // Use the hardcoded MONGO_URI or environment variable
    let mongoUri = process.env.MONGODB_URI || MONGO_URI;

    console.log("Attempting to connect to MongoDB...");
    console.log("MongoDB URI:", mongoUri ? "Found" : "Not found");
    
    // Try to connect to the provided MongoDB URI first
    if (mongoUri) {
      try {
        await mongoose.connect(mongoUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
        return; // Connection successful, exit function
      } catch (connError) {
        console.log('Failed to connect to provided MongoDB, starting in DEMO mode...');
        mongoUri = null;
      }
    }

    // If no MongoDB URI or connection failed, try mongodb-memory-server
    if (!mongoUri) {
      console.log('Trying MongoDB Memory Server...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();

        await mongoose.connect(mongoUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('MongoDB Memory Server connected successfully');
        return;
      } catch (memServerError) {
        console.log('MongoDB Memory Server not available, starting in DEMO mode...');
      }
    }

    // Fallback to demo mode
    isDemoMode = true;
    console.log('===========================================');
    console.log('⚠️  RUNNING IN DEMO MODE (No Database)');
    console.log('===========================================');
    console.log('Features available in demo mode:');
    console.log('✓ User registration and login');
    console.log('✓ Quiz with sample questions');
    console.log('✓ All API endpoints respond normally');
    console.log('Note: Data will not persist after server restart');
    console.log('===========================================');

  } catch (error) {
    console.log('Database not available, starting in DEMO mode...');
    isDemoMode = true;
  }
};

connectDB();

// Make demoDB available to routes
app.use((req, res, next) => {
  req.demoDB = DemoDB;
  req.isDemoMode = isDemoMode;
  next();
});

const authRoutes = require('./src/routes/authRoutes');
const questionRoutes = require('./src/routes/questionRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
...
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  const status = isDemoMode ? 'demo' : 'production';
  res.json({
    message: 'منصة السودان للجودة - API работает بنجاح!',
    version: '1.0.0',
    status: status,
    database: isDemoMode ? 'Demo Mode (In-Memory)' : 'MongoDB',
    endpoints: {
      auth: '/api/auth',
      questions: '/api/questions'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: isDemoMode ? 'demo' : 'production',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

