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
        isDemoMode = true;
        console.log('===========================================');
        console.log('🚀 RUNNING IN DEMO MODE (No Persistent DB)');
        console.log('===========================================');
    } catch (error) {
        console.log('Database setup error:', error.message);
        isDemoMode = true;
    }
};

connectDB();

app.use((req, res, next) => {
    req.demoDB = DemoDB;
    req.isDemoMode = isDemoMode;
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/user', userRoutes);
app.use('/api/certificates', certificateRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'منصة السودان للجودة - API Server Ready!',
        status: isDemoMode ? 'demo' : 'production',
        vercel: process.env.VERCEL ? 'Deployed on Vercel ✅' : 'Local dev'
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', mode: isDemoMode ? 'demo' : 'production' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', demoMode: isDemoMode });
});

const serverListener = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
