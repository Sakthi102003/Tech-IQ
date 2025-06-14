import dotenv from 'dotenv';
dotenv.config();

import OpenAI from 'openai';
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'openai-service' },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ]
});

export class OpenAIService {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      logger.warn('OpenAI API key not found');
      this.client = null;
    } else {
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
  }

  async generateRecommendations(projectData) {
    logger.info('OpenAI generateRecommendations called for:', projectData.projectName);
    
    if (!this.client) {
      logger.warn('OpenAI client not available, using fallback recommendations');
      return this.createFallbackRecommendations(projectData, 'OpenAI API key not configured');
    }

    try {
      logger.info('Starting OpenAI API call for project:', projectData.projectName);
      const prompt = this.buildPrompt(projectData);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('OpenAI API timeout after 30 seconds')), 30000);
      });

      const apiPromise = this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a Tech Stack Advisor AI. Analyze project requirements and provide detailed technology recommendations in a structured JSON format. Focus on practical, modern solutions that match the team's experience level and budget constraints.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2500,
        response_format: { type: "json_object" }
      });

      const completion = await Promise.race([apiPromise, timeoutPromise]);
      logger.info('OpenAI API call completed successfully');

      const response = completion.choices[0].message.content;
      let recommendations;

      try {
        recommendations = JSON.parse(response);
        logger.info('Successfully parsed OpenAI JSON response');
      } catch (parseError) {
        logger.error('Failed to parse OpenAI response as JSON:', parseError);
        // Fallback to structured response
        recommendations = this.createFallbackRecommendations(projectData, response);
      }

      // Ensure the response has the required structure
      return this.validateAndEnhanceRecommendations(recommendations, projectData);

    } catch (error) {
      logger.error('OpenAI API error:', {
        message: error.message,
        code: error.code,
        type: error.type,
        projectName: projectData.projectName
      });
      
      if (error.code === 'insufficient_quota') {
        logger.warn('OpenAI quota exceeded, using fallback');
        return this.createFallbackRecommendations(projectData, 'Quota exceeded');
      }
      
      if (error.code === 'rate_limit_exceeded') {
        logger.warn('OpenAI rate limit exceeded, using fallback');
        return this.createFallbackRecommendations(projectData, 'Rate limit exceeded');
      }

      if (error.message.includes('timeout')) {
        logger.warn('OpenAI API timeout, using fallback');
        return this.createFallbackRecommendations(projectData, 'API timeout');
      }

      // For any other error, use fallback instead of throwing
      logger.warn('OpenAI API failed, using fallback recommendations');
      return this.createFallbackRecommendations(projectData, error.message);
    }
  }

  buildPrompt(projectData) {
    return `
Analyze this project and provide comprehensive technology recommendations:

Project Details:
- Name: ${projectData.projectName}
- Development Type: ${projectData.developmentType}
- Description: ${projectData.description}
- Budget: ${projectData.budget}
- Timeline: ${projectData.timeline}
- Team Size: ${projectData.teamSize}
- Experience Level: ${projectData.experience}
- Required Features: ${projectData.features.join(', ')}

Please provide recommendations in this exact JSON structure:
{
  "frontend": {
    "primary": "recommended framework",
    "reasoning": "explanation for choice",
    "libraries": ["lib1", "lib2", "lib3"]
  },
  "backend": {
    "primary": "recommended backend technology",
    "database": "recommended database",
    "reasoning": "explanation for choices"
  },
  "devTools": {
    "versionControl": "Git",
    "deployment": "recommended platform",
    "cicd": "recommended CI/CD solution"
  },
  "estimatedCost": {
    "development": "cost range or 'Free (Self-developed)' if budget is Free",
    "hosting": "monthly hosting cost or 'Free (GitHub Pages, Netlify, Vercel, Railway free tier)' if budget is Free",
    "thirdParty": "monthly third-party costs or 'Free (Open source alternatives, free tiers of services)' if budget is Free"
  },
  "timeline": {
    "estimated": {
      "weeks": "number of weeks",
      "months": "number of months",
      "range": {
        "minimum": "minimum time estimate",
        "maximum": "maximum time estimate",
        "realistic": "realistic time estimate"
      }
    },
    "category": "Short-term/Medium-term/Long-term/Enterprise-scale",
    "description": "timeline description",
    "breakdown": {
      "planning": "weeks for planning",
      "development": "weeks for development",
      "testing": "weeks for testing",
      "deployment": "weeks for deployment"
    },
    "milestones": [
      {
        "name": "milestone name",
        "week": "week number",
        "description": "milestone description"
      }
    ],
    "riskFactors": ["risk1", "risk2"],
    "recommendations": ["recommendation1", "recommendation2"]
  },
  "roadmap": [
    {
      "phase": "Phase name",
      "duration": "time estimate",
      "tasks": ["task1", "task2"],
      "deliverables": ["deliverable1", "deliverable2"]
    }
  ],
  "githubTemplates": [
    {
      "name": "template name",
      "description": "template description",
      "url": "github url"
    }
  ],
  "integrationWarnings": [
    {
      "tools": ["tool1", "tool2"],
      "issue": "potential issue",
      "solution": "recommended solution"
    }
  ],
  "communityInsights": {
    "popularity": "High/Medium/Low",
    "marketDemand": "Growing/Stable/Declining",
    "trendingAlternatives": ["alt1", "alt2"]
  }
}`;
  }

  createFallbackRecommendations(projectData, rawResponse) {
    logger.info('Creating fallback recommendations for project:', projectData.projectName);
    
    // Use the comprehensive dynamic recommendation logic
    return this.generateDynamicRecommendations(projectData);
  }

  // Comprehensive dynamic recommendation logic
  generateDynamicRecommendations(projectData) {
    const {
      projectName,
      developmentType,
      description,
      budget,
      timeline,
      teamSize,
      experience,
      features,
      currency
    } = projectData;

    // Determine frontend technology based on features and requirements
    const getFrontendRecommendation = () => {
      const isComplex = features?.length > 6;
      const needsSEO = features?.includes('SEO Optimization') || features?.includes('Content Management');
      const needsRealtime = features?.includes('Real-time Updates');
      const needsAuth = features?.includes('User Authentication');
      const needsPerformance = features?.includes('High Performance') || features?.includes('Data Processing');
      const needsGaming = features?.includes('Gaming');
      const needsDataViz = features?.includes('Data Processing') || features?.includes('Machine Learning');
      const needsSystemIntegration = features?.includes('System Integration');
      const needsPayments = features?.includes('Payment Processing');
      const needsFileStorage = features?.includes('File Upload/Storage');
      const isBeginner = experience === 'Beginner';
      const isLowBudget = budget?.includes('Free') || budget?.includes('Under');
      const isLargeTeam = teamSize === 'Large team (16+ people)';
      const isFrontendOnly = developmentType === 'Frontend Only';
      const isBackendOnly = developmentType === 'Backend Only';
      const isFullStack = developmentType === 'Full Stack (Both Frontend & Backend)';
      
      // Skip frontend recommendations for backend-only projects
      if (isBackendOnly) {
        return {
          primary: 'Not Required (Backend Only)',
          reasoning: 'This is a backend-only project, no frontend technology needed',
          libraries: []
        };
      }

      // Priority 1: Gaming applications
      if (needsGaming) {
        if (experience === 'Advanced') {
          return {
            primary: 'Unreal Engine (C++)',
            reasoning: 'Industry-standard game engine with high-performance rendering and advanced features',
            libraries: ['Unreal Engine', 'Blueprints', 'C++ Standard Library', 'DirectX/OpenGL']
          };
        } else {
          return {
            primary: 'Unity (C#)',
            reasoning: 'User-friendly game development with visual scripting and cross-platform deployment',
            libraries: ['Unity Engine', 'Unity UI', 'Unity Analytics', 'Unity Ads']
          };
        }
      }

      // Priority 2: Data Science/ML applications
      if (needsDataViz && features?.includes('Machine Learning')) {
        return {
          primary: 'Streamlit (Python)',
          reasoning: 'Rapid development of data science web applications with minimal frontend code',
          libraries: ['streamlit', 'pandas', 'numpy', 'plotly', 'scikit-learn', 'tensorflow']
        };
      }

      // Priority 3: Experience-based recommendations for beginners
      if (isBeginner) {
        if (isLowBudget) {
          return {
            primary: 'HTML/CSS/JavaScript',
            reasoning: 'Start with fundamentals - perfect for learning web development basics with minimal setup',
            libraries: ['Bootstrap', 'jQuery', 'Local Storage API', 'Fetch API']
          };
        } else {
          return {
            primary: 'React with Vite',
            reasoning: 'Modern, beginner-friendly framework with excellent documentation and community support',
            libraries: ['react-router-dom', 'tailwindcss', 'react-hook-form', 'axios']
          };
        }
      }

      // Priority 4: Experience-based recommendations for intermediate
      if (experience === 'Intermediate') {
        if (needsRealtime) {
          return {
            primary: 'Next.js',
            reasoning: 'Full-stack React framework with server-side rendering and excellent real-time capabilities',
            libraries: ['socket.io-client', 'swr', 'tailwindcss', 'framer-motion']
          };
        } else {
          return {
            primary: 'Vue.js',
            reasoning: 'Progressive framework with gentle learning curve and excellent performance for intermediate developers',
            libraries: ['Vue Router', 'Pinia', 'Vuetify', 'Vite']
          };
        }
      }

      // Priority 5: Experience-based recommendations for advanced
      if (experience === 'Advanced') {
        if (isLargeTeam || isComplex) {
          return {
            primary: 'Angular (TypeScript)',
            reasoning: 'Enterprise framework with strong architecture patterns, perfect for large team collaboration',
            libraries: ['Angular Material', 'RxJS', 'NgRx', 'Angular Universal']
          };
        } else {
          return {
            primary: 'React with TypeScript',
            reasoning: 'Type-safe development with excellent tooling and flexibility for complex applications',
            libraries: ['react-router-dom', 'styled-components', 'react-query', 'framer-motion']
          };
        }
      }

      // Priority 6: Experience-based recommendations for experts
      if (experience === 'Expert') {
        return {
          primary: 'Svelte/SvelteKit',
          reasoning: 'Cutting-edge framework with compile-time optimizations and minimal runtime overhead',
          libraries: ['SvelteKit', 'Tailwind CSS', 'Prisma', 'TypeScript']
        };
      }

      // Priority 7: SEO-critical applications
      if (needsSEO) {
        if (isBeginner) {
          return {
            primary: 'Hugo (Go)',
            reasoning: 'Extremely fast static site generator with excellent SEO and minimal learning curve',
            libraries: ['Hugo Modules', 'Hugo Pipes', 'Markdown', 'YAML']
          };
        } else {
          return {
            primary: 'Next.js (JavaScript)',
            reasoning: 'Server-side rendering with excellent SEO capabilities and flexible deployment options',
            libraries: ['next-seo', 'next-mdx-remote', 'tailwindcss', 'framer-motion']
          };
        }
      }

      // Priority 8: E-commerce requirements
      if (needsPayments) {
        if (experience === 'Advanced' && !isLowBudget) {
          return {
            primary: 'Next.js (JavaScript)',
            reasoning: 'Built-in SEO optimization, server-side rendering, and excellent e-commerce ecosystem',
            libraries: ['next-auth', 'stripe', 'prisma', 'tailwindcss', 'framer-motion']
          };
        } else {
          return {
            primary: 'WordPress/WooCommerce (PHP)',
            reasoning: 'Established e-commerce platform with extensive plugins and themes',
            libraries: ['WooCommerce', 'Elementor', 'Yoast SEO', 'WP Rocket']
          };
        }
      }

      // Priority 9: Data visualization/Dashboard requirements
      if (needsDataViz) {
        return {
          primary: 'Dash (Python)',
          reasoning: 'Python-based framework perfect for data visualization and analytics dashboards',
          libraries: ['dash', 'plotly', 'pandas', 'numpy', 'dash-bootstrap-components']
        };
      }

      // Default: React for general web applications
      return {
        primary: 'React (JavaScript)',
        reasoning: 'Popular, well-documented framework with excellent ecosystem and community support',
        libraries: ['react-router-dom', 'tailwindcss', 'axios', 'react-hook-form']
      };
    };

    // Determine backend technology based on features and requirements
    const getBackendRecommendation = () => {
      const isSmallTeam = teamSize === 'Solo (1 person)' || teamSize === 'Small team (2-5 people)';
      const needsRealtime = features?.includes('Real-time Updates');
      const needsPayments = features?.includes('Payment Processing');
      const needsAuth = features?.includes('User Authentication');
      const needsFileStorage = features?.includes('File Upload/Storage');
      const needsDataProcessing = features?.includes('Data Processing') || features?.includes('Machine Learning');
      const needsHighPerformance = features?.includes('High Performance') || features?.includes('Gaming');
      const needsGaming = features?.includes('Gaming');
      const needsML = features?.includes('Machine Learning');
      const needsSEO = features?.includes('SEO Optimization') || features?.includes('Content Management');
      const isComplex = features?.length > 6;
      const isBeginner = experience === 'Beginner';
      const isLowBudget = budget?.includes('Free') || budget?.includes('Under');
      const isLargeTeam = teamSize === 'Large team (16+ people)';
      const isStaticContent = needsSEO && !needsAuth && !needsPayments && !needsRealtime && !needsDataProcessing;
      const isFrontendOnly = developmentType === 'Frontend Only';
      const isBackendOnly = developmentType === 'Backend Only';
      const isFullStack = developmentType === 'Full Stack (Both Frontend & Backend)';
      
      // Skip backend recommendations for frontend-only projects
      if (isFrontendOnly) {
        return {
          primary: 'Not Required (Frontend Only)',
          database: 'Browser Storage/External APIs',
          reasoning: 'This is a frontend-only project, backend will be handled by external services or APIs'
        };
      }
      
      // Priority 1: Static content (no backend needed)
      if (isStaticContent && !needsFileStorage) {
        return {
          primary: 'Static Hosting (No Backend)',
          database: 'None (Static Content)',
          reasoning: 'Static sites don\'t require backend infrastructure, reducing costs and complexity'
        };
      }

      // Priority 2: Gaming applications
      if (needsGaming) {
        if (needsHighPerformance) {
          return {
            primary: 'C++ with Custom Engine',
            database: 'SQLite/Custom File Format',
            reasoning: 'Maximum performance for game logic, physics, and real-time processing'
          };
        } else {
          return {
            primary: 'C# with ASP.NET Core',
            database: 'SQL Server/PostgreSQL',
            reasoning: 'Excellent integration with Unity, robust multiplayer capabilities'
          };
        }
      }

      // Priority 3: Machine Learning applications
      if (needsML) {
        return {
          primary: 'Python with FastAPI',
          database: 'PostgreSQL + Redis',
          reasoning: 'Excellent ML libraries ecosystem with high-performance async API framework'
        };
      }

      // Priority 4: Data Processing applications
      if (needsDataProcessing && !needsML) {
        return {
          primary: 'Python with Django',
          database: 'PostgreSQL',
          reasoning: 'Robust framework with excellent data handling and scientific computing integration'
        };
      }

      // Priority 5: High Performance requirements
      if (needsHighPerformance && experience === 'Advanced') {
        return {
          primary: 'Rust with Actix-web',
          database: 'PostgreSQL',
          reasoning: 'Memory-safe systems programming with exceptional performance and concurrency'
        };
      }

      // Priority 6: High Performance for non-advanced users
      if (needsHighPerformance && !isBeginner) {
        return {
          primary: 'Go with Gin/Fiber',
          database: 'PostgreSQL',
          reasoning: 'Excellent performance, built-in concurrency, and fast compilation for high-load applications'
        };
      }

      // Priority 7: Real-time applications
      if (needsRealtime) {
        if (experience === 'Advanced') {
          return {
            primary: 'Go with WebSocket',
            database: 'Redis + PostgreSQL',
            reasoning: 'Superior concurrency handling for real-time applications with excellent performance'
          };
        } else {
          return {
            primary: 'Node.js with Socket.io',
            database: 'Redis + PostgreSQL',
            reasoning: 'Excellent real-time capabilities with WebSocket support and caching'
          };
        }
      }

      // Priority 8: E-commerce/Payment processing
      if (needsPayments) {
        if (isLowBudget) {
          return {
            primary: 'PHP with Laravel',
            database: 'MySQL',
            reasoning: 'Cost-effective with extensive e-commerce packages and shared hosting compatibility'
          };
        } else if (experience === 'Advanced') {
          return {
            primary: 'Java with Spring Boot',
            database: 'PostgreSQL',
            reasoning: 'Robust architecture for complex e-commerce logic with excellent payment integrations'
          };
        } else {
          return {
            primary: 'Node.js with Express',
            database: 'PostgreSQL',
            reasoning: 'Full control over e-commerce logic with robust payment and inventory management'
          };
        }
      }

      // Priority 9: Large team/Enterprise requirements
      if (isLargeTeam) {
        return {
          primary: 'Java with Spring Boot',
          database: 'PostgreSQL/Oracle',
          reasoning: 'Enterprise-grade framework with excellent tooling, scalability, and team collaboration features'
        };
      }

      // Priority 10: Complex applications for advanced users
      if (isComplex && experience === 'Advanced') {
        return {
          primary: 'Java with Spring Boot',
          database: 'PostgreSQL',
          reasoning: 'Enterprise-grade framework with comprehensive features and excellent tooling'
        };
      }

      // Experience-based recommendations for beginners
      if (isBeginner) {
        if (isLowBudget) {
          return {
            primary: 'Python with Flask',
            database: 'SQLite',
            reasoning: 'Simple, lightweight framework perfect for learning with minimal setup requirements'
          };
        } else {
          return {
            primary: 'Node.js with Express',
            database: 'MongoDB',
            reasoning: 'JavaScript everywhere - easy to learn with consistent language across frontend and backend'
          };
        }
      }

      // Experience-based recommendations for intermediate
      if (experience === 'Intermediate') {
        if (needsAuth || needsFileStorage) {
          return {
            primary: 'Supabase (PostgreSQL)',
            database: 'PostgreSQL (Supabase)',
            reasoning: 'Open-source Firebase alternative with built-in authentication and file storage'
          };
        } else {
          return {
            primary: 'Python with Django',
            database: 'PostgreSQL',
            reasoning: 'Batteries-included framework with excellent documentation and rapid development'
          };
        }
      }

      // Experience-based recommendations for advanced
      if (experience === 'Advanced') {
        if (isLargeTeam || isComplex) {
          return {
            primary: 'Java with Spring Boot',
            database: 'PostgreSQL',
            reasoning: 'Enterprise-grade framework with excellent tooling, scalability, and team collaboration features'
          };
        } else {
          return {
            primary: 'Python with FastAPI',
            database: 'PostgreSQL',
            reasoning: 'Modern Python framework with automatic API documentation and excellent performance'
          };
        }
      }

      // Experience-based recommendations for experts
      if (experience === 'Expert') {
        return {
          primary: 'Rust with Actix-web',
          database: 'PostgreSQL',
          reasoning: 'Memory-safe systems programming with exceptional performance and modern async capabilities'
        };
      }

      // Default: Node.js for general applications
      return {
        primary: 'Node.js with Express',
        database: 'PostgreSQL',
        reasoning: 'Versatile JavaScript runtime with excellent ecosystem and community support'
      };
    };

    // Generate cost estimates based on budget and currency
    const getCostEstimates = () => {
      const isFree = budget?.includes('Free');
      const isUnder1Lakh = budget?.includes('Under ₹1,00,000');
      const isUnder5K = budget?.includes('Under $5,000');
      const isLowBudgetINR = budget?.includes('₹1,00,000 - ₹3,00,000');
      const isLowBudgetUSD = budget?.includes('$5,000 - $15,000');
      const isMidBudgetINR = budget?.includes('₹3,00,000 - ₹6,00,000');
      const isMidBudgetUSD = budget?.includes('$15,000 - $50,000');
      
      if (isFree) {
        return {
          development: 'Free (Self-developed)',
          hosting: 'Free (GitHub Pages, Netlify, Vercel, Railway free tier)',
          thirdParty: 'Free (Open source alternatives, free tiers of services)'
        };
      } else if (isUnder1Lakh || isUnder5K) {
        return {
          development: budget,
          hosting: `${currency === 'INR' ? '₹300 - ₹1,500' : '$5 - $30'}/month`,
          thirdParty: `${currency === 'INR' ? '₹500 - ₹3,000' : '$10 - $60'}/month`
        };
      } else if (isLowBudgetINR || isLowBudgetUSD) {
        return {
          development: budget,
          hosting: `${currency === 'INR' ? '₹1,000 - ₹5,000' : '$20 - $100'}/month`,
          thirdParty: `${currency === 'INR' ? '₹2,000 - ₹8,000' : '$40 - $150'}/month`
        };
      } else if (isMidBudgetINR || isMidBudgetUSD) {
        return {
          development: budget,
          hosting: `${currency === 'INR' ? '₹3,000 - ₹15,000' : '$60 - $300'}/month`,
          thirdParty: `${currency === 'INR' ? '₹5,000 - ₹20,000' : '$100 - $400'}/month`
        };
      } else {
        return {
          development: budget || `${currency === 'INR' ? '₹10,00,000+' : '$100,000+'}`,
          hosting: `${currency === 'INR' ? '₹10,000 - ₹50,000' : '$200 - $1,000'}/month`,
          thirdParty: `${currency === 'INR' ? '₹15,000 - ₹75,000' : '$300 - $1,500'}/month`
        };
      }
    };

    // Generate DevOps recommendations
    const getDevToolsRecommendation = () => {
      const isLowBudget = budget?.includes('Free') || budget?.includes('Under');
      const isEnterprise = teamSize === 'Large team (10+ people)' || features?.includes('High Performance');
      const needsCI = features?.includes('Automated Testing') || experience === 'Advanced';
      
      return {
        versionControl: 'Git',
        deployment: isLowBudget 
          ? 'Netlify/Vercel (Frontend) + Railway/Render (Backend)'
          : isEnterprise 
            ? 'AWS/Google Cloud with Kubernetes'
            : 'Digital Ocean/Linode with Docker',
        cicd: needsCI 
          ? 'GitHub Actions with automated testing'
          : 'GitHub Actions (basic deployment)'
      };
    };

    // Generate dynamic roadmap based on project complexity and features
    const generateDynamicRoadmap = () => {
      const roadmapPhases = [];
      
      // Analyze project complexity
      const featureCount = features?.length || 0;
      const isComplex = featureCount > 6;
      const isSimple = featureCount <= 3;
      const isLargeTeam = teamSize === 'Large team (16+ people)';
      const isBeginner = experience === 'Beginner';
      const isAdvanced = experience === 'Advanced' || experience === 'Expert';
      const isShortTimeline = timeline === 'Less than 1 month';
      const isLongTimeline = timeline === '6-12 months' || timeline === 'More than 1 year';
      
      // Feature-based complexity analysis
      const hasAuth = features?.includes('User Authentication');
      const hasPayments = features?.includes('Payment Processing');
      const hasRealtime = features?.includes('Real-time Updates');
      const hasML = features?.includes('Machine Learning');
      const hasAPI = features?.includes('API Development');
      const hasAdmin = features?.includes('Admin Dashboard');
      const hasAnalytics = features?.includes('Analytics/Reporting');
      const hasFileUpload = features?.includes('File Upload/Storage');
      const hasSEO = features?.includes('SEO Optimization');
      const hasIntegration = features?.includes('System Integration');
      const hasGaming = features?.includes('Gaming');
      const hasDataProcessing = features?.includes('Data Processing');
      
      // Phase 1: Planning & Research
      const planningTasks = ['Project requirements analysis', 'Technology stack finalization'];
      let planningDuration = '1 week';
      
      if (isComplex || isLargeTeam) {
        planningTasks.push('Architecture design', 'Team role assignment', 'Risk assessment');
        planningDuration = '2-3 weeks';
      }
      if (hasML || hasDataProcessing) {
        planningTasks.push('Data analysis and modeling strategy', 'ML pipeline design');
      }
      if (hasIntegration) {
        planningTasks.push('Third-party API research', 'Integration planning');
      }
      if (isBeginner) {
        planningTasks.push('Learning path creation', 'Tutorial and documentation review');
        planningDuration = isSimple ? '1-2 weeks' : '2-3 weeks';
      }
      
      roadmapPhases.push({
        phase: 'Planning & Research',
        duration: planningDuration,
        tasks: planningTasks,
        deliverables: ['Project specification', 'Technical architecture document', 'Development timeline']
      });
      
      // Phase 2: Environment Setup
      const setupTasks = ['Development environment setup', 'Version control initialization'];
      let setupDuration = '3-5 days';
      
      if (isComplex || isLargeTeam) {
        setupTasks.push('CI/CD pipeline setup', 'Code quality tools configuration', 'Team collaboration tools setup');
        setupDuration = '1-2 weeks';
      }
      if (hasGaming) {
        setupTasks.push('Game engine setup', 'Asset pipeline configuration');
      }
      if (hasML) {
        setupTasks.push('ML development environment', 'Data pipeline setup', 'Model training infrastructure');
      }
      
      roadmapPhases.push({
        phase: 'Environment Setup',
        duration: setupDuration,
        tasks: setupTasks,
        deliverables: ['Configured development environment', 'Project boilerplate', 'CI/CD pipeline']
      });
      
      // Phase 3: Core Development (split into sub-phases for complex projects)
      if (isComplex || hasML || hasGaming) {
        // Phase 3a: Backend/Core Logic
        const backendTasks = ['Database design and setup', 'Core API development'];
        let backendDuration = '3-4 weeks';
        
        if (hasAuth) backendTasks.push('Authentication system implementation');
        if (hasPayments) backendTasks.push('Payment gateway integration');
        if (hasAPI) backendTasks.push('RESTful API development', 'API documentation');
        if (hasRealtime) backendTasks.push('Real-time communication setup');
        if (hasML) {
          backendTasks.push('ML model development', 'Model training and validation', 'ML API endpoints');
          backendDuration = '4-6 weeks';
        }
        if (hasGaming) {
          backendTasks.push('Game logic implementation', 'Physics system setup', 'Multiplayer networking');
          backendDuration = '6-8 weeks';
        }
        
        roadmapPhases.push({
          phase: 'Backend Development',
          duration: backendDuration,
          tasks: backendTasks,
          deliverables: ['Database schema', 'Core APIs', 'Authentication system']
        });
        
        // Phase 3b: Frontend Development
        const frontendTasks = ['UI/UX implementation', 'Component development'];
        let frontendDuration = '3-4 weeks';
        
        if (hasAdmin) frontendTasks.push('Admin dashboard development');
        if (hasAnalytics) frontendTasks.push('Analytics dashboard implementation');
        if (hasFileUpload) frontendTasks.push('File upload interface');
        if (hasSEO) frontendTasks.push('SEO optimization implementation');
        if (hasGaming) {
          frontendTasks.push('Game UI development', 'Game controls implementation', 'Graphics optimization');
          frontendDuration = '4-6 weeks';
        }
        
        roadmapPhases.push({
          phase: 'Frontend Development',
          duration: frontendDuration,
          tasks: frontendTasks,
          deliverables: ['User interface', 'Frontend components', 'User experience flows']
        });
        
        // Phase 3c: Integration
        roadmapPhases.push({
          phase: 'System Integration',
          duration: '2-3 weeks',
          tasks: [
            'Frontend-backend integration',
            'Third-party service integration',
            'End-to-end functionality testing',
            'Performance optimization'
          ],
          deliverables: ['Integrated application', 'Integration test results', 'Performance benchmarks']
        });
      } else {
        // Simple projects - single development phase
        const coreTasks = ['Core feature implementation', 'User interface development'];
        let coreDuration = '2-4 weeks';
        
        if (hasAuth) coreTasks.push('User authentication setup');
        if (hasPayments) coreTasks.push('Payment processing integration');
        if (hasFileUpload) coreTasks.push('File handling implementation');
        if (hasAnalytics) coreTasks.push('Basic analytics implementation');
        
        if (isShortTimeline) {
          coreDuration = '1-2 weeks';
          coreTasks.push('MVP feature prioritization');
        }
        
        roadmapPhases.push({
          phase: 'Core Development',
          duration: coreDuration,
          tasks: coreTasks,
          deliverables: ['Working application', 'Core features', 'Basic UI']
        });
      }
      
      // Phase 4: Testing & Quality Assurance
      const testingTasks = ['Unit testing', 'Integration testing'];
      let testingDuration = '1 week';
      
      if (isComplex || isLargeTeam) {
        testingTasks.push('End-to-end testing', 'Performance testing', 'Security testing', 'User acceptance testing');
        testingDuration = '2-3 weeks';
      }
      if (hasPayments) {
        testingTasks.push('Payment flow testing', 'Security audit');
      }
      if (hasML) {
        testingTasks.push('Model validation', 'A/B testing setup');
      }
      if (hasGaming) {
        testingTasks.push('Gameplay testing', 'Performance optimization', 'Device compatibility testing');
      }
      if (isBeginner && !isShortTimeline) {
        testingDuration = '1-2 weeks';
        testingTasks.push('Code review and refactoring');
      }
      
      roadmapPhases.push({
        phase: 'Testing & Quality Assurance',
        duration: testingDuration,
        tasks: testingTasks,
        deliverables: ['Test reports', 'Bug fixes', 'Performance metrics', 'Quality assurance documentation']
      });
      
      // Phase 5: Deployment & Launch
      const deploymentTasks = ['Production environment setup', 'Application deployment'];
      let deploymentDuration = '3-5 days';
      
      if (isComplex || isLargeTeam) {
        deploymentTasks.push('Load balancing setup', 'Monitoring and logging configuration', 'Backup systems setup');
        deploymentDuration = '1-2 weeks';
      }
      if (hasML) {
        deploymentTasks.push('ML model deployment', 'Model monitoring setup');
      }
      if (hasGaming) {
        deploymentTasks.push('Game distribution setup', 'Update mechanism implementation');
      }
      
      roadmapPhases.push({
        phase: 'Deployment & Launch',
        duration: deploymentDuration,
        tasks: deploymentTasks,
        deliverables: ['Live application', 'Deployment documentation', 'Monitoring dashboard']
      });
      
      // Phase 6: Post-Launch (only for complex projects or long timelines)
      if (isComplex || isLongTimeline || hasML) {
        const postLaunchTasks = ['User feedback collection', 'Performance monitoring'];
        let postLaunchDuration = '2-4 weeks';
        
        if (hasML) {
          postLaunchTasks.push('Model performance monitoring', 'Continuous model improvement');
        }
        if (hasAnalytics) {
          postLaunchTasks.push('Analytics setup and monitoring', 'User behavior analysis');
        }
        if (isLongTimeline) {
          postLaunchTasks.push('Feature enhancement planning', 'Scalability improvements');
          postLaunchDuration = '4-8 weeks';
        }
        
        roadmapPhases.push({
          phase: 'Post-Launch & Optimization',
          duration: postLaunchDuration,
          tasks: postLaunchTasks,
          deliverables: ['User feedback report', 'Performance optimization', 'Future roadmap']
        });
      }
      
      return roadmapPhases;
    };

    // Generate timeline estimates
    const generateTimelineEstimates = () => {
      const featureCount = features?.length || 0;
      const isComplex = featureCount > 6;
      const isSimple = featureCount <= 3;
      const isLargeTeam = teamSize === 'Large team (16+ people)';
      const isMediumTeam = teamSize === 'Medium team (6-15 people)';
      const isBeginner = experience === 'Beginner';
      const isAdvanced = experience === 'Advanced' || experience === 'Expert';
      
      // Feature complexity multipliers
      const hasML = features?.includes('Machine Learning');
      const hasGaming = features?.includes('Gaming');
      const hasPayments = features?.includes('Payment Processing');
      const hasRealtime = features?.includes('Real-time Updates');
      const hasIntegration = features?.includes('System Integration');
      const hasDataProcessing = features?.includes('Data Processing');
      
      // Base timeline calculation
      let baseWeeks = 4; // Default 4 weeks for simple projects
      
      if (isSimple) {
        baseWeeks = isBeginner ? 6 : 4;
      } else if (isComplex) {
        baseWeeks = isBeginner ? 16 : isAdvanced ? 12 : 14;
      } else {
        baseWeeks = isBeginner ? 10 : isAdvanced ? 8 : 9;
      }
      
      // Feature-based adjustments
      if (hasML) baseWeeks += 4;
      if (hasGaming) baseWeeks += 6;
      if (hasPayments) baseWeeks += 2;
      if (hasRealtime) baseWeeks += 2;
      if (hasIntegration) baseWeeks += 3;
      if (hasDataProcessing) baseWeeks += 2;
      
      // Team size adjustments
      if (isLargeTeam) {
        baseWeeks *= 0.7; // Large teams can work in parallel
        baseWeeks += 2; // But need coordination time
      } else if (isMediumTeam) {
        baseWeeks *= 0.8;
        baseWeeks += 1;
      }
      
      // Convert to different time formats
      const totalWeeks = Math.ceil(baseWeeks);
      const totalMonths = Math.ceil(totalWeeks / 4);
      const totalDays = totalWeeks * 5; // Working days
      
      // Determine timeline category
      let timelineCategory = '';
      let timelineDescription = '';
      let riskFactors = [];
      let recommendations = [];
      
      if (totalWeeks <= 4) {
        timelineCategory = 'Short-term';
        timelineDescription = 'Quick development cycle suitable for MVP or simple applications';
        recommendations.push('Focus on core features only');
        recommendations.push('Consider using existing templates or frameworks');
      } else if (totalWeeks <= 12) {
        timelineCategory = 'Medium-term';
        timelineDescription = 'Standard development timeline with room for proper planning and testing';
        recommendations.push('Implement features in phases');
        recommendations.push('Plan for regular testing and feedback cycles');
      } else if (totalWeeks <= 24) {
        timelineCategory = 'Long-term';
        timelineDescription = 'Extended development period allowing for complex features and thorough testing';
        recommendations.push('Break project into multiple milestones');
        recommendations.push('Consider agile development methodology');
        riskFactors.push('Scope creep risk');
        riskFactors.push('Technology changes during development');
      } else {
        timelineCategory = 'Enterprise-scale';
        timelineDescription = 'Large-scale project requiring careful planning and project management';
        recommendations.push('Implement robust project management practices');
        recommendations.push('Consider hiring additional team members');
        recommendations.push('Plan for multiple release cycles');
        riskFactors.push('High complexity management');
        riskFactors.push('Team coordination challenges');
        riskFactors.push('Budget overrun risk');
      }
      
      // Add experience-based risk factors
      if (isBeginner) {
        riskFactors.push('Learning curve may extend timeline');
        recommendations.push('Allocate extra time for learning and debugging');
      }
      
      // Add feature-specific risks
      if (hasML) {
        riskFactors.push('Model training time uncertainty');
        riskFactors.push('Data quality issues');
      }
      if (hasGaming) {
        riskFactors.push('Performance optimization challenges');
        riskFactors.push('Platform compatibility issues');
      }
      if (hasPayments) {
        riskFactors.push('Compliance and security requirements');
        riskFactors.push('Third-party integration delays');
      }
      
      return {
        estimated: {
          weeks: totalWeeks,
          months: totalMonths,
          workingDays: totalDays,
          range: {
            minimum: `${Math.max(1, totalWeeks - 2)} weeks`,
            maximum: `${totalWeeks + 4} weeks`,
            realistic: `${totalWeeks} weeks`
          }
        },
        category: timelineCategory,
        description: timelineDescription,
        breakdown: {
          planning: Math.ceil(totalWeeks * 0.15),
          development: Math.ceil(totalWeeks * 0.60),
          testing: Math.ceil(totalWeeks * 0.15),
          deployment: Math.ceil(totalWeeks * 0.10)
        },
        milestones: [
          {
            name: 'Project Kickoff',
            week: 1,
            description: 'Project setup and planning complete'
          },
          {
            name: 'MVP Ready',
            week: Math.ceil(totalWeeks * 0.6),
            description: 'Core features implemented and testable'
          },
          {
            name: 'Beta Release',
            week: Math.ceil(totalWeeks * 0.85),
            description: 'Feature-complete version ready for testing'
          },
          {
            name: 'Production Launch',
            week: totalWeeks,
            description: 'Final version deployed and live'
          }
        ],
        riskFactors,
        recommendations,
        bufferTime: {
          recommended: `${Math.ceil(totalWeeks * 0.2)} weeks`,
          reason: 'Account for unexpected challenges and scope changes'
        }
      };
    };

    // Get the recommendations
    const frontend = getFrontendRecommendation();
    const backend = getBackendRecommendation();
    const devTools = getDevToolsRecommendation();
    const estimatedCost = getCostEstimates();
    const dynamicRoadmap = generateDynamicRoadmap();
    const timelineEstimates = generateTimelineEstimates();

    return {
      frontend,
      backend,
      devTools,
      estimatedCost,
      timeline: timelineEstimates,
      roadmap: dynamicRoadmap,
      resources: [
        {
          name: `${frontend.primary} Documentation`,
          description: `Official documentation for ${frontend.primary}`,
          url: '#'
        },
        {
          name: `${backend.primary} Tutorial`,
          description: `Getting started with ${backend.primary}`,
          url: '#'
        }
      ],
      communityInsights: {
        popularity: 'High',
        marketDemand: 'Growing',
        trendingAlternatives: []
      }
    };
  }

  validateAndEnhanceRecommendations(recommendations, projectData) {
    // Ensure all required fields exist
    const required = {
      frontend: { primary: '', reasoning: '', libraries: [] },
      backend: { primary: '', database: '', reasoning: '' },
      devTools: { versionControl: 'Git', deployment: '', cicd: '' },
      estimatedCost: { development: '', hosting: '', thirdParty: '' },
      timeline: {
        estimated: { weeks: 0, months: 0, range: { minimum: '', maximum: '', realistic: '' } },
        category: '',
        description: '',
        breakdown: { planning: 0, development: 0, testing: 0, deployment: 0 },
        milestones: [],
        riskFactors: [],
        recommendations: []
      },
      roadmap: [],
      resources: [],
      communityInsights: { popularity: '', marketDemand: '', trendingAlternatives: [] }
    };

    // Merge with defaults
    const validated = { ...required, ...recommendations };
    
    // Force free cost estimates if budget is "Free"
    const isFree = projectData.budget?.includes('Free');
    if (isFree) {
      validated.estimatedCost = {
        development: 'Free (Self-developed)',
        hosting: 'Free (GitHub Pages, Netlify, Vercel, Railway free tier)',
        thirdParty: 'Free (Open source alternatives, free tiers of services)'
      };
    }
    
    // Add metadata
    validated.metadata = {
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      generatedAt: new Date().toISOString(),
      projectName: projectData.projectName,
      projectType: projectData.projectType
    };

    return validated;
  }
}