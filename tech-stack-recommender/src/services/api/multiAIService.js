// Multi-AI Service Integration
// This service can work with multiple AI providers directly from the frontend
// WARNING: Direct API calls expose keys in browser - use backend service for production

class MultiAIService {
  constructor() {
    this.providers = {
      openai: {
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        baseURL: 'https://api.openai.com/v1',
        model: 'gpt-3.5-turbo'
      },
      gemini: {
        apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta',
        model: 'gemini-pro'
      }
      // Note: Claude doesn't support direct browser calls due to CORS
    };
    this.timeout = 60000;
  }

  async generateRecommendations(projectData, provider = 'openai') {
    if (!this.providers[provider]) {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    if (!this.providers[provider].apiKey) {
      throw new Error(`API key not configured for ${provider}`);
    }

    try {
      console.log(`Generating recommendations using ${provider}`);
      
      switch (provider) {
        case 'openai':
          return await this.generateOpenAIRecommendations(projectData);
        case 'gemini':
          return await this.generateGeminiRecommendations(projectData);
        default:
          throw new Error(`Provider ${provider} not implemented`);
      }
    } catch (error) {
      console.error(`${provider} error:`, error);
      throw error;
    }
  }

  async generateOpenAIRecommendations(projectData) {
    const { apiKey, baseURL, model } = this.providers.openai;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are a Tech Stack Advisor. Provide detailed technology recommendations in JSON format.'
            },
            {
              role: 'user',
              content: this.buildPrompt(projectData)
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
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      const result = await response.json();
      const recommendations = JSON.parse(result.choices[0].message.content);
      
      // Force free cost estimates if budget is "Free"
      const isFree = projectData.budget?.includes('Free');
      if (isFree) {
        recommendations.estimatedCost = {
          development: 'Free (Self-developed)',
          hosting: 'Free (GitHub Pages, Netlify, Vercel, Railway free tier)',
          thirdParty: 'Free (Open source alternatives, free tiers of services)'
        };
      }
      
      recommendations.metadata = {
        provider: 'openai',
        model,
        generatedAt: new Date().toISOString(),
        usage: result.usage
      };

      return recommendations;
    } catch (error) {
      clearTimeout(timeoutId);
      throw this.handleError(error, 'openai');
    }
  }

  async generateGeminiRecommendations(projectData) {
    const { apiKey, baseURL, model } = this.providers.gemini;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${baseURL}/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${this.buildPrompt(projectData)}\n\nRespond with valid JSON only.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
      }

