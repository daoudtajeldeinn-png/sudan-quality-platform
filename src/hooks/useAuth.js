import { useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { apiService } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe = () => {};

    const init = async () => {
      try {
        // Must await redirect result FIRST before setting up auth listener
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log('[Auth] Redirect result received:', result.user.email);
        }
      } catch (err) {
        console.warn('[Auth] getRedirectResult error:', err.code, err.message);
        if (err.code !== 'auth/no-redirect-operation') {
          setError(err.message);
        }
      }

      // Now set up the auth state listener
      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setLoading(false);
          setError(null);

          apiService.registerUser({
            userId: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          }).then(tokenData => {
            setAuthToken(tokenData.token || null);
          }).catch(err => {
            console.warn('Backend sync (non-critical):', err.message);
            setAuthToken(null);
          });
        } else {
          setUser(null);
          setAuthToken(null);
          setLoading(false);
          setError(null);
        }
      });
    };

    init();
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithRedirect(auth, provider);
      // Page navigates away — nothing runs after this
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
