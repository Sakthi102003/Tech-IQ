import {
    ArrowDownTrayIcon,
    ClockIcon,
    EyeIcon,
    FolderIcon,
    PlusIcon,
    ShareIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectForm from '../components/forms/ProjectForm';

import useAuthStore from '../store/authStore';
import useProjectsStore from '../store/projectsStore';
import { removeNotification, showErrorNotification, showLoadingNotification, showSuccessNotification } from '../utils/notifications';
import { downloadPDF, generateRecommendationsPDF } from '../utils/pdfGenerator';

const Dashboard = () => {
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const { user } = useAuthStore();
  const { projects, loading, loadProjects, deleteProject } = useProjectsStore();

  // Load projects when component mounts
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleProjectFormClose = () => {
    setIsProjectFormOpen(false);
    // Refresh projects list when form closes
    loadProjects();
  };

  const handleDeleteClick = (project) => {
    setDeleteConfirmation(project);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmation) {
      deleteProject(deleteConfirmation.id);
      setDeleteConfirmation(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation(null);
  };

  const handleShareProject = async (project) => {
    const shareUrl = `${window.location.origin}/recommendations/${project.id}`;
    
    try {
      // Try to use the Web Share API if available (mobile devices)
      if (navigator.share) {
        await navigator.share({
          title: `Tech Stack Recommendations for ${project.projectName || project.name}`,
          text: `Check out the tech stack recommendations for ${project.projectName || project.name}`,
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

  const handleDownloadPDF = async (project) => {
    let loadingNotification = null;
    
    try {
      // Show loading notification
      loadingNotification = showLoadingNotification('Generating PDF...');

      // Generate PDF
      const pdf = await generateRecommendationsPDF(project);
      
      // Create filename with project name and date
      const sanitizedProjectName = (project.projectName || project.name).replace(/[^a-z0-9]/gi, '_').toLowerCase();
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-8 border border-gray-100 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-0.5">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center transform transition-transform duration-300 hover:scale-110 hover:rotate-3">
            <span className="text-2xl text-white">👋</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Welcome back, {user?.displayName || 'Developer'}!
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Manage your projects and get technology recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setIsProjectFormOpen(true)}
          className="p-8 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-primary-500 transform hover:-translate-y-2 hover:scale-105 active:scale-95"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-4 transform transition-transform duration-300 hover:rotate-12">
            <PlusIcon className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">New Project</h3>
          <p className="text-primary-100 text-sm">
            Create a new project and get Tech IQ recommendations
          </p>
        </button>

        <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1 hover:scale-102 cursor-pointer"
             style={{
               transformStyle: 'preserve-3d',
             }}>
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4 transform transition-transform duration-300 hover:rotate-6">
            <FolderIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Active Projects</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {projects.length} projects in progress
          </p>
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Your Projects</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage and track your development projects</p>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No projects yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Get started by creating your first project and receiving personalized tech recommendations.
              </p>
              <button
                onClick={() => setIsProjectFormOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-all duration-200 transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg active:scale-95"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <PlusIcon className="h-4 w-4 mr-2 transform transition-transform duration-200 hover:rotate-90" />
                Create Your First Project
              </button>
            </div>
          ) : (
            projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-8 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Link
                        to={`/recommendations/${project.id}`}
                        className="text-xl font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        {project.projectName || project.name}
                      </Link>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 'In Progress' 
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                          : project.status === 'Completed'
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                    <div className="flex items-center space-x-6 mb-4">
                      <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        Updated {project.lastUpdated}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.stack && project.stack.length > 0 ? (
                        project.stack.map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            {tech}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400 dark:text-gray-500 italic">No tech stack available</span>
                      )}
                    </div>
                  </div>
                  <div className="ml-6 flex-shrink-0 flex items-center space-x-2">
                    <Link
                      to={`/recommendations/${project.id}`}
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200 transform hover:scale-110 hover:-translate-y-1 hover:shadow-md active:scale-95"
                      title="View project details"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <EyeIcon className="h-5 w-5 transform transition-transform duration-200 hover:rotate-12" />
                    </Link>
                    <button
                      onClick={() => handleDownloadPDF(project)}
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-all duration-200 transform hover:scale-110 hover:-translate-y-1 hover:shadow-md active:scale-95"
                      title="Download PDF"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <ArrowDownTrayIcon className="h-5 w-5 transform transition-transform duration-200 hover:-rotate-12" />
                    </button>
                    <button
                      onClick={() => handleShareProject(project)}
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100 text-primary-600 hover:bg-primary-200 transition-all duration-200 transform hover:scale-110 hover:-translate-y-1 hover:shadow-md active:scale-95"
                      title="Share project"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <ShareIcon className="h-5 w-5 transform transition-transform duration-200 hover:rotate-12" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(project)}
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200 transform hover:scale-110 hover:-translate-y-1 hover:shadow-md active:scale-95"
                      title="Delete project"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <TrashIcon className="h-5 w-5 transform transition-transform duration-200 hover:-rotate-12" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <TrashIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Delete Project</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete "{deleteConfirmation.projectName || deleteConfirmation.name}"? 
              This action cannot be undone and will permanently remove all project data and recommendations.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete Project
              </button>
            </div>
          </motion.div>
        </div>
      )}



      {/* Project Form Modal */}
      {isProjectFormOpen && (
        <ProjectForm onClose={handleProjectFormClose} />
      )}
    </div>
  );
};

export default Dashboard;
