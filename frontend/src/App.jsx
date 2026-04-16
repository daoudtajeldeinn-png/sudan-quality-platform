import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import { VerifyCertificate } from './pages/VerifyCertificate';
import { LanguageProvider } from './LanguageContext';
import { GamificationProvider } from './GamificationContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { auth } from './firebase/config';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

// Safe apiService stub (real impl in services/api.js - stub prevents crash)
const safeApiService = {
  registerUser: async (userData) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn('Backend unavailable, using mock token:', error);
      return { token: `mock-${userData.userId}-${Date.now()}` };
    }
  }
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error, info) {
    console.error('App.jsx ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', direction: 'rtl' }}>
          <h2>خطأ في التطبيق</h2>
          <p>{this.state.error}</p>
          <button onClick={() => window.location.reload()}>إعادة التحميل</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent({ user, setUser, authToken, onTokenUpdate }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, [setUser]);

  useEffect(() => {
    if (user) {
      safeApiService.registerUser({
        userId: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }).then(onTokenUpdate).catch(console.error);
    }
  }, [user, onTokenUpdate]);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setError('');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', direction: 'rtl' }}>جاري التحميل...</div>;

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', direction: 'rtl' }}>
        <h1 style={{ color: '#28a745' }}>منصة السودان للجودة</h1>
        <p style={{ fontSize: '18px', color: '#666' }}>التدريب التفاعلي في الجودة الدوائية</p>
        <button onClick={handleGoogleLogin} style={{ background: '#4285f4', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', fontSize: '16px' }}>
          الدخول بحساب Google
        </button>
        {error && <div style={{ color: 'red', marginTop: '20px' }}>{error}</div>}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Dashboard user={user} onLogout={handleLogout} authToken={authToken} />
    </ErrorBoundary>
  );
}

function AppContentWrapper({ children }) {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const handleTokenUpdate = (token) => setAuthToken(token);

  return children(user, setUser, authToken, handleTokenUpdate);
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/verify" element={<VerifyCertificate />} />
          <Route path="/*" element={
            <AppContentWrapper>
              {AppContent}
            </AppContentWrapper>
          } />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;

