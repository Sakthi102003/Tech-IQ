import { useState } from 'react';
import openaiService from '../services/openai/openaiService';

const TestRecommendations = () => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const testProjects = [
    {
      projectName: "E-commerce Mobile App",
      projectType: "Mobile App",
      description: "A mobile app for online shopping with real-time notifications",
      budget: "Under $5,000",
      timeline: "3-6 months",
      teamSize: "Small team (2-5 people)",
      experience: "Intermediate",
      features: ["User Authentication", "Payment Processing", "Push Notifications", "Real-time Updates"],
      currency: "USD"
    },
    {
      projectName: "Corporate Dashboard",
      projectType: "Web Application",
      description: "Analytics dashboard for business intelligence",
      budget: "$15,000 - $50,000",
      timeline: "6-12 months",
      teamSize: "Medium team (6-15 people)",
      experience: "Advanced",
      features: ["User Authentication", "Analytics/Reporting", "Admin Dashboard", "API Development"],
      currency: "USD"
    },
    {
      projectName: "Budget Tracker",
      projectType: "Web Application",
      description: "Personal finance management tool",
      budget: "Free",
      timeline: "1-2 months",
      teamSize: "Solo (1 person)",
      experience: "Beginner",
      features: ["User Authentication", "File Upload/Storage", "Analytics/Reporting"],
      currency: "INR"
    }
  ];

  const runTests = async () => {
    setIsLoading(true);
    const results = [];

    for (const project of testProjects) {
      try {
        const recommendations = await openaiService.generateTechIQRecommendation(project, { useMockData: true });
        results.push({
          project: project.projectName,
          frontend: recommendations.frontend.primary,
          backend: recommendations.backend.primary,
          database: recommendations.backend.database,
          success: true
        });
      } catch (error) {
        results.push({
          project: project.projectName,
          error: error.message,
          success: false
        });
      }
    }

    setTestResults(results);
    setIsLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Dynamic Recommendations Test</h2>
      
      <button
        onClick={runTests}
        disabled={isLoading}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Running Tests...' : 'Test Dynamic Recommendations'}
      </button>

      {testResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Test Results:</h3>
          
          {testResults.map((result, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h4 className="font-semibold text-lg">{result.project}</h4>
              
              {result.success ? (
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Frontend:</strong> {result.frontend}
                  </div>
                  <div>
                    <strong>Backend:</strong> {result.backend}
                  </div>
                  <div>
                    <strong>Database:</strong> {result.database}
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-red-600">
                  <strong>Error:</strong> {result.error}
                </div>
              )}
            </div>
          ))}
          
          {/* Check if results are different */}
          {testResults.length > 1 && testResults.every(r => r.success) && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800">Uniqueness Check:</h4>
              <div className="mt-2 text-sm text-green-700">
                {testResults.some((result, index) => 
                  index > 0 && (
                    result.frontend !== testResults[0].frontend ||
                    result.backend !== testResults[0].backend ||
                    result.database !== testResults[0].database
                  )
                ) ? (
                  <span className="text-green-600">✅ Recommendations are unique for different projects!</span>
                ) : (
                  <span className="text-red-600">❌ All recommendations are the same (issue not fixed)</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestRecommendations;