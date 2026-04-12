const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const questionRoutes = require('./src/routes/questionRoutes');
const userRoutes = require('./src/routes/userRoutes');
const certificateRoutes = require('./src/routes/certificateRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Use env var only, remove hardcoded for security
const MONGO_URI = process.env.MONGODB_URI;

console.log("MongoDB URI:", MONGO_URI ? "Set" : "Not set");

// ─── CORS (FIXED) ─────────────────────────────────────────────────────────────
const corsOptions = {
  origin: true, // FULLY PERMISSIVE - Allows ALL origins (including preflight)
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle ALL preflight OPTIONS requests
// ──────────────────────────────────────────────────────────────────────────────

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
        let mongoUri = MONGO_URI;

        console.log("Attempting to connect to MongoDB...");
        console.log("MongoDB URI:", mongoUri ? "Found" : "Not found");

        if (mongoUri) {
            try {
                await mongoose.connect(mongoUri, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                console.log('MongoDB connected successfully');
                return;
            } catch (connError) {
                console.log('Failed to connect to MongoDB:', connError.message);
                console.log('Starting in DEMO mode...');
            }
        }

        // Try MongoDB Memory Server (local dev only, Vercel-safe)
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
            console.log('MongoDB Memory Server not available (expected on Vercel/prod):', memServerError.message);
        }

        // Fallback to demo mode
        isDemoMode = true;
        console.log('===========================================');
        console.log('🚀 RUNNING IN DEMO MODE (No Persistent DB)');
        console.log('===========================================');
        console.log('✅ Features working:');
        console.log('  • User auth & profiles');
        console.log('  • Quizzes & scoring');
        console.log('  • Certificates');
        console.log('  • All APIs respond');
        console.log('ℹ️  Data resets on restart');
        console.log('===========================================');

    } catch (error) {
        console.log('Database setup error:', error.message);
        console.log('Starting in safe DEMO mode...');
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/user', userRoutes);
app.use('/api/certificates', certificateRoutes);

app.get('/', (req, res) => {
    const status = isDemoMode ? 'demo' : 'production';
    res.json({
        message: 'منصة السودان للجودة - API Server Ready! 🎯',
        version: '1.0.0',
        status: status,
        database: isDemoMode ? 'Demo (In-Memory)' : 'MongoDB Connected',
        endpoints: {
            auth: '/api/auth',
            questions: '/api/questions',
            user: '/api/user',
            certificates: '/api/certificates'
        },
        vercel: process.env.VERCEL ? 'Deployed on Vercel ✅' : 'Local dev'
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        mode: isDemoMode ? 'demo' : 'production',
        timestamp: new Date().toISOString(),
        vercel: !!process.env.VERCEL
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', demoMode: isDemoMode });
});

// Start server
const serverListener = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
    console.log(`📱 Vercel deployment: ${!!process.env.VERCEL}`);
});

module.exports = app; // Vercel serverless support