      const result = await response.json();
      const text = result.candidates[0].content.parts[0].text;
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in Gemini response');
      }

      const recommendations = JSON.parse(jsonMatch[0]);
      
      // Force free cost estimates if budget is "Free"
      const isFree = projectData.budget?.includes('Free');
      if (isFree) {
        recommendations.estimatedCost = {
          development: 'Free (Self-developed)',
          hosting: 'Free (GitHub Pages, Netlify, Vercel, Railway free tier)',
          thirdParty: 'Free (Open source alternatives, free tiers of services)'
        };
      }
      
      recommendations.metadata = {
        provider: 'gemini',
        model,
        generatedAt: new Date().toISOString(),
        usage: result.usageMetadata
      };

      return recommendations;
    } catch (error) {
      clearTimeout(timeoutId);
      throw this.handleError(error, 'gemini');
    }
  }

  async compareProviders(projectData, providers = ['openai', 'gemini']) {
    const results = {};
    const errors = {};

    console.log('Comparing recommendations from multiple providers:', providers);

    // Generate recommendations from each provider
    const promises = providers.map(async (provider) => {
      try {
        const recommendations = await this.generateRecommendations(projectData, provider);
        results[provider] = recommendations;
      } catch (error) {
        console.error(`Error with ${provider}:`, error.message);
        errors[provider] = error.message;
      }
    });

    await Promise.allSettled(promises);

    return {
      success: Object.keys(results).length > 0,
      results,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
      comparison: this.generateComparison(results),
      timestamp: new Date().toISOString()
    };
  }

  generateComparison(results) {
    if (Object.keys(results).length < 2) {
      return null;
    }

    const providers = Object.keys(results);
    const comparison = {
      frontend: {},
      backend: {},
      agreements: [],
      differences: []
    };

    // Compare frontend recommendations
    const frontendChoices = providers.map(p => results[p].frontend?.primary).filter(Boolean);
    if (frontendChoices.length > 1) {
      const uniqueChoices = [...new Set(frontendChoices)];
      if (uniqueChoices.length === 1) {
        comparison.agreements.push(`All providers recommend ${uniqueChoices[0]} for frontend`);
      } else {
        comparison.differences.push(`Frontend: ${providers.map(p => `${p} suggests ${results[p].frontend?.primary}`).join(', ')}`);
      }
    }

    // Compare backend recommendations
    const backendChoices = providers.map(p => results[p].backend?.primary).filter(Boolean);
    if (backendChoices.length > 1) {
      const uniqueChoices = [...new Set(backendChoices)];
      if (uniqueChoices.length === 1) {
        comparison.agreements.push(`All providers recommend ${uniqueChoices[0]} for backend`);
      } else {
        comparison.differences.push(`Backend: ${providers.map(p => `${p} suggests ${results[p].backend?.primary}`).join(', ')}`);
      }
    }

    return comparison;
  }

  buildPrompt(projectData) {
    return `
Analyze this project and provide comprehensive technology recommendations:

Project Details:
- Name: ${projectData.projectName}
- Type: ${projectData.projectType}
- Description: ${projectData.description}
- Budget: ${projectData.budget}
- Timeline: ${projectData.timeline}
- Team Size: ${projectData.teamSize}
- Experience Level: ${projectData.experience}
- Required Features: ${projectData.features.join(', ')}

Provide recommendations in this JSON structure:
{
  "frontend": {
    "primary": "recommended framework",
    "reasoning": "explanation",
    "libraries": ["lib1", "lib2", "lib3"]
  },
  "backend": {
    "primary": "recommended backend",
    "database": "recommended database",
    "reasoning": "explanation"
  },
  "devTools": {
    "versionControl": "Git",
    "deployment": "platform",
    "cicd": "solution"
  },
  "estimatedCost": {
    "development": "cost range or 'Free (Self-developed)' if budget is Free",
    "hosting": "monthly cost or 'Free (GitHub Pages, Netlify, Vercel, Railway free tier)' if budget is Free",
    "thirdParty": "monthly cost or 'Free (Open source alternatives, free tiers of services)' if budget is Free"
  },
  "roadmap": [
    {
      "phase": "name",
      "duration": "time",
      "tasks": ["task1", "task2"],
      "deliverables": ["item1", "item2"]
    }
  ],
  "githubTemplates": [
    {
      "name": "template name",
      "description": "description",
      "url": "github url"
    }
  ],
  "integrationWarnings": [
    {
      "tools": ["tool1", "tool2"],
      "issue": "issue",
      "solution": "solution"
    }
  ],
  "communityInsights": {
    "popularity": "High/Medium/Low",
    "marketDemand": "Growing/Stable/Declining",
    "trendingAlternatives": ["alt1", "alt2"]
  }
}`;
  }

  handleError(error, provider) {
    if (error.name === 'AbortError') {
      return new Error(`${provider} request timeout`);
    }

    if (error.message.includes('Failed to fetch')) {
      return new Error(`Network error connecting to ${provider}`);
    }

    return error;
  }

  // Check which providers are available
  getAvailableProviders() {
    const available = {};
    
    Object.keys(this.providers).forEach(provider => {
      available[provider] = {
        configured: !!this.providers[provider].apiKey,
        name: provider.charAt(0).toUpperCase() + provider.slice(1),
        model: this.providers[provider].model
      };
    });

    return available;
  }

  // Test API connections
  async testProviders() {
    const results = {};
    
    for (const [provider, config] of Object.entries(this.providers)) {
      if (!config.apiKey) {
        results[provider] = { success: false, message: 'API key not configured' };
        continue;
      }

      try {
        // Simple test request for each provider
        if (provider === 'openai') {
          const response = await fetch(`${config.baseURL}/models`, {
            headers: { 'Authorization': `Bearer ${config.apiKey}` }
          });
          results[provider] = { 
            success: response.ok, 
            message: response.ok ? 'Connected' : 'Authentication failed' 
          };
        } else if (provider === 'gemini') {
          const response = await fetch(`${config.baseURL}/models?key=${config.apiKey}`);
          results[provider] = { 
            success: response.ok, 
            message: response.ok ? 'Connected' : 'Authentication failed' 
          };
        }
      } catch (error) {
        results[provider] = { success: false, message: error.message };
      }
    }

    return results;
  }
}

export default new MultiAIService();