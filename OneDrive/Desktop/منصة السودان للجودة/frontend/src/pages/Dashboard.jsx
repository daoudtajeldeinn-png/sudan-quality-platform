import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Quiz from '../components/Quiz';
import LectureView from '../components/LectureView';
import FMEATool from '../components/FMEATool';
import BatchSignSim from '../components/BatchSignSim';
import StabilityCalculator from '../components/StabilityCalculator';
import SamplingCalculator from '../components/SamplingCalculator';
import InspectionChecklist from '../components/InspectionChecklist';
import { useLanguage } from '../LanguageContext';
import { useGamification } from '../GamificationContext';
import pharmaLogo from '../assets/pharma_logo.png';
import certBg from '../assets/certificate_bg.png';
import apiService from '../services/api';

const TRACKS = [
  { id: 'qms', titleKey: 'track_qms', units: ['gmp-intro', 'ich-q10', 'adv-gmp'], icon: '🏆', color: '#17a2b8' },
  { id: 'sterile', titleKey: 'track_sterile', units: ['sterile-annex1'], icon: '🛡️', color: '#6c757d' },
  { id: 'data_integrity', titleKey: 'track_data_integrity', units: ['data-integrity', 'gamp5-basics', 'batch-records'], icon: '💻', color: '#6610f2' },
  { id: 'qrm', titleKey: 'track_qrm', units: ['qrm-basics', 'adv-qrm'], icon: '⚠️', color: '#e83e8c' },
  { id: 'validation', titleKey: 'track_validation', units: ['validation-qualification', 'adv-validation'], icon: '✅', color: '#20c997' },
  { id: 'gdp', titleKey: 'track_gdp', units: ['gdp-basics', 'adv-gdp'], icon: '🚚', color: '#fd7e14' },
  { id: 'regulatory', titleKey: 'track_regulatory', units: ['nmpb-reg', 'ich-guidelines', 'glp-basics', 'iso-17025', 'adv-glp', 'adv-iso-17025'], icon: '⚖️', color: '#009688' },
];

const UNIT_ICONS = {
  'gmp-intro': { icon: '🏭', color: '#10b981', title: { ar: 'مقدمة في GMP', en: 'Intro to GMP' } },
  'glp-basics': { icon: '🔬', color: '#3b82f6', title: { ar: 'مبادئ GLP', en: 'GLP Basics' } },
  'iso-17025': { icon: '📊', color: '#f59e0b', title: { ar: 'ISO 17025', en: 'ISO 17025' } },
  'ich-guidelines': { icon: '🌐', color: '#ef4444', title: { ar: 'إرشادات ICH', en: 'ICH Guidelines' } },
  'validation-qualification': { icon: '✅', color: '#06b6d4', title: { ar: 'التحقق والتأهيل', en: 'Validation & Qualification' } },
  'data-integrity': { icon: '🔒', color: '#8b5cf6', title: { ar: 'سلامة البيانات', en: 'Data Integrity' } },
  'qrm-basics': { icon: '⚠️', color: '#ec4899', title: { ar: 'إدارة المخاطر', en: 'QRM Basics' } },
  'gdp-basics': { icon: '🚚', color: '#f97316', title: { ar: 'ممارسات التوزيع', en: 'GDP Basics' } },
  'ich-q10': { icon: '🏆', color: '#0891b2', title: { ar: 'نظام Q10', en: 'ICH Q10' } },
  'sterile-annex1': { icon: '🛡️', color: '#64748b', title: { ar: 'التصنيع المعقم', en: 'Sterile Mfg' } },
  'gamp5-basics': { icon: '💻', color: '#4a5568', title: { ar: 'GAMP 5', en: 'GAMP 5' } },
  'batch-records': { icon: '📝', color: '#4c51bf', title: { ar: 'سجلات التشغيل', en: 'Batch Records' } },
  'nmpb-reg': { icon: '🇸🇩', color: '#059669', title: { ar: 'الرقابة الدوائية', en: 'NMPB Regulatory' } },
  'adv-gmp': { icon: '🏭+', color: '#10b981', title: { ar: 'ممارسات التصنيع المتقدمة', en: 'Adv. GMP' } },
  'adv-glp': { icon: '🔬+', color: '#3b82f6', title: { ar: 'تحليل بيانات GLP', en: 'Adv. GLP' } },
  'adv-iso-17025': { icon: '📊+', color: '#f59e0b', title: { ar: 'التطبيق العملي لـ ISO', en: 'Adv. ISO' } },
  'adv-validation': { icon: '✅+', color: '#06b6d4', title: { ar: 'التحقق المتقدم', en: 'Adv. Validation' } },
  'adv-qrm': { icon: '⚠️+', color: '#ec4899', title: { ar: 'تطبيقات QRM', en: 'Adv. QRM' } },
  'adv-gdp': { icon: '🚚+', color: '#f97316', title: { ar: 'سلسلة التبريد', en: 'Adv. GDP' } },
};

