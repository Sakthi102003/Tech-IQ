import {
    createUserWithEmailAndPassword,
    EmailAuthProvider,
    signOut as firebaseSignOut,
    getRedirectResult,
    onAuthStateChanged,
    reauthenticateWithCredential,
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    updatePassword,
} from 'firebase/auth';
import toast from 'react-hot-toast';
import { create } from 'zustand';
import { auth, githubProvider, googleProvider } from '../services/firebase';

const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,

  initializeAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
    
    // Check for redirect result on app initialization
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          set({ user: result.user, loading: false });
          toast.success('Successfully signed in!');
        }
      })
      .catch((error) => {
        console.error('Redirect result error:', error);
        set({ loading: false });
      });
    
    return unsubscribe;
  },

  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      set({ user: userCredential.user, loading: false });
      toast.success('Successfully signed in!');
      return userCredential.user;
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message);
      throw error;
    }
  },

  signUp: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      set({ user: userCredential.user, loading: false });
      toast.success('Account created successfully!');
      return userCredential.user;
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      set({ user: null });
      toast.success('Successfully signed out!');
    } catch (error) {
      set({ error: error.message });
      toast.error(error.message);
      throw error;
    }
  },

  updateProfile: async (displayName) => {
    try {
      if (auth.currentUser) {
        await auth.currentUser.updateProfile({ displayName });
        set({ user: auth.currentUser });
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      set({ error: error.message });
      toast.error(error.message);
      throw error;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      set({ loading: true, error: null });
      
      if (!auth.currentUser) {
        throw new Error('No user is currently signed in');
      }

      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update password
      await updatePassword(auth.currentUser, newPassword);
      
      set({ loading: false });
      toast.success('Password updated successfully!');
    } catch (error) {
      set({ error: error.message, loading: false });
      
      // Handle specific error cases
      if (error.code === 'auth/wrong-password') {
        toast.error('Current password is incorrect');
      } else if (error.code === 'auth/weak-password') {
        toast.error('New password is too weak. Please choose a stronger password.');
      } else if (error.code === 'auth/requires-recent-login') {
        toast.error('Please sign out and sign in again before changing your password');
      } else {
        toast.error('Failed to change password. Please try again.');
      }
      throw error;
    }
  },

  resetError: () => set({ error: null }),

  // Google sign-in method
  signInWithGoogle: async (useRedirect = false) => {
    try {
      set({ loading: true, error: null });
      
      if (useRedirect) {
        // Use redirect method as fallback
        await signInWithRedirect(auth, googleProvider);
        // Note: redirect will reload the page, so we don't set loading to false here
        return;
      } else {
        // Try popup method first
        const result = await signInWithPopup(auth, googleProvider);
        set({ user: result.user, loading: false });
        toast.success('Successfully signed in with Google!');
        return result.user;
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      
      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        toast.error('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        // Suggest redirect method for popup blocked
        toast.error('Popup was blocked. Redirecting to Google sign-in...');
        setTimeout(() => {
          get().signInWithGoogle(true); // Retry with redirect
        }, 1000);
        return;
      } else if (error.code === 'auth/network-request-failed') {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error('Failed to sign in with Google. Please try again.');
      }
      throw error;
    }
  },

  // GitHub sign-in method
  signInWithGitHub: async (useRedirect = false) => {
    try {
      set({ loading: true, error: null });
      
      if (useRedirect) {
        // Use redirect method as fallback
        await signInWithRedirect(auth, githubProvider);
        // Note: redirect will reload the page, so we don't set loading to false here
        return;
      } else {
        // Try popup method first
        const result = await signInWithPopup(auth, githubProvider);
        set({ user: result.user, loading: false });
        toast.success('Successfully signed in with GitHub!');
        return result.user;
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      
      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        toast.error('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        // Suggest redirect method for popup blocked
        toast.error('Popup was blocked. Redirecting to GitHub sign-in...');
        setTimeout(() => {
          get().signInWithGitHub(true); // Retry with redirect
        }, 1000);
        return;
      } else if (error.code === 'auth/network-request-failed') {
        toast.error('Network error. Please check your connection and try again.');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        toast.error('An account already exists with the same email address but different sign-in credentials.');
      } else {
        toast.error('Failed to sign in with GitHub. Please try again.');
      }
      throw error;
    }
  },
}));

export default useAuthStore;
