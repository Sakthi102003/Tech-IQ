import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'gemini-service' },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ]
});

export class GeminiService {
  constructor() {
    if (!process.env.GOOGLE_API_KEY) {
      logger.warn('Google API key not found');
      this.client = null;
    } else {
      this.client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      this.model = this.client.getGenerativeModel({ model: 'gemini-pro' });
    }
  }

  async generateRecommendations(projectData) {
    if (!this.client) {
      throw new Error('Google API key not configured');
    }

    try {
      const prompt = this.buildPrompt(projectData);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      let recommendations;

      try {
        // Try to extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          recommendations = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        logger.error('Failed to parse Gemini response as JSON:', parseError);
        recommendations = this.createFallbackRecommendations(projectData, text);
      }

      return this.validateAndEnhanceRecommendations(recommendations, projectData);

    } catch (error) {
      logger.error('Gemini API error:', error);
      
      if (error.message.includes('API_KEY_INVALID')) {
        throw new Error('Invalid Google API key');
      }
      
      if (error.message.includes('RATE_LIMIT_EXCEEDED')) {
        throw new Error('Gemini rate limit exceeded. Please try again later.');
      }

      throw new Error(`Gemini API error: ${error.message}`);
    }
  }

  buildPrompt(projectData) {
    return `
You are an expert technology consultant. Analyze the following project requirements and provide detailed technology stack recommendations.

Project Information:
- Project Name: ${projectData.projectName}
- Project Type: ${projectData.projectType}
- Description: ${projectData.description}
- Budget: ${projectData.budget}
- Timeline: ${projectData.timeline}
- Team Size: ${projectData.teamSize} developers
- Experience Level: ${projectData.experience}
- Required Features: ${projectData.features.join(', ')}

Please provide your recommendations in the following JSON format (respond with valid JSON only):

{
  "frontend": {
    "primary": "recommended frontend framework/library",
    "reasoning": "detailed explanation for this choice considering team size, experience, and project requirements",
    "libraries": ["essential library 1", "essential library 2", "essential library 3"]
  },
  "backend": {
    "primary": "recommended backend technology/framework",
    "database": "recommended database solution",
    "reasoning": "detailed explanation for backend and database choices"
  },
  "devTools": {
    "versionControl": "Git",
    "deployment": "recommended deployment platform",
    "cicd": "recommended CI/CD solution"
  },
  "estimatedCost": {
    "development": "estimated development cost range",
    "hosting": "estimated monthly hosting costs",
    "thirdParty": "estimated monthly third-party service costs"
  },
  "roadmap": [
    {
      "phase": "Development phase name",
      "duration": "estimated duration",
      "tasks": ["specific task 1", "specific task 2", "specific task 3"],
      "deliverables": ["deliverable 1", "deliverable 2"]
    }
  ],
  "githubTemplates": [
    {
      "name": "template name",
      "description": "what this template provides",
      "url": "actual github repository URL"
    }
  ],
  "integrationWarnings": [
    {
      "tools": ["technology 1", "technology 2"],
      "issue": "potential integration challenge",
      "solution": "recommended approach to resolve"
    }
  ],
  "communityInsights": {
    "popularity": "High/Medium/Low",
    "marketDemand": "Growing/Stable/Declining",
    "trendingAlternatives": ["alternative 1", "alternative 2", "alternative 3"]
  }
}

Focus on practical, modern solutions that align with the team's experience level and budget. Consider scalability, maintainability, and community support in your recommendations.`;
  }

  createFallbackRecommendations(projectData, rawResponse) {
    const isMobile = projectData.projectType === 'Mobile App';
    const isSmallTeam = projectData.teamSize <= 2;
    const isFree = projectData.budget?.includes('Free');
    const isLowBudget = projectData.budget?.includes('5,000') || projectData.budget?.includes('Under');

    return {
      frontend: {
        primary: isMobile ? 'React Native' : 'React',
        reasoning: isMobile 
          ? 'Cross-platform development efficiency with native performance'
          : 'Large ecosystem, excellent documentation, and strong community support',
        libraries: isMobile 
          ? ['react-navigation', 'react-native-vector-icons', 'react-native-async-storage']
          : ['react-router-dom', 'tailwindcss', 'framer-motion']
      },
      backend: {
        primary: 'Fallback to comprehensive logic needed',
        database: 'Fallback to comprehensive logic needed',
        reasoning: 'This service needs to be updated with comprehensive logic like OpenAI service'
      },
      devTools: {
        versionControl: 'Git',
        deployment: isLowBudget || isFree ? 'Netlify/Vercel' : 'AWS/Google Cloud',
        cicd: 'GitHub Actions'
      },
      estimatedCost: isFree ? {
        development: 'Free (Self-developed)',
        hosting: 'Free (GitHub Pages, Netlify, Vercel, Railway free tier)',
        thirdParty: 'Free (Open source alternatives, free tiers of services)'
      } : {
        development: projectData.budget || '$10,000 - $30,000',
        hosting: isLowBudget ? '$20 - $100/month' : '$100 - $500/month',
        thirdParty: isLowBudget ? '$50 - $200/month' : '$200 - $800/month'
      },
      roadmap: [
        {
          phase: 'Planning & Setup',
          duration: '1-2 weeks',
          tasks: ['Requirements analysis', 'Architecture design', 'Development environment setup'],
          deliverables: ['Technical specification', 'Project repository', 'CI/CD pipeline']
        },
        {
          phase: 'Core Development',
          duration: '4-8 weeks',
          tasks: ['Core feature implementation', 'API development', 'Database design'],
          deliverables: ['MVP version', 'API documentation', 'Test suite']
        },
        {
          phase: 'Testing & Deployment',
          duration: '2-3 weeks',
          tasks: ['Integration testing', 'Performance optimization', 'Production deployment'],
          deliverables: ['Production-ready application', 'Deployment documentation']
        }
      ],
      githubTemplates: [
        {
          name: 'React TypeScript Starter',
          description: 'Modern React application with TypeScript and best practices',
          url: 'https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts'
        },
        {
          name: 'Node.js Express API',
          description: 'RESTful API template with Express and PostgreSQL',
          url: 'https://github.com/hagopj13/node-express-boilerplate'
        }
      ],
      integrationWarnings: [
        {
          tools: ['React', 'Node.js'],
          issue: 'CORS configuration needed for development',
          solution: 'Configure CORS middleware properly and use environment-specific settings'
        }
      ],
      communityInsights: {
        popularity: 'High',
        marketDemand: 'Growing',
        trendingAlternatives: ['Next.js', 'Remix', 'SvelteKit']
      },
      rawResponse: rawResponse
    };
  }

  validateAndEnhanceRecommendations(recommendations, projectData) {
    // Ensure all required fields exist with Gemini-specific enhancements
    const validated = {
      frontend: recommendations.frontend || {},
      backend: recommendations.backend || {},
      devTools: recommendations.devTools || {},
      estimatedCost: recommendations.estimatedCost || {},
      roadmap: recommendations.roadmap || [],
      githubTemplates: recommendations.githubTemplates || [],
      integrationWarnings: recommendations.integrationWarnings || [],
      communityInsights: recommendations.communityInsights || {}
    };

    // Force free cost estimates if budget is "Free"
    const isFree = projectData.budget?.includes('Free');
    if (isFree) {
      validated.estimatedCost = {
        development: 'Free (Self-developed)',
        hosting: 'Free (GitHub Pages, Netlify, Vercel, Railway free tier)',
        thirdParty: 'Free (Open source alternatives, free tiers of services)'
      };
    }

    // Add Gemini-specific metadata
    validated.metadata = {
      provider: 'gemini',
      model: 'gemini-pro',
      generatedAt: new Date().toISOString(),
      projectName: projectData.projectName,
      projectType: projectData.projectType,
      strengths: ['Multimodal capabilities', 'Large context window', 'Code understanding']
    };

    return validated;
  }
}