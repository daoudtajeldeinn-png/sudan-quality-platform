const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const questionRoutes = require('./src/routes/questionRoutes');
const certificateRoutes = require('./src/routes/certificateRoutes');
const userRoutes = require('./src/routes/userRoutes');

const { DemoDB } = require('./src/data/demoQuestions');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ─────────────────────────────────────────────────────────────
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    next();
});

app.use(express.json());

// ─── DATABASE ───────────────────────────────────────────────────────────────
let isConnected = false;
let isDemoMode = false;

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://daoudtajeldeinn113:Daoud2002@cluster0.mongodb.net/sudan-quality-platform?retryWrites=true&w=majority';

const connectDB = async () => {
    if (isConnected) return;
    try {
        console.log("--- MongoDB Connection Check ---");
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
        });
        isConnected = true;
        isDemoMode = false;
        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.log('⚠️ SWITCHING TO DEMO MODE');
        isDemoMode = true;
        isConnected = false;
    }
};

app.use(async (req, res, next) => {
    await connectDB();
    req.isDemoMode = isDemoMode;
    req.demoDB = DemoDB;
    next();
});

// ─── ROUTES ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/user', userRoutes);
app.use('/api/certificates', certificateRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'منصة السودان للجودة - API works!',
        status: isDemoMode ? 'demo' : 'production',
        database: isDemoMode ? 'Demo Mode' : 'MongoDB'
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', mode: isDemoMode ? 'demo' : 'production' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});