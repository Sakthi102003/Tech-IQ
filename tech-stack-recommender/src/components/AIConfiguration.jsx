import {
    CheckCircleIcon,
    CogIcon,
    ExclamationTriangleIcon,
    GlobeAltIcon,
    ServerIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

const AIConfiguration = ({ onConfigChange, currentConfig = {} }) => {
  const [config, setConfig] = useState({
    useBackend: true,
    aiProvider: 'openai',
    useMockData: false,
    compareProviders: false,
    ...currentConfig
  });
  
  const [backendStatus, setBackendStatus] = useState('checking');
  const [providerStatus, setProviderStatus] = useState({});

  useEffect(() => {
    checkBackendHealth();
    if (!config.useBackend) {
      checkProviderStatus();
    }
  }, [config.useBackend]);

  const checkBackendHealth = async () => {
    try {
      const { default: backendService } = await import('../services/api/backendService.js');
      const health = await backendService.checkHealth();
      setBackendStatus(health.status === 'healthy' ? 'healthy' : 'unhealthy');
    } catch (error) {
      console.error('Backend health check failed:', error);
      setBackendStatus('unhealthy');
    }
  };

  const checkProviderStatus = async () => {
    try {
      const { default: multiAIService } = await import('../services/api/multiAIService.js');
      const providers = multiAIService.getAvailableProviders();
      setProviderStatus(providers);
    } catch (error) {
      console.error('Provider status check failed:', error);
    }
  };

  const handleConfigChange = (newConfig) => {
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  const updateConfig = (key, value) => {
    const newConfig = { ...config, [key]: value };
    handleConfigChange(newConfig);
  };

  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'healthy':
      case true:
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'unhealthy':
      case false:
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <div className="h-5 w-5 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <CogIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Configuration</h3>
      </div>

      <div className="space-y-6">
        {/* Integration Method */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
            Integration Method
          </label>
          <div className="space-y-3">
            {/* Backend API Option */}
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="backend"
                  name="integration"
                  checked={config.useBackend && !config.useMockData}
                  onChange={() => handleConfigChange({ ...config, useBackend: true, useMockData: false })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex items-center space-x-2">
                  <ServerIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <label htmlFor="backend" className="font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                      Backend API (Recommended)
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Secure server-side AI calls</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <StatusIcon status={backendStatus} />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {backendStatus === 'checking' ? 'Checking...' : 
                   backendStatus === 'healthy' ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            {/* Direct API Option */}
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="direct"
                  name="integration"
                  checked={!config.useBackend && !config.useMockData}
                  onChange={() => handleConfigChange({ ...config, useBackend: false, useMockData: false })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex items-center space-x-2">
                  <GlobeAltIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <label htmlFor="direct" className="font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                      Direct API Calls
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Frontend-only integration</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                <span className="text-sm text-yellow-600 dark:text-yellow-400">Exposes API keys</span>
              </div>
            </div>

            {/* Mock Data Option */}
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="mock"
                  name="integration"
                  checked={config.useMockData}
                  onChange={() => handleConfigChange({ ...config, useMockData: true, useBackend: false })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <label htmlFor="mock" className="font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                    Mock Data
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Development/demo mode</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">Always available</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Provider Selection */}
        {!config.useMockData && (
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
              AI Provider
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {['openai', 'gemini'].map((provider) => {
                const isAvailable = config.useBackend || providerStatus[provider]?.configured;
                const isDisabled = !config.useBackend && !isAvailable;
                
                return (
                  <div
                    key={provider}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      config.aiProvider === provider
                        ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                        : isDisabled
                        ? 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 cursor-not-allowed'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                    onClick={() => !isDisabled && updateConfig('aiProvider', provider)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                          {provider === 'openai' ? 'OpenAI' : 
                           provider === 'gemini' ? 'Google Gemini' : 'Claude'}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {provider === 'openai' ? 'GPT-3.5/4' : 
                           provider === 'gemini' ? 'Gemini Pro' : 'Claude 3'}
                        </div>
                      </div>
                      {!config.useBackend && (
                        <StatusIcon status={providerStatus[provider]?.configured} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Advanced Options */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
            Advanced Options
          </label>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={config.compareProviders}
                onChange={(e) => updateConfig('compareProviders', e.target.checked)}
                disabled={config.useMockData}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
              />
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-100">Compare Providers</span>
                <p className="text-sm text-gray-600 dark:text-gray-300">Get recommendations from multiple AI services</p>
              </div>
            </label>
          </div>
        </div>

        {/* Warnings */}
        {!config.useBackend && !config.useMockData && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Security Warning</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Direct API calls expose your API keys in the browser. Only use this for development/testing.
                  For production, use the backend API option.
                </p>
              </div>
            </div>
          </div>
        )}

        {backendStatus === 'unhealthy' && config.useBackend && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200">Backend Unavailable</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  The backend API server is not running. Please start the backend server or switch to direct API calls.
                </p>
                <div className="mt-2">
                  <code className="text-xs bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                    cd backend && npm run dev
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIConfiguration;