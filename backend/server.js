const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Force Google DNS for SRV resolution (fixes connection issues in some regions)
dns.setServers(['8.8.8.8', '8.8.4.4']);

const authRoutes = require('./src/routes/authRoutes');
const questionRoutes = require('./src/routes/questionRoutes');
const certificateRoutes = require('./src/routes/certificateRoutes');
const userRoutes = require('./src/routes/userRoutes');

const { DemoDB } = require('./src/data/demoQuestions');

const app = express();
const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://daoudtajeldeinn_db_user:9xEajIUAs9eAVg1p@sudanqualityplateform2.hkq9hs1.mongodb.net/sudan_quality_db?retryWrites=true&w=majority";

// ─── MIDDLEWARE ─────────────────────────────────────────────────────────────
// ─── MANUAL CORS HANDLING (ULTIMATE FIX) ────────────────────────────────────
app.use((req, res, next) => {
    const origin = req.headers.origin;
    // Allow any origin
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle Preflight (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    next();
});

app.use(express.json());
app.options('*', cors());

// ─── DATABASE ───────────────────────────────────────────────────────────────
let isDemoMode = false;

const connectDB = async () => {
    try {
        console.log("--- DB Connection Attempt ---");
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected successfully');
        isDemoMode = false;
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.log('⚠️ SWITCHING TO DEMO MODE');
        isDemoMode = true;
    }
};

connectDB();

app.use((req, res, next) => {
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
        database: isDemoMode ? 'Demo Mode' : 'MongoDB Atlas'
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', mode: isDemoMode ? 'demo' : 'production' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});