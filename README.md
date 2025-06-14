# Tech Stack Recommender

An AI-powered full-stack web application that provides intelligent technology stack recommendations for software projects. Built with React frontend, Node.js backend, and integrated with multiple AI providers.

## 🚀 Features

- 🤖 **AI-Powered Recommendations**: Get intelligent tech stack suggestions using OpenAI and Google Gemini
- 🔧 **Flexible AI Configuration**: Choose between backend API, direct API calls, or mock data for development
- 🔄 **Provider Comparison**: Compare recommendations from multiple AI providers simultaneously
- 💰 **Cost Estimation**: Accurate development and maintenance cost projections
- 🗺️ **Development Roadmap**: Detailed project timeline with milestones and phases
- 📄 **PDF Export**: Download recommendations as professional PDF reports
- 🔗 **GitHub Templates**: Curated starter templates for recommended tech stacks
- ⚠️ **Integration Warnings**: Identify potential challenges before development
- 📊 **Community Insights**: Market trends and popularity metrics
- 🔐 **User Authentication**: Secure Firebase authentication
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- ⚡ **Modern UI/UX**: Smooth animations with Framer Motion
- 🌐 **Multi-Platform Support**: Web, mobile, and desktop project recommendations
- 🛡️ **Security-First**: Backend API integration to protect API keys in production

## 🏗️ Architecture

This is a full-stack application with the following structure:

```
Tech Recommender/
├── tech-stack-recommender/     # Frontend React application
├── backend/                    # Node.js backend server
├── docker-compose.yml         # Docker orchestration
├── SETUP_GUIDE.md            # Detailed setup instructions
├── FEATURE_BASED_RECOMMENDATIONS.md  # Feature documentation
└── PDF_DOWNLOAD_FEATURE.md   # PDF feature documentation
```

### Frontend (React)
- **React 18** with modern hooks and context
- **Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **Framer Motion** for smooth animations
- **React Router** for navigation
- **Zustand** for state management
- **Firebase** for authentication

### Backend (Node.js)
- **Express.js** server
- **OpenAI API** integration
- **Google Gemini API** integration
- **CORS** enabled for cross-origin requests
- **Environment-based configuration**

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Firebase account
- OpenAI API key
- Google Gemini API key (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Tech Recommender"
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your API keys
   npm start
   ```

3. **Set up the frontend**
   ```bash
   cd tech-stack-recommender
   npm install
   cp .env.example .env
   # Edit .env with your Firebase config
   npm run dev
   ```

4. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3001`

### Docker Deployment

For production deployment using Docker:

```bash
docker-compose up -d
```

This will start both frontend and backend services with proper networking.

## 📋 Environment Configuration

### Backend (.env)
```env
PORT=3001
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production
```

### Frontend (.env)
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend API Configuration
VITE_API_BASE_URL=http://localhost:3001

# Direct AI Provider Keys (Optional - for direct API mode)
# WARNING: Only use in development - exposes keys in browser
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_GOOGLE_API_KEY=your_google_gemini_api_key
```

## 🤖 AI Configuration

The application supports multiple AI integration methods:

### Integration Methods

1. **Backend API (Recommended for Production)**
   - Secure server-side AI calls
   - API keys protected on backend
   - Automatic health checking
   - Rate limiting and error handling

2. **Direct API Calls (Development Only)**
   - Frontend-only integration
   - Faster development setup
   - ⚠️ **Warning**: Exposes API keys in browser

3. **Mock Data Mode**
   - No API keys required
   - Perfect for development and demos
   - Realistic sample responses

### Provider Comparison

Enable provider comparison to get recommendations from multiple AI services simultaneously:
- Compare OpenAI vs Google Gemini responses
- Identify agreements and differences
- Make informed decisions based on multiple perspectives

### Configuration

Access AI configuration through the Settings page in the application to:
- Switch between integration methods
- Select AI providers
- Enable provider comparison
- Monitor connection status

## 🔧 Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Project Structure

```
tech-stack-recommender/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── store/              # State management
│   ├── utils/              # Utility functions
│   └── assets/             # Static assets
├── public/                 # Public assets
└── dist/                   # Build output

backend/
├── routes/                 # API routes
├── services/               # Business logic
├── server.js              # Main server file
└── package.json           # Dependencies
```

## 🚀 Deployment

### Production Deployment Options

1. **Docker (Recommended)**
   ```bash
   docker-compose up -d
   ```

2. **Manual Deployment**
   - Deploy backend to services like Railway, Render, or Heroku
   - Deploy frontend to Vercel, Netlify, or Firebase Hosting
   - Update VITE_API_BASE_URL to point to your backend URL

3. **Cloud Platforms**
   - AWS: Use ECS/EKS for containers
   - Google Cloud: Use Cloud Run or GKE
   - Azure: Use Container Instances or AKS

## 📚 Documentation

- [Setup Guide](SETUP_GUIDE.md) - Detailed setup instructions
- [Feature Documentation](FEATURE_BASED_RECOMMENDATIONS.md) - Feature specifications
- [PDF Feature](PDF_DOWNLOAD_FEATURE.md) - PDF export functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the documentation files
2. Review the setup guide
3. Create an issue with detailed information
4. Contact support

## 🗺️ Roadmap

### ✅ Recently Completed
- [x] Multi-provider AI integration (OpenAI, Google Gemini)
- [x] Provider comparison functionality
- [x] Flexible AI configuration system
- [x] Mock data mode for development
- [x] PDF export functionality
- [x] Security-first backend API integration

### 🚧 In Progress
- [ ] Enhanced error handling and retry mechanisms
- [ ] Advanced provider status monitoring
- [ ] Improved cost estimation algorithms

### 📋 Planned Features
- [ ] Integration with more AI providers (Claude, Cohere)
- [ ] Advanced project analytics and insights
- [ ] Team collaboration features
- [ ] API for third-party integrations
- [ ] Mobile app development
- [ ] Advanced cost optimization suggestions
- [ ] Multi-language support
- [ ] Integration with project management tools
- [ ] Real-time collaboration on recommendations
- [ ] Custom AI model fine-tuning

---

Built with ❤️ for developers, Ungalil Oruvan
