import {
  CogIcon,
  KeyIcon,
  ShieldCheckIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useState } from 'react';
import AIConfiguration from '../components/AIConfiguration';
import ChangePasswordModal from '../components/auth/ChangePasswordModal';
import useAuthStore from '../store/authStore';

const Settings = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('ai');
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [aiConfig, setAiConfig] = useState({
    useBackend: true,
    aiProvider: 'openai',
    useMockData: false,
    compareProviders: false
  });

  const tabs = [
    { id: 'ai', name: 'AI Configuration', icon: CogIcon },
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'api', name: 'API Keys', icon: KeyIcon },
  ];

  const handleAIConfigChange = (newConfig) => {
    setAiConfig(newConfig);
    // Save to localStorage or send to backend
    localStorage.setItem('aiConfig', JSON.stringify(newConfig));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Manage your account settings and AI integration preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'ai' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    AI Configuration
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Configure how the application connects to AI services for generating tech recommendations.
                  </p>
                </div>
                
                <AIConfiguration 
                  currentConfig={aiConfig}
                  onConfigChange={handleAIConfigChange}
                />

                {/* Current Configuration Summary */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Current Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Integration Method:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        {aiConfig.useMockData ? 'Mock Data' : 
                         aiConfig.useBackend ? 'Backend API' : 'Direct API'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">AI Provider:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400 capitalize">
                        {aiConfig.useMockData ? 'N/A' : aiConfig.aiProvider}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Compare Providers:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        {aiConfig.compareProviders ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Security Level:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        {aiConfig.useMockData ? 'Demo Mode' :
                         aiConfig.useBackend ? 'High (Server-side)' : 'Low (Client-side)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Profile Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.displayName || ''}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.email || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
                  </div>
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Password</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">Update your account password</p>
                    {user?.providerData?.[0]?.providerId === 'password' ? (
                      <button 
                        onClick={() => setIsChangePasswordModalOpen(true)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100"
                      >
                        Change Password
                      </button>
                    ) : (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          You signed in with {user?.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 'GitHub'}. 
                          Password changes must be done through your {user?.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 'GitHub'} account.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">API Keys</h2>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <ShieldCheckIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Security Notice</h3>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        For security reasons, we recommend using the backend API integration instead of storing API keys in the frontend.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      OpenAI API Key
                    </label>
                    <input
                      type="password"
                      placeholder="sk-..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Google Gemini API Key
                    </label>
                    <input
                      type="password"
                      placeholder="AI..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    These keys are only used for direct API integration (development mode).
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </div>
  );
};

export default Settings;