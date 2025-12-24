# 🚀 Deployment Guide for Agri-Fields Application

This guide provides multiple options for deploying the Agri-Fields application to production.

## 📋 Prerequisites

Before deploying, ensure you have:
- A Gemini API key from [Google AI Studio](https://ai.google.dev/)
- Firebase project credentials (if using authentication features)
- Node.js 20 or higher installed locally (for building/testing)

## 🌐 Deployment Options

### Option 1: Vercel (Recommended) ⭐

Vercel is the recommended platform for deploying Vite applications with zero configuration.

#### Quick Deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jvm-indian/agri-fields1)

#### Manual Deployment Steps:

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy from GitHub**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the Vite framework

3. **Configure Environment Variables**:
   In Vercel dashboard, add these environment variables:
   - `GEMINI_API_KEY`: Your Gemini API key

4. **Deploy**:
   - Click "Deploy"
   - Your app will be live at `https://your-project.vercel.app`

#### Using Vercel CLI:

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Option 2: Netlify

Netlify is another excellent platform for hosting static sites and SPAs.

#### Quick Deploy with Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/jvm-indian/agri-fields1)

#### Manual Deployment Steps:

1. **Install Netlify CLI** (optional):
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy from GitHub**:
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository
   - Netlify will use the `netlify.toml` configuration

3. **Configure Environment Variables**:
   In Netlify dashboard, go to Site settings → Environment variables:
   - `GEMINI_API_KEY`: Your Gemini API key

4. **Deploy**:
   - Click "Deploy site"
   - Your app will be live at `https://your-site.netlify.app`

#### Using Netlify CLI:

```bash
# Login to Netlify
netlify login

# Build and deploy
netlify deploy --prod
```

### Option 3: Docker Container 🐳

Deploy as a containerized application on any platform that supports Docker.

#### Method 1: Simple Docker Build (Recommended)

This method requires building the app locally first:

```bash
# 1. Build the application locally
npm run build

# 2. Build the Docker image using the simple Dockerfile
docker build -f Dockerfile.simple -t agri-fields .

# 3. Run the container
docker run -p 8080:80 agri-fields
```

Access the app at `http://localhost:8080`

#### Method 2: Full Docker Build

This builds everything inside Docker (note: requires Node 20+):

```bash
# Build the Docker image
docker build -t agri-fields .

# Run the container with environment variable
docker run -p 8080:80 -e GEMINI_API_KEY=your_api_key_here agri-fields
```

#### Using Docker Compose:

```bash
# Create a .env file with your API key
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Build locally first
npm run build

# Start with docker-compose
docker-compose up -d
```

Access the app at `http://localhost:8080`

#### Deploy to Cloud Platforms:

**Google Cloud Run:**
```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/agri-fields

# Deploy to Cloud Run
gcloud run deploy agri-fields \
  --image gcr.io/YOUR_PROJECT_ID/agri-fields \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_api_key
```

**AWS ECS/Fargate:**
```bash
# Build and push to Amazon ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com
docker tag agri-fields:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/agri-fields:latest
docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/agri-fields:latest

# Create ECS service with your image
```

**Azure Container Instances:**
```bash
# Login to Azure
az login

# Create container instance
az container create \
  --resource-group myResourceGroup \
  --name agri-fields \
  --image agri-fields:latest \
  --dns-name-label agri-fields-app \
  --ports 80 \
  --environment-variables GEMINI_API_KEY=your_api_key
```

**DigitalOcean App Platform:**
```bash
# Push your Docker image to DigitalOcean Container Registry
doctl registry login
docker tag agri-fields:latest registry.digitalocean.com/your-registry/agri-fields
docker push registry.digitalocean.com/your-registry/agri-fields
```

### Option 4: GitHub Pages

For a simple static hosting option (note: environment variables need to be baked in at build time).

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**:
   Add to your `package.json`:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

4. **Configure GitHub Pages**:
   - Go to your repository settings
   - Navigate to Pages section
   - Select `gh-pages` branch as source

### Option 5: Firebase Hosting

Since the app already uses Firebase, you can host it there too.

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase Hosting**:
   ```bash
   firebase login
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to `dist`
   - Configure as single-page app: Yes
   - Don't overwrite index.html

3. **Deploy**:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

## 🔐 Environment Variables

All deployment platforms need these environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |

### How to Set Environment Variables:

- **Vercel**: Dashboard → Project Settings → Environment Variables
- **Netlify**: Dashboard → Site Settings → Environment Variables
- **Docker**: Use `-e` flag or docker-compose environment section
- **Cloud Platforms**: Use their respective environment variable configuration

⚠️ **Security Note**: Never commit API keys to your repository. Always use environment variables or secrets management.

## 🧪 Testing Your Deployment

After deploying, test these features:

1. ✅ Landing page loads correctly
2. ✅ Authentication works (sign up/login)
3. ✅ Dashboard displays properly
4. ✅ AI Teacher feature works with Gemini API
5. ✅ Crop Doctor feature works with Gemini API
6. ✅ Dark mode toggle works
7. ✅ Language switching works

## 🏗️ Build Configuration

The application uses Vite with the following build configuration:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Server Port**: 3000 (for local development)
- **Framework**: React 19 with TypeScript

## 📱 Custom Domain

### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Netlify:
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records as instructed

### Docker/Cloud Platforms:
Configure domain through your cloud provider's DNS/load balancer settings.

## 🔄 Continuous Deployment (CI/CD)

### Vercel & Netlify:
- Automatically deploy on every push to `main` branch
- Preview deployments for pull requests
- Rollback to previous deployments with one click

### GitHub Actions (for other platforms):

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      # Add your deployment steps here
```

## 🐛 Troubleshooting

### Build Fails:
- Check that all dependencies are installed: `npm install`
- Verify Node.js version: `node --version` (should be 18+)
- Clear cache and rebuild: `rm -rf node_modules package-lock.json && npm install`

### App Doesn't Load:
- Check browser console for errors
- Verify environment variables are set correctly
- Check that routing is configured for SPA (single-page app)

### API Errors:
- Verify `GEMINI_API_KEY` is set correctly
- Check API key has proper permissions
- Review browser network tab for failed requests

## 📊 Performance Optimization

The build includes:
- ✅ Code splitting
- ✅ Minification
- ✅ Gzip compression (when using nginx/Docker)
- ✅ Asset caching

For further optimization, consider:
- Implementing lazy loading for routes
- Using dynamic imports for heavy components
- Optimizing images with next-gen formats

## 📞 Support

If you encounter issues:
1. Check the [GitHub Issues](https://github.com/jvm-indian/agri-fields1/issues)
2. Review deployment platform documentation
3. Verify all environment variables are correctly set

## 🎉 Success!

Once deployed, your app will be accessible worldwide. Share the URL with your users and start managing agricultural fields with AI assistance!

---

**Need help?** Open an issue on GitHub or refer to platform-specific documentation:
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
- [Docker Docs](https://docs.docker.com/)
