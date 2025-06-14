# AI Integration Setup Guide

This guide will help you set up secure AI integration for your Tech Stack Recommender application. You have three options:

## 🔒 Option 1: Backend API Server (Recommended for Production)

### Why Use Backend API?
- ✅ **Secure**: API keys are stored server-side
- ✅ **Scalable**: Better rate limiting and caching
- ✅ **Multiple AI Providers**: Easy to switch between OpenAI, Gemini, Claude
- ✅ **Error Handling**: Centralized error management
- ✅ **Monitoring**: Request logging and analytics

### Setup Steps

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173

   # AI Provider API Keys (add the ones you want to use)
   OPENAI_API_KEY=sk-your-openai-key-here
   GOOGLE_API_KEY=your-google-gemini-key-here

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Start the Backend Server**
   ```bash
   npm run dev
   ```
   
   The server will run on `http://localhost:3001`

4. **Update Frontend Configuration**
   
   In `tech-stack-recommender/.env`:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

5. **Test the Integration**
   
   Visit `http://localhost:3001/api/health` to verify the server is running.

### API Endpoints

- `GET /api/health` - Health check
- `GET /api/health/detailed` - Detailed health with AI provider status
- `GET /api/providers` - Available AI providers
- `POST /api/ai/recommendations` - Generate recommendations
- `POST /api/ai/recommendations/compare` - Compare multiple providers

---

## 🌐 Option 2: Direct API Integration (Development/Testing Only)

### ⚠️ Security Warning
This method exposes API keys in the browser. **Never use in production!**

### Setup Steps

1. **Configure Frontend Environment**
   
   In `tech-stack-recommender/.env`:
   ```env
   # OpenAI (required for basic functionality)
   VITE_OPENAI_API_KEY=sk-your-openai-key-here
   
   # Google Gemini (optional)
   VITE_GOOGLE_API_KEY=your-google-gemini-key-here
   
   # Note: Claude doesn't support direct browser calls due to CORS
   ```

2. **Update Service Configuration**
   
   In your component, use the AI configuration:
   ```javascript
   import openaiService from './services/openai/openaiService.js';
   
   // Use direct API calls
   const recommendations = await openaiService.generateTechIQRecommendation(
     projectData, 
     { 
       useBackend: false,
       aiProvider: 'openai' // or 'gemini'
     }
   );
   ```

---

## 🔧 Option 3: Multiple AI Services Integration

### Supported Providers

| Provider | Backend Support | Direct Support | Features |
|----------|----------------|----------------|----------|
| **OpenAI** | ✅ | ✅ | GPT-3.5/4, JSON mode |
| **Google Gemini** | ✅ | ✅ | Gemini Pro, large context |
| **Anthropic Claude** | ✅ | ❌ | Claude 3, safety focus |

### Getting API Keys

#### OpenAI
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create account and add billing
3. Go to API Keys section
4. Create new secret key

#### Google Gemini
1. Visit [Google AI Studio](https://makersuite.google.com/)
2. Create project
3. Enable Generative AI API
4. Create API key

#### Anthropic Claude
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create account
3. Add billing
4. Generate API key

### Usage Examples

#### Single Provider
```javascript
const recommendations = await openaiService.generateTechIQRecommendation(
  projectData, 
  { 
    useBackend: true,
    aiProvider: 'openai' // 'gemini'
  }
);
```

#### Compare Multiple Providers
```javascript
const comparison = await openaiService.generateTechIQRecommendation(
  projectData, 
  { 
    useBackend: true,
    compareProviders: true
  }
);
```

---

## 🚀 Production Deployment

### Backend Deployment Options

#### Option A: Railway/Render
1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically

#### Option B: Docker
```dockerfile
# Dockerfile already created in backend/
docker build -t tech-recommender-backend .
docker run -p 3001:3001 --env-file .env tech-recommender-backend
```

#### Option C: Traditional VPS
```bash
# Install Node.js 18+
# Clone repository
# Install dependencies
npm install --production
# Set environment variables
# Start with PM2
pm2 start server.js --name tech-recommender-api
```

### Frontend Deployment
Update `VITE_API_URL` to point to your production backend:
```env
VITE_API_URL=https://your-backend-domain.com/api
```

---

## 🔍 Testing & Debugging

### Health Checks
```bash
# Basic health
curl http://localhost:3001/api/health

# Detailed health with AI provider status
curl http://localhost:3001/api/health/detailed

# Available providers
curl http://localhost:3001/api/providers
```

### Test Recommendations
```bash
curl -X POST http://localhost:3001/api/ai/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "Test Project",
    "projectType": "Web Application",
    "description": "A simple test project",
    "budget": "$10,000 - $25,000",
    "timeline": "3-6 months",
    "teamSize": 2,
    "experience": "Intermediate",
    "features": ["User Authentication", "Database"],
    "aiProvider": "openai"
  }'
```

### Common Issues

#### Backend Not Starting
- Check if port 3001 is available
- Verify environment variables are set
- Check logs for specific errors

#### API Key Errors
- Verify API keys are correct and active
- Check billing/quota limits
- Ensure proper permissions

#### CORS Issues
- Verify `CORS_ORIGIN` matches your frontend URL
- Check if both frontend and backend are running

---

## 📊 Monitoring & Analytics

### Logging
Logs are stored in `backend/logs/`:
- `error.log` - Error messages
- `combined.log` - All requests

### Rate Limiting
Default limits:
- 100 requests per 15 minutes per IP
- Configurable via environment variables

### Usage Tracking
Monitor API usage through:
- Backend logs
- AI provider dashboards
- Custom analytics (implement as needed)

---

## 🔐 Security Best Practices

1. **Never expose API keys in frontend code**
2. **Use environment variables for all secrets**
3. **Implement proper rate limiting**
4. **Use HTTPS in production**
5. **Regularly rotate API keys**
6. **Monitor for unusual usage patterns**
7. **Implement request validation**
8. **Use CORS properly**

---

## 🆘 Support & Troubleshooting

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "API key not configured" | Missing API key | Add key to .env file |
| "Rate limit exceeded" | Too many requests | Wait or increase limits |
| "Backend unavailable" | Server not running | Start backend server |
| "CORS error" | Wrong origin | Update CORS_ORIGIN |

### Getting Help
1. Check the logs in `backend/logs/`
2. Verify environment variables
3. Test API endpoints directly
4. Check AI provider status pages

---

## 📝 Next Steps

1. **Choose your integration method** based on your needs
2. **Set up the backend server** for production use
3. **Configure your AI provider accounts**
4. **Test the integration** thoroughly
5. **Deploy to production** with proper security measures

Remember: Start with the backend API approach for the best security and scalability!