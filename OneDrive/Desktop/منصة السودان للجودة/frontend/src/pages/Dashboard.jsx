import React, { useState } from 'react';
import Quiz from '../components/Quiz';
import LectureView from '../components/LectureView';
import { useLanguage } from '../LanguageContext';

const Dashboard = ({ user, onLogout }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [currentUnit, setCurrentUnit] = useState(null);
  const [isLectureMode, setIsLectureMode] = useState(false);
  const [userProgress, setUserProgress] = useState({
    gmp: 75,
    glp: 0,
    iso: 0,
    ich: 0
  });

  const sections = [
    {
      id: 'gmp',
      title: 'GMP',
      description: t('gmpDesc'),
      progress: userProgress.gmp,
      color: '#28a745'
    },
    {
      id: 'glp',
      title: 'GLP',
      description: t('glpDesc'),
      progress: userProgress.glp,
      color: '#007bff'
    },
    {
      id: 'iso',
      title: 'ISO',
      description: t('isoDesc'),
      progress: userProgress.iso,
      color: '#ffc107'
    },
    {
      id: 'ich',
      title: 'ICH',
      description: t('ichDesc'),
      progress: userProgress.ich,
      color: '#dc3545'
    }
  ];

  const units = [
    { id: 'gmp-intro', title: t('introGMP'), subtitle: t('unit1'), color: '#28a745' },
    { id: 'glp-basics', title: t('glpBasics'), subtitle: t('unit2'), color: '#007bff' },
    { id: 'iso-17025', title: t('iso17025'), subtitle: t('unit3'), color: '#ffc107' },
    { id: 'ich-guidelines', title: t('ichGuidelines'), subtitle: t('unit4'), color: '#dc3545' },
    { id: 'validation-qualification', title: t('valQual'), subtitle: t('unit5'), color: '#20c997' },
    { id: 'data-integrity', title: t('dataIntegrity'), subtitle: t('unit6'), color: '#6610f2' },
    { id: 'qrm-basics', title: t('qrmBasics'), subtitle: t('unit7'), color: '#e83e8c' },
  ];

  const handleStartUnit = (unitId) => {
    setCurrentUnit(unitId);
    setIsLectureMode(true); // Start with lecture mode
  };

  const handleProceedToQuiz = () => {
    setIsLectureMode(false);
  };

  const handleQuizComplete = (result) => {
    // result comes from Quiz.jsx as { score, passed, unitId }
    const { score, unitId } = result;

    // Map full unit ID (e.g., 'gmp-intro') to progress key (e.g., 'gmp')
    const progressKey = unitId.split('-')[0];

    if (score >= 90) {
      setUserProgress(prev => ({
        ...prev,
        [progressKey]: 100
      }));
      alert(`${t('congrats')} ${score}%`);
    } else {
      alert(`${t('failed')} ${score}%. ${t('tryAgain')}`);
    }
    setCurrentUnit(null);
  };

  if (currentUnit) {
    if (isLectureMode) {
      return (
        <LectureView
          unitId={currentUnit}
          onProceedToQuiz={handleProceedToQuiz}
          onBack={() => setCurrentUnit(null)}
        />
      );
    }

    return (
      <div>
        <button
          onClick={() => setCurrentUnit(null)}
          style={{
            margin: '20px',
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {t('backToDashboard')}
        </button>
        <Quiz unitId={currentUnit} onQuizComplete={handleQuizComplete} />
      </div>
    );
  }

  return (
    <div style={{
      direction: language === 'ar' ? 'rtl' : 'ltr',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#28a745',
        color: 'white',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1>{t('dashboardTitle')}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={toggleLanguage}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid white',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {language === 'ar' ? 'English' : 'العربية'}
          </button>

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
              marginLeft: language === 'ar' ? '0' : '15px',
              marginRight: language === 'ar' ? '15px' : '0'
            }}
          >
            {t('logout')}
          </button>
        </div>
      </header>

      {/* Progress Summary */}
      <div style={{
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#28a745', marginBottom: '15px' }}>{t('progressSummary')}</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {sections.map((section) => (
              <div key={section.id} style={{
                textAlign: 'center',
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '6px'
              }}>
                <h3 style={{ color: section.color, margin: '0 0 10px 0' }}>{section.title}</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: '0 0 15px 0' }}>{section.description}</p>
                <div style={{
                  width: '100%',
                  height: '10px',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '5px',
                  overflow: 'hidden',
                  marginBottom: '5px'
                }}>
                  <div style={{
                    width: `${section.progress}%`,
                    height: '100%',
                    backgroundColor: section.color,
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{section.progress}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Available Units */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#28a745', marginBottom: '15px' }}>{t('availableUnits')}</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px'
          }}>
            {units.map((unit) => (
              <div key={unit.id} style={{
                border: '1px solid #ddd',
                borderRadius: '6px',
                padding: '15px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: '#f8f9fa'
              }}>
                <h4>{unit.title}</h4>
                <p style={{ fontSize: '14px', color: '#666' }}>{unit.subtitle}</p>
                <button
                  onClick={() => handleStartUnit(unit.id)}
                  style={{
                    backgroundColor: unit.color,
                    color: unit.color === '#ffc107' ? 'black' : 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                >
                  {t('startStudy')}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginTop: '30px'
        }}>
          <h2 style={{ color: '#28a745', marginBottom: '15px' }}>{t('earnedCertificates')}</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px'
          }}>
            <div style={{
              border: '2px dashed #28a745',
              borderRadius: '6px',
              padding: '20px',
              textAlign: 'center',
              backgroundColor: '#f8fff8'
            }}>
              <h4 style={{ color: '#28a745' }}>{t('gmpCert')}</h4>
              <p style={{ fontSize: '14px', color: '#666' }}>{t('earned')}</p>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#e0e0e0',
                borderRadius: '4px',
                overflow: 'hidden',
                margin: '10px 0'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#28a745'
                }}></div>
              </div>
              <span style={{ fontSize: '12px', color: '#888' }}>100% {t('completed')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
