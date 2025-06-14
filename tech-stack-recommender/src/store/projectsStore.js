import { create } from 'zustand';

const useProjectsStore = create((set, get) => ({
      projects: [],
      loading: false,
      error: null,

      // Load projects from localStorage
      loadProjects: () => {
        try {
          set({ loading: true, error: null });
          const projects = [];
          
          // Get all localStorage keys that start with 'project_'
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('project_')) {
              try {
                const projectData = localStorage.getItem(key);
                if (projectData) {
                  const project = JSON.parse(projectData);
                  projects.push({
                    ...project,
                    lastUpdated: get().formatLastUpdated(project.createdAt),
                    status: project.status || 'Planning', // Default status
                    stack: get().extractTechStack(project.recommendations),
                  });
                }
              } catch (error) {
                console.error(`Error parsing project ${key}:`, error);
              }
            }
          }
          
          // Sort projects by creation date (newest first)
          projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          
          set({ projects, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          console.error('Error loading projects:', error);
        }
      },

      // Add a new project
      addProject: (projectData) => {
        const projects = get().projects;
        const newProject = {
          ...projectData,
          lastUpdated: 'Just now',
          status: projectData.status || 'Planning',
          stack: get().extractTechStack(projectData.recommendations),
        };
        
        set({ projects: [newProject, ...projects] });
      },

      // Update project status
      updateProjectStatus: (projectId, status) => {
        const projects = get().projects.map(project =>
          project.id === projectId ? { ...project, status } : project
        );
        set({ projects });
        
        // Also update in localStorage
        try {
          const projectData = localStorage.getItem(`project_${projectId}`);
          if (projectData) {
            const project = JSON.parse(projectData);
            project.status = status;
            localStorage.setItem(`project_${projectId}`, JSON.stringify(project));
          }
        } catch (error) {
          console.error('Error updating project status in localStorage:', error);
        }
      },

      // Delete a project
      deleteProject: (projectId) => {
        const projects = get().projects.filter(project => project.id !== projectId);
        set({ projects });
        
        // Also remove from localStorage
        try {
          localStorage.removeItem(`project_${projectId}`);
        } catch (error) {
          console.error('Error deleting project from localStorage:', error);
        }
      },

      // Helper function to format last updated time
      formatLastUpdated: (createdAt) => {
        if (!createdAt) return 'Unknown';
        
        const now = new Date();
        const created = new Date(createdAt);
        const diffInMs = now - created;
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        if (diffInDays === 1) return '1 day ago';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 14) return '1 week ago';
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        if (diffInDays < 60) return '1 month ago';
        return `${Math.floor(diffInDays / 30)} months ago`;
      },

      // Helper function to extract tech stack from recommendations
      extractTechStack: (recommendations) => {
        if (!recommendations || !recommendations.techStack) return [];
        
        try {
          // Extract main technologies from the recommendations
          const stack = [];
          
          if (recommendations.techStack.frontend) {
            stack.push(...recommendations.techStack.frontend.slice(0, 2)); // Take first 2
          }
          if (recommendations.techStack.backend) {
            stack.push(...recommendations.techStack.backend.slice(0, 2)); // Take first 2
          }
          if (recommendations.techStack.database) {
            stack.push(...recommendations.techStack.database.slice(0, 1)); // Take first 1
          }
          
          // Remove duplicates and limit to 4 items
          return [...new Set(stack)].slice(0, 4);
        } catch (error) {
          console.error('Error extracting tech stack:', error);
          return [];
        }
      },

      // Clear all projects
      clearProjects: () => {
        set({ projects: [], error: null });
        
        // Also clear from localStorage
        try {
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('project_')) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach(key => localStorage.removeItem(key));
        } catch (error) {
          console.error('Error clearing projects from localStorage:', error);
        }
      },

      // Get project by ID
      getProjectById: (projectId) => {
        return get().projects.find(project => project.id === projectId);
      },

      // Reset error
      resetError: () => set({ error: null }),
    }));

export default useProjectsStore;