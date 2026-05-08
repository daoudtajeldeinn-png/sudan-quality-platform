const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const questionRoutes = require('./src/routes/questionRoutes');
const certificateRoutes = require('./src/routes/certificateRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Hardcoded MongoDB URI - can be changed here
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://daoudtajeldeinn113_db_user:HbdStyeaJyk5DaVz@sudanqualityplatform.xmr9cgw.mongodb.net/?appName=SUDANQUALITYPLATFORM&retryWrites=true&w=majority";

// ─── CORS (EXTREME FIX) ─────────────────────────────────────────────────────
app.use(cors({
    origin: function (origin, callback) {
        const whitelist = [
            'https://decisive-octane-472816-d3.web.app',
            'https://sudan-quality-frontend.vercel.app',
            'https://sudan-quality-frontend-evipdz4gl-daoudtajeldeinn-pngs-projects.vercel.app',
            'https://decisive-octane-472816-d3.firebaseapp.com',
            'http://localhost:5173',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            'http://localhost:5000'
        ];
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log("CORS Blocked Origin:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.options('*', cors());
// ────────────────────────────────────────────────────────────────────────────

console.log("MongoDB URI:", MONGO_URI);

// Middleware
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
    let user = this.users.get(id);
    if (!user && id) {
      // Auto-create demo user if requested but not found
      user = {
        userId: id,
        email: 'demo@sudan-quality.com',
        displayName: 'Demo User',
        xp: 0,
        level: 1,
        badges: [],
        stats: { totalQuizzes: 0, perfectScores: 0 },
        progress: { unitScores: {}, unitStates: {}, certificates: [], completedUnits: [] },
        createdAt: new Date()
      };
      this.users.set(id, user);
    }
    return user;
  },

  async updateUser(id, data) {
    const user = await this.findUserById(id);
    if (!user) return null;
    
    // Merge nested objects correctly
    if (data.progress) {
      user.progress = { ...user.progress, ...data.progress };
      delete data.progress;
    }
    if (data.stats) {
      user.stats = { ...user.stats, ...data.stats };
      delete data.stats;
    }
    
    Object.assign(user, data);
    this.users.set(id, user);
    return user;
  },

  async awardCertificate(id, certData) {
    const user = await this.findUserById(id);
    if (!user) return null;
    
    const cert = {
      _id: 'cert_' + Date.now(),
      certNumber: `SQP-DEMO-${Date.now()}`,
      status: 'active',
      ...certData,
      issueDate: new Date()
    };
    
    if (!user.progress.certificates) user.progress.certificates = [];
    user.progress.certificates.push({
        certificateId: cert._id,
        issueDate: cert.issueDate,
        score: cert.score,
        unitType: cert.unitName,
        level: cert.level || 1
    });
    
    this.users.set(id, user);
    return cert;
  },

  async createUser(userData) {
    const id = userData.userId || 'demo_' + Date.now();
    const user = { 
      ...userData, 
      _id: id, 
      xp: userData.xp || 0,
      level: userData.level || 1,
      badges: userData.badges || [],
      stats: userData.stats || { totalQuizzes: 0, perfectScores: 0 },
      progress: userData.progress || { unitScores: {}, unitStates: {}, certificates: [], completedUnits: [] },
      createdAt: new Date() 
    };
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

const userRoutes = require('./src/routes/userRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/user', userRoutes);
app.use('/api/certificates', certificateRoutes);

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