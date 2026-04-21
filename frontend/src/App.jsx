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
      </div>
    );
  }

  if (!user) {
    return (
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
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={
      <div style={{ padding: '40px', textAlign: 'center', direction: 'rtl' }}>
        <h2>خطأ في التطبيق</h2>
        <button onClick={() => window.location.reload()}>إعادة التحميل</button>
      </div>
    }>
      <GamificationProvider 
        userId={user.uid} 
        userEmail={user.email} 
        authToken={authToken}
        loading={loading}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <Dashboard user={user} onLogout={logout} authToken={authToken} />
        </Suspense>
      </GamificationProvider>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/verify" element={<VerifyCertificate />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;