const Dashboard = ({ user, onLogout }) => {
  const { language, toggleLanguage, t, theme, toggleTheme } = useLanguage();
  const { xp, level, badges, getXpToNextLevel, stats, updateStats, addXp, awardBadge } = useGamification();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [userCertLevel, setUserCertLevel] = useState(1);
  const [certificates, setCertificates] = useState([]);
  const [currentUnit, setCurrentUnit] = useState(null);
  const [isLectureMode, setIsLectureMode] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [isSampleMode, setIsSampleMode] = useState(false);
  const [showPledge, setShowPledge] = useState(false);
  const [showDevProfile, setShowDevProfile] = useState(false);
  const [viewMode, setViewMode] = useState('academy');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [userProgress, setUserProgress] = useState({
    'gmp-intro': 0, 'glp-basics': 0, 'iso-17025': 0, 'ich-guidelines': 0,
    'validation-qualification': 0, 'data-integrity': 0, 'qrm-basics': 0,
    'gdp-basics': 0, 'ich-q10': 0, 'sterile-annex1': 0, 'gamp5-basics': 0,
    'batch-records': 0, 'nmpb-reg': 0,
    'adv-gmp': 0, 'adv-glp': 0, 'adv-iso-17025': 0, 'adv-validation': 0,
    'adv-qrm': 0, 'adv-gdp': 0
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [unitStates, setUnitStates] = useState({});
  const [streak, setStreak] = useState(0);
  const unitIds = Object.keys(userProgress).filter(id => !id.startsWith('completionDate'));


  const LOGO_PATH = pharmaLogo;
  const CERT_BG = certBg;

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const savedProgress = localStorage.getItem(`sqp_progress_${user?.email || 'guest'}`);
        const savedStates = localStorage.getItem(`sqp_states_${user?.email || 'guest'}`);
        const pledgeSigned = localStorage.getItem(`sqp_pledge_${user?.email || 'guest'}`);

        if (savedProgress) {
          try {
            const parsed = JSON.parse(savedProgress);
            setUserProgress(prev => ({ ...prev, ...parsed }));
          } catch (e) { console.error('Error parsing progress', e); }
        }
        if (savedStates) {
          try { setUnitStates(JSON.parse(savedStates)); } catch (e) {}
        }
        if (!pledgeSigned) setShowPledge(true);

        if (user?.uid) {
          const profile = await apiService.getUserProfile(user.uid);
          if (profile && profile.progress) {
            const remoteProgress = profile.progress.unitScores || {};
            setUserProgress(prev => {
              const reconciled = { ...prev };
              Object.keys(remoteProgress).forEach(unitId => {
                reconciled[unitId] = Math.max(prev[unitId] || 0, remoteProgress[unitId]);
              });
              return reconciled;
            });
            if (profile.progress.unitStates) {
              setUnitStates(prev => ({ ...profile.progress.unitStates, ...prev }));
            }
            setUserCertLevel(profile.progress.level || 1);
            const certsData = await apiService.getUserCertificates(user.uid);
            setCertificates(certsData.certificates || []);
          }
        } else {
          // Guest fallback
          setUserCertLevel(1);
        }

        // Streak
        const lastLogin = localStorage.getItem(`sqp_last_login_${user?.email || 'guest'}`);
        const currentStreak = parseInt(localStorage.getItem(`sqp_streak_${user?.email || 'guest'}`) || '0');
        const today = new Date().toDateString();
        
        if (lastLogin === today) {
          setStreak(currentStreak);
        } else {
          setStreak(1);
          localStorage.setItem(`sqp_streak_${user?.email || 'guest'}`, '1');
        }
        localStorage.setItem(`sqp_last_login_${user?.email || 'guest'}`, today);
      } catch (error) {
        console.error('Dashboard load error:', error);
        setLoadError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [user?.uid, user?.email]);

  useEffect(() => {
    if (viewMode === 'academy' && !currentTrack) {
      apiService.getLeaderboard()
        .then(data => setLeaderboard(data))
        .catch(err => console.error('Leaderboard fetch failed', err));
    }
  }, [viewMode, currentTrack]);

  const logAuditTrail = (eventType, unitId = null) => {
    const log = {
      timestamp: new Date().toISOString(),
      eventType,
      unitId,
      userId: user?.uid
    };
    const currentLogs = JSON.parse(localStorage.getItem(`sqp_audit_${user?.email || 'guest'}`) || '[]');
    currentLogs.push(log);
    localStorage.setItem(`sqp_audit_${user?.email || 'guest'}`, JSON.stringify(currentLogs.slice(-100)));
  };

  const handleSignPledge = () => {
    localStorage.setItem(`sqp_pledge_${user?.email || 'guest'}`, 'true');
    setShowPledge(false);
    logAuditTrail('eventPledge');
  };

  const handleLevelToggle = async () => {
    const newLevel = userCertLevel === 1 ? 2 : 1;
    setUserCertLevel(newLevel);
    if (user?.uid) {
      try {
        await apiService.setUserLevel(user.uid, newLevel);
      } catch (e) {
        console.error('Level toggle failed', e);
      }
    }
  };

  const handleQuizComplete = async (result) => {
    const { score, unitId } = result;
    logAuditTrail('eventQuiz', unitId);

    if (score >= 90 && user?.uid) {
      try {
        await apiService.awardCertificate({
          userId: user.uid,
          userName: user.displayName || user.email,
          unitId,
          unitName: allUnitsDefinition.find(u => u.id === unitId)?.title?.[language] || unitId,
          score,
          percentage: score
        });
        console.log('شهادة مُصدرة تلقائياً!');
      } catch (e) {
        console.error('Award failed', e);
      }
    }

    setUserProgress(prev => {
      const newProgress = { ...prev, [unitId]: Math.max(prev[unitId] || 0, score) };
      localStorage.setItem(`sqp_progress_${user?.email || 'guest'}`, JSON.stringify(newProgress));
      if (user?.uid) {
        apiService.syncUserStats(user.uid, {
          progress: {
            unitScores: newProgress,
            unitStates,
            level: userCertLevel,
            totalScore: Object.values(newProgress).reduce((a, b) => a + b, 0)
          }
        }).catch(console.error);
      }
      return newProgress;
    });
    setCurrentUnit(null);
  };

  const allUnitsDefinition = [
    { id: 'nmpb-reg', title: { ar: 'الرقابة الدوائية', en: 'NMPB Regulatory' }, color: '#059669' },
    { id: 'gmp-intro', title: { ar: 'مقدمة GMP', en: 'GMP Intro' }, color: '#10b981' },
    // ... rest as before
  ];

  // Simplified for brevity - full in actual file
  const currentTrackObj = currentTrack ? TRACKS.find(t => t.id === currentTrack) : null;
  const currentSectionUnits = currentTrackObj ? currentTrackObj.units : [];
  const units = allUnitsDefinition.filter(u => currentSectionUnits.includes(u.id));
  const allTrackUnits = TRACKS.flatMap(t => t.units);

  const totalAverage = Math.round(allTrackUnits.reduce((a, id) => a + (userProgress[id] || 0), 0) / (allTrackUnits.length || 1));
  const allPassed = allTrackUnits.every(id => (userProgress[id] || 0) >= 90);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '70vh', 
        direction: language === 'ar' ? 'rtl' : 'ltr',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ fontSize: '1.5rem', color: '#28a745' }}>جاري تحميل الكورسات...</div>
        <div style={{ marginTop: '20px' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #28a745', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px', 
        color: '#dc3545',
        direction: language === 'ar' ? 'rtl' : 'ltr'
      }}>
        <h3>خطأ في تحميل البيانات</h3>
        <p>{loadError}</p>
        <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
      {/* PROMINENT BANNER ALWAYS VISIBLE */}
      <div style={{
        background: 'linear-gradient(90deg, #d4edda, #c3e6cb)',
        color: '#155724',
        padding: '20px',
        textAlign: 'center',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginBottom: '20px',
        borderBottom: '4px solid #28a745',
        boxShadow: '0 2px 10px rgba(40,167,69,0.2)'
      }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>📜 <strong>قواعد الشهادات</strong></div>
        <div>
          {userCertLevel === 1 
            ? <span>المستوى الابتدائي: <strong style={{ color: '#28a745' }}>كل 3 كورسات = شهادة مجمعة بتفاصيل الثلاثة</strong></span> 
            : <span>المستوى المتقدم: <strong style={{ color: '#28a745' }}>شهادة لكل كورس على حدة</strong></span>
          }
        </div>
        <button onClick={handleLevelToggle} style={{
          marginTop: '10px',
          padding: '10px 20px',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '1rem'
        }}>
          {userCertLevel === 1 ? 'التبديل إلى متقدم' : 'التبديل إلى ابتدائي'}
        </button>
      </div>

      {/* Certificates Section */}
      <section style={{ padding: '30px', borderRadius: '24px', marginBottom: '30px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#17a2b8' }}>🎯 الشهادات المحقّقة ({certificates.length})</h3>
        <div style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#28a745', fontWeight: 'bold' }}>
          {userCertLevel === 1 ? 'كل 3 كورسات اكتملت بنسبة 90%+ = شهادة' : 'كل كورس اكتمل بنسبة 90%+ = شهادة'}
        </div>
        {certificates.length > 0 ? certificates.map(cert => (
          <div key={cert.certificateId} style={{ padding: '15px', marginBottom: '10px', background: '#d4edda', borderRadius: '10px', borderLeft: '5px solid #28a745' }}>
            {cert.unitType || 'شهادة مجمعة'} - <strong>L{cert.level}</strong> - {cert.score}%
          </div>
        )) : <p style={{ color: '#6c757d' }}>ابدأ الكورسات لتحقيق شهاداتك!</p>}
      </section>

      {/* Course Tracks Section - Ensure renders */}
      <section style={{ padding: '30px', borderRadius: '24px', marginBottom: '30px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#17a2b8', textAlign: 'center' }}>📚 الكورسات المتاحة</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {TRACKS.map((track) => (
            <div key={track.id} style={{
              padding: '20px',
              borderRadius: '16px',
              background: track.color + '20',
              border: '2px solid ' + track.color + '40',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              ':hover': { transform: 'translateY(-4px)' }
            }} onClick={() => setCurrentTrack(track.id)}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{track.icon}</div>
              <h3 style={{ color: track.color, margin: '0 0 10px 0' }}>{t(track.titleKey)}</h3>
              <p>{track.units.length} وحدة دراسية</p>
            </div>
          ))}
        </div>
      </section>

      {/* Progress Bar Section */}
      <section style={{ padding: '30px', borderRadius: '24px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h3>📊 تقدمك في المنصة</h3>
        <div style={{ width: '100%', height: '20px', background: '#e9ecef', borderRadius: '10px', marginTop: '10px' }}>
          <div style={{ 
            width: `${totalAverage}%`, 
            height: '100%', 
            background: `linear-gradient(90deg, #28a745, #20c997)`, 
            borderRadius: '10px',
            transition: 'width 0.5s ease'
          }}></div>
        </div>
        <p style={{ marginTop: '5px' }}>متوسط التقدم: {totalAverage}%</p>
      </section>
    </div>
  );

};

export default Dashboard;

