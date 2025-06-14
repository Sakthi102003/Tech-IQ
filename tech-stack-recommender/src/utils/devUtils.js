// Development utilities - only for testing purposes

/**
 * Clear all projects from localStorage
 * Use this in browser console: window.clearAllProjects()
 */
export const clearAllProjects = () => {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('project_')) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  console.log(`Cleared ${keysToRemove.length} projects from localStorage`);
  
  // Reload the page to refresh the UI
  window.location.reload();
};

/**
 * List all projects in localStorage
 */
export const listAllProjects = () => {
  const projects = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('project_')) {
      try {
        const projectData = localStorage.getItem(key);
        if (projectData) {
          projects.push(JSON.parse(projectData));
        }
      } catch (error) {
        console.error(`Error parsing project ${key}:`, error);
      }
    }
  }
  
  console.log('Projects in localStorage:', projects);
  return projects;
};

// Make functions available globally in development
if (process.env.NODE_ENV === 'development') {
  window.clearAllProjects = clearAllProjects;
  window.listAllProjects = listAllProjects;
}