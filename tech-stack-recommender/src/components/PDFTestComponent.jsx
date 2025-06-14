import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { removeNotification, showErrorNotification, showLoadingNotification, showSuccessNotification } from '../utils/notifications';
import { downloadPDF, generateRecommendationsPDF } from '../utils/pdfGenerator';

// Test component for PDF generation functionality
const PDFTestComponent = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Sample project data for testing
  const sampleProject = {
    id: 'test-project-1',
    projectName: 'Sample E-commerce Website',
    description: 'A modern e-commerce platform with user authentication, payment processing, and inventory management.',
    projectType: 'Web Application',
    budget: '$10,000 - $50,000',
    timeline: '3-6 months',
    teamSize: 'Small team (2-5 people)',
    experience: 'Intermediate',
    currency: 'USD',
    features: [
      'User Authentication',
      'Payment Processing',
      'Real-time Updates',
      'SEO Optimization',
      'File Upload/Storage',
      'Data Processing'
    ],
    recommendations: {
      frontend: {
        primary: 'Next.js (JavaScript)',
        reasoning: 'Server-side rendering with excellent SEO capabilities and flexible deployment options',
        libraries: ['next-seo', 'next-mdx-remote', 'tailwindcss', 'framer-motion', 'stripe']
      },
      backend: {
        primary: 'Node.js with Express',
        database: 'PostgreSQL',
        reasoning: 'Full control over e-commerce logic with robust payment and inventory management'
      },
      devTools: {
        versionControl: 'Git with GitHub',
        deployment: 'Vercel for frontend, Railway for backend',
        cicd: 'GitHub Actions'
      },
      timeline: {
        estimated: {
          weeks: 16,
          months: 4,
          range: {
            minimum: '12 weeks',
            maximum: '20 weeks'
          }
        },
        category: 'Medium Complexity',
        description: 'This project involves building a full-featured e-commerce platform with modern technologies.',
        breakdown: {
          planning: 2,
          development: 10,
          testing: 3,
          deployment: 1
        },
        milestones: [
          {
            week: 2,
            name: 'Project Setup & Planning',
            description: 'Complete project setup, database design, and development environment configuration'
          },
          {
            week: 6,
            name: 'Core Features Implementation',
            description: 'User authentication, product catalog, and basic shopping cart functionality'
          },
          {
            week: 12,
            name: 'Payment Integration',
            description: 'Complete payment processing integration and order management system'
          },
          {
            week: 15,
            name: 'Testing & Optimization',
            description: 'Comprehensive testing, performance optimization, and bug fixes'
          }
        ],
        riskFactors: [
          'Payment gateway integration complexity',
          'Third-party API dependencies',
          'Performance optimization for large product catalogs'
        ],
        recommendations: [
          'Start with MVP features and iterate',
          'Implement comprehensive testing early',
          'Plan for scalability from the beginning'
        ],
        bufferTime: {
          recommended: '20% additional time (3-4 weeks)',
          reason: 'Account for integration challenges and testing requirements'
        }
      },
      estimatedCost: {
        development: '$25,000 - $35,000',
        hosting: '$50 - $200/month',
        thirdParty: '$100 - $500/month'
      }
    },
    createdAt: new Date().toISOString(),
    lastUpdated: 'Today'
  };

  const handleTestPDFGeneration = async () => {
    let loadingNotification = null;
    setIsGenerating(true);

    try {
      // Show loading notification
      loadingNotification = showLoadingNotification('Generating test PDF...');

      // Generate PDF
      const pdf = await generateRecommendationsPDF(sampleProject);
      
      // Create filename
      const date = new Date().toISOString().split('T')[0];
      const filename = `test_pdf_generation_${date}.pdf`;
      
      // Download PDF
      downloadPDF(pdf, filename);
      
      // Remove loading notification
      if (loadingNotification) {
        removeNotification(loadingNotification);
      }
      
      // Show success notification
      showSuccessNotification('Test PDF generated successfully!');
      
    } catch (error) {
      console.error('Error generating test PDF:', error);
      
      // Remove loading notification if it exists
      if (loadingNotification) {
        removeNotification(loadingNotification);
      }
      
      // Show error notification
      showErrorNotification(`Failed to generate test PDF: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <ArrowDownTrayIcon className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">PDF Generation Test</h3>
          <p className="text-sm text-gray-600">Test the PDF download functionality with sample data</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Sample Project Details:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Project: {sampleProject.projectName}</li>
            <li>• Type: {sampleProject.projectType}</li>
            <li>• Budget: {sampleProject.budget}</li>
            <li>• Timeline: {sampleProject.timeline}</li>
            <li>• Features: {sampleProject.features.length} features included</li>
            <li>• Complete recommendations with timeline and cost analysis</li>
          </ul>
        </div>

        <button
          onClick={handleTestPDFGeneration}
          disabled={isGenerating}
          className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${
            isGenerating
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
          {isGenerating ? 'Generating PDF...' : 'Generate Test PDF'}
        </button>

        <div className="text-xs text-gray-500 text-center">
          This will generate a PDF with sample project data to test the functionality.
        </div>
      </div>
    </div>
  );
};

export default PDFTestComponent;