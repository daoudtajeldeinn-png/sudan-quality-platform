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

// Unit grouping
const TRACKS = [
  { id: 'qms', titleKey: 'track_qms', units: ['gmp-intro', 'ich-q10', 'adv-gmp'], icon: '🏆', color: '#17a2b8' },
  { id: 'sterile', titleKey: 'track_sterile', units: ['sterile-annex1'], icon: '🛡️', color: '#6c757d' },
  { id: 'data_integrity', titleKey: 'track_data_integrity', units: ['data-integrity', 'gamp5-basics', 'batch-records'], icon: '💻', color: '#6610f2' },
  { id: 'qrm', titleKey: 'track_qrm', units: ['qrm-basics', 'adv-qrm'], icon: '⚠️', color: '#e83e8c' },
  { id: 'validation', titleKey: 'track_validation', units: ['validation-qualification', 'adv-validation'], icon: '✅', color: '#20c997' },
  { id: 'gdp', titleKey: 'track_gdp', units: ['gdp-basics', 'adv-gdp'], icon: '🚚', color: '#fd7e14' },
  { id: 'regulatory', titleKey: 'track_regulatory', units: ['nmpb-reg', 'ich-guidelines', 'glp-basics', 'iso-17025', 'adv-glp', 'adv-iso-17025'], icon: '⚖️', color: '#009688' },
];

