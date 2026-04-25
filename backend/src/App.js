import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);

<<<<<<< HEAD
  // Replace this with your Vercel URL
  const API_BASE_URL = 'https://sudanes-chemical-industries-pos-gpd.vercel.app';

=======
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
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
<<<<<<< HEAD

=======
    
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
    loadFirebase();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const firebaseModule = await import('./firebase/config');
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
<<<<<<< HEAD

      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(firebaseModule.auth, provider);
      setUser(result.user);
      setShowDashboard(true); // الانتقال للوحة التحكم تلقائياً

=======
      
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(firebaseModule.auth, provider);
      setUser(result.user);
      setShowDashboard(true); // الانتقال للوحة التحكم تلقائياً
      
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
      // إرسال بيانات المستخدم للـ Backend
      try {
        const userData = {
          userId: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        };
<<<<<<< HEAD

        // FIXED: Now using the Vercel Production URL instead of localhost
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
=======
        
        const response = await fetch('http://localhost:5000/api/auth/register', {
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
<<<<<<< HEAD

=======
        
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
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
<<<<<<< HEAD
      <div style={{
        textAlign: 'center',
        marginTop: '50px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ fontSize: '20px' }}>جاري التحميل...</div>
=======
      <div style={{ 
        textAlign: 'center', 
        marginTop: '50px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div>جاري التحميل...</div>
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
      </div>
    );
  }

  if (user && showDashboard) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  if (user && !showDashboard) {
<<<<<<< HEAD
    return (
      <div style={{
        textAlign: 'center',
=======
    // هذا هو الجزء المفقود - زر الذهاب للوحة التحكم
    return (
      <div style={{ 
        textAlign: 'center', 
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
        marginTop: '50px',
        fontFamily: 'Arial, sans-serif',
        direction: 'rtl'
      }}>
        <h1 style={{ color: '#28a745' }}>مرحباً، {user.displayName || 'مستخدم'}</h1>
        {user.photoURL && (
<<<<<<< HEAD
          <img
            src={user.photoURL}
            alt="Profile"
            style={{
              width: '100px',
              height: '100px',
=======
          <img 
            src={user.photoURL} 
            alt="Profile" 
            style={{ 
              width: '100px', 
              height: '100px', 
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
              borderRadius: '50%',
              border: '3px solid #28a745',
              margin: '20px 0'
            }}
          />
        )}
        <p style={{ fontSize: '18px', color: '#333' }}>{user.email}</p>
<<<<<<< HEAD
        <button
=======
        <button 
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
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
<<<<<<< HEAD
        <button
=======
        <button 
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
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
<<<<<<< HEAD
    <div style={{
      textAlign: 'center',
=======
    <div style={{ 
      textAlign: 'center', 
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
      marginTop: '50px',
      fontFamily: 'Arial, sans-serif',
      direction: 'rtl'
    }}>
      <h1 style={{ color: '#28a745' }}>منصة السودان للجودة</h1>
      <p style={{ fontSize: '18px', color: '#666' }}>
        التدريب التفاعلي في الجودة الدوائية
      </p>
<<<<<<< HEAD
      <button
=======
      <button 
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
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
