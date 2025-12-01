#!/bin/bash

# GameShelf Setup Script
echo "🎮 Setting up GameShelf..."

# Check if .env exists
if [ ! -f .env ]; then
  echo "📝 Creating .env file from .env.example..."
  cp .env.example .env
  echo "⚠️  Please edit .env and add your API keys:"
  echo "   - NUXT_PUBLIC_SUPABASE_URL"
  echo "   - NUXT_PUBLIC_SUPABASE_ANON_KEY"
  echo "   - OPENAI_API_KEY (optional)"
  echo "   - GEMINI_API_KEY (optional)"
else
  echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if Supabase is configured
if grep -q "your_supabase_url" .env 2>/dev/null; then
  echo ""
  echo "⚠️  WARNING: Supabase is not configured yet!"
  echo "   Please:"
  echo "   1. Create a Supabase project at https://supabase.com"
  echo "   2. Run the SQL migration from supabase/migrations/001_create_games_table.sql"
  echo "   3. Update .env with your Supabase URL and anon key"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start developing:"
echo "  npm run dev"
echo ""
echo "To set up the database:"
echo "  1. Go to your Supabase project SQL Editor"
echo "  2. Run the SQL from supabase/migrations/001_create_games_table.sql"

