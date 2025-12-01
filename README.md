# GameShelf

A mobile-first game catalog application built with Nuxt 3, Vue, TypeScript, Tailwind CSS, and Supabase.

## Features

- 📸 Take photos of physical games using your device camera
- 🤖 AI-powered game recognition using OpenAI GPT-4 Vision or Google Gemini
- 📚 Alphabetical catalog with fuzzy search (powered by Fuse.js)
- ✏️ Edit and delete games from your collection
- 📱 Mobile-first responsive design with shadcn-style UI components
- 🎨 Beautiful, modern interface with dark mode support

## Tech Stack

- **Framework**: Nuxt 3 with Vue 3 (Composition API with `<script setup>`)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn design system
- **State Management**: Pinia
- **Database**: Supabase (PostgreSQL)
- **Search**: Fuse.js for fuzzy search
- **Utilities**: VueUse for composables
- **AI**: OpenAI GPT-4 Vision / Google Gemini

## Setup

### Quick Start

Run the setup script:
```bash
npm run setup
```

This will:
- Create a `.env` file from `.env.example`
- Install all dependencies
- Guide you through Supabase configuration

### Manual Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
- `NUXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NUXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `OPENAI_API_KEY` - OpenAI API key (optional, for game recognition)
- `GEMINI_API_KEY` - Google Gemini API key (optional, for game recognition)

**Note**: At least one AI API key (OpenAI or Gemini) is required for game recognition.

3. **Set up Supabase:**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Go to SQL Editor
   - Run the SQL migration from `supabase/migrations/001_create_games_table.sql`
   - Copy your project URL and anon key to `.env`

4. **Start the development server:**
```bash
npm run dev
```

Visit `http://localhost:3000` to see your app!

## Usage

### Scanning a Game

1. Navigate to the "Scan New Game" page
2. Take a photo or select an image from your device
3. Click "Recognize Game" to use AI to identify the game
4. Review and edit the recognized information
5. Save the game to your catalog

### Viewing Your Catalog

- All games are displayed in alphabetical order
- Use the search bar to find games by title, description, or category
- Click "Edit" to modify game information
- Click "Delete" to remove a game from your collection

## Project Structure

```
gameshelf/
├── assets/css/          # Global styles with shadcn design tokens
├── composables/         # Vue composables (useGameRecognition)
├── pages/              # Nuxt pages (index, scan, catalog, edit)
├── stores/             # Pinia stores (games store)
├── supabase/           # Database migrations
├── types/              # TypeScript type definitions
└── scripts/            # Setup scripts
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NUXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NUXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `OPENAI_API_KEY` | OpenAI API key for game recognition | No* |
| `GEMINI_API_KEY` | Google Gemini API key for game recognition | No* |

\* At least one AI API key is required for game recognition to work.

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Deploy to Vercel

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import project to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Nuxt 3

3. **Configure Environment Variables:**
   In Vercel project settings, add these environment variables:
   - `NUXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NUXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `OPENAI_API_KEY` - Your OpenAI API key

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy your app automatically
   - Your app will be live at `https://your-project.vercel.app`

### Manual Deployment

You can also deploy using Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts to configure your project
```

## License

MIT

