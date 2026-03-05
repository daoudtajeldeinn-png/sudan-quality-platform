import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState(false);

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
        console.log('Firebase not configured yet');
        setFirebaseError(true);
        setLoading(false);
      }
    };
    
    loadFirebase();
  }, []);

  const handleGoogleLogin = async () => {
    if (firebaseError) {
      alert('Firebase غير معد بشكل صحيح');
      return;
    }
    
    try {
      const firebaseModule = await import('./firebase/config');
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseModule.auth, provider);
      console.log('User signed in:', result.user);
    } catch (error) {
      console.error('Login error:', error);
      alert('حدث خطأ في تسجيل الدخول: ' + error.message);
    }
  };

  const handleLogout = async () => {
    if (firebaseError) return;
    
    try {
      const firebaseModule = await import('./firebase/config');
      const { signOut } = await import('firebase/auth');
      await signOut(firebaseModule.auth);
      console.log('User signed out');
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
        {firebaseError && (
          <div style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
            Firebase غير معد بشكل صحيح
          </div>
        )}
      </div>
    );
  }

  if (!user) {
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
          disabled={firebaseError}
          style={{
            backgroundColor: firebaseError ? '#cccccc' : '#4285f4',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: firebaseError ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            marginTop: '20px'
          }}
        >
          {firebaseError ? 'خطأ في إعداد Firebase' : 'الدخول بحساب Google'}
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
      <h1>مرحباً، {user.displayName || 'مستخدم'}</h1>
      {user.photoURL && (
        <img 
          src={user.photoURL} 
          alt="Profile" 
          style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%',
            border: '3px solid #28a745'
          }}
        />
      )}
      <p style={{ fontSize: '18px', color: '#333' }}>{user.email}</p>
      <button 
        onClick={handleLogout}
        style={{
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px',
          fontSize: '16px'
        }}
      >
        تسجيل الخروج
      </button>
    </div>
  );
}

export default App;
