# Tech Stack Recommender - Frontend

The React frontend application for the Tech Stack Recommender platform. This is part of a full-stack application that provides intelligent technology stack recommendations for software projects.

## Features

- 🤖 **AI-Powered Recommendations**: Get intelligent tech stack suggestions based on project requirements
- 🔧 **Flexible AI Configuration**: Choose between backend API, direct API calls, or mock data
- 🔄 **Provider Comparison**: Compare recommendations from multiple AI providers (OpenAI, Google Gemini)
- 💰 **Cost Estimation**: Accurate development and maintenance cost projections
- 🗺️ **Development Roadmap**: Detailed project timeline with milestones and phases
- 📄 **PDF Export**: Download recommendations as professional PDF reports
- 🔗 **GitHub Templates**: Curated starter templates for recommended tech stacks
- ⚠️ **Integration Warnings**: Identify potential challenges before development
- 📊 **Community Insights**: Market trends and popularity metrics
- 🔐 **User Authentication**: Secure Firebase authentication
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- ⚡ **Modern UI/UX**: Smooth animations with Framer Motion
- 🛡️ **Security-First**: Backend API integration to protect API keys

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Heroicons** - Beautiful SVG icons
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### Backend Integration
- **Node.js Backend** - RESTful API server (see ../backend/)
- **Firebase** - Authentication service
- **AI Services** - OpenAI and Google Gemini integration via backend
- **Zustand** - Lightweight state management

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Firebase account
- Backend server running (see ../backend/ for setup)

### Installation

1. **Navigate to the frontend directory**
   ```bash
   cd tech-stack-recommender
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the `.env.example` file to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your actual values:
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

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## Firebase Setup

1. **Create a Firebase project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication with Email/Password

2. **Get your Firebase config**
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click on the web app icon to create a web app
   - Copy the configuration values to your `.env` file

3. **Set up Authentication**
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication

## AI Configuration

The frontend supports multiple AI integration methods:

### Integration Options

1. **Backend API (Recommended)**
   - Secure server-side AI calls
   - No API keys exposed in browser
   - Requires backend server running

2. **Direct API Calls (Development)**
   - Frontend-only integration
   - Requires API keys in environment variables
   - ⚠️ **Security Warning**: API keys visible in browser

3. **Mock Data Mode**
   - No API keys required
   - Perfect for development and demos

### Configuration Access

- Navigate to Settings page in the application
- Choose your preferred integration method
- Configure AI providers (OpenAI, Google Gemini)
- Enable provider comparison for multiple perspectives

## Backend Setup

1. **Set up the backend server**
   - Navigate to the `../backend/` directory
   - Follow the backend setup instructions
   - Ensure the backend server is running on port 3001
   - The frontend will communicate with the backend API for AI recommendations

## Project Structure

```
src/
├── components/
│   ├── AIConfiguration.jsx      # AI provider configuration
│   ├── auth/
│   │   └── ProtectedRoute.jsx
│   ├── forms/
│   │   └── ProjectForm.jsx
│   └── layout/
│       ├── Header.jsx
│       ├── Footer.jsx
│       └── Layout.jsx
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Profile.jsx
│   ├── Settings.jsx             # Settings page with AI config
│   ├── Recommendations.jsx
│   └── NotFound.jsx
├── services/
│   ├── api/
│   │   ├── backendService.js    # Backend API integration
│   │   ├── directOpenAI.js      # Direct OpenAI integration
│   │   └── multiAIService.js    # Multi-provider AI service
│   ├── firebase.js
│   └── openai/
│       └── openaiService.js
├── store/
│   └── authStore.js
├── utils/                       # Utility functions
├── assets/                      # Static assets
├── App.jsx
├── main.jsx
└── index.css
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### 1. Project Creation
- Comprehensive project form with validation
- Multiple project types and configurations
- Feature selection and requirements gathering

### 2. AI Recommendations
- Frontend and backend technology suggestions
- Database and deployment recommendations
- Cost analysis and timeline estimation

### 3. Development Roadmap
- Phase-by-phase project breakdown
- Task lists and deliverables
- Timeline estimation

### 4. Templates & Resources
- Curated GitHub starter templates
- Integration guides and documentation
- Community insights and trends

### 5. User Management
- Secure authentication with Firebase
- User profiles and preferences
- Project history and management

## Deployment

### Frontend Deployment Options

1. **Vercel (Recommended)**
   - Connect your repository to Vercel
   - Set environment variables in Vercel dashboard
   - Update `VITE_API_BASE_URL` to point to your deployed backend
   - Deploy automatically on push to main branch

2. **Netlify**
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Configure environment variables

3. **Firebase Hosting**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   npm run build
   firebase deploy
   ```

**Important**: Make sure to update `VITE_API_BASE_URL` to point to your deployed backend URL.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact support at support@techstack-recommender.com

## Roadmap

### ✅ Recently Completed
- [x] Multi-provider AI integration (OpenAI, Google Gemini)
- [x] Provider comparison functionality
- [x] Flexible AI configuration system
- [x] Mock data mode for development
- [x] PDF export functionality

### 📋 Planned Features
- [ ] Integration with more AI providers (Claude, Cohere)
- [ ] Advanced project analytics
- [ ] Team collaboration features
- [ ] API for third-party integrations
- [ ] Mobile app development
- [ ] Advanced cost optimization suggestions
- [ ] Real-time collaboration features

---

**Note**: This is the frontend part of the Tech Stack Recommender application. For the complete setup, you also need to run the backend server located in the `../backend/` directory.

Built with ❤️ by the Tech Stack Recommender team
