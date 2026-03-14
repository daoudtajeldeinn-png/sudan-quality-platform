import React, { useState, useEffect } from 'react';
import Quiz from '../components/Quiz';
import LectureView from '../components/LectureView';
import { useLanguage } from '../LanguageContext';
import pharmaLogo from '../assets/pharma_logo.png';
import certBg from '../assets/certificate_bg.png';

// Unit icons mapping - visual icons for each unit
const UNIT_ICONS = {
  'gmp-intro': { icon: '🏭', color: '#28a745', title: { ar: 'مقدمة في GMP', en: 'Intro to GMP' } },
  'glp-basics': { icon: '🔬', color: '#007bff', title: { ar: 'مبادئ GLP', en: 'GLP Basics' } },
  'iso-17025': { icon: '📊', color: '#ffc107', title: { ar: 'ISO 17025', en: 'ISO 17025' } },
  'ich-guidelines': { icon: '🌐', color: '#dc3545', title: { ar: 'إرشادات ICH', en: 'ICH Guidelines' } },
  'validation-qualification': { icon: '✅', color: '#20c997', title: { ar: 'التحقق والتأهيل', en: 'Validation & Qualification' } },
  'data-integrity': { icon: '🔒', color: '#6610f2', title: { ar: 'سلامة البيانات', en: 'Data Integrity' } },
  'qrm-basics': { icon: '⚠️', color: '#e83e8c', title: { ar: 'إدارة المخاطر', en: 'QRM Basics' } },
  'gdp-basics': { icon: '🚚', color: '#fd7e14', title: { ar: 'ممارسات التوزيع', en: 'GDP Basics' } },
};

const Dashboard = ({ user, onLogout }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [currentUnit, setCurrentUnit] = useState(null);
  const [isLectureMode, setIsLectureMode] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [isSampleMode, setIsSampleMode] = useState(false);
  const [showPledge, setShowPledge] = useState(false);
  const [showDevProfile, setShowDevProfile] = useState(false);
  const [userProgress, setUserProgress] = useState({
    'gmp-intro': 0,
    'glp-basics': 0,
    'iso-17025': 0,
    'ich-guidelines': 0,
    'validation-qualification': 0,
    'data-integrity': 0,
    'qrm-basics': 0,
    'gdp-basics': 0
  });
  const [unitStates, setUnitStates] = useState({}); // { unitId: { lectureFinished: bool } }

  const LOGO_PATH = pharmaLogo;
  const CERT_BG = certBg;

  // Load progress and state from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(`sqp_progress_${user.email}`);
    const savedStates = localStorage.getItem(`sqp_states_${user.email}`);
    const pledgeSigned = localStorage.getItem(`sqp_pledge_${user.email}`);

    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setUserProgress(prev => ({ ...prev, ...parsed }));
      } catch (e) { console.error('Error parsing progress', e); }
    }

    if (savedStates) {
      try {
        const parsed = JSON.parse(savedStates);
        setUnitStates(parsed);
      } catch (e) { console.error('Error parsing unit states', e); }
    }

    if (!pledgeSigned) {
      setShowPledge(true);
    }

    logAuditTrail('eventLogin');
  }, [user.email]);

  const logAuditTrail = (eventType, unitId = null) => {
    const log = {
      timestamp: new Date().toISOString(),
      eventType,
      unitId,
      userId: user.uid
    };
    const currentLogs = JSON.parse(localStorage.getItem(`sqp_audit_${user.email}`) || '[]');
    currentLogs.push(log);
    localStorage.setItem(`sqp_audit_${user.email}`, JSON.stringify(currentLogs.slice(-100))); // Keep last 100 entries
  };

  const handleSignPledge = () => {
    localStorage.setItem(`sqp_pledge_${user.email}`, 'true');
    setShowPledge(false);
    logAuditTrail('eventPledge');
  };

  const units = [
    { id: 'gmp-intro', title: t('introGMP'), subtitle: t('unit1'), color: '#28a745' },
    { id: 'glp-basics', title: t('glpBasics'), subtitle: t('unit2'), color: '#007bff' },
    { id: 'iso-17025', title: t('iso17025'), subtitle: t('unit3'), color: '#ffc107' },
    { id: 'ich-guidelines', title: t('ichGuidelines'), subtitle: t('unit4'), color: '#dc3545' },
    { id: 'validation-qualification', title: t('valQual'), subtitle: t('unit5'), color: '#20c997' },
    { id: 'data-integrity', title: t('dataIntegrity'), subtitle: t('unit6'), color: '#6610f2' },
    { id: 'qrm-basics', title: t('qrmBasics'), subtitle: t('unit7'), color: '#e83e8c' },
    { id: 'gdp-basics', title: t('gdpBasics'), subtitle: t('unit8'), color: '#fd7e14' },
  ];

  const handleStartUnit = (unitId) => {
    setCurrentUnit(unitId);
    setIsLectureMode(true);
  };

  const handleLectureFinished = (unitId) => {
    console.log('Lecture finished for unit:', unitId, 'currentUnit:', currentUnit);
    // Mark lecture as finished
    setUnitStates(prev => {
      const newStates = { ...prev, [unitId]: { ...prev[unitId], lectureFinished: true } };
      localStorage.setItem(`sqp_states_${user.email}`, JSON.stringify(newStates));
      return newStates;
    });
    // Switch from lecture mode to quiz mode
    setIsLectureMode(false);
  };

  const handleQuizComplete = (result) => {
    const { score, unitId } = result;
    logAuditTrail('eventQuiz', unitId);

    // Only update if it's the highest score or if it passes
    setUserProgress(prev => {
      const isNewSuccess = score >= 90 && (!prev[unitId] || prev[unitId] < 90);
      const newProgress = {
        ...prev,
        [unitId]: Math.max(prev[unitId] || 0, score)
      };

      // If this was the last unit needed to complete the program
      const allOthersPassed = Object.entries(newProgress)
        .filter(([id]) => id !== unitId && id !== 'completionDate')
        .every(([_, s]) => s >= 90);

      if (isNewSuccess && allOthersPassed) {
        newProgress.completionDate = new Date().toISOString();
      }

      // Save to localStorage
      localStorage.setItem(`sqp_progress_${user.email}`, JSON.stringify(newProgress));
      return newProgress;
    });

    setCurrentUnit(null);
  };

  const unitIds = ['gmp-intro', 'glp-basics', 'iso-17025', 'ich-guidelines', 'validation-qualification', 'data-integrity', 'qrm-basics', 'gdp-basics'];
  const allPassed = unitIds.every(id => (userProgress[id] || 0) >= 90);
  const totalAverage = Math.round(unitIds.reduce((a, id) => a + (userProgress[id] || 0), 0) / 8);

  const DeveloperProfileModal = () => (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 5000,
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white', maxWidth: '700px', width: '100%', padding: '40px', borderRadius: '30px',
        textAlign: 'center', border: '8px solid #28a745', position: 'relative', direction: 'rtl'
      }}>
        <button onClick={() => setShowDevProfile(false)} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
