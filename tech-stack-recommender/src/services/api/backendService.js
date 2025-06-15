// Backend API Service - Secure way to handle AI calls
class BackendAPIService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    this.timeout = 120000; // 2 minutes timeout for AI requests
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      }

      throw error;
    }
  }

  async generateRecommendations(projectData, aiProvider = 'openai') {
    try {
      console.log(`Generating recommendations using backend API with ${aiProvider}`);
      console.log('Request data:', projectData);
      
      const response = await this.makeRequest('/ai/recommendations', {
        method: 'POST',
        body: JSON.stringify({
          ...projectData,
          aiProvider
        }),
      });

      console.log('Backend response:', response);
      return response.data;
    } catch (error) {
      console.error('Backend API error:', error);
      
      // Provide more specific error messages
      if (error.message.includes('timeout')) {
        throw new Error('The AI service is taking too long to respond. This might be due to high demand. Please try again in a few minutes.');
      } else if (error.message.includes('connect')) {
        throw new Error('Unable to connect to the AI service. Please check your internet connection and try again.');
      } else if (error.message.includes('500')) {
        throw new Error('The AI service is currently experiencing issues. Please try again later.');
      } else {
        throw new Error(`Failed to generate recommendations: ${error.message}`);
      }
    }
  }

  async compareRecommendations(projectData, providers = ['openai', 'gemini']) {
    try {
      console.log('Generating comparative recommendations using backend API');
      
      const response = await this.makeRequest('/ai/recommendations/compare', {
        method: 'POST',
        body: JSON.stringify({
          ...projectData,
          providers
        }),
      });

      return response;
    } catch (error) {
      console.error('Backend API comparison error:', error);
      throw new Error(`Failed to compare recommendations: ${error.message}`);
    }
  }

  async getAvailableProviders() {
    try {
      const response = await this.makeRequest('/ai/providers');
      return response;
    } catch (error) {
      console.error('Error fetching providers:', error);
      throw new Error(`Failed to fetch available AI providers: ${error.message}`);
    }
  }

  async checkHealth() {
    try {
      const response = await this.makeRequest('/health');
      return response;
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'unhealthy', error: error.message };
    }
  }

  async checkDetailedHealth() {
    try {
      const response = await this.makeRequest('/health/detailed');
      return response;
    } catch (error) {
      console.error('Detailed health check failed:', error);
      return { status: 'unhealthy', error: error.message };
    }
  }
}

export default new BackendAPIService();