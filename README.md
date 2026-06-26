# Elina Portfolio

This is a Create React App portfolio site.

## Local development

```bash
npm install
npm start
```

## Production build

```bash
npm run build
```

## Deploy to Vercel

This repo includes a `vercel.json` configured for SPA hosting:
- build command: `npm run build`
- output directory: `build`
- rewrite rule: all routes -> `/index.html`

### Quick deploy steps
1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Vercel, click **Add New Project** and import the repo.
3. Keep the detected settings (or verify `build` as output directory).
4. Deploy.
