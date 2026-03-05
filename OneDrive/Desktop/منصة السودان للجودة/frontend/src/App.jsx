import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    // محاولة تحميل Firebase
    const loadFirebase = async () => {
      try {
        const firebaseModule = await import('./firebase/config');
        setFirebaseReady(true);
        
        // إعداد listener لحالة تسجيل الدخول
        const unsubscribe = firebaseModule.auth.onAuthStateChanged((currentUser) => {
          setUser(currentUser);
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
    if (!firebaseReady) {
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
      alert('حدث خطأ في تسجيل الدخول');
    }
  };

  const handleLogout = async () => {
    if (!firebaseReady) return;
    
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
        {!firebaseReady && (
          <div style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
            تأكد من إعداد Firebase Configuration
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
          disabled={!firebaseReady}
          style={{
            backgroundColor: firebaseReady ? '#4285f4' : '#cccccc',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: firebaseReady ? 'pointer' : 'not-allowed',
            fontSize: '16px',
            marginTop: '20px'
          }}
        >
          {firebaseReady ? 'الدخول بحساب Google' : 'جاري إعداد Firebase...'}
        </button>
        
        {!firebaseReady && (
          <div style={{ 
            marginTop: '30px', 
            fontSize: '14px', 
            color: '#888',
            maxWidth: '500px',
            margin: '30px auto 0',
            padding: '15px',
            backgroundColor: '#fff3cd',
            borderRadius: '5px',
            border: '1px solid #ffeaa7'
          }}>
            <strong>تنبيه:</strong> يجب إعداد ملف Firebase Configuration في:<br/>
            <code>src/firebase/config.js</code><br/>
            باستخدام بيانات من Firebase Console.
          </div>
        )}
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
