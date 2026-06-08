const express = require('express');
const cors = require('cors');
const supabase = require('./src/config/supabase');
const { DemoDB } = require('./src/data/demoQuestions');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization']
}));
app.use(express.json());

// Check if Supabase is configured
const isDemoMode = !process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY;

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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', mode: isDemoMode ? 'demo' : 'production' });
});

// Start server only if not running on Vercel
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${isDemoMode ? 'demo' : 'production'} mode`);
  });
}

module.exports = app;
