import React, { Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

import StudentShell from './pages/StudentShell';
import AdminDashboard from './pages/AdminDashboard';
import { VerifyCertificate } from './pages/VerifyCertificate';
import './App.css';
import { LanguageProvider } from './LanguageContext';
import { GamificationProvider } from './GamificationContext';
import { useAuth } from './hooks/useAuth';
import emailjs from '@emailjs/browser';

// EmailJS config
const EMAILJS_SERVICE  = 'service_5cdkh5d';
const EMAILJS_TEMPLATE = 'template_lrfl1xq';
const EMAILJS_KEY      = 'C-YEGgyegcQ0BL0KU';

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
        <div style={{
          display:'flex', flexDirection:'column', alignItems:'center',
          justifyContent:'center', height:'100vh',
          background:'linear-gradient(135deg,#0f2557,#1a3a7a)',
          color:'white', textAlign:'center', padding:'40px'
        }}>
          <div style={{ fontSize:'60px', marginBottom:'20px' }}>🔧</div>
          <h1 style={{ fontSize:'28px', fontWeight:'600', marginBottom:'12px' }}>We'll be back soon</h1>
          <p style={{ fontSize:'16px', opacity:0.75, marginBottom:'8px', maxWidth:'400px' }}>
            Sudan Quality Platform is currently under maintenance. We apologize for the inconvenience.
          </p>
          <p style={{ fontSize:'13px', opacity:0.5 }}>منصة السودان للجودة — قيد الصيانة</p>
          <button onClick={() => window.location.reload()} style={{
            marginTop:'30px', padding:'12px 30px', borderRadius:'8px',
            background:'#d4af37', color:'#1a2a4a', border:'none',
            fontWeight:'600', cursor:'pointer', fontSize:'14px'
          }}>Try Again / حاول مجدداً</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const LoadingSpinner = () => (
  <div style={{
    display:'flex', flexDirection:'column', justifyContent:'center',
    alignItems:'center', height:'100vh', textAlign:'center', direction:'rtl', padding:'2rem'
  }}>
    <div style={{ fontSize:'1.5rem', color:'#28a745', marginBottom:'1rem' }}>منصة السودان للجودة</div>
    <div style={{ fontSize:'1.2rem', color:'#666' }}>جاري تهيئة التطبيق...</div>
  </div>
);

function AppContent() {
  const { user, authToken, loading, error, isAdmin, isInactive, daysSinceLogin, setIsInactive, loginWithGoogle, logout } = useAuth();

  // Send inactivity email once when flagged — must be before any conditional returns
  React.useEffect(() => {
    if (user && isInactive) {
      emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
        to_email:      user.email,
        user_name:     user.displayName || user.email.split('@')[0],
        days_inactive: daysSinceLogin,
      }, EMAILJS_KEY).then(() => {
        console.log('✅ Inactivity email sent to:', user.email);
      }).catch(err => {
        console.warn('EmailJS error (non-critical):', err);
      });
    }
  }, [isInactive]);
  const [studentView, setStudentView] = useState(false);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div style={{ textAlign:'center', marginTop:'50px', direction:'rtl', padding:'2rem' }}>
        <h2 style={{ color:'red' }}>خطأ في التحقق من الهوية</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}
          style={{ background:'#dc3545', color:'white', border:'none', padding:'12px 24px', borderRadius:'6px', fontSize:'16px', cursor:'pointer' }}>
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign:'center', marginTop:'50px', direction:'rtl' }}>
        <h1 style={{ color:'#28a745', fontSize:'2.5rem' }}>منصة السودان للجودة</h1>
        <p style={{ fontSize:'18px', color:'#666', margin:'2rem 0' }}>التدريب التفاعلي في الجودة الدوائية</p>
        <button onClick={loginWithGoogle}
          style={{
            background:'linear-gradient(45deg,#4285f4,#34a853)', color:'white', border:'none',
            padding:'15px 40px', borderRadius:'50px', fontSize:'18px', fontWeight:'bold',
            cursor:'pointer', boxShadow:'0 4px 15px rgba(66,133,244,0.4)', transition:'all 0.3s'
          }}
          disabled={loading}>
          الدخول بحساب Google
        </button>
      </div>
    );
  }

  if (user && isInactive) {
    return (
      <div style={{
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        height:'100vh', background:'linear-gradient(135deg,#0f2557,#1a3a7a)',
        color:'white', textAlign:'center', padding:'40px', fontFamily:"'Inter',sans-serif"
      }}>
        <div style={{ fontSize:'64px', marginBottom:'20px' }}>⏰</div>
        <h1 style={{ fontSize:'26px', fontWeight:'700', marginBottom:'12px' }}>Account Inactive</h1>
        <p style={{ fontSize:'15px', opacity:0.75, maxWidth:'420px', lineHeight:'1.7', marginBottom:'8px' }}>
          Your account has been inactive for <strong style={{color:'#d4af37'}}>{daysSinceLogin} days</strong>.
          Please contact the administrator to reactivate your account.
        </p>
        <p style={{ fontSize:'13px', opacity:0.5, marginBottom:'30px' }}>
          حسابك غير نشط. يرجى التواصل مع المسؤول لإعادة التفعيل.
        </p>
        <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', justifyContent:'center' }}>
          <button onClick={() => setIsInactive(false)} style={{
            padding:'12px 28px', borderRadius:'10px', background:'#d4af37',
            color:'#1a2a4a', border:'none', fontWeight:'700', cursor:'pointer', fontSize:'14px'
          }}>Continue Anyway</button>
          <button onClick={logout} style={{
            padding:'12px 28px', borderRadius:'10px', background:'rgba(255,255,255,0.1)',
            color:'white', border:'1px solid rgba(255,255,255,0.3)', fontWeight:'600', cursor:'pointer', fontSize:'14px'
          }}>Sign Out</button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <GamificationProvider userId={user.uid} userEmail={user.email} authToken={authToken} loading={loading}>
        <Suspense fallback={<LoadingSpinner />}>


          {isAdmin && !studentView ? (
            <AdminDashboard user={user} onLogout={logout} authToken={authToken} onSwitchView={() => setStudentView(true)} />
          ) : (
            <StudentShell user={user} onLogout={logout} authToken={authToken} onSwitchView={() => setStudentView(false)} isAdmin={isAdmin} />
          )}
        </Suspense>
      </GamificationProvider>
    </ErrorBoundary>
  );
}

import { APP_VERSION } from './services/api';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
          <div style={{ flex:1 }}>
            <Routes>
              <Route path="/verify" element={<VerifyCertificate />} />
              <Route path="/*" element={<AppContent />} />
            </Routes>
          </div>
          <footer style={{
            textAlign:'center', padding:'10px',
            backgroundColor:'var(--bg-card)', borderTop:'1px solid var(--border-color)',
            color:'var(--text-secondary)', fontSize:'0.85rem', direction:'ltr'
          }}>
            Sudan Quality Platform v{APP_VERSION}
          </footer>
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
