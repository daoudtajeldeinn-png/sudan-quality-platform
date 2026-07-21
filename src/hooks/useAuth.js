import { useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import {
  onAuthStateChanged, signOut,
  GoogleAuthProvider, signInWithPopup,
  signInWithRedirect, getRedirectResult
} from 'firebase/auth';
import { apiService } from '../services/api';

const ADMIN_EMAILS = [
  'daoudtajeldeinn113@gmail.com',
  'daoudtajeldeinn@gmail.com'
];

export const useAuth = () => {
  const [user, setUser]         = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [isAdmin, setIsAdmin]   = useState(false);

  useEffect(() => {
    // Handle redirect result first (for Chrome fallback)
    getRedirectResult(auth)
      .then(result => {
        if (result?.user) {
          console.log('✅ Redirect login success:', result.user.email);
        }
      })
      .catch(err => {
        if (err.code !== 'auth/no-auth-event') {
          console.warn('Redirect result error (non-critical):', err.code);
        }
      });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsAdmin(ADMIN_EMAILS.includes(currentUser.email));
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
        setIsAdmin(false);
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
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      // Try popup first
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (popupErr) {
      console.warn('Popup failed, trying redirect:', popupErr.code);

      // If popup blocked or storage issue → use redirect
      if (
        popupErr.code === 'auth/popup-blocked' ||
        popupErr.code === 'auth/popup-closed-by-user' ||
        popupErr.code === 'auth/cancelled-popup-request' ||
        popupErr.code === 'auth/web-storage-unsupported' ||
        popupErr.code === 'auth/operation-not-supported-in-this-environment' ||
        popupErr.code === 'auth/missing-initial-state'
      ) {
        try {
          await signInWithRedirect(auth, provider);
          // Page will redirect — no return value
          return null;
        } catch (redirectErr) {
          setError(redirectErr.message);
          setLoading(false);
          throw redirectErr;
        }
      }

      setError(popupErr.message);
      setLoading(false);
      throw popupErr;
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
