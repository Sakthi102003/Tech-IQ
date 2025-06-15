// Helper function to generate dynamic recommendations based on project data
const generateDynamicRecommendations = (projectData) => {
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
  
  // Normalize project type
  const projectType = developmentType;

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
    const isLargeTeam = teamSize === 'Large team (10+ people)';
    const isMobileTarget = projectType === 'Mobile App';
    const isDesktopTarget = projectType === 'Desktop Application';
    const isWebTarget = !isMobileTarget && !isDesktopTarget;

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
      if (isWebTarget) {
        return {
          primary: 'Streamlit (Python)',
          reasoning: 'Rapid development of data science web applications with minimal frontend code',
          libraries: ['streamlit', 'pandas', 'numpy', 'plotly', 'scikit-learn', 'tensorflow']
        };
      } else if (isDesktopTarget) {
        return {
          primary: 'PyQt/PySide (Python)',
          reasoning: 'Python ecosystem for data science with native desktop UI capabilities',
          libraries: ['PyQt6', 'pandas', 'numpy', 'matplotlib', 'scikit-learn']
        };
      }
    }

    // Priority 3: High Performance requirements
    if (needsPerformance && experience === 'Advanced') {
      if (isDesktopTarget || needsSystemIntegration) {
        return {
          primary: 'Qt (C++)',
          reasoning: 'Native performance with cross-platform compatibility and system-level access',
          libraries: ['Qt Widgets', 'Qt Network', 'Qt SQL', 'Qt Charts']
        };
      } else if (isMobileTarget) {
        return {
          primary: 'Flutter',
          reasoning: 'High-performance cross-platform development with native compilation and excellent UI',
          libraries: ['flutter_bloc', 'dio', 'shared_preferences', 'firebase_core']
        };
      }
    }

    // Priority 4: Mobile-specific recommendations
    if (isMobileTarget) {
      if (isBeginner || isLowBudget) {
        return {
          primary: 'Expo (React Native)',
          reasoning: 'Managed workflow with easy deployment and beginner-friendly development experience',
          libraries: ['expo-router', 'expo-auth-session', 'expo-sqlite', 'react-native-paper']
        };
      } else {
        return {
          primary: 'React Native',
          reasoning: 'Full control over native modules with excellent performance and flexibility',
          libraries: ['react-navigation', 'react-native-vector-icons', 'react-native-async-storage', 'react-native-paper']
        };
      }
    }

    // Priority 5: Desktop-specific recommendations
    if (isDesktopTarget) {
      if (isComplex || !isBeginner) {
        return {
          primary: 'Tauri (Rust)',
          reasoning: 'Lightweight, secure desktop apps with Rust backend and web frontend',
          libraries: ['tauri', 'serde', 'tokio', 'reqwest']
        };
      } else {
        return {
          primary: 'Electron (JavaScript)',
          reasoning: 'Mature ecosystem with extensive documentation and community support',
          libraries: ['electron-builder', 'electron-updater', 'electron-store', 'react']
        };
      }
    }

    // Priority 6: SEO-critical applications
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

    // Priority 7: Real-time applications
    if (needsRealtime) {
      return {
        primary: 'Next.js (JavaScript)',
        reasoning: 'Server-side rendering with excellent real-time capabilities through API routes',
        libraries: ['socket.io-client', 'swr', 'tailwindcss', 'framer-motion']
      };
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

    // Priority 10: Large team/Enterprise requirements
    if (isLargeTeam || isComplex) {
      return {
        primary: 'Angular (TypeScript)',
        reasoning: 'Enterprise framework with strong architecture patterns, perfect for large team collaboration',
        libraries: ['Angular Material', 'RxJS', 'NgRx', 'Angular Universal']
      };
    }

    // Priority 11: Beginner + Low budget
    if (isBeginner && isLowBudget) {
      return {
        primary: 'React with Vite (JavaScript)',
        reasoning: 'Modern, fast development with excellent developer experience and strong ecosystem',
        libraries: ['react-router-dom', 'tailwindcss', 'framer-motion', 'react-hook-form', 'zustand']
      };
    }

    // Default: Vue.js for general web applications
    return {
      primary: 'Vue.js (JavaScript)',
      reasoning: 'Progressive framework with gentle learning curve and excellent performance',
      libraries: ['Vue Router', 'Pinia', 'Vuetify', 'Vite']
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
    const isLargeTeam = teamSize === 'Large team (10+ people)';
    const isStaticContent = needsSEO && !needsAuth && !needsPayments && !needsRealtime && !needsDataProcessing;
    
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

    // Priority 11: Beginner + Low budget
    if (isBeginner && isLowBudget) {
      return {
        primary: 'Python with Flask',
        database: 'SQLite',
        reasoning: 'Simple, lightweight framework perfect for learning with minimal setup requirements'
      };
    }

    // Priority 12: Low budget or small team with auth/file storage
    if ((isLowBudget || isSmallTeam) && (needsAuth || needsFileStorage)) {
      return {
        primary: 'Supabase (PostgreSQL)',
        database: 'PostgreSQL (Supabase)',
        reasoning: 'Open-source Firebase alternative with SQL database and built-in features'
      };
    }

    // Priority 13: Low budget or small team (general)
    if (isLowBudget || isSmallTeam) {
      return {
        primary: 'Python with Django',
        database: isLowBudget ? 'SQLite' : 'PostgreSQL',
        reasoning: 'Batteries-included framework with excellent documentation and rapid development'
      };
    }

    // Priority 14: Beginner-friendly API development
    if (isBeginner) {
      return {
        primary: 'Python with FastAPI',
        database: 'PostgreSQL',
        reasoning: 'Modern Python framework with automatic API documentation and excellent developer experience'
      };
    }

    // Default: Python Django for general applications
    return {
      primary: 'Python with Django',
      database: 'PostgreSQL',
      reasoning: 'Comprehensive framework with excellent documentation and rapid development capabilities'
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
        hosting: `${currency === 'INR' ? '₹1,000 - ₹4,000' : '$20 - $80'}/month`,
        thirdParty: `${currency === 'INR' ? '₹2,000 - ₹8,000' : '$40 - $160'}/month`
      };
    } else if (isMidBudgetINR || isMidBudgetUSD) {
      return {
        development: budget,
        hosting: `${currency === 'INR' ? '₹3,000 - ₹8,000' : '$60 - $160'}/month`,
        thirdParty: `${currency === 'INR' ? '₹5,000 - ₹15,000' : '$100 - $300'}/month`
      };
    } else {
      // High budget ranges
      return {
        development: budget,
        hosting: `${currency === 'INR' ? '₹5,000 - ₹20,000' : '$100 - $400'}/month`,
        thirdParty: `${currency === 'INR' ? '₹10,000 - ₹40,000' : '$200 - $800'}/month`
      };
    }
  };









  // Determine deployment strategy based on requirements
  const getDeploymentRecommendation = () => {
    const isMobileTarget = projectType === 'Mobile App';
    const isDesktopTarget = projectType === 'Desktop Application';
    const needsHighPerformance = features?.includes('High Performance');
    const needsScaling = features?.includes('High Performance') || teamSize === 'Large team (10+ people)';
    const isLowBudget = budget?.includes('Free') || budget?.includes('Under');
    const needsGlobalCDN = features?.includes('SEO Optimization') || features?.includes('High Performance');
    const isStaticSite = backend.primary === 'Static Hosting (No Backend)';

    if (isMobileTarget) {
      return 'App Store / Play Store';
    } else if (isDesktopTarget) {
      return 'GitHub Releases / Microsoft Store / Mac App Store';
    } else if (isStaticSite && isLowBudget) {
      return 'Vercel / Netlify / GitHub Pages';
    } else if (isLowBudget) {
      return 'Vercel / Netlify / Railway';
    } else if (needsScaling || needsHighPerformance) {
      return 'AWS / Google Cloud / Azure';
    } else if (needsGlobalCDN) {
      return 'Vercel / Netlify / Cloudflare Pages';
    } else {
      return 'Digital Ocean / Linode / Heroku';
    }
  };

  const frontend = getFrontendRecommendation();
  const backend = getBackendRecommendation();

  // Generate basic timeline estimates for frontend fallback
  const generateBasicTimeline = () => {
    const featureCount = features?.length || 0;
    const isComplex = featureCount > 6;
    const isBeginner = experience === 'Beginner';
    
    let baseWeeks = isComplex ? (isBeginner ? 12 : 8) : (isBeginner ? 6 : 4);
    
    return {
      estimated: {
        weeks: baseWeeks,
        months: Math.ceil(baseWeeks / 4),
        range: {
          minimum: `${Math.max(1, baseWeeks - 2)} weeks`,
          maximum: `${baseWeeks + 3} weeks`,
          realistic: `${baseWeeks} weeks`
        }
      },
      category: baseWeeks <= 4 ? 'Short-term' : baseWeeks <= 12 ? 'Medium-term' : 'Long-term',
      description: `Estimated timeline based on project complexity and team experience`,
      breakdown: {
        planning: Math.ceil(baseWeeks * 0.15),
        development: Math.ceil(baseWeeks * 0.60),
        testing: Math.ceil(baseWeeks * 0.15),
        deployment: Math.ceil(baseWeeks * 0.10)
      },
      milestones: [
        {
          name: 'Project Kickoff',
          week: 1,
          description: 'Project setup and planning complete'
        },
        {
          name: 'MVP Ready',
          week: Math.ceil(baseWeeks * 0.6),
          description: 'Core features implemented and testable'
        },
        {
          name: 'Production Launch',
          week: baseWeeks,
          description: 'Final version deployed and live'
        }
      ],
      riskFactors: isBeginner ? ['Learning curve may extend timeline'] : [],
      recommendations: ['Plan for regular testing cycles', 'Consider agile development approach']
    };
  };

  return {
    projectName,
    projectType,
    frontend,
    backend,
    devTools: {
      versionControl: 'Git',
      deployment: getDeploymentRecommendation(),
      cicd: teamSize === 'Solo (1 person)' ? 'GitHub Actions' : 'GitHub Actions / Jenkins'
    },
    estimatedCost: getCostEstimates(),
    timeline: generateBasicTimeline(),
    techStack: {
      frontend: [frontend.primary, ...frontend.libraries.slice(0, 2)],
      backend: [backend.primary, backend.database],
      database: [backend.database]
    }
  };
};

