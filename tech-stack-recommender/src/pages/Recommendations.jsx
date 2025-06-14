import {
  ArrowDownTrayIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  LinkIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useProjectsStore from '../store/projectsStore';
import { removeNotification, showErrorNotification, showLoadingNotification, showSuccessNotification } from '../utils/notifications';
import { downloadPDF, generateRecommendationsPDF } from '../utils/pdfGenerator';

const Recommendations = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { projects, loadProjects } = useProjectsStore();

  useEffect(() => {
    // Load projects if not already loaded
    if (projects.length === 0) {
      loadProjects();
    }
    
    // Find the project by ID
    const foundProject = projects.find(p => p.id === id);
    if (foundProject) {
      setProject(foundProject);
    } else {
      // Fallback to localStorage if not found in store
      const projectData = localStorage.getItem(`project_${id}`);
      if (projectData) {
        setProject(JSON.parse(projectData));
      }
    }
  }, [id, projects, loadProjects]);

  const handleShareProject = async () => {
    const shareUrl = window.location.href;
    
    try {
      // Try to use the Web Share API if available (mobile devices)
      if (navigator.share) {
        await navigator.share({
          title: `Tech Stack Recommendations for ${project.projectName}`,
          text: `Check out the tech stack recommendations for ${project.projectName}`,
          url: shareUrl,
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        showSuccessNotification('Share link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing project:', error);
      showErrorNotification('Failed to share project. Please try again.');
    }
  };

  const handleDownloadPDF = async () => {
    let loadingNotification = null;
    
    try {
      // Show loading notification
      loadingNotification = showLoadingNotification('Generating PDF...');

      // Generate PDF
      const pdf = await generateRecommendationsPDF(project);
      
      // Create filename with project name and date
      const sanitizedProjectName = project.projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const date = new Date().toISOString().split('T')[0];
      const filename = `${sanitizedProjectName}_recommendations_${date}.pdf`;
      
      // Download PDF
      downloadPDF(pdf, filename);
      
      // Remove loading notification
      if (loadingNotification) {
        removeNotification(loadingNotification);
      }
      
      // Show success notification
      showSuccessNotification('PDF downloaded successfully!');
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      
      // Remove loading notification if it exists
      if (loadingNotification) {
        removeNotification(loadingNotification);
      }
      
      // Show error notification
      showErrorNotification('Failed to generate PDF. Please try again.');
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'timeline', label: 'Timeline', icon: ClockIcon },
    { id: 'cost', label: 'Cost Analysis', icon: CurrencyDollarIcon },
  ];

  const renderTabContent = () => {
    const { recommendations } = project;

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Frontend Stack
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-primary-600">
                      {recommendations.frontend.primary}
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {recommendations.frontend.reasoning}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Key Libraries:</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {recommendations.frontend.libraries.map((lib) => (
                        <span
                          key={lib}
                          className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded-full"
                        >
                          {lib}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Backend Stack
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-primary-600">
                      {recommendations.backend.primary}
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {recommendations.backend.reasoning}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Database:</h4>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {recommendations.backend.database}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                DevOps & Deployment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300">Version Control</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {recommendations.devTools.versionControl}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300">Deployment</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {recommendations.devTools.deployment}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300">CI/CD</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {recommendations.devTools.cicd}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className="space-y-6">
            {/* Timeline Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card text-center">
                <ClockIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Duration</h3>
                <p className="text-2xl font-bold text-primary-600 mt-2">
                  {recommendations.timeline?.estimated?.weeks || 'N/A'} weeks
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  ({recommendations.timeline?.estimated?.months || 'N/A'} months)
                </p>
              </div>
              <div className="card text-center">
                <ChartBarIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Category</h3>
                <p className="text-xl font-bold text-green-600 mt-2">
                  {recommendations.timeline?.category || 'N/A'}
                </p>
              </div>
              <div className="card text-center">
                <LinkIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Range</h3>
                <p className="text-sm font-medium text-blue-600 mt-2">
                  {recommendations.timeline?.estimated?.range?.minimum || 'N/A'} - {recommendations.timeline?.estimated?.range?.maximum || 'N/A'}
                </p>
              </div>
            </div>

            {/* Timeline Description */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Timeline Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {recommendations.timeline?.description || 'No timeline description available.'}
              </p>
            </div>

            {/* Time Breakdown */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Phase Breakdown
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {recommendations.timeline?.breakdown?.planning || 0}
                  </div>
                  <div className="text-sm text-blue-800 dark:text-blue-300 font-medium">Planning</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">weeks</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {recommendations.timeline?.breakdown?.development || 0}
                  </div>
                  <div className="text-sm text-green-800 dark:text-green-300 font-medium">Development</div>
                  <div className="text-xs text-green-600 dark:text-green-400">weeks</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {recommendations.timeline?.breakdown?.testing || 0}
                  </div>
                  <div className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">Testing</div>
                  <div className="text-xs text-yellow-600 dark:text-yellow-400">weeks</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {recommendations.timeline?.breakdown?.deployment || 0}
                  </div>
                  <div className="text-sm text-purple-800 dark:text-purple-300 font-medium">Deployment</div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">weeks</div>
                </div>
              </div>
            </div>

            {/* Milestones */}
            {recommendations.timeline?.milestones && recommendations.timeline.milestones.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Key Milestones
                </h3>
                <div className="space-y-4">
                  {recommendations.timeline.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-300 font-bold text-sm">W{milestone.week}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{milestone.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{milestone.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risk Factors */}
            {recommendations.timeline?.riskFactors && recommendations.timeline.riskFactors.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Risk Factors
                </h3>
                <div className="space-y-2">
                  {recommendations.timeline.riskFactors.map((risk, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{risk}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline Recommendations */}
            {recommendations.timeline?.recommendations && recommendations.timeline.recommendations.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Timeline Recommendations
                </h3>
                <div className="space-y-2">
                  {recommendations.timeline.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Buffer Time */}
            {recommendations.timeline?.bufferTime && (
              <div className="card bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                  Recommended Buffer Time
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 font-medium">
                  {recommendations.timeline.bufferTime.recommended}
                </p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                  {recommendations.timeline.bufferTime.reason}
                </p>
              </div>
            )}
          </div>
        );

      case 'cost':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card text-center">
                <CurrencyDollarIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Development</h3>
                <p className="text-2xl font-bold text-primary-600 mt-2">
                  {recommendations.estimatedCost.development}
                </p>
              </div>
              <div className="card text-center">
                <ChartBarIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Hosting</h3>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  {recommendations.estimatedCost.hosting}
                </p>
              </div>
              <div className="card text-center">
                <LinkIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Third-party</h3>
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  {recommendations.estimatedCost.thirdParty}
                </p>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Cost Breakdown Analysis
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-300">Initial Development</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{recommendations.estimatedCost.development}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-300">Monthly Hosting</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{recommendations.estimatedCost.hosting}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-300">Third-party Services</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{recommendations.estimatedCost.thirdParty}</span>
                </div>
              </div>
            </div>
          </div>
        );







      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{project.projectName}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm rounded-full">
                {project.projectType}
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full">
                {project.budget}
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full">
                {project.timeline}
              </span>
            </div>
          </div>
          <div className="ml-4 flex space-x-3">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Download PDF
            </button>
            <button
              onClick={handleShareProject}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ShareIcon className="h-5 w-5 mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'}
              `}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
};

export default Recommendations;
