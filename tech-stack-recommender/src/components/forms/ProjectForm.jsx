import { XMarkIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import openaiService from '../../services/openai/openaiService';
import useProjectsStore from '../../store/projectsStore';

const projectSchema = z.object({
  projectName: z.string().min(2, 'Project name must be at least 2 characters'),
  developmentType: z.string().min(1, 'Please select development type'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  currency: z.string().min(1, 'Please select a currency'),
  budget: z.string().min(1, 'Please select a budget range'),
  timeline: z.string().min(1, 'Please select a timeline'),
  teamSize: z.string().min(1, 'Please select team size'),
  experience: z.string().min(1, 'Please select experience level'),
  features: z.array(z.string()).min(1, 'Please select at least one feature'),
});

const ProjectForm = ({ onClose }) => {
  const navigate = useNavigate();
  const { addProject } = useProjectsStore();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      currency: 'INR',
      features: [],
    },
  });

  const watchedFeatures = watch('features');
  const watchedCurrency = watch('currency');

  const developmentTypes = [
    'Frontend Only',
    'Backend Only',
    'Full Stack (Both Frontend & Backend)',
  ];

  const currencies = [
    { value: 'INR', label: 'Indian Rupee (₹)', symbol: '₹' }
  ];

  const budgetRanges = {
    INR: [
      'Free',
      'Under ₹1,00,000',
      '₹1,00,000 - ₹3,00,000',
      '₹3,00,000 - ₹6,00,000',
      '₹6,00,000 - ₹10,00,000',
      'Over ₹10,00,000',
    ]
  };

  const timelines = [
    '1-2 months',
    '3-6 months',
    '6-12 months',
    'Over 1 year',
  ];

  const teamSizes = [
    'Solo (1 person)',
    'Small team (2-5 people)',
    'Medium team (6-15 people)',
    'Large team (16+ people)',
  ];

  const experienceLevels = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert',
  ];

  const availableFeatures = [
    'User Authentication',
    'Real-time Updates',
    'Payment Processing',
    'File Upload/Storage',
    'Search Functionality',
    'Analytics/Reporting',
    'Social Media Integration',
    'Email Notifications',
    'Multi-language Support',
    'Offline Functionality',
    'Push Notifications',
    'Third-party Integrations',
    'Admin Dashboard',
    'API Development',
    'Database Management',
    'Mobile Responsive Design',
    'SEO Optimization',
    'Content Management',
    'E-commerce Features',
    'Data Visualization',
    'Machine Learning',
    'Automated Testing',
    'Performance Optimization',
  ];

  const handleFeatureChange = (feature) => {
    const currentFeatures = watchedFeatures || [];
    const updatedFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter((f) => f !== feature)
      : [...currentFeatures, feature];
    setValue('features', updatedFeatures);
  };

  const onSubmit = async (data) => {
    try {
      const recommendations = await openaiService.generateTechIQRecommendation(data);
      
      // Create project data
      const projectId = Date.now().toString();
      const projectData = {
        ...data,
        recommendations,
        id: projectId,
        createdAt: new Date().toISOString(),
        status: 'Planning', // Default status
      };

      // Save to localStorage
      localStorage.setItem(`project_${projectId}`, JSON.stringify(projectData));

      // Add to projects store
      addProject(projectData);

      toast.success('Project created successfully!');
      navigate(`/recommendations/${projectId}`);
      onClose();
    } catch (error) {
      toast.error('Failed to generate recommendations. Please try again.');
      console.error('Error creating project:', error);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-opacity" />

          <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                  Create New Project
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Project Name
                    </label>
                    <input
                      type="text"
                      {...register('projectName')}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="My Awesome Project"
                    />
                    {errors.projectName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.projectName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Development Type
                    </label>
                    <select
                      {...register('developmentType')}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select development type</option>
                      {developmentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.developmentType && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.developmentType.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Project Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Describe your project goals and requirements..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Currency
                    </label>
                    <select
                      {...register('currency')}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      onChange={(e) => {
                        setValue('currency', e.target.value);
                        setValue('budget', ''); // Reset budget when currency changes
                      }}
                    >
                      {currencies.map((currency) => (
                        <option key={currency.value} value={currency.value}>
                          {currency.label}
                        </option>
                      ))}
                    </select>
                    {errors.currency && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.currency.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Budget Range
                    </label>
                    <select
                      {...register('budget')}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select budget</option>
                      {budgetRanges['INR'].map((range) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                    {errors.budget && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.budget.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Timeline
                    </label>
                    <select
                      {...register('timeline')}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select timeline</option>
                      {timelines.map((timeline) => (
                        <option key={timeline} value={timeline}>
                          {timeline}
                        </option>
                      ))}
                    </select>
                    {errors.timeline && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.timeline.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Team Size
                    </label>
                    <select
                      {...register('teamSize')}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select team size</option>
                      {teamSizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    {errors.teamSize && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.teamSize.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Experience Level
                    </label>
                    <select
                      {...register('experience')}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select experience</option>
                      {experienceLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                    {errors.experience && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.experience.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Required Features
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableFeatures.map((feature) => (
                      <label key={feature} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={watchedFeatures?.includes(feature) || false}
                          onChange={() => handleFeatureChange(feature)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </label>
                    ))}
                  </div>
                  {errors.features && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.features.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400"
                  >
                    {isSubmitting ? 'Generating...' : 'Generate Recommendations'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectForm;
