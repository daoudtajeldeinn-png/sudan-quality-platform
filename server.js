const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const questionRoutes = require('./src/routes/questionRoutes');
const certificateRoutes = require('./src/routes/certificateRoutes');
const userRoutes = require('./src/routes/userRoutes');

const { DemoDB } = require('./src/data/demoQuestions');
const supabase = require('./src/config/supabase');

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
let isSupabaseConnected = false;
let isDemoMode = false;

const checkSupabaseConnection = async () => {
    if (isSupabaseConnected) return;
    try {
        console.log("--- Supabase Connection Check ---");
        console.log("SUPABASE_URL:", process.env.SUPABASE_URL ? "SET" : "NOT SET");
        console.log("SUPABASE_ANON_KEY:", process.env.SUPABASE_ANON_KEY ? "SET" : "NOT SET");
        const { data, error } = await supabase.from('questions').select('count').limit(1);
        if (error) throw error;
        isSupabaseConnected = true;
        isDemoMode = false;
        console.log('✅ Supabase connected successfully');
    } catch (err) {
        console.error('❌ Supabase Connection Error:', err.message);
        console.error('❌ Full error:', JSON.stringify(err, null, 2));
        console.log('⚠️ SWITCHING TO DEMO MODE');
        isDemoMode = true;
        isSupabaseConnected = false;
    }
};

app.use(async (req, res, next) => {
    await checkSupabaseConnection();
    req.isDemoMode = isDemoMode;
    req.demoDB = DemoDB;
    req.supabase = supabase;
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
        database: isDemoMode ? 'Demo Mode' : 'Supabase'
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', mode: isDemoMode ? 'demo' : 'production' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});