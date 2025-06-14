import express from 'express';
import { body, validationResult } from 'express-validator';
import { createLogger, format, transports } from 'winston';
import { GeminiService } from '../services/gemini.js';
import { OpenAIService } from '../services/openai.js';

const router = express.Router();
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'ai-routes' },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ]
});

// Initialize AI services
const openaiService = new OpenAIService();
const geminiService = new GeminiService();

// Validation middleware for tech recommendations
const validateTechRequest = [
  body('projectName').notEmpty().withMessage('Project name is required'),
  body('projectType').notEmpty().withMessage('Project type is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('budget').notEmpty().withMessage('Budget is required'),
  body('timeline').notEmpty().withMessage('Timeline is required'),
  body('teamSize').notEmpty().withMessage('Team size is required'),
  body('experience').notEmpty().withMessage('Experience level is required'),
  body('features').isArray().withMessage('Features must be an array'),
  body('aiProvider').optional().isIn(['openai', 'gemini']).withMessage('Invalid AI provider')
];

// Test endpoint
router.post('/test', async (req, res) => {
  try {
    logger.info('Test endpoint called with body:', req.body);
    res.json({ success: true, received: req.body });
  } catch (error) {
    logger.error('Test endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate tech recommendations
router.post('/recommendations', async (req, res) => {
  try {
    logger.info('Received recommendation request:', req.body);
    
    // Skip validation for now

    const projectData = req.body;
    const aiProvider = projectData.aiProvider || 'openai';

    logger.info(`Generating recommendations using ${aiProvider}`, {
      projectName: projectData.projectName,
      projectType: projectData.projectType
    });

    let recommendations;

    logger.info('About to call AI service:', aiProvider);

    // Route to appropriate AI service
    switch (aiProvider) {
      case 'openai':
        logger.info('Calling OpenAI service...');
        recommendations = await openaiService.generateRecommendations(projectData);
        logger.info('OpenAI service completed');
        break;
      case 'gemini':
        logger.info('Calling Gemini service...');
        recommendations = await geminiService.generateRecommendations(projectData);
        logger.info('Gemini service completed');
        break;
      default:
        return res.status(400).json({
          error: 'Invalid AI provider',
          message: 'Supported providers: openai, gemini'
        });
    }

    logger.info('AI service call completed, sending response');

    res.json({
      success: true,
      provider: aiProvider,
      data: recommendations,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error generating recommendations:', {
      error: error.message,
      stack: error.stack,
      projectData: req.body
    });

    // Handle specific AI service errors
    if (error.message.includes('API key')) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid or missing API key for the selected AI provider'
      });
    }

    if (error.message.includes('quota') || error.message.includes('rate limit')) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Please try again later'
      });
    }

    res.status(500).json({
      error: 'Failed to generate recommendations',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Compare recommendations from multiple AI providers
router.post('/recommendations/compare', validateTechRequest, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const projectData = req.body;
    const providers = req.body.providers || ['openai', 'gemini'];

    logger.info('Generating comparative recommendations', {
      projectName: projectData.projectName,
      providers
    });

    const results = {};
    const providerErrors = {};

    // Generate recommendations from multiple providers
    const promises = providers.map(async (provider) => {
      try {
        let service;
        switch (provider) {
          case 'openai':
            service = openaiService;
            break;
          case 'gemini':
            service = geminiService;
            break;

          default:
            throw new Error(`Unsupported provider: ${provider}`);
        }

        const recommendations = await service.generateRecommendations(projectData);
        results[provider] = recommendations;
      } catch (error) {
        logger.error(`Error with ${provider}:`, error.message);
        providerErrors[provider] = error.message;
      }
    });

    await Promise.allSettled(promises);

    // Return results even if some providers failed
    res.json({
      success: Object.keys(results).length > 0,
      results,
      errors: Object.keys(providerErrors).length > 0 ? providerErrors : undefined,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error in comparative analysis:', error);
    res.status(500).json({
      error: 'Failed to generate comparative recommendations',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get available AI providers and their status
router.get('/providers', (req, res) => {
  const providers = {
    openai: {
      available: !!process.env.OPENAI_API_KEY,
      name: 'OpenAI GPT',
      description: 'Advanced language model for comprehensive tech recommendations'
    },
    gemini: {
      available: !!process.env.GOOGLE_API_KEY,
      name: 'Google Gemini',
      description: 'Google\'s multimodal AI for diverse tech insights'
    },

  };

  res.json({
    providers,
    defaultProvider: 'openai',
    timestamp: new Date().toISOString()
  });
});

export default router;