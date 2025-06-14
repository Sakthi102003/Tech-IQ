// Direct OpenAI Integration with proper error handling
// WARNING: This exposes your API key in the browser - only use for development/testing
class DirectOpenAIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
    this.model = 'gpt-3.5-turbo';
    this.timeout = 60000; // 60 seconds for AI responses
  }

  async generateRecommendations(projectData) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
    }

    try {
      console.log('Generating recommendations using direct OpenAI API');
      
      const prompt = this.buildPrompt(projectData);
      const response = await this.makeOpenAIRequest(prompt);
      
      return this.parseResponse(response, projectData);
    } catch (error) {
      console.error('Direct OpenAI error:', error);
      throw this.handleOpenAIError(error);
    }
  }

  async makeOpenAIRequest(prompt) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a Tech Stack Advisor AI. Provide detailed, practical technology recommendations in JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2500,
          response_format: { type: "json_object" }
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(JSON.stringify(errorData));
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  buildPrompt(projectData) {
    return `
Analyze this project and provide comprehensive technology recommendations in JSON format:

Project Details:
- Name: ${projectData.projectName}
- Type: ${projectData.projectType}
- Description: ${projectData.description}
- Budget: ${projectData.budget}
- Timeline: ${projectData.timeline}
- Team Size: ${projectData.teamSize}
- Experience Level: ${projectData.experience}
- Required Features: ${projectData.features.join(', ')}

Provide recommendations in this exact JSON structure:
{
  "frontend": {
    "primary": "recommended framework",
    "reasoning": "detailed explanation",
    "libraries": ["lib1", "lib2", "lib3"]
  },
  "backend": {
    "primary": "recommended backend technology",
    "database": "recommended database",
    "reasoning": "detailed explanation"
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
}

Focus on practical, modern solutions that match the team's experience and budget.`;
  }

  parseResponse(response, projectData) {
    try {
      const content = response.choices[0].message.content;
      const recommendations = JSON.parse(content);
      
      // Force free cost estimates if budget is "Free"
      const isFree = projectData.budget?.includes('Free');
      if (isFree) {
        recommendations.estimatedCost = {
          development: 'Free (Self-developed)',
          hosting: 'Free (GitHub Pages, Netlify, Vercel, Railway free tier)',
          thirdParty: 'Free (Open source alternatives, free tiers of services)'
        };
      }
      
      // Add metadata
      recommendations.metadata = {
        provider: 'openai-direct',
        model: this.model,
        generatedAt: new Date().toISOString(),
        projectName: projectData.projectName,
        projectType: projectData.projectType,
        usage: response.usage
      };

      return recommendations;
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      throw new Error('Invalid response format from OpenAI. Please try again.');
    }
  }

  handleOpenAIError(error) {
    if (error.name === 'AbortError') {
      return new Error('Request timeout. The AI service took too long to respond.');
    }

    try {
      const errorData = JSON.parse(error.message);
      
      if (errorData.error) {
        const { type, code, message } = errorData.error;
        
        switch (type) {
          case 'invalid_request_error':
            if (code === 'invalid_api_key') {
              return new Error('Invalid OpenAI API key. Please check your configuration.');
            }
            return new Error(`Invalid request: ${message}`);
            
          case 'authentication_error':
            return new Error('Authentication failed. Please check your OpenAI API key.');
            
          case 'permission_error':
            return new Error('Permission denied. Your API key may not have access to this model.');
            
          case 'rate_limit_error':
            return new Error('Rate limit exceeded. Please wait a moment and try again.');
            
          case 'tokens_exceeded_error':
            return new Error('Token limit exceeded. Please try with a shorter description.');
            
          case 'quota_exceeded_error':
            return new Error('API quota exceeded. Please check your OpenAI billing.');
            
          case 'server_error':
            return new Error('OpenAI server error. Please try again in a few moments.');
            
          default:
            return new Error(`OpenAI API error: ${message}`);
        }
      }
    } catch (parseError) {
      // If we can't parse the error, return the original message
    }

    if (error.message.includes('Failed to fetch')) {
      return new Error('Network error. Please check your internet connection.');
    }

    return new Error(`OpenAI API error: ${error.message}`);
  }

  // Utility method to test API key
  async testConnection() {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'API key validation failed');
      }

      return { success: true, message: 'OpenAI API key is valid' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default new DirectOpenAIService();