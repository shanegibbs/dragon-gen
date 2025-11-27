# Quick Start Guide

## First Time Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

## Development

### Web App
```bash
npm run dev
```
Opens at http://localhost:3000

### Console/CLI Mode
```bash
npm run build:cli
npm run start:cli
```

## Building for Production

### Web (GitHub Pages)
```bash
npm run build
```
Output: `dist-web/` directory

The GitHub Actions workflow will automatically deploy when you push to `main`.

**Important:** If your GitHub repository name is different from `dragon-gen`, update the `base` path in `vite.config.ts`.

## GitHub Pages Setup

1. Go to your repository → Settings → Pages
2. Under "Source", select **"GitHub Actions"**
3. Push to `main` branch (or manually trigger the workflow)

Your app will be live at: `https://<username>.github.io/dragon-gen/`

## Troubleshooting

- **"npm not found"**: Install Node.js (v18+) and npm
- **Port 3000 in use**: Change port in `vite.config.ts`
- **TypeScript errors**: Run `npm install` to ensure all dependencies are installed
- **GitHub Pages 404**: Check that `base` in `vite.config.ts` matches your repo name
