# Development Setup

This guide covers setting up your development environment for the Dragon Clan Simulator.

## Prerequisites

- Node.js (v18 or higher) - See [Node.js Version Management](#nodejs-version-management) below
- npm, yarn, or pnpm

## Node.js Version Management

This project uses **fnm (Fast Node Manager)** for Node.js version management.

### Installing fnm (if not already installed)

If fnm is not installed on your system, install it with:

```bash
curl -fsSL https://fnm.vercel.app/install | bash
```

After installation, either:
- Open a new terminal (fnm will auto-load), or
- Run `source ~/.bashrc` to load fnm in the current terminal

### Quick Start

```bash
# In a new terminal, fnm will auto-load
# Just navigate to the project and use the correct Node version
cd /path/to/dragon-gen
fnm use          # Uses Node 20 from .nvmrc
```

If Node.js 20 is not installed yet, fnm will prompt you to install it, or you can run:
```bash
fnm install 20
fnm use
```

### Manual Setup (if needed in current shell)

```bash
export PATH="$HOME/.local/share/fnm:$PATH"
eval "$(fnm env)"
fnm use
```

## Installation

```bash
# Using npm (default)
npm install
```

## Running the Game

```bash
# Build the TypeScript code
npm run build

# Run the simulation
npm start
```

## Development Mode

```bash
# Watch for changes and auto-rebuild
npm run dev
```

## Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled game
- `npm run dev` - Watch mode: auto-rebuild and restart on changes
- `npm run clean` - Remove the dist/ directory
