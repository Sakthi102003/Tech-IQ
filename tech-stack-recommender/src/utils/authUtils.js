import { getRedirectResult, signInWithRedirect } from 'firebase/auth';
import { auth } from '../services/firebase';

/**
 * Utility function to handle redirect-based authentication as fallback
 * when popup authentication fails
 */
export const handleAuthRedirect = async (provider) => {
  try {
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error('Redirect authentication error:', error);
    throw error;
  }
};

/**
 * Handle redirect result after user returns from OAuth provider
 */
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    return result;
  } catch (error) {
    console.error('Redirect result error:', error);
    throw error;
  }
};

/**
 * Check if popup is likely to be blocked
 */
export const isPopupBlocked = () => {
  // Simple check - this is not 100% reliable but helps
  const popup = window.open('', '_blank', 'width=1,height=1');
  if (popup) {
    popup.close();
    return false;
  }
  return true;
};