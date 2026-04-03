import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    // محاولة تحميل Firebase
    const loadFirebase = async () => {
      try {
        const firebaseModule = await import('./firebase/config');
        const unsubscribe = firebaseModule.auth.onAuthStateChanged((currentUser) => {
          if (currentUser) {
            setUser(currentUser);
            setShowDashboard(true); // إظهار لوحة التحكم تلقائياً عند تسجيل الدخول
          }
          setLoading(false);
        });
        return () => unsubscribe();
      } catch (error) {
        console.log('Firebase not configured yet');
        setLoading(false);
      }
    };
    
    loadFirebase();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const firebaseModule = await import('./firebase/config');
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
      
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(firebaseModule.auth, provider);
      setUser(result.user);
      setShowDashboard(true); // الانتقال للوحة التحكم تلقائياً
      
      // إرسال بيانات المستخدم للـ Backend
      try {
        const userData = {
          userId: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        };
        
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        
        if (response.ok) {
          console.log('User registered in backend');
        }
      } catch (error) {
        console.error('Backend registration error:', error);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const firebaseModule = await import('./firebase/config');
      const { signOut } = await import('firebase/auth');
      await signOut(firebaseModule.auth);
      setUser(null);
      setShowDashboard(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        marginTop: '50px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div>جاري التحميل...</div>
      </div>
    );
  }

  if (user && showDashboard) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  if (user && !showDashboard) {
    // هذا هو الجزء المفقود - زر الذهاب للوحة التحكم
    return (
      <div style={{ 
        textAlign: 'center', 
        marginTop: '50px',
        fontFamily: 'Arial, sans-serif',
        direction: 'rtl'
      }}>
        <h1 style={{ color: '#28a745' }}>مرحباً، {user.displayName || 'مستخدم'}</h1>
        {user.photoURL && (
          <img 
            src={user.photoURL} 
            alt="Profile" 
            style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%',
              border: '3px solid #28a745',
              margin: '20px 0'
            }}
          />
        )}
        <p style={{ fontSize: '18px', color: '#333' }}>{user.email}</p>
        <button 
          onClick={() => setShowDashboard(true)}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '20px',
            marginRight: '10px'
          }}
        >
          الذهاب للوحة التحكم
        </button>
        <button 
          onClick={handleLogout}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '20px'
          }}
        >
          تسجيل الخروج
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      textAlign: 'center', 
      marginTop: '50px',
      fontFamily: 'Arial, sans-serif',
      direction: 'rtl'
    }}>
      <h1 style={{ color: '#28a745' }}>منصة السودان للجودة</h1>
      <p style={{ fontSize: '18px', color: '#666' }}>
        التدريب التفاعلي في الجودة الدوائية
      </p>
      <button 
        onClick={handleGoogleLogin}
        style={{
          backgroundColor: '#4285f4',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          marginTop: '20px'
        }}
      >
        الدخول بحساب Google
      </button>
    </div>
  );
}

export default App;
