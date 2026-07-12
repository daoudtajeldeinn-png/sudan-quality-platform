import { useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { apiService } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Handle redirect result on mobile after returning from Google
    getRedirectResult(auth).then(result => {
      if (result?.user) {
        // user will be picked up by onAuthStateChanged below
      }
    }).catch(err => {
      if (err.code !== 'auth/no-redirect-operation') {
        setError(err.message);
      }
    });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // ✅ Show user IMMEDIATELY — don't wait for backend
        setUser(currentUser);
        setLoading(false);
        setError(null);

        // Sync with backend in background (non-blocking)
        apiService.registerUser({
          userId: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL
        }).then(tokenData => {
          setAuthToken(tokenData.token || null);
        }).catch(err => {
          console.warn('Backend sync (non-critical):', err.message);
          setAuthToken(null); // App still works without token
        });
      } else {
        setUser(null);
        setAuthToken(null);
        setLoading(false);
        setError(null);
      }
    });

    return unsubscribe;
  }, []);

  const isMobile = () => /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      if (isMobile()) {
        // Redirect flow for mobile — page will reload after Google auth
        await signInWithRedirect(auth, provider);
        // Nothing after this runs on mobile (page navigates away)
      } else {
        const result = await signInWithPopup(auth, provider);
        setLoading(false);
        return result.user;
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { user, authToken, loading, error, loginWithGoogle, logout };
};