<div style={{ width: '150px', height: '150px', borderRadius: '50%', margin: '0 auto 20px', border: '5px solid #28a745', overflow: 'hidden' }}>
          {/* Dr. Daoud Tajeldeinn profile from scholar/credential.net - replace src with actual URL */}
          <img 
            src="https://scholar.googleusercontent.com/citations?view_op=medium_photo&user=DzRrLjcAAAAJ&citpid=1" 
            alt="Dr. Daoud Tajeldeinn Ahmed Abdelkarim - GMP Specialist" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <h2 style={{ color: '#1a5928', fontSize: '2rem', marginBottom: '10px' }}>{t('developerName')}</h2>
        <p style={{ color: '#28a745', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px' }}>{t('developerTitle')}</p>
        <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '20px', textAlign: 'right', marginBottom: '30px' }}>
          <p style={{ lineHeight: '1.6' }}>• {t('developerTitle')}</p>
          <p>• متخصص التدريب والتأهيل الدوائي</p>
          <p>• مؤسس {t('issuingAuthority')}</p>
        </div>
        <a href="https://www.credential.net/profile/daoudtajeldeinn887198/wallet" target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
          View Digital Wallet 🌐
        </a>
      </div>
    </div>
  );

  const MicroBadge = ({ unitId, score }) => {
    const isUnlocked = score >= 90;
    return (
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        backgroundColor: isUnlocked ? '#fff' : '#f0f0f0',
        border: `3px solid ${isUnlocked ? '#28a745' : '#ddd'}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '5px', textAlign: 'center', cursor: isUnlocked ? 'pointer' : 'default',
        opacity: isUnlocked ? 1 : 0.5, transition: 'all 0.3s',
        boxShadow: isUnlocked ? '0 4px 10px rgba(40,167,69,0.2)' : 'none'
      }} onClick={() => isUnlocked && alert(`${t('microBadge')}: ${unitId.toUpperCase()}\n${t('badgeId')}: SQP-B-${unitId.substring(0, 3).toUpperCase()}-${score}`)}>
        <span style={{ fontSize: '1.5rem' }}>{isUnlocked ? '🥇' : '🔒'}</span>
        <span style={{ fontSize: '0.6rem', fontWeight: 'bold', color: isUnlocked ? '#28a745' : '#999' }}>{unitId.split('-')[0].toUpperCase()}</span>
      </div>
    );
  };

  const CertificateModal = ({ isSample = false }) => {
    const [showSurvey, setShowSurvey] = useState(!isSample && !localStorage.getItem(`sqp_survey_${user.email}`));

    if (showSurvey) {
      return (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 4000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white', maxWidth: '600px', padding: '40px', borderRadius: '24px',
            textAlign: 'center', border: '5px solid #28a745', direction: 'rtl'
          }}>
            <h2 style={{ color: '#1a5928', marginBottom: '20px' }}>{t('surveyTitle')}</h2>
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <p>1. {t('surveyQ1')}</p>
              <input type="range" min="1" max="5" style={{ width: '100%' }} />
              <p>2. {t('surveyQ2')}</p>
              <input type="range" min="1" max="5" style={{ width: '100%' }} />
              <p>3. {t('surveyQ3')}</p>
              <input type="range" min="1" max="5" style={{ width: '100%' }} />
            </div>
            <button onClick={() => { localStorage.setItem(`sqp_survey_${user.email}`, 'true'); setShowSurvey(false); }} className="btn-primary" style={{ width: '100%', padding: '15px' }}>
              {t('submitSurvey')}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 2000, padding: '40px', overflowY: 'auto'
      }}>
        <div id="certificate-printable" style={{
          backgroundColor: 'white', width: '100%', maxWidth: '1050px', minHeight: '850px',
          padding: '60px 80px', borderRadius: '4px', position: 'relative',
          border: '20px solid #d4af37', textAlign: 'center',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)', direction: 'rtl',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          overflow: 'hidden'
        }}>
          {/* Subtle Watermark */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '600px', height: '600px', backgroundImage: `url(${LOGO_PATH})`,
            backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
            opacity: 0.015, pointerEvents: 'none', zIndex: 1
          }}></div>

          {isSample && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)',
              fontSize: '12rem', color: 'rgba(255,0,0,0.07)', fontWeight: 'bold', pointerEvents: 'none', zIndex: 10
            }}>SAMPLE</div>
          )}

          <div style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
            <div style={{ position: 'absolute', top: '-30px', right: '-40px', display: 'flex', alignItems: 'center', gap: '20px', zIndex: 100 }}>
              <img src={LOGO_PATH} alt="Logo" style={{ width: '150px', height: '150px', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.1))' }} />
              <div style={{ textAlign: 'right', color: '#1a5928' }}>
                <div style={{ fontWeight: 'bold', fontSize: '2.4rem', lineHeight: '1.1' }}>{t('issuingAuthority')}</div>
                <div style={{ fontSize: '1.2rem', opacity: 1, fontWeight: 'bold', color: '#dc3545' }}>Quality & Excellence Authority</div>
              </div>
            </div>

            <div style={{ marginTop: '160px' }}>
              <h1 style={{ fontSize: '3.8rem', color: '#1a5928', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '2px' }}>{t('certTitle')}</h1>
              <div style={{ width: '220px', height: '3px', backgroundColor: '#d4af37', margin: '20px auto' }}></div>
              <div style={{ margin: '30px 0' }}>
                <p style={{ fontSize: '1.5rem', color: '#555', marginBottom: '15px', fontWeight: 'bold' }}>{t('certIntro')}</p>
                <h2 style={{ fontSize: '3.8rem', color: '#000', fontFamily: '"Playfair Display", serif', fontWeight: 'bold', borderBottom: '2px solid #eee', display: 'inline-block', paddingBottom: '5px' }}>
                  {isSample ? 'Ahmed Daoud Tajeldeinn' : (user.displayName || user.email.split('@')[0])}
                </h2>
                <div style={{ fontSize: '1.1rem', color: '#666', marginTop: '10px', fontWeight: 'bold' }}>
                  Email: {isSample ? 'daoud.specialist@quality.sd' : user.email}
                </div>
              </div>
              <p style={{ fontSize: '1.4rem', margin: '25px auto', color: '#333', lineHeight: '1.6', maxWidth: '850px' }}>
                {t('certDesc')}
              </p>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px',
              padding: '25px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '15px',
              textAlign: 'right', border: '1px solid #d4af37', margin: '20px auto', maxWidth: '800px'
            }}>
              {units.map(u => (
                <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '6px 0', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#444' }}>{t(u.id.replaceAll('-', '_'))}</span>
                  <span style={{ fontWeight: '900', color: '#1a5928', fontSize: '1rem' }}>%{isSample ? 100 : userProgress[u.id]}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', gridColumn: 'span 2', marginTop: '10px', paddingTop: '10px', borderTop: '2px solid #d4af37', fontSize: '1.8rem', fontWeight: '900', color: '#c53030' }}>
                <span>{t('totalScore')}</span>
                <span>%{isSample ? 100 : totalAverage}</span>
              </div>
            </div>

            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 20px' }}>
              <div style={{ textAlign: 'right', color: '#444' }}>
                <p style={{ margin: '5px 0', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {t('dateLabel')}: {userProgress.completionDate ? new Date(userProgress.completionDate).toLocaleDateString() : new Date().toLocaleDateString()}
                </p>
                <p style={{ fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '1px', color: '#666' }}>ID: {isSample ? 'VALID-SAMPLE-888' : `${user.uid?.substring(0, 8).toUpperCase()}-${new Date(userProgress.completionDate || new Date()).getTime().toString().substring(8)}`}</p>
                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={LOGO_PATH} alt="Small Logo" style={{ width: '35px', height: '35px', opacity: 0.8 }} />
                  <span style={{ fontSize: '0.8rem', color: '#555', fontWeight: 'bold' }}>Built by {t('developerName')}</span>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '120px', height: '120px', border: '5px double #d4af37',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 15px', backgroundColor: 'white'
                }}>
                  <img src={LOGO_PATH} alt="Seal" style={{ width: '85px', height: '85px', opacity: 1.0 }} />
                  <div style={{ position: 'absolute', fontSize: '0.75rem', fontWeight: 'bold', color: '#d4af37', transform: 'rotate(-15deg)', backgroundColor: 'rgba(255,255,255,0.7)', padding: '2px 5px' }}>OFFICIAL SEAL</div>
                </div>
                <div style={{ width: '240px', borderTop: '2px solid #1a5928', paddingTop: '10px', fontWeight: 'bold', color: '#1a5928', fontSize: '1.2rem' }}>
                  {t('developerName')}
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#dc3545' }}>Founder & GMP/ISO Specialist</div>
                </div>
              </div>
            </div>
          </div>

          <div className="no-print" style={{ marginTop: '50px', paddingBottom: '20px', position: 'relative', zIndex: 10 }}>
            {!isSample && (
              <button onClick={() => { window.print(); logAuditTrail('eventCert'); }} className="btn-primary" style={{ padding: '15px 50px', fontSize: '1.2rem', boxShadow: '0 10px 20px rgba(40,167,69,0.3)' }}>
                {t('printCert')}
              </button>
            )}
            <button onClick={() => { setShowCertificate(false); setIsSampleMode(false); }} className="btn-secondary" style={{ padding: '15px 50px', fontSize: '1.2rem', marginLeft: '15px' }}>
              {t('back')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PledgeModal = () => (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 3000,
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white', maxWidth: '600px', padding: '40px', borderRadius: '24px',
        textAlign: 'center', border: '5px solid #28a745', direction: 'rtl'
      }}>
        <h2 style={{ color: '#1a5928', marginBottom: '20px' }}>{t('pledgeTitle')}</h2>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#333', marginBottom: '30px' }}>{t('pledgeText')}</p>
        <button onClick={handleSignPledge} className="btn-primary" style={{ width: '100%', padding: '15px' }}>
          {t('pledgeAgree')}
        </button>
      </div>
    </div>
  );

  if (currentUnit) {
    if (isLectureMode) {
      return (
        <LectureView
          unitId={currentUnit}
          userName={user.displayName || user.email.split('@')[0]}
          onProceedToQuiz={() => handleLectureFinished(currentUnit)}
          onBack={() => setCurrentUnit(null)}
        />
      );
    }

    return (
      <div style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
        <button
          onClick={() => setCurrentUnit(null)}
          className="btn-secondary"
          style={{ margin: '20px' }}
        >
          {t('back')}
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
      minHeight: '100vh', paddingBottom: '50px'
    }}>
      {showPledge && <PledgeModal />}
      {showCertificate && <CertificateModal isSample={isSampleMode} />}
      {showDevProfile && <DeveloperProfileModal />}

      {/* Header */}
      <header className="main-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img src={LOGO_PATH} alt="Pharma Logo" style={{ width: '55px', height: '55px' }} />
          <div>
            <h1 style={{ fontSize: '1.8rem', margin: 0 }}>{t('issuingAuthority')}</h1>
            <p style={{ margin: 0, opacity: 0.8 }}>Quality Specialist Management System</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button onClick={() => setShowDevProfile(true)} className="btn-lang" style={{ backgroundColor: '#17a2b8', color: 'white' }}>
            {t('developerProfile')}
          </button>
          <button onClick={() => { setIsSampleMode(true); setShowCertificate(true); }} className="btn-lang" style={{ backgroundColor: '#ffc107', color: 'black' }}>
            {t('sampleCert')}
          </button>
          <button onClick={toggleLanguage} className="btn-lang">
            {language === 'ar' ? 'English' : 'العربية'}
          </button>

          <div className="user-profile">
            {user.photoURL && <img src={user.photoURL} alt="P" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />}
            <span style={{ fontWeight: '500' }}>{user.displayName || user.email}</span>
          </div>

          <button onClick={onLogout} className="btn-logout">
            {t('logout')}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Micro-Credentials Wallet Section */}
        <section style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '24px', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '20px', color: '#1a5928', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🎫</span> {t('microBadge')} Wallet
          </h3>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {units.map(u => (
              <MicroBadge key={u.id} unitId={u.id} score={userProgress[u.id]} />
            ))}
          </div>
        </section>

        {/* NEW: Visual Icon Grid for Units */}
        <section style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '24px', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '25px', color: '#1a5928', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>📚</span> {t('availableUnits')}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {units.map((unit) => {
              const unitIcon = UNIT_ICONS[unit.id] || { icon: '📖', color: '#28a745' };
              const finishedLecture = unitStates[unit.id]?.lectureFinished;
              const progress = userProgress[unit.id] || 0;
              const isPassed = progress >= 90;
              
              return (
                <div 
                  key={unit.id}
                  onClick={() => handleStartUnit(unit.id)}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '20px',
                    padding: '25px',
                    cursor: 'pointer',
                    border: `2px solid ${isPassed ? '#28a745' : '#e9ecef'}`,
                    boxShadow: isPassed ? '0 8px 25px rgba(40,167,69,0.2)' : '0 4px 15px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Progress indicator */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: language === 'ar' ? 'auto' : '10px',
                    left: language === 'ar' ? '10px' : 'auto',
                    backgroundColor: isPassed ? '#28a745' : '#6c757d',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {progress}%
                  </div>
                  
                  {/* Icon */}
                  <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    backgroundColor: `${unitIcon.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 15px',
                    fontSize: '2.5rem'
                  }}>
                    {unitIcon.icon}
                  </div>
                  
                  {/* Title */}
                  <h4 style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '1.1rem',
                    color: '#2c3e50'
                  }}>
                    {unit.title}
                  </h4>
                  
                  {/* Subtitle */}
                  <p style={{ 
                    margin: '0 0 15px 0', 
                    fontSize: '0.85rem',
                    color: '#888'
                  }}>
                    {unit.subtitle}
                  </p>
                  
                  {/* Status badge */}
                  {finishedLecture && (
                    <div style={{
                      backgroundColor: '#d4edda',
                      color: '#155724',
                      padding: '6px 15px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      display: 'inline-block'
                    }}>
                      ✓ {language === 'ar' ? 'مكتمل' : 'Completed'}
                    </div>
                  )}
                  
                  {!finishedLecture && (
                    <div style={{
                      backgroundColor: unitIcon.color,
                      color: 'white',
                      padding: '8px 20px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      display: 'inline-block'
                    }}>
                      {t('startStudy')} →
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Certificate Summary */}
        <div className="certificate-sidebar">
          <div className="cert-trophy">🏆</div>
          <h2 style={{ color: '#1a5928' }}>{t('earnedCertificates')}</h2>
          <p style={{ color: '#666', margin: '15px 0' }}>
            {allPassed ? t('earned') : t('lockedMsg')}
          </p>

          <div className="progress-container">
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${(unitIds.filter(id => (userProgress[id] || 0) >= 90).length / 8) * 100}%`,
                }}
              ></div>
            </div>
            <p style={{ marginTop: '10px', fontWeight: '500' }}>
              {unitIds.filter(id => (userProgress[id] || 0) >= 90).length} / 8 {t('completed')}
            </p>
          </div>

          <button
            disabled={!allPassed}
            onClick={() => { setIsSampleMode(false); setShowCertificate(true); }}
            className={`btn-cert ${allPassed ? 'active' : ''}`}
          >
            {allPassed ? t('viewCert') : t('lockedMsg').split(':')[0]}
          </button>
        </div>
      </main>

      {/* Footer Branding */}
      <footer style={{ textAlign: 'center', padding: '40px', color: '#888', borderTop: '1px solid #eee' }}>
        <p style={{ fontWeight: 'bold' }}>{t('issuingAuthority')} - Certified Educational Platform</p>
        <p style={{ fontSize: '0.9rem' }}>Developed & Maintained by <span style={{ color: '#28a745', fontWeight: 'bold' }}>{t('developerName')}</span></p>
        <p style={{ fontSize: '0.8rem' }}>© {new Date().getFullYear()} Sudan Quality Platform. All International Patents Reserved.</p>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        .main-header { background-color: #28a745; color: white; padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .user-profile { display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.1); padding: 5px 15px; border-radius: 40px; }
        .user-profile img { width: 32px; height: 32px; border-radius: 50%; }
        .btn-lang { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 8px 15px; border-radius: 8px; cursor: pointer; transition: 0.2s; font-weight: bold; }
        .btn-lang:hover { background: rgba(255,255,255,0.2); }
        .btn-logout { background: #dc3545; color: white; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; }
        .btn-logout:hover { background: #c82333; }
        .btn-primary { background: #28a745; color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: bold; padding: 12px 30px; }
        .btn-secondary { background: #6c757d; color: white; border: none; border-radius: 12px; cursor: pointer; padding: 10px 20px; }
        .dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 30px; }
        .units-section { background-color: white; padding: 30px; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); grid-column: span 2; }
        .section-title { color: #1a5928; margin-bottom: 25px; display: flex; align-items: center; gap: 10px; }
        .section-title .dot { width: 8px; height: 24px; background-color: #28a745; border-radius: 4px; }
        .units-list { display: flex; flex-direction: column; gap: 15px; }
        .unit-card { display: flex; justify-content: space-between; align-items: center; padding: 20px; background-color: #fcfcfc; border: 1px solid #f0f0f0; border-radius: 16px; transition: all 0.2s; }
        .unit-card:hover { border-color: #28a745; box-shadow: 0 5px 15px rgba(40,167,69,0.1); }
        .unit-card h4 { margin: 0; font-size: 1.1rem; }
        .unit-subtitle { font-size: 0.85rem; color: #888; }
        .unit-actions { display: flex; align-items: center; gap: 20px; }
        .score-badge { text-align: center; }
        .score-badge .label { font-size: 0.8rem; color: #666; }
        .score-badge .value { font-weight: bold; }
        .btn-start { border: none; padding: 10px 20px; border-radius: 12px; cursor: pointer; font-weight: bold; }
        .certificate-sidebar { background-color: white; padding: 30px; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: center; text-align: center; height: fit-content; }
        .certificate-sidebar h2 { color: #1a5928; }
        .certificate-sidebar p { color: #666; margin: 15px 0; }
        .cert-trophy { font-size: 4rem; margin-bottom: 10px; }
        .progress-container { margin: 20px 0; }
        .progress-bar-bg { width: 100%; height: 12px; background-color: #eee; border-radius: 6px; overflow: hidden; }
        .progress-bar-fill { height: 100%; background-color: #28a745; transition: width 1s ease; }
        .btn-cert { width: 100%; padding: 18px; border-radius: 16px; border: none; background-color: #ccc; color: white; font-size: 1.2rem; font-weight: bold; cursor: not-allowed; box-shadow: none; }
        .btn-cert.active { background-color: #28a745; cursor: pointer; box-shadow: 0 10px 20px rgba(40, 167, 69, 0.3); }
        .lecture-done { font-size: 0.75rem; color: #28a745; font-weight: bold; display: block; margin-top: 5px; }
        @media print {
          body * { visibility: hidden; }
          #certificate-printable, #certificate-printable * { visibility: visible; }
          #certificate-printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            box-shadow: none;
          }
          .no-print { display: none !important; }
        }
      `}} />
    </div>
  );
};

export default Dashboard;
