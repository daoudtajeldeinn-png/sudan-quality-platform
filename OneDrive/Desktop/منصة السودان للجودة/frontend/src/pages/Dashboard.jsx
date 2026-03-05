import React, { useState, useEffect } from 'react';
import LoginForm from './components/Auth/internal/LoginForm';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // التحقق من وجود token مخزن
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // هنا سيتم التحقق من صحة الـ token لاحقاً
      // للمoment نفترض أن المستخدم مسجل
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData.user);
    localStorage.setItem('token', userData.token);
# تحديث ملف Dashboard.jsx
@'
import React, { useState, useEffect } from 'react';

const Dashboard = ({ user, onLogout }) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="dashboard" style={{ 
      direction: 'rtl', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <header style={{
        backgroundColor: '#28a745',
        color: 'white',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1>لوحة التحكم - منصة السودان للجودة</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {user.photoURL && (
            <img 
              src={user.photoURL} 
              alt="Profile" 
              style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%',
                border: '2px solid white'
              }} 
            />
          )}
          <span>{user.displayName || user.email}</span>
          <button 
            onClick={onLogout}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginLeft: '15px'
            }}
          >
            تسجيل الخروج
          </button>
        </div>
      </header>
      
      <div style={{
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#28a745', marginBottom: '10px' }}>GMP</h3>
            <p style={{ color: '#666', marginBottom: '15px' }}>التصنيع الجيد</p>
            <div style={{
              width: '100%',
              height: '10px',
              backgroundColor: '#e0e0e0',
              borderRadius: '5px',
              overflow: 'hidden',
              marginBottom: '10px'
            }}>
              <div style={{
                width: '0%',
                height: '100%',
                backgroundColor: '#28a745',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
            <span>0%</span>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#28a745', marginBottom: '10px' }}>GLP</h3>
            <p style={{ color: '#666', marginBottom: '15px' }}>المختبر الجيد</p>
            <div style={{
              width: '100%',
              height: '10px',
              backgroundColor: '#e0e0e0',
              borderRadius: '5px',
              overflow: 'hidden',
              marginBottom: '10px'
              }}>
              <div style={{
                width: '0%',
                height: '100%',
                backgroundColor: '#28a745',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
            <span>0%</span>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#28a745', marginBottom: '10px' }}>ISO</h3>
            <p style={{ color: '#666', marginBottom: '15px' }}>المعايير الدولية</p>
            <div style={{
              width: '100%',
              height: '10px',
              backgroundColor: '#e0e0e0',
              borderRadius: '5px',
              overflow: 'hidden',
              marginBottom: '10px'
            }}>
              <div style={{
                width: '0%',
                height: '100%',
                backgroundColor: '#28a745',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
            <span>0%</span>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#28a745', marginBottom: '10px' }}>ICH</h3>
            <p style={{ color: '#666', marginBottom: '15px' }}>التوحيد الدولي</p>
            <div style={{
              width: '100%',
              height: '10px',
              backgroundColor: '#e0e0e0',
              borderRadius: '5px',
              overflow: 'hidden',
              marginBottom: '10px'
            }}>
              <div style={{
                width: '0%',
                height: '100%',
                backgroundColor: '#28a745',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
            <span>0%</span>
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginTop: '30px'
        }}>
          <h2 style={{ color: '#28a745', marginBottom: '15px' }}>الوحدات المتاحة</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            <div style={{
              border: '1px solid #ddd',
              borderRadius: '6px',
              padding: '15px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'white'}>
              <h4>مقدمة في GMP</h4>
              <p style={{ fontSize: '14px', color: '#666' }}>الوحدة الأولى</p>
            </div>
            
            <div style={{
              border: '1px solid #ddd',
              borderRadius: '6px',
              padding: '15px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'white'}>
              <h4>مبادئ GLP</h4>
              <p style={{ fontSize: '14px', color: '#666' }}>الوحدة الثانية</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
