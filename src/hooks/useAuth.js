import { useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { apiService } from '../services/api';

const ADMIN_EMAILS = [
  'daoudtajeldeinn113@gmail.com',
  'daoudtajeldeinn@gmail.com'
];

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // ✅ Show user IMMEDIATELY — don't wait for backend
        setUser(currentUser);
        setIsAdmin(ADMIN_EMAILS.includes(currentUser.email));
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
        setIsAdmin(false);
        setLoading(false);
        setError(null);
      }
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

  return { user, authToken, loading, error, isAdmin, loginWithGoogle, logout };
};