// Unit icons mapping
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

  // Load progress and state from Backend + localStorage on mount
  useEffect(() => {
    const loadInitialData = async () => {
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
        try { setUnitStates(JSON.parse(savedStates)); } catch (e) {}
      }
      if (!pledgeSigned) setShowPledge(true);

      if (user.uid) {
        try {
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
          }
        } catch (error) {
          console.warn('Backend load failed', error);
        }
      }

      // Streak Calculation
      const lastLogin = localStorage.getItem(`sqp_last_login_${user.email}`);
      const currentStreak = parseInt(localStorage.getItem(`sqp_streak_${user.email}`) || '0');
      const today = new Date().toDateString();
      
      if (lastLogin) {
        if (lastLogin === today) {
          setStreak(currentStreak);
        } else {
          const lastDate = new Date(lastLogin);
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastDate.toDateString() === yesterday.toDateString()) {
            const nextStreak = currentStreak + 1;
            setStreak(nextStreak);
            localStorage.setItem(`sqp_streak_${user.email}`, nextStreak.toString());
          } else {
            setStreak(1);
            localStorage.setItem(`sqp_streak_${user.email}`, '1');
          }
        }
      } else {
        setStreak(1);
        localStorage.setItem(`sqp_streak_${user.email}`, '1');
      }
      localStorage.setItem(`sqp_last_login_${user.email}`, today);
    };

    loadInitialData();
  }, [user.uid, user.email]);

  // Fetch leaderboard
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
      userId: user.uid
    };
    const currentLogs = JSON.parse(localStorage.getItem(`sqp_audit_${user.email}`) || '[]');
    currentLogs.push(log);
    localStorage.setItem(`sqp_audit_${user.email}`, JSON.stringify(currentLogs.slice(-100)));
  };

  const handleSignPledge = () => {
    localStorage.setItem(`sqp_pledge_${user.email}`, 'true');
    setShowPledge(false);
    logAuditTrail('eventPledge');
  };

  const allUnitsDefinition = [
    { id: 'nmpb-reg', title: t('nmpbReg'), subtitle: t('unit1'), color: '#059669' },
    { id: 'gmp-intro', title: t('introGMP'), subtitle: t('unit1'), color: '#10b981' },
    { id: 'glp-basics', title: t('glpBasics'), subtitle: t('unit2'), color: '#3b82f6' },
    { id: 'iso-17025', title: t('iso17025'), subtitle: t('unit3'), color: '#f59e0b' },
    { id: 'ich-guidelines', title: t('ichGuidelines'), subtitle: t('unit4'), color: '#ef4444' },
    { id: 'validation-qualification', title: t('valQual'), subtitle: t('unit5'), color: '#06b6d4' },
    { id: 'data-integrity', title: t('dataIntegrity'), subtitle: t('unit6'), color: '#8b5cf6' },
    { id: 'qrm-basics', title: t('qrmBasics'), subtitle: t('unit7'), color: '#ec4899' },
    { id: 'gdp-basics', title: t('gdpBasics'), subtitle: t('unit8'), color: '#f97316' },
    { id: 'ich-q10', title: t('ichQ10'), subtitle: t('unit9'), color: '#0891b2' },
    { id: 'sterile-annex1', title: t('annex1'), subtitle: t('unit10'), color: '#64748b' },
    { id: 'gamp5-basics', title: t('gamp5'), subtitle: t('unit11'), color: '#4a5568' },
    { id: 'batch-records', title: t('batchRecords'), subtitle: t('unit12'), color: '#4c51bf' },
    { id: 'adv-gmp', title: t('adv_gmp'), subtitle: t('unit1'), color: '#059669' },
    { id: 'adv-glp', title: t('adv_glp'), subtitle: t('unit2'), color: '#2563eb' },
    { id: 'adv-iso-17025', title: t('adv_iso_17025'), subtitle: t('unit3'), color: '#d97706' },
    { id: 'adv-validation', title: t('adv_validation'), subtitle: t('unit4'), color: '#0891b2' },
    { id: 'adv-qrm', title: t('adv_qrm'), subtitle: t('unit5'), color: '#db2777' },
    { id: 'adv-gdp', title: t('adv_gdp'), subtitle: t('unit6'), color: '#ea580c' },
  ];

  const currentTrackObj = currentTrack ? TRACKS.find(t => t.id === currentTrack) : null;
  const currentSectionUnits = currentTrackObj ? currentTrackObj.units : [];
  const units = allUnitsDefinition.filter(u => currentSectionUnits.includes(u.id));
  const allTrackUnits = TRACKS.flatMap(t => t.units);

  const handleStartUnit = (unitId) => {
    setCurrentUnit(unitId);
    setIsLectureMode(true);
  };

  const handleLectureFinished = (unitId) => {
    setUnitStates(prev => {
      const newStates = { ...prev, [unitId]: { ...prev[unitId], lectureFinished: true } };
      localStorage.setItem(`sqp_states_${user.email}`, JSON.stringify(newStates));
      return newStates;
    });
    setIsLectureMode(false);
  };

  const handleQuizComplete = (result) => {
    const { score, unitId } = result;
    logAuditTrail('eventQuiz', unitId);

    setUserProgress(prev => {
      const isNewSuccess = score >= 90 && (!prev[unitId] || prev[unitId] < 90);
      const newProgress = { ...prev, [unitId]: Math.max(prev[unitId] || 0, score) };
      const allOthersPassed = allTrackUnits.filter(id => id !== unitId).every(id => (newProgress[id] || 0) >= 90);
      if (isNewSuccess && allOthersPassed) newProgress[`completionDate_academy`] = new Date().toISOString();
      localStorage.setItem(`sqp_progress_${user.email}`, JSON.stringify(newProgress));
      if (user.uid) {
        apiService.syncUserStats(user.uid, {
          progress: {
            unitScores: newProgress,
            unitStates: unitStates,
            lastPlayed: unitId,
            totalScore: Object.values(newProgress).reduce((a, b) => a + b, 0)
          }
        }).catch(err => console.error('Sync failed:', err));
      }
      return newProgress;
    });
    setCurrentUnit(null);
  };

  const totalAverage = Math.round(allTrackUnits.reduce((a, id) => a + (userProgress[id] || 0), 0) / (allTrackUnits.length || 1));
  const allPassed = allTrackUnits.every(id => (userProgress[id] || 0) >= 90);

  const DeveloperProfileModal = () => (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 5000,
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{
        backgroundColor: 'white', maxWidth: '600px', width: '100%', padding: '40px', borderRadius: '30px',
        textAlign: 'center', border: '8px solid #28a745', position: 'relative', direction: language === 'ar' ? 'rtl' : 'ltr',
        margin: 'auto'
      }}>
        <button onClick={() => setShowDevProfile(false)} style={{ position: 'absolute', top: '20px', right: language === 'ar' ? 'auto' : '20px', left: language === 'ar' ? '20px' : 'auto', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
        <div style={{ width: '150px', height: '150px', borderRadius: '50%', margin: '0 auto 20px', border: '5px solid #28a745', overflow: 'hidden' }}>
          <img 
            src="https://scholar.googleusercontent.com/citations?view_op=medium_photo&user=DzRrLjcAAAAJ&citpid=1" 
            alt="Dr. Daoud Tajeldeinn Ahmed Abdelkarim" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <h2 style={{ color: '#1a5928', fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '10px' }}>{t('developerName')}</h2>
        <p style={{ color: '#28a745', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px' }}>{t('developerTitle')}</p>
        <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '20px', textAlign: language === 'ar' ? 'right' : 'left', marginBottom: '30px', fontSize: '1rem' }}>
          <p style={{ lineHeight: '1.8', margin: '5px 0' }}>• {t('developerTitle')}</p>
          <p style={{ lineHeight: '1.8', margin: '5px 0' }}>• {language === 'ar' ? 'متخصص التدريب والتأهيل الدوائي' : 'Pharmaceutical Training & Qualification Specialist'}</p>
          <p style={{ lineHeight: '1.8', margin: '5px 0' }}>• {language === 'ar' ? `مؤسس ${t('issuingAuthority')}` : `Founder of ${t('issuingAuthority')}`}</p>
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

    const downloadCertificatePDF = async () => {
      const input = document.getElementById('certificate-printable');
      if (!input) return;
      window.scrollTo(0, 0);
      
      // Ensure fonts are loaded before capture
      try {
        await document.fonts.ready;
      } catch (e) {
        console.warn('Font loading wait failed', e);
      }
      
      await new Promise(resolve => setTimeout(resolve, 800)); // Increased delay for better rendering

      html2canvas(input, { 
        scale: 2.5, 
        useCORS: true, 
        logging: false,
        letterRendering: true,
        allowTaint: true
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'l',
          unit: 'mm',
          format: 'a4',
          hotfixes: ["px_scaling"]
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        pdf.save(`${isSample ? 'SAMPLE_' : ''}Sudan_Quality_Platform_Certificate.pdf`);
        logAuditTrail('eventCert');
      });
    };

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
        backgroundColor: 'rgba(10, 22, 40, 0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 2000, padding: '40px', overflowY: 'auto'
      }}>
        <div id="certificate-printable" style={{
          backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '1050px', minHeight: '850px',
          padding: '60px 80px', borderRadius: '4px', position: 'relative',
          border: '15px solid var(--pharma-navy)', outline: '5px solid var(--pharma-gold)', outlineOffset: '-25px',
          textAlign: 'center',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)', direction: 'rtl',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          fontFamily: language === 'ar' ? "'IBM Plex Sans Arabic', 'Amiri', serif" : "'Inter', 'IBM Plex Sans', sans-serif"
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '600px', height: '600px', backgroundImage: `url(${LOGO_PATH})`,
            backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
            opacity: 0.03, pointerEvents: 'none', zIndex: 1
          }}></div>

          <div style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
            <div style={{ position: 'absolute', top: '-30px', right: '-40px', display: 'flex', alignItems: 'center', gap: '20px', zIndex: 100 }}>
              <img src={LOGO_PATH} alt="Logo" style={{ width: '130px', height: '130px' }} />
              <div style={{ textAlign: 'right', color: 'var(--pharma-navy)' }}>
                <div style={{ fontWeight: 'bold', fontSize: '2.2rem', lineHeight: '1.2' }}>{t('issuingAuthority')}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--regulatory-amber)' }}>Quality & Accreditation Board</div>
              </div>
            </div>

            <div style={{ marginTop: '160px' }}>
              <h1 style={{ fontSize: '3.5rem', color: 'var(--pharma-navy)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>
                {t('certTitle')}
              </h1>
              <div style={{ width: '250px', height: '4px', backgroundColor: 'var(--pharma-gold)', margin: '20px auto' }}></div>
              <div style={{ margin: '30px 0' }}>
                <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginBottom: '15px', fontWeight: '600' }}>{t('certIntro')}</p>
                <h2 style={{ fontSize: '3.8rem', color: 'var(--pharma-blue)', fontWeight: '700' }}>
                  {isSample ? 'Ahmed Daoud Tajeldeinn' : (user.displayName || user.email.split('@')[0])}
                </h2>
              </div>
              <p style={{ fontSize: '1.4rem', margin: '25px auto', color: 'var(--text-primary)', lineHeight: '1.8', maxWidth: '850px', fontWeight: '500' }}>
                {t('certDesc')}
              </p>
            </div>

            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 20px' }}>
              <div style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                <p style={{ margin: '5px 0', fontWeight: '700', fontSize: '1.1rem', color: 'var(--pharma-navy)' }}>
                  {t('dateLabel')}: {new Date().toLocaleDateString()}
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <img src={LOGO_PATH} alt="Seal" style={{ width: '85px', height: '85px' }} />
                <div style={{ width: '240px', borderTop: '2px solid var(--pharma-navy)', paddingTop: '10px', fontWeight: '800', color: 'var(--pharma-navy)', fontSize: '1.2rem' }}>
                  {t('developerName')}
                </div>
              </div>
            </div>
          </div>

          <div className="no-print" style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: '15px' }}>
            <button onClick={downloadCertificatePDF} style={{ padding: '12px 40px', backgroundColor: 'var(--pharma-navy)', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              📄 Download PDF
            </button>
            <button onClick={() => { setShowCertificate(false); setIsSampleMode(false); }} style={{ padding: '12px 40px', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
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
          onProceedToQuiz={() => handleLectureFinished(currentUnit)}
          onBack={() => setCurrentUnit(null)}
        />
      );
    }
    return (
      <div style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
        <button onClick={() => setCurrentUnit(null)} className="btn-secondary" style={{ margin: '20px' }}>{t('back')}</button>
        <Quiz unitId={currentUnit} onQuizComplete={handleQuizComplete} user={user} />
      </div>
    );
  }

  return (
    <div style={{ direction: language === 'ar' ? 'rtl' : 'ltr', paddingBottom: '50px' }}>
      {showPledge && <PledgeModal />}
      {showCertificate && <CertificateModal isSample={isSampleMode} />}
      {showDevProfile && <DeveloperProfileModal />}

      <header className="main-header glass-panel" style={{ borderRadius: '0 0 24px 24px', margin: '0 20px', backgroundColor: 'var(--primary-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img src={LOGO_PATH} alt="Pharma Logo" style={{ width: '55px', height: '55px' }} />
          <div>
            <h1 style={{ fontSize: '1.8rem', margin: 0 }}>{t('issuingAuthority')}</h1>
            <p style={{ margin: 0, opacity: 0.9 }}>Quality Specialist Management System</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={toggleTheme} className="btn-lang"> {theme === 'dark' ? '☀️' : '🌙'}</button>
          <button onClick={() => setShowDevProfile(true)} className="btn-lang" style={{ backgroundColor: 'var(--primary-hover)', color: 'white' }}>{t('developerProfile')}</button>
          <button onClick={() => { setIsSampleMode(true); setShowCertificate(true); }} className="btn-lang" style={{ backgroundColor: '#ffc107', color: 'black' }}>{t('sampleCert')}</button>
          <button onClick={toggleLanguage} className="btn-lang">{language === 'ar' ? 'English' : 'العربية'}</button>
          <div className="user-profile">
            <span style={{ fontWeight: '500' }}>{user.displayName || user.email}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '10px', backgroundColor: 'rgba(255, 152, 0, 0.1)', padding: '4px 10px', borderRadius: '20px', color: '#ff9800', border: '1px solid rgba(255, 152, 0, 0.2)' }}>
              <span>🔥</span> <span style={{ fontWeight: 'bold' }}>{streak}d</span>
            </div>
          </div>
          <button onClick={onLogout} className="btn-logout">{t('logout')}</button>
        </div>
      </header>

      <div className="glass-panel" style={{ margin: '15px 20px 0', padding: '12px 25px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>L{level}</div>
          <div style={{ fontWeight: 'bold' }}>{t('level')} {level}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.85rem' }}>
            <span>{t('xp')}: {xp}</span>
            <span>{getXpToNextLevel().progress} / {getXpToNextLevel().goal}</span>
          </div>
          <div style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${getXpToNextLevel().percentage}%`, height: '100%', backgroundColor: 'var(--primary-color)', transition: 'width 0.5s ease-out' }} />
          </div>
        </div>
      </div>

      <nav style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '25px', padding: '0 20px' }}>
        <button onClick={() => { setViewMode('academy'); setCurrentTrack(null); }} style={{ padding: '12px 35px', borderRadius: '15px', backgroundColor: viewMode === 'academy' ? 'var(--primary-color)' : 'var(--bg-card)', color: viewMode === 'academy' ? 'white' : 'var(--text-primary)', fontWeight: 'bold', cursor: 'pointer' }}>🎓 {t('academy')}</button>
        <button onClick={() => { setViewMode('toolkit'); setCurrentTrack(null); }} style={{ padding: '12px 35px', borderRadius: '15px', backgroundColor: viewMode === 'toolkit' ? 'var(--primary-color)' : 'var(--bg-card)', color: viewMode === 'toolkit' ? 'white' : 'var(--text-primary)', fontWeight: 'bold', cursor: 'pointer' }}>🛠️ {t('toolkit')}</button>
        <button onClick={() => setViewMode('analytics')} style={{ padding: '12px 35px', borderRadius: '15px', backgroundColor: viewMode === 'analytics' ? 'var(--primary-color)' : 'var(--bg-card)', color: viewMode === 'analytics' ? 'white' : 'var(--text-primary)', fontWeight: 'bold', cursor: 'pointer' }}>📊 {t('analytics')}</button>
      </nav>

      <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        {viewMode === 'academy' ? (
          <div className="animate-fade-in">
            <section className="glass-panel" style={{ padding: '30px', borderRadius: '24px', marginBottom: '30px' }}>
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>🏷️ {t('microBadge')} Wallet</h3>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {unitIds.map(id => <MicroBadge key={id} unitId={id} score={userProgress[id]} />)}
              </div>
            </section>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '30px' }}>
              <section className="glass-panel" style={{ padding: '30px' }}>
                {!currentTrack ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    {TRACKS.map(track => (
                      <div key={track.id} onClick={() => setCurrentTrack(track.id)} className="interactive-card" style={{ padding: '25px', backgroundColor: 'var(--bg-card)', borderRadius: '20px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{track.icon}</div>
                        <h4>{t(track.titleKey)}</h4>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <button onClick={() => setCurrentTrack(null)} style={{ marginBottom: '20px' }}>← Back</button>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                      {units.map(unit => (
                        <div key={unit.id} onClick={() => handleStartUnit(unit.id)} className="interactive-card" style={{ padding: '25px', backgroundColor: 'var(--bg-card)', borderRadius: '20px', textAlign: 'center', border: `2px solid ${unit.color}` }}>
                          <div style={{ fontSize: '2.5rem' }}>{UNIT_ICONS[unit.id]?.icon}</div>
                          <h4>{unit.title}</h4>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
              <div className="certificate-sidebar">
                <div className="cert-trophy">🏆</div>
                <h2>{t('earnedCertificates')}</h2>
                <button disabled={!allPassed} onClick={() => setShowCertificate(true)} className={`btn-cert ${allPassed ? 'active' : ''}`}>{allPassed ? t('viewCert') : 'Locked'}</button>
              </div>
            </div>
          </div>
        ) : viewMode === 'toolkit' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
            <FMEATool /> <BatchSignSim /> <StabilityCalculator /> <SamplingCalculator /> <InspectionChecklist />
          </div>
        ) : (
          /* Analytics View */
          <div className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '30px' }}>
              <section className="glass-panel" style={{ padding: '30px', borderRadius: '24px', background: 'var(--bg-card)' }}>
                <h3 style={{ marginBottom: '25px', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.5rem' }}>📊</span> {language === 'ar' ? 'تحليل تقدمك الدراسي' : 'Your Learning Analytics'}
                </h3>
                
                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                  <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', padding: '25px', borderRadius: '20px', textAlign: 'center', border: '1px solid #10b981' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>{allTrackUnits.filter(id => (userProgress[id] || 0) >= 90).length}</div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '500' }}>{language === 'ar' ? 'وحدة مكتملة' : 'Units Completed'}</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.05)', padding: '25px', borderRadius: '20px', textAlign: 'center', border: '1px solid #f59e0b' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{totalAverage}%</div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '500' }}>{language === 'ar' ? 'متوسط الدرجات' : 'Average Score'}</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.05)', padding: '25px', borderRadius: '20px', textAlign: 'center', border: '1px solid #6366f1' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#6366f1' }}>{allTrackUnits.filter(id => (userProgress[id] || 0) >= 90).length * 2}h</div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '500' }}>{language === 'ar' ? 'ساعات الدراسة' : 'Study Hours'}</div>
                  </div>
                </div>

                {/* Performance by Unit */}
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>📈</span> {language === 'ar' ? 'الأداء لكل وحدة تدريبية' : 'Performance by Training Unit'}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {allTrackUnits.map(unitId => {
                    const score = userProgress[unitId] || 0;
                    const isPassed = score >= 90;
                    const unitInfo = UNIT_ICONS[unitId] || { icon: '📄', color: '#6366f1' };
                    const unitDef = allUnitsDefinition.find(u => u.id === unitId);
                    
                    return (
                      <div key={unitId} style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '15px', borderRadius: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                          <span style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '1.2rem' }}>{unitInfo.icon}</span> 
                            {unitDef?.title || unitId}
                          </span>
                          <span style={{ 
                            fontWeight: 'bold', 
                            color: isPassed ? '#10b981' : score > 0 ? '#f59e0b' : '#94a3b8',
                            backgroundColor: isPassed ? 'rgba(16, 185, 129, 0.1)' : score > 0 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                            padding: '4px 12px',
                            borderRadius: '10px',
                            fontSize: '0.9rem'
                          }}>
                            {score > 0 ? `${score}%` : (language === 'ar' ? 'لم يبدأ' : 'Not Started')}
                          </span>
                        </div>
                        <div style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
                          <div style={{ 
                            width: `${score}%`, 
                            height: '100%', 
                            backgroundColor: isPassed ? '#10b981' : '#f59e0b', 
                            borderRadius: '10px',
                            transition: 'width 1s ease-out'
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Sidebar: Weak Areas & Path */}
              <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div className="glass-panel" style={{ padding: '25px', borderRadius: '24px', background: 'var(--bg-card)' }}>
                  <h4 style={{ color: '#ef4444', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>⚠️</span> {language === 'ar' ? 'نقاط تحتاج تركيز' : 'Areas for Focus'}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {allTrackUnits.filter(id => (userProgress[id] || 0) < 90 && (userProgress[id] || 0) > 0).length > 0 ? (
                      allTrackUnits.filter(id => (userProgress[id] || 0) < 90 && (userProgress[id] || 0) > 0).map(id => (
                        <div key={id} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', padding: '10px', borderRight: '4px solid #ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: '0 8px 8px 0' }}>
                          {allUnitsDefinition.find(u => u.id === id)?.title}
                        </div>
                      ))
                    ) : (
                      <p style={{ fontSize: '0.9rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.05)', padding: '10px', borderRadius: '8px' }}>
                        {language === 'ar' ? 'أداء ممتاز! لا توجد نقاط ضعف حالياً.' : 'Excellent performance! No weak areas identified.'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '25px', borderRadius: '24px', background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))', color: 'white' }}>
                  <h4 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}><span>🏁</span> {language === 'ar' ? 'طريق الشهادة' : 'Certification Path'}</h4>
                  <div style={{ fontSize: '0.95rem', opacity: 0.95, lineHeight: '1.6' }}>
                    {allPassed ? (
                      <p>✨ {language === 'ar' ? 'لقد أكملت جميع المتطلبات! يمكنك الآن تحميل شهادتك الرسمية.' : 'You have completed all requirements! You can now download your official certificate.'}</p>
                    ) : (
                      <p>
                        {language === 'ar' ? 'يتبقى لك' : 'You have'} {allTrackUnits.length - allTrackUnits.filter(id => (userProgress[id] || 0) >= 90).length} {language === 'ar' ? 'وحدات للوصول للدرجة المطلوبة (90%+).' : 'units remaining to reach the required score (90%+).'}
                      </p>
                    )}
                  </div>
                  <div style={{ marginTop: '20px', height: '10px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${(allTrackUnits.filter(id => (userProgress[id] || 0) >= 90).length / allTrackUnits.length) * 100}%`, 
                      height: '100%', 
                      background: 'white', 
                      borderRadius: '10px',
                      boxShadow: '0 0 15px rgba(255,255,255,0.5)'
                    }} />
                  </div>
                  <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {Math.round((allTrackUnits.filter(id => (userProgress[id] || 0) >= 90).length / allTrackUnits.length) * 100)}% {language === 'ar' ? 'مكتمل' : 'Complete'}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
        <p>© {new Date().getFullYear()} Sudan Quality Platform</p>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .main-header { padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; color: white; }
        .user-profile { display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.2); padding: 5px 15px; border-radius: 40px; }
        .btn-lang { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 8px 15px; border-radius: 8px; cursor: pointer; }
        .btn-logout { background: #dc3545; color: white; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; }
        .interactive-card { transition: all 0.3s; cursor: pointer; }
        .interactive-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
      `}} />
    </div>
  );
};

export default Dashboard;
