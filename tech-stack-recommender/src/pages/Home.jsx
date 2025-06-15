import {
  ChartBarIcon,
  ClockIcon,
  CogIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

import { Link } from 'react-router-dom';
import AuthTest from '../components/AuthTest';
import { auth } from '../services/firebase';
import useAuthStore from '../store/authStore';

const features = [
  {
    name: 'AI-Powered Recommendations',
    description:
      'Get intelligent Tech IQ suggestions based on your project requirements, team size, and budget.',
    icon: RocketLaunchIcon,
  },
  {
    name: 'Cost Estimation',
    description:
      'Accurate development and maintenance cost projections to help you plan your project budget.',
    icon: ChartBarIcon,
  },
  {
    name: 'Integration Analysis',
    description:
      'Identify potential integration challenges and get solutions before you start development.',
    icon: CogIcon,
  },
  {
    name: 'Development Roadmap',
    description:
      'Get a detailed project timeline with milestones and implementation phases.',
    icon: ClockIcon,
  },
];

const Home = () => {
  const { user, loading, enableDemoMode } = useAuthStore();

  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 py-12 md:py-16 lg:py-20 xl:py-24">
            <div>
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl lg:text-7xl">
                  <span className="block mb-2">Build better with</span>
                  <span className="block text-primary-600 dark:text-primary-400">
                    intelligent Tech IQ choices
                  </span>
                </h1>
                <p className="mt-8 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Get AI-powered Tech IQ recommendations tailored to your project's needs. 
                  Make informed decisions about frameworks, tools, and infrastructure.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                  {!loading && (
                    user ? (
                      // Show dashboard button for authenticated users
                      <Link
                        to="/dashboard"
                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 shadow-sm hover:shadow-lg transition-all duration-200"
                      >
                        Go to Dashboard
                      </Link>
                    ) : (
                      // Show registration and login buttons for non-authenticated users
                      <>
                        {auth ? (
                          // Firebase is configured - show normal auth buttons
                          <>
                            <Link
                              to="/register"
                              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 shadow-sm hover:shadow-lg transition-all duration-200"
                            >
                              Get Started
                            </Link>
                            <Link
                              to="/login"
                              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10 transition-all duration-200"
                            >
                              Sign In
                            </Link>
                          </>
                        ) : (
                          // Firebase not configured - show demo mode
                          <div className="flex flex-col items-center gap-4">
                            <button
                              onClick={enableDemoMode}
                              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 shadow-sm hover:shadow-lg transition-all duration-200"
                            >
                              Try Demo Mode
                            </button>
                            <div className="text-center">
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Authentication is not configured. Try the demo to explore features.
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                ✨ Intelligent recommendations powered by AI
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase mb-3">
              Features
            </h2>
            <p className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-5xl mb-6">
              Make better technology decisions
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Our AI-powered platform helps you choose the right technologies for your
              project's success.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className="relative"
                >
                  <dt className="flex items-center mb-4">
                    <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg">
                      <feature.icon className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <p className="ml-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {feature.name}
                    </p>
                  </dt>
                  <dd className="ml-20 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div id="how-it-works" className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase mb-3">
              How it Works
            </h2>
            <p className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-5xl mb-6">
              Simple process, powerful results
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Our AI analyzes your project requirements and recommends the best technology stack.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 gap-8">
              <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 flex h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 justify-center items-center text-xl font-bold">1</div>
                  <h3 className="ml-4 text-xl font-medium text-gray-900 dark:text-gray-100">Describe your project</h3>
                </div>
                <p className="ml-16 text-gray-600 dark:text-gray-300">Tell us about your project's goals, scope, and requirements.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 flex h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 justify-center items-center text-xl font-bold">2</div>
                  <h3 className="ml-4 text-xl font-medium text-gray-900 dark:text-gray-100">AI analysis</h3>
                </div>
                <p className="ml-16 text-gray-600 dark:text-gray-300">Our AI analyzes your requirements and matches them with the best technologies.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 flex h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 justify-center items-center text-xl font-bold">3</div>
                  <h3 className="ml-4 text-xl font-medium text-gray-900 dark:text-gray-100">Get recommendations</h3>
                </div>
                <p className="ml-16 text-gray-600 dark:text-gray-300">Receive detailed tech stack recommendations with explanations and trade-offs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase mb-3">
              Pricing
            </h2>
            <p className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-5xl mb-6">
              Free during Beta
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              We're currently in beta and all features are available for free while we gather feedback.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border-2 border-primary-500 dark:border-primary-400">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Beta Access</h3>
                <p className="mt-4 text-4xl font-bold text-primary-600 dark:text-primary-400">Free</p>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Full access to all features during our beta period</p>
              </div>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-3 text-lg text-gray-700 dark:text-gray-300">Unlimited recommendations</span>
                </div>
                <div className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-3 text-lg text-gray-700 dark:text-gray-300">Advanced analytics</span>
                </div>
                <div className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-3 text-lg text-gray-700 dark:text-gray-300">Priority support</span>
                </div>
                <div className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-3 text-lg text-gray-700 dark:text-gray-300">Opportunity to shape our product</span>
                </div>
              </div>
              
              <div className="mt-10">
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 text-center">Paid plans will be introduced in the future, but early beta users will receive special benefits.</p>
                {!loading && (
                  user ? (
                    <Link to="/dashboard" className="block w-full bg-primary-600 text-white rounded-lg py-3 px-4 text-center font-medium hover:bg-primary-700 transition-colors shadow-md">
                      Go to Dashboard
                    </Link>
                  ) : auth ? (
                    <Link to="/register" className="block w-full bg-primary-600 text-white rounded-lg py-3 px-4 text-center font-medium hover:bg-primary-700 transition-colors shadow-md">
                      Join the Beta
                    </Link>
                  ) : (
                    <button 
                      onClick={enableDemoMode}
                      className="block w-full bg-primary-600 text-white rounded-lg py-3 px-4 text-center font-medium hover:bg-primary-700 transition-colors shadow-md"
                    >
                      Try Demo Mode
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase mb-3">
              FAQ
            </h2>
            <p className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-5xl mb-6">
              Frequently asked questions
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Find answers to common questions about our platform.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">How accurate are the AI recommendations?</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Our AI recommendations are based on analyzing thousands of successful projects and technology combinations. We continuously train our models with the latest industry data to provide up to 95% accuracy in our recommendations.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Can I export the recommendations?</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Yes, all recommendations can be exported as PDF reports or shared directly with team members through our collaboration features.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Do you offer refunds?</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied with our service, contact our support team for a full refund.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">How do I get started?</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Simply create a free account, describe your project requirements, and our AI will generate your first recommendation within minutes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-2xl mx-auto text-center py-16 sm:py-20">
            {!loading && (
              user ? (
                <>
                  <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                    <span className="block">Welcome back!</span>
                    <span className="block">Ready to create your next project?</span>
                  </h2>
                  <p className="mt-4 text-lg leading-6 text-primary-200">
                    Continue building amazing projects with AI-powered technology recommendations.
                  </p>
                  <Link
                    to="/dashboard"
                    className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto"
                  >
                    Go to Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                    <span className="block">Ready to get started?</span>
                    <span className="block">Create your account today.</span>
                  </h2>
                  <p className="mt-4 text-lg leading-6 text-primary-200">
                    Join thousands of developers making informed technology choices with our
                    AI-powered recommendations.
                  </p>
                  <Link
                    to="/register"
                    className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto"
                  >
                    Sign up for free
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </div>
      
      {/* Auth Test Component (Development Only) */}
      {process.env.NODE_ENV === 'development' && <AuthTest />}
    </div>
  );
};

export default Home;
