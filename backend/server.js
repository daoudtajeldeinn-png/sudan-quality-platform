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
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://daoudtajeldeinn_db_user:9xEajIUAs9eAVg1p@sudanqualityplateform2.hkq9hs1.mongodb.net/sudan_quality_db?retryWrites=true&w=majority";

// ─── CORS (EXTREME FIX) ─────────────────────────────────────────────────────
app.use(cors({
    origin: function (origin, callback) {
        // Allow all origins to resolve CORS blocking issues across all preview URLs
        callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Add COOP/COEP headers to allow Firebase Auth popups to communicate back to the opener
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    next();
});

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
    let mongoUri = process.env.MONGODB_URI || MONGO_URI;
    
    console.log("--- DB Connection Attempt ---");
    console.log("Target URI:", mongoUri ? mongoUri.substring(0, 20) + "..." : "NONE");

    if (mongoUri) {
      try {
        await mongoose.connect(mongoUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected successfully');
        isDemoMode = false;
        return;
      } catch (connError) {
        console.error('❌ Failed to connect to provided MongoDB:', connError.message);
      }
    }

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
        console.log('✅ MongoDB Memory Server connected');
        isDemoMode = false;
        return;
      } catch (memServerError) {
        console.error('❌ Memory Server failed:', memServerError.message);
      }
    }

    isDemoMode = true;
    console.log('⚠️ RUNNING IN DEMO MODE');
  } catch (error) {
    console.error('DB setup fatal error:', error);
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