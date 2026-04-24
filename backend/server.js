<<<<<<< HEAD
const express = require('express');
=======
 const express = require('express');
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const questionRoutes = require('./src/routes/questionRoutes');
const userRoutes = require('./src/routes/userRoutes');
const certificateRoutes = require('./src/routes/certificateRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

<<<<<<< HEAD
const MONGO_URI = process.env.MONGODB_URI;
console.log("MongoDB URI:", MONGO_URI ? "Set" : "Not set");

// ─── CORS (EXTREME FIX) ─────────────────────────────────────────────────────
app.use(cors({
    origin: function (origin, callback) {
        const whitelist = [
            'https://decisive-octane-472816-d3.web.app',
            'https://sudan-quality-frontend.vercel.app',
            'http://localhost:5173',
            'http://localhost:3000',
            'http://127.0.0.1:5173'
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

app.use(express.json());

let isDemoMode = false;
const demoUsers = new Map();
const { demoQuestions, getQuestionsByUnit, checkAnswer: checkDemoAnswer } = require('./src/data/demoQuestions');

const DemoDB = {
    users: demoUsers,
=======
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
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
    async findUserByEmail(email) {
        for (let user of this.users.values()) {
            if (user.email === email) return user;
        }
        return null;
    },
<<<<<<< HEAD
    async findUserById(id) {
        return this.users.get(id) || null;
    },
=======

    async findUserById(id) {
        return this.users.get(id) || null;
    },

>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
    async createUser(userData) {
        const id = 'demo_' + Date.now();
        const user = { ...userData, _id: id, createdAt: new Date() };
        this.users.set(id, user);
        return user;
    },
<<<<<<< HEAD
    async getRandomQuestions(unitId, count = 10) {
        return getQuestionsByUnit(unitId, count);
    },
    async getRotatedQuestions(unitId, count = 10, excludeIds = []) {
        return getQuestionsByUnit(unitId, count, excludeIds);
    },
=======

    async getRandomQuestions(unitId, count = 10) {
        return getQuestionsByUnit(unitId, count);
    },

    async getRotatedQuestions(unitId, count = 10, excludeIds = []) {
        return getQuestionsByUnit(unitId, count, excludeIds);
    },

>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
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

<<<<<<< HEAD
const connectDB = async () => {
    try {
        if (MONGO_URI) {
            try {
                await mongoose.connect(MONGO_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                console.log('✅ MongoDB Atlas connected successfully');
                return;
            } catch (connError) {
                console.log('❌ MongoDB Atlas connection failed:', connError.message);
            }
        }

        // FALLBACK TO DEMO MODE IMMEDIATELY (No more MemoryServer crash!)
=======
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
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
        isDemoMode = true;
        console.log('===========================================');
        console.log('🚀 RUNNING IN DEMO MODE (No Persistent DB)');
        console.log('===========================================');
<<<<<<< HEAD
    } catch (error) {
        console.log('Database setup error:', error.message);
=======
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
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
        isDemoMode = true;
    }
};

connectDB();

<<<<<<< HEAD
=======
// Make demoDB available to routes
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
app.use((req, res, next) => {
    req.demoDB = DemoDB;
    req.isDemoMode = isDemoMode;
    next();
});

<<<<<<< HEAD
=======
// Routes
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/user', userRoutes);
app.use('/api/certificates', certificateRoutes);

app.get('/', (req, res) => {
<<<<<<< HEAD
    res.json({
        message: 'منصة السودان للجودة - API Server Ready!',
        status: isDemoMode ? 'demo' : 'production',
=======
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
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
        vercel: process.env.VERCEL ? 'Deployed on Vercel ✅' : 'Local dev'
    });
});

<<<<<<< HEAD
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', mode: isDemoMode ? 'demo' : 'production' });
});

=======
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
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', demoMode: isDemoMode });
});

<<<<<<< HEAD
const serverListener = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
=======
// Start server
const serverListener = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
    console.log(`📱 Vercel deployment: ${!!process.env.VERCEL}`);
});

module.exports = app; // Vercel serverless support
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
