-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create index for alphabetical sorting
CREATE INDEX IF NOT EXISTS idx_games_title ON games(title);

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS idx_games_category ON games(category);

-- Enable Row Level Security
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your auth needs)
CREATE POLICY "Allow all operations for authenticated users" ON games
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create policy to allow public read access (optional, adjust as needed)
CREATE POLICY "Allow public read access" ON games
  FOR SELECT
  USING (true);

