import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';

const AuthTest = () => {
  const { user, loading, signOut, enableDemoMode } = useAuthStore();
  const [authStatus, setAuthStatus] = useState('Checking...');

  useEffect(() => {
    if (loading) {
      setAuthStatus('Loading authentication...');
    } else if (user) {
      if (user.uid === 'demo-user') {
        setAuthStatus('✅ Demo Mode Active');
      } else {
        setAuthStatus('✅ User Authenticated');
      }
    } else {
      setAuthStatus('❌ Not Authenticated');
    }
  }, [user, loading]);

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg max-w-sm">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
        🔐 Auth Status
      </h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Status:</strong> {authStatus}
        </div>
        
        {user && (
          <>
            <div>
              <strong>User:</strong> {user.email || user.displayName || 'Demo User'}
            </div>
            <div>
              <strong>UID:</strong> {user.uid.substring(0, 8)}...
            </div>
          </>
        )}
        
        <div className="flex gap-2 mt-3">
          {!user && (
            <button
              onClick={enableDemoMode}
              className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
            >
              Demo Mode
            </button>
          )}
          
          {user && (
            <button
              onClick={signOut}
              className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthTest;