# Dragon Clan Simulator

A 2D simulation game where you manage a clan of dragons. Play in your browser!

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```
Opens at http://localhost:3000

### Console/CLI Mode
```bash
npm install
npm run build:cli  # Build TypeScript
npm run start:cli  # Run CLI version
```

## 📦 Deployment

- **Web**: Automatically deploys to GitHub Pages via GitHub Actions

See [docs/web-deployment.md](docs/web-deployment.md) for detailed deployment instructions.

## ✨ Features

- **Dragon Management**: Create and manage a clan of dragons with unique personalities
- **Character System**: Each dragon has traits, values, and interaction styles
- **Relationship Dynamics**: Dragons form relationships based on compatibility and interactions
- **Interactive UI**: Modern web interface with real-time updates
- **Web-Based**: Runs in any modern browser

## 🎮 How to Play

1. Start with a clan of 6 randomly generated dragons
2. Click "Simulate 10 Interactions" to watch dragons interact
3. Add more dragons or reset the clan
4. View detailed character information and relationship matrices

## 📚 Documentation

- [Setup Guide](docs/setup.md) - Development environment setup
- [Web Deployment](docs/web-deployment.md) - Deployment instructions
- [Character System](docs/character.md) - Character traits and values
- [Value System](docs/value-system.md) - How values affect interactions

## 🏗️ Project Structure

```
src/
  ├── app.ts         # Web frontend
  ├── app.css        # Styles
  ├── index.ts       # CLI entry point
  ├── dragon.ts      # Dragon entity class
  ├── clan.ts        # Clan management
  ├── character.ts   # Character system
  ├── values.ts      # Value system
  └── ...

index.html           # Web entry point
vite.config.ts       # Vite configuration
```

## 🛠️ Technology Stack

- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server

## 📝 Scripts

- `npm run dev` - Start web dev server
- `npm run build` - Build for web
- `npm run preview` - Preview production build
- `npm run build:cli` - Build TypeScript for CLI
- `npm run start:cli` - Run CLI version
- `npm run dev:cli` - Watch mode for CLI development