const generateTechIQRecommendation = async (projectData, options = {}) => {
  try {
    console.log('Generating local recommendations for project:', projectData.projectName);
    
    const { 
      useBackend = false, // Default to local recommendations when used as fallback
      aiProvider = 'openai', 
      useMockData = false,
      compareProviders = false 
    } = options;

    // Import services dynamically to avoid loading unused dependencies
    if (useMockData) {
      console.log('Using mock data for development');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
    } else if (useBackend) {
      // Use secure backend API (recommended for production)
      const { default: backendService } = await import('../api/backendService.js');
      
      if (compareProviders) {
        return await backendService.compareRecommendations(projectData, ['openai', 'gemini']);
      } else {
        return await backendService.generateRecommendations(projectData, aiProvider);
      }
    } else if (options.useDirectAPI) {
      // Use direct API calls (development/testing only)
      console.warn('⚠️ Using direct API calls - API keys will be exposed in browser!');
      
      if (compareProviders) {
        const { default: multiAIService } = await import('../api/multiAIService.js');
        const result = await multiAIService.compareProviders(projectData);
        return result.results[Object.keys(result.results)[0]] || result; // Return first result or full comparison
      } else if (aiProvider === 'openai') {
        const { default: directOpenAI } = await import('../api/directOpenAI.js');
        return await directOpenAI.generateRecommendations(projectData);
      } else {
        const { default: multiAIService } = await import('../api/multiAIService.js');
        return await multiAIService.generateRecommendations(projectData, aiProvider);
      }
    }

    // Generate customized recommendations based on project data (LOCAL FALLBACK)
    console.log('Using local dynamic recommendations for:', projectData.projectName);
    console.log('Project data:', projectData);
    
    // Add a small delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const recommendations = generateDynamicRecommendations(projectData);
    console.log('Generated recommendations:', recommendations);

    return recommendations;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw error;
  }
};

const openaiService = {
  generateTechIQRecommendation,
  generateDynamicRecommendations,
};

export default openaiService;
export { generateDynamicRecommendations };

