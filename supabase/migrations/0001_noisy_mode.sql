/*
  # Journal Database Schema

  1. New Tables
    - `journals`
      - Main journal entry table with date and mood tracking
    - `time_sections` 
      - Stores morning, afternoon, evening activities
    - `health_records`
      - Tracks seizures and falls
    - `achievements`
      - Daily achievements and learnings

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Journals table
CREATE TABLE IF NOT EXISTS journals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  date date NOT NULL,
  mood text NOT NULL,
  mood_explanation text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Time sections table (morning, afternoon, evening activities)
CREATE TABLE IF NOT EXISTS time_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_id uuid REFERENCES journals(id) ON DELETE CASCADE,
  section_type text NOT NULL CHECK (section_type IN ('morning', 'afternoon', 'evening')),
  time time,
  medicine_time time,
  medicine_taken boolean DEFAULT false,
  meal_time time,
  meal_items text,
  meal_amount text CHECK (meal_amount IN ('All', 'Most', 'Half', 'Little')),
  activities text[] DEFAULT '{}',
  UNIQUE(journal_id, section_type)
);

-- Health records table
CREATE TABLE IF NOT EXISTS health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_id uuid REFERENCES journals(id) ON DELETE CASCADE,
  seizure_count integer DEFAULT 0,
  seizure_times text,
  seizure_duration text CHECK (seizure_duration IN ('Short', 'Medium', 'Long')),
  fall_count integer DEFAULT 0,
  fall_times text,
  fall_injuries boolean DEFAULT false,
  injury_description text
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_id uuid REFERENCES journals(id) ON DELETE CASCADE,
  learned text,
  proud text,
  help text,
  notes text
);

-- Enable RLS
ALTER TABLE journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Policies for journals
CREATE POLICY "Users can manage their own journals"
  ON journals
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for time sections
CREATE POLICY "Users can manage their journal sections"
  ON time_sections
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM journals 
    WHERE journals.id = time_sections.journal_id 
    AND journals.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM journals 
    WHERE journals.id = time_sections.journal_id 
    AND journals.user_id = auth.uid()
  ));

-- Policies for health records
CREATE POLICY "Users can manage their health records"
  ON health_records
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM journals 
    WHERE journals.id = health_records.journal_id 
    AND journals.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM journals 
    WHERE journals.id = health_records.journal_id 
    AND journals.user_id = auth.uid()
  ));

-- Policies for achievements
CREATE POLICY "Users can manage their achievements"
  ON achievements
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM journals 
    WHERE journals.id = achievements.journal_id 
    AND journals.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM journals 
    WHERE journals.id = achievements.journal_id 
    AND journals.user_id = auth.uid()
  ));