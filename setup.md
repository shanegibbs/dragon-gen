# Development Setup

This guide covers setting up your development environment for the Dragon Clan Simulator.

## Prerequisites

- Node.js (v18 or higher) - See [Node.js Version Management](#nodejs-version-management) below
- npm, yarn, or pnpm

## Node.js Version Management

This project uses **fnm (Fast Node Manager)** for Node.js version management.

**fnm is already installed!** It's configured in your `~/.bashrc` and will automatically load in new terminals.

### Quick Start

```bash
# In a new terminal, fnm will auto-load
# Just navigate to the project and use the correct Node version
cd /home/shane/dev/gen
fnm use          # Uses Node 20 from .nvmrc

# Or use the helper script
source setup-env.sh
```

### Manual Setup (if needed in current shell)

```bash
export PATH="/home/shane/.local/share/fnm:$PATH"
eval "$(fnm env)"
fnm use
```

### Alternative: nvm (Node Version Manager)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Use the project's Node version
nvm use
```

### Alternative: Volta

Automatic version switching per project.

```bash
# Install Volta
curl https://get.volta.sh | bash

# Volta will automatically use the version from .node-version
```

The project includes `.nvmrc` and `.node-version` files for automatic version detection.

## Installation

```bash
# Using npm (default)
npm install

# Or using pnpm (faster, more efficient)
pnpm install

# Or using yarn
yarn install
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

