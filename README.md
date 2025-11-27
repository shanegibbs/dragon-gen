# Dragon Clan Simulator

A 2D simulation game where you manage a clan of dragons. Starting simple with console output, with plans to expand to multiple platforms.

## Getting Started

See [docs/setup.md](docs/setup.md) for detailed development setup instructions, including:
- Node.js version management (fnm)
- Installation steps
- Running the game
- Development workflow

## Current Features

- Basic dragon entities with names, elements, age, energy, and mood
- Dragon-to-dragon interactions
- Clan management system
- Console-based simulation

## Future Plans

- Visual 2D representation
- Player decisions and actions
- Dragon breeding and genetics
- Resource management
- Multi-platform deployment (web, desktop, mobile)

## Project Structure

```
src/
  ├── index.ts      # Entry point
  ├── dragon.ts     # Dragon entity class
  └── clan.ts       # Clan management class
```

## Technology Stack

- **TypeScript** - Type-safe JavaScript
- **Node.js** - Runtime environment

This setup allows for easy expansion to:
- **Web**: Add HTML/CSS and bundle with a tool like Vite
- **Desktop**: Use Electron
- **Mobile**: Use React Native or Capacitor

