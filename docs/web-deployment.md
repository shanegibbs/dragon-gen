# Web Deployment

This project is a web application that can be deployed to:

- **GitHub Pages**: Automatic deployment via GitHub Actions
- **Any static hosting**: Netlify, Vercel, etc.

## Development

```bash
npm run dev
```

This starts a Vite dev server at `http://localhost:3000`.

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist-web/` directory.

## Preview Production Build

```bash
npm run preview
```

## GitHub Pages Deployment

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys to GitHub Pages when you push to the `main` branch.

**To enable GitHub Pages:**

1. Go to your repository Settings → Pages
2. Under "Source", select "GitHub Actions"
3. Push to the `main` branch or manually trigger the workflow

The app will be available at: `https://<username>.github.io/dragon-gen/`

**Note:** Make sure the `base` path in `vite.config.ts` matches your repository name.

## Other Static Hosting Options

### Netlify

1. Connect your GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist-web`

### Vercel

1. Import your GitHub repository
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist-web`

## Project Structure

```
dragon-gen/
├── src/              # Game logic and frontend
│   ├── app.ts        # Frontend application entry point
│   ├── app.css       # Styles
│   ├── dragon.ts     # Dragon class
│   ├── clan.ts       # Clan management
│   └── ...
├── index.html        # HTML entry point
├── vite.config.ts    # Vite configuration
└── dist-web/         # Web build output (gitignored)
```

## Troubleshooting

### GitHub Pages Issues

- **404 errors**: Check that `base` in `vite.config.ts` matches your repo name
- **Build fails**: Check GitHub Actions logs for specific errors
- **Assets not loading**: Ensure all paths use relative URLs

### Development Issues

- **Port already in use**: Change the port in `vite.config.ts`
- **TypeScript errors**: Run `npm install` to ensure all types are installed
- **Module not found**: Check that imports use `.js` extension (required for ES modules)
