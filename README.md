# Dragon Clan Simulator

A 2D simulation game where you manage a clan of dragons. Play in your browser!

[Play now!](https://shanegibbs.github.io/dragon-gen/)

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- Rust (for building WebAssembly backend)
  - Install from https://rustup.rs/
  - `wasm-pack` will be installed automatically if needed

### Development
```bash
npm install
npm run dev
```
This will build the Rust WebAssembly backend and start the dev server at http://localhost:3000

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
  ├── app.ts           # Web frontend
  ├── app.css          # Styles
  └── wasm-wrapper.ts  # TypeScript wrapper for Rust/WASM backend

rust/
  ├── src/
  │   ├── lib.rs       # Main Rust entry point
  │   ├── dragon.rs    # Dragon entity and interactions
  │   ├── clan.rs      # Clan management
  │   ├── character.rs # Character system
  │   ├── values.rs    # Value system
  │   ├── relationship.rs # Relationship management
  │   └── name_generator.rs # Name generation
  └── pkg/             # Generated WASM package

index.html              # Web entry point
vite.config.ts          # Vite configuration
```

## 🛠️ Technology Stack

- **Rust** - Backend logic compiled to WebAssembly for performance
- **TypeScript** - Type-safe JavaScript frontend
- **Vite** - Fast build tool and dev server
- **wasm-pack** - Build tool for Rust WebAssembly

## 📝 Scripts

- `npm run build:wasm` - Build Rust WebAssembly backend
- `npm run dev` - Build WASM and start web dev server
- `npm run build` - Build WASM and build for web production
- `npm run preview` - Preview production build
- `npm run clean` - Clean build artifacts

