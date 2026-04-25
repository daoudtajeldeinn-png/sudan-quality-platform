<<<<<<< HEAD
import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { VerifyCertificate } from './pages/VerifyCertificate';
import './App.css';
import { LanguageProvider } from './LanguageContext';
import { GamificationProvider } from './GamificationContext';
import { useAuth } from './hooks/useAuth';
import { auth } from './firebase/config';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { apiService } from './services/api';

// Error Boundary Component (preserved)
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

// Loading Component
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    textAlign: 'center', 
    direction: 'rtl',
    padding: '2rem'
  }}>
    <div style={{ fontSize: '1.5rem', color: '#28a745', marginBottom: '1rem' }}>
      منصة السودان للجودة
    </div>
    <div style={{ fontSize: '1.2rem', color: '#666' }}>جاري تهيئة التطبيق...</div>
  </div>
);

function AppContent() {
  const { user, authToken, loading, error, loginWithGoogle, logout } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', direction: 'rtl', padding: '2rem' }}>
        <h2 style={{ color: 'red' }}>خطأ في التحقق من الهوية</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{ background: '#dc3545', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' }}
        >
          إعادة المحاولة
        </button>
=======
import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import { VerifyCertificate } from './pages/VerifyCertificate';
import { LanguageProvider } from './LanguageContext';
import { GamificationProvider } from './GamificationContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { auth } from './firebase/config';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

<<<<<<< HEAD
function AppContent({ user, setUser }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    const registerUser = async () => {
      try {
        const userData = {
          userId: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        };
        await apiService.registerUser(userData);
        console.log('User registered in backend');
      } catch (error) {
        console.error('Backend registration error:', error);
      }
    };
    registerUser();
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
=======
import { apiService } from './services/api';

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
>>>>>>> 6e99791776742434a56d4862508810f8b0037935
      setLoading(false);
    });
    return unsubscribe;
  }, [setUser]);

  useEffect(() => {
    if (user) {
      apiService.registerUser({
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

<<<<<<< HEAD
  if (loading) {
    return (
      <div style={{
        textAlign: 'center',
        marginTop: '50px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div>جاري التحميل...</div>
        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
      </div>
    );
  }

  if (!user) {
    return (
<<<<<<< HEAD
      <div style={{ textAlign: 'center', marginTop: '50px', direction: 'rtl' }}>
        <h1 style={{ color: '#28a745', fontSize: '2.5rem' }}>منصة السودان للجودة</h1>
        <p style={{ fontSize: '18px', color: '#666', margin: '2rem 0' }}>التدريب التفاعلي في الجودة الدوائية</p>
        <button 
          onClick={loginWithGoogle} 
          style={{ 
            background: 'linear-gradient(45deg, #4285f4, #34a853)', 
            color: 'white', 
            border: 'none', 
            padding: '15px 40px', 
            borderRadius: '50px', 
            fontSize: '18px', 
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(66,133,244,0.4)',
            transition: 'all 0.3s'
          }}
          disabled={loading}
        >
          الدخول بحساب Google
        </button>
=======
      <div style={{
        textAlign: 'center',
        marginTop: '50px',
        fontFamily: 'Arial, sans-serif',
        direction: 'rtl'
      }}>
=======
  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', direction: 'rtl' }}>جاري التحميل...</div>;

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', direction: 'rtl' }}>
>>>>>>> 6e99791776742434a56d4862508810f8b0037935
        <h1 style={{ color: '#28a745' }}>منصة السودان للجودة</h1>
        <p style={{ fontSize: '18px', color: '#666' }}>التدريب التفاعلي في الجودة الدوائية</p>
        <button onClick={handleGoogleLogin} style={{ background: '#4285f4', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', fontSize: '16px' }}>
          الدخول بحساب Google
        </button>
<<<<<<< HEAD

        {error && (
          <div style={{
            color: 'red',
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#ffe6e6',
            borderRadius: '4px',
            maxWidth: '400px',
            margin: '20px auto 0'
          }}>
            {error}
          </div>
        )}
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
=======
        {error && <div style={{ color: 'red', marginTop: '20px' }}>{error}</div>}
>>>>>>> 6e99791776742434a56d4862508810f8b0037935
      </div>
    );
  }

  return (
<<<<<<< HEAD
<<<<<<< HEAD
    <ErrorBoundary fallback={
      <div style={{ padding: '40px', textAlign: 'center', direction: 'rtl' }}>
        <h2>خطأ في التطبيق</h2>
        <button onClick={() => window.location.reload()}>إعادة التحميل</button>
      </div>
    }>
=======
    <ErrorBoundary>
>>>>>>> 6e99791776742434a56d4862508810f8b0037935
      <GamificationProvider 
        userId={user.uid} 
        userEmail={user.email} 
        authToken={authToken}
<<<<<<< HEAD
        loading={loading}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <Dashboard user={user} onLogout={logout} authToken={authToken} />
        </Suspense>
      </GamificationProvider>
    </ErrorBoundary>
=======
    <>
      {/* Add Verify route if using router in future; keep Dashboard rendering for current flow */}
      <Dashboard user={user} onLogout={handleLogout} />
    </>
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
=======
      >
        <Dashboard user={user} onLogout={handleLogout} authToken={authToken} />
      </GamificationProvider>
    </ErrorBoundary>
>>>>>>> 6e99791776742434a56d4862508810f8b0037935
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
<<<<<<< HEAD
<<<<<<< HEAD
          <Route path="/*" element={<AppContent />} />
=======
          <Route path="/*" element={<AppContentWrapper />} />
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
=======
          <Route path="/*" element={
            <AppContentWrapper>
              {AppContent}
            </AppContentWrapper>
          } />
>>>>>>> 6e99791776742434a56d4862508810f8b0037935
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

<<<<<<< HEAD
<<<<<<< HEAD
export default App;

=======
function AppContentWrapper() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFirebase = async () => {
      try {
        const firebaseModule = await import('./firebase/config');
        const unsubscribe = firebaseModule.auth.onAuthStateChanged((currentUser) => {
          setUser(currentUser);
          setLoading(false);
        });
        return () => unsubscribe();
      } catch (error) {
        setLoading(false);
      }
    };
    loadFirebase();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>جاري التحميل...</div>;

  return (
    <GamificationProvider userId={user?.uid} userEmail={user?.email}>
      <AppContent user={user} setUser={setUser} />
    </GamificationProvider>
  );
}

export default App;
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
=======
export default App;

>>>>>>> 6e99791776742434a56d4862508810f8b0037935
