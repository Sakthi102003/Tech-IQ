# Deployment Guide

This guide explains how to deploy the Tech Stack Recommender application to production.

## 🔐 Environment Variables Setup

### Required Environment Variables

#### Backend (.env)
```env
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_API_KEY=your_google_gemini_api_key_here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

#### Frontend (.env)
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_APP_NAME=Tech Stack Recommender
VITE_APP_VERSION=1.0.0
VITE_API_URL=https://your-backend-domain.com/api
```

## 🚀 Deployment Options

### Option 1: Separate Deployments (Recommended)

#### Backend Deployment (Railway/Render/Heroku)

1. **Connect Repository**
   - Link your GitHub repository
   - Select the `backend` folder as root directory

2. **Set Environment Variables**
   - Add all backend environment variables in the platform dashboard
   - Make sure to set `NODE_ENV=production`

3. **Deploy**
   - Platform will automatically build and deploy
   - Note the deployed backend URL

#### Frontend Deployment (Vercel/Netlify)

1. **Connect Repository**
   - Link your GitHub repository
   - Select the `tech-stack-recommender` folder as root directory

2. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set Environment Variables**
   - Add all frontend environment variables
   - Update `VITE_API_URL` to point to your deployed backend

4. **Deploy**
   - Platform will automatically build and deploy

### Option 2: Docker Deployment

#### Prerequisites
- Docker and Docker Compose installed
- Server with Docker support

#### Steps

1. **Create Production Environment File**
   ```bash
   # Create .env.production in root directory
   cp .env.example .env.production
   # Edit with your production values
   ```

2. **Update docker-compose.yml for Production**
   ```yaml
   version: '3.8'
   services:
     backend:
       build: ./backend
       ports:
         - "3001:3001"
       environment:
         - NODE_ENV=production
         - PORT=3001
         - OPENAI_API_KEY=${OPENAI_API_KEY}
         - GOOGLE_API_KEY=${GOOGLE_API_KEY}
         - CORS_ORIGIN=https://your-domain.com
       restart: unless-stopped

     frontend:
       build: ./tech-stack-recommender
       ports:
         - "80:80"
       environment:
         - VITE_API_URL=https://your-domain.com/api
         - VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}
         - VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN}
         - VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID}
         - VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET}
         - VITE_FIREBASE_MESSAGING_SENDER_ID=${VITE_FIREBASE_MESSAGING_SENDER_ID}
         - VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID}
       depends_on:
         - backend
       restart: unless-stopped
   ```

3. **Deploy**
   ```bash
   docker-compose --env-file .env.production up -d
   ```

### Option 3: Cloud Platform Deployment

#### AWS
- Use **Elastic Beanstalk** or **ECS**
- Store secrets in **AWS Secrets Manager**
- Use **CloudFront** for frontend distribution

#### Google Cloud
- Use **Cloud Run** for containers
- Store secrets in **Secret Manager**
- Use **Cloud Storage** for static frontend

#### Azure
- Use **Container Instances** or **App Service**
- Store secrets in **Key Vault**
- Use **Static Web Apps** for frontend

## 🔧 Platform-Specific Instructions

### Vercel (Frontend)
1. Import project from GitHub
2. Framework Preset: Vite
3. Root Directory: `tech-stack-recommender`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add environment variables in Settings > Environment Variables

### Railway (Backend)
1. Deploy from GitHub
2. Root Directory: `backend`
3. Add environment variables in Variables tab
4. Railway will auto-detect Node.js and deploy

### Render (Backend)
1. Connect GitHub repository
2. Root Directory: `backend`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add environment variables in Environment tab

### Netlify (Frontend)
1. Connect GitHub repository
2. Base directory: `tech-stack-recommender`
3. Build command: `npm run build`
4. Publish directory: `tech-stack-recommender/dist`
5. Add environment variables in Site settings > Environment variables

## 🔒 Security Checklist

- [ ] All API keys are set as environment variables (not in code)
- [ ] `.env` files are in `.gitignore`
- [ ] Production uses HTTPS
- [ ] CORS is configured for production domain
- [ ] Firebase security rules are properly configured
- [ ] Rate limiting is enabled
- [ ] Error messages don't expose sensitive information

## 🧪 Testing Deployment

1. **Backend Health Check**
   ```bash
   curl https://your-backend-domain.com/api/health
   ```

2. **Frontend Functionality**
   - Test user registration/login
   - Test AI recommendations
   - Test PDF generation
   - Check console for errors

## 🔄 CI/CD Setup (Optional)

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        # Add Railway deployment action

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        # Add Vercel deployment action
```

## 📞 Support

If you encounter deployment issues:
1. Check platform-specific logs
2. Verify all environment variables are set
3. Test API endpoints individually
4. Check CORS configuration
5. Verify Firebase configuration

---

**Remember**: Never commit `.env` files to version control. Always use platform-provided environment variable management for production deployments.