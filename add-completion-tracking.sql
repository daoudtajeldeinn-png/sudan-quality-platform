-- Add unit completion tracking to users table
-- Run this in the Supabase SQL Editor

-- Add completedUnits column to track which units the user has completed
ALTER TABLE users ADD COLUMN IF NOT EXISTS "completedUnits" JSONB DEFAULT '{}';

-- Add completionDate column to track when each unit was completed
ALTER TABLE users ADD COLUMN IF NOT EXISTS "completionDates" JSONB DEFAULT '{}';

-- Add index for faster queries on completed units
CREATE INDEX IF NOT EXISTS idx_users_completedUnits ON users USING GIN ("completedUnits");
