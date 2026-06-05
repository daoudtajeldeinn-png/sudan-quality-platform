-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unitId TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB,
  correctAnswer TEXT,
  correctAnswers TEXT[],
  type TEXT DEFAULT 'multiple',
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  progress JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_history table
CREATE TABLE IF NOT EXISTS quiz_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  userId TEXT NOT NULL,
  unitId TEXT NOT NULL,
  seenQuestions TEXT[] DEFAULT '{}',
  lastReset TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(userId, unitId)
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  userId TEXT NOT NULL,
  unitId TEXT NOT NULL,
  issuedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  certificateData JSONB,
  UNIQUE(userId, unitId)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_unitId ON questions(unitId);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_quiz_history_userId ON quiz_history(userId);
CREATE INDEX IF NOT EXISTS idx_quiz_history_unitId ON quiz_history(unitId);
CREATE INDEX IF NOT EXISTS idx_certificates_userId ON certificates(userId);
CREATE INDEX IF NOT EXISTS idx_certificates_unitId ON certificates(unitId);

-- Enable Row Level Security (optional, can be disabled for simplicity)
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (for demo purposes)
-- In production, you should restrict these policies
CREATE POLICY "Enable read access for all users" ON questions FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON questions FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON questions FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON users FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON users FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON quiz_history FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON quiz_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON quiz_history FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON certificates FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON certificates FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON certificates FOR UPDATE USING (true);
