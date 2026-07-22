require('dotenv').config();
const express = require('express');
const cors = require('cors');
const supabase = require('./src/config/supabase');
const { DemoDB } = require('./src/data/demoQuestions');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS — must come before all routes
const allowedOrigins = [
  'https://decisive-octane-472816-d3.web.app',
  'https://decisive-octane-472816-d3.firebaseapp.com',
  'http://localhost:5173',
  'http://localhost:3000'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS policy: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization', 'x-admin-email']
};

app.use(cors(corsOptions));

// Handle OPTIONS preflight explicitly for ALL routes
app.options('*', cors(corsOptions));

app.use(express.json());

// Check if Supabase is configured
const isDemoMode = !process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_URL === 'https://your-project.supabase.co';

// Attach demo mode and database to request
app.use((req, res, next) => {
  req.isDemoMode = isDemoMode;
  req.supabase = supabase;
  req.demoDB = DemoDB;
  next();
});

// Routes
const authRoutes = require('./src/routes/authRoutes');
const questionRoutes = require('./src/routes/questionRoutes');
const userRoutes = require('./src/routes/userRoutes');
const certificateRoutes = require('./src/routes/certificateRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/user', userRoutes);
app.use('/api/certificates', certificateRoutes);
const adminRoutes = require('./src/routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// Root route — informational, so browser doesn't show "Cannot GET /"
app.get('/', (req, res) => {
  res.json({
    name: 'منصة السودان للجودة — Backend API',
    version: '1.0.9',
    status: 'running',
    mode: isDemoMode ? 'demo' : 'production',
    endpoints: [
      'POST /api/auth/register',
      'GET  /api/auth/user/:userId',
      'GET  /api/questions/rotate/:unitId/:count',
      'POST /api/questions/check',
      'GET  /api/user/profile/:userId',
      'POST /api/user/sync/:userId',
      'GET  /api/user/leaderboard',
      'GET  /api/user/certificates/:userId',
      'POST /api/user/complete/:userId',
      'POST /api/certificates/award-public',
      'GET  /health'
    ]
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

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

// Start server only if not running on Vercel
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${isDemoMode ? 'demo' : 'production'} mode`);
  });
}

module.exports = app;
