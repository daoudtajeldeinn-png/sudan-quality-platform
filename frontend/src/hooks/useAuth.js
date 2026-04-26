import { useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { apiService } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          // Register/sync user with backend for token
          const tokenData = await apiService.registerUser({
            userId: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          });
          setAuthToken(tokenData.token || null);
        } catch (err) {
          console.error('Auth token fetch error:', err);
          setAuthToken(null);
        }
      } else {
        setUser(null);
        setAuthToken(null);
      }
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      // Token handled in onAuthStateChanged
      return result.user;
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
