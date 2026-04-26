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
import apiService from '../services/api';
import pharmaLogo from '../assets/pharma_logo.png';
import certBg from '../assets/certificate_bg.png';

// Unit grouping - FIXED ALL ICONS
const TRACKS = [
  { id: 'qms', titleKey: 'track_qms', units: ['gmp-intro', 'ich-q10', 'adv-gmp'], icon: '⚙️', color: '#17a2b8' },
  { id: 'sterile', titleKey: 'track_sterile', units: ['sterile-annex1'], icon: '🦠', color: '#6c757d' },
  { id: 'data_integrity', titleKey: 'track_data_integrity', units: ['data-integrity', 'gamp5-basics', 'batch-records'], icon: '💻', color: '#6610f2' },
  { id: 'qrm', titleKey: 'track_qrm', units: ['qrm-basics', 'adv-qrm'], icon: '⚠️', color: '#e83e8c' },
  { id: 'validation', titleKey: 'track_validation', units: ['validation-qualification', 'adv-validation'], icon: '✅', color: '#20c997' },
  { id: 'gdp', titleKey: 'track_gdp', units: ['gdp-basics', 'adv-gdp'], icon: '🚚', color: '#fd7e14' },
  { id: 'regulatory', titleKey: 'track_regulatory', units: ['nmpb-reg', 'ich-guidelines', 'glp-basics', 'iso-17025', 'adv-glp', 'adv-iso-17025'], icon: '🌍', color: '#009688' },
];

// Unit icons mapping - ALL EMOJIS
const UNIT_ICONS = {
  'gmp-intro': { icon: '📦', color: '#28a745', title: { ar: 'مقدمة في GMP', en: 'Intro to GMP' } },
  'glp-basics': { icon: '🧪', color: '#007bff', title: { ar: 'مبادئ GLP', en: 'GLP Basics' } },
  'iso-17025': { icon: '📋', color: '#ffc107', title: { ar: 'ISO 17025', en: 'ISO 17025' } },
  'ich-guidelines': { icon: '🌍', color: '#dc3545', title: { ar: 'إرشادات ICH', en: 'ICH Guidelines' } },
  'validation-qualification': { icon: '✅', color: '#20c997', title: { ar: 'التحقق وصلاحية الأداء', en: 'Validation & Qualification' } },
  'data-integrity': { icon: '🔒', color: '#6610f2', title: { ar: 'سلامة ونزاهة البيانات', en: 'Data Integrity' } },
  'qrm-basics': { icon: '⚠️', color: '#e83e8c', title: { ar: 'إدارة مخاطر الجودة', en: 'QRM Basics' } },
  'gdp-basics': { icon: '🚚', color: '#fd7e14', title: { ar: 'ممارسات التوزيع الجيدة GDP', en: 'GDP Basics' } },
  'ich-q10': { icon: '⚙️', color: '#17a2b8', title: { ar: 'نظام الجودة الصيدلاني ICH Q10', en: 'ICH Q10' } },
  'sterile-annex1': { icon: '🦠', color: '#6c757d', title: { ar: 'التصنيع المعقم (Annex 1)', en: 'Sterile Mfg' } },
  'gamp5-basics': { icon: '💻', color: '#343a40', title: { ar: 'GAMP 5', en: 'GAMP 5' } },
  'batch-records': { icon: '📄', color: '#6610f2', title: { ar: 'سجلات التشغيل (Batch Records)', en: 'Batch Records' } },
  'nmpb-reg': { icon: '🇸🇩', color: '#009688', title: { ar: 'الرقابة الدوائية (NMPB)', en: 'NMPB Regulatory' } },
  'adv-gmp': { icon: '📦⭐', color: '#28a745', title: { ar: 'ممارسات التصنيع المتقدمة', en: 'Adv. GMP' } },
  'adv-glp': { icon: '🧪⭐', color: '#007bff', title: { ar: 'تحليل بيانات GLP', en: 'Adv. GLP' } },
  'adv-iso-17025': { icon: '📋⭐', color: '#ffc107', title: { ar: 'التطبيق العملي لـ ISO/IEC', en: 'Adv. ISO' } },
  'adv-validation': { icon: '✅⭐', color: '#20c997', title: { ar: 'التحقق المتقدم', en: 'Adv. Validation' } },
  'adv-qrm': { icon: '⚠️⭐', color: '#e83e8c', title: { ar: 'تطبيقات QRM', en: 'Adv. QRM' } },
  'adv-gdp': { icon: '🚚⭐', color: '#fd7e14', title: { ar: 'أساسيات سلسلة التبريد', en: 'Adv. GDP' } },
};

const Dashboard = ({ user, onLogout, authToken }) => {
  const { language, toggleLanguage, t, theme, toggleTheme } = useLanguage();
  const { xp, level, badges, getXpToNextLevel, stats, updateStats, addXp, awardBadge } = useGamification();
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

  const unitIds = Object.keys(UNIT_ICONS);
  const LOGO_PATH = pharmaLogo;
  const CERT_BG = certBg;

  useEffect(() => {
    const loadInitialData = async () => {
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

      if (user?.uid && authToken) {
        try {
          const profile = await apiService.getUserProfile(user.uid, authToken);
          if (profile && profile.progress) {
            const remoteProgress = profile.progress.unitScores || {};
            setUserProgress(prev => {
              const reconciled = { ...prev };
              Object.keys(remoteProgress).forEach(unitId => {
                reconciled[unitId] = Math.max(prev[unitId] || 0, remoteProgress[unitId]);
              });
              return reconciled;
            });
            setUserCertLevel(profile.progress.level || 1);
            if (profile.progress.unitStates) setUnitStates(profile.progress.unitStates);
            const certsData = await apiService.getUserCertificates(user.uid, authToken);
            setCertificates(certsData.certificates || []);
          }
          const leaderboardData = await apiService.getLeaderboard(authToken);
          if (leaderboardData && Array.isArray(leaderboardData)) {
            setLeaderboard(leaderboardData);
          }
        } catch (error) {
          console.error("Failed to load backend profile or leaderboard:", error);
        }
      } else {
         setUserCertLevel(1);
      }

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
    };

    loadInitialData();
  }, [user?.uid, user?.email, authToken]);

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

  const allUnitsDefinition = [
    { id: 'nmpb-reg', title: t('nmpbReg'), subtitle: t('unit1'), color: '#009688' },
    { id: 'gmp-intro', title: t('introGMP'), subtitle: t('unit1'), color: '#28a745' },
    { id: 'glp-basics', title: t('glpBasics'), subtitle: t('unit2'), color: '#007bff' },
    { id: 'iso-17025', title: t('iso17025'), subtitle: t('unit3'), color: '#ffc107' },
    { id: 'ich-guidelines', title: t('ichGuidelines'), subtitle: t('unit4'), color: '#dc3545' },
    { id: 'validation-qualification', title: t('valQual'), subtitle: t('unit5'), color: '#20c997' },
    { id: 'data-integrity', title: t('dataIntegrity'), subtitle: t('unit6'), color: '#6610f2' },
    { id: 'qrm-basics', title: t('qrmBasics'), subtitle: t('unit7'), color: '#e83e8c' },
    { id: 'gdp-basics', title: t('gdpBasics'), subtitle: t('unit8'), color: '#fd7e14' },
    { id: 'ich-q10', title: t('ichQ10'), subtitle: t('unit9'), color: '#17a2b8' },
    { id: 'sterile-annex1', title: t('annex1'), subtitle: t('unit10'), color: '#6c757d' },
    { id: 'gamp5-basics', title: t('gamp5'), subtitle: t('unit11'), color: '#343a40' },
    { id: 'batch-records', title: t('batchRecords'), subtitle: t('unit12'), color: '#6610f2' },
    { id: 'adv-gmp', title: t('adv_gmp'), subtitle: t('unit1'), color: '#28a745' },
    { id: 'adv-glp', title: t('adv_glp'), subtitle: t('unit2'), color: '#007bff' },
    { id: 'adv-iso-17025', title: t('adv_iso_17025'), subtitle: t('unit3'), color: '#ffc107' },
    { id: 'adv-validation', title: t('adv_validation'), subtitle: t('unit4'), color: '#20c997' },
    { id: 'adv-qrm', title: t('adv_qrm'), subtitle: t('unit5'), color: '#e83e8c' },
    { id: 'adv-gdp', title: t('adv_gdp'), subtitle: t('unit6'), color: '#fd7e14' },
  ];

  const currentTrackObj = currentTrack ? TRACKS.find(tr => tr.id === currentTrack) : null;
  const currentSectionUnits = currentTrackObj ? currentTrackObj.units : [];
  const units = allUnitsDefinition.filter(u => currentSectionUnits.includes(u.id));
  const allTrackUnits = TRACKS.flatMap(tr => tr.units);

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

  const handleStartUnit = (unitId) => {
    setCurrentUnit(unitId);
    setIsLectureMode(true);
  };

  const handleLectureFinished = (unitId) => {
    console.log('Lecture finished for unit:', unitId, 'currentUnit:', currentUnit);
    if (!unitStates[unitId]?.lectureFinished) {
      addXp(20);
      updateStats({ lecturesCompleted: (stats.lecturesCompleted || 0) + 1 });
    }
    setUnitStates(prev => {
      const newStates = { ...prev, [unitId]: { ...prev[unitId], lectureFinished: true } };
      localStorage.setItem(`sqp_states_${user?.email || 'guest'}`, JSON.stringify(newStates));
      return newStates;
    });
    setIsLectureMode(false);
  };

  const handleQuizComplete = (result) => {
    const { score, unitId } = result;
    logAuditTrail('eventQuiz', unitId);

    if (score >= 90 && user?.uid) {
      try {
        apiService.awardCertificate({
          userId: user.uid,
          userName: user.displayName || user.email,
          unitId,
          unitName: allUnitsDefinition.find(u => u.id === unitId)?.title || unitId,
          score,
          percentage: score
        });
      } catch (e) {
        console.error('Award failed', e);
      }
    }

    setUserProgress(prev => {
      const isNewSuccess = score >= 90 && (!prev[unitId] || prev[unitId] < 90);
      const newProgress = {
        ...prev,
        [unitId]: Math.max(prev[unitId] || 0, score)
      };

      const allOthersPassed = allTrackUnits
        .filter(id => id !== unitId)
        .every(id => (newProgress[id] || 0) >= 90);

      if (isNewSuccess && allOthersPassed) {
        newProgress[`completionDate_academy`] = new Date().toISOString();
      }

      localStorage.setItem(`sqp_progress_${user?.email || 'guest'}`, JSON.stringify(newProgress));
      
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

  const allPassed = allTrackUnits.every(id => (userProgress[id] || 0) >= 90);
  const totalAverage = Math.round(allTrackUnits.reduce((a, id) => a + (userProgress[id] || 0), 0) / (allTrackUnits.length || 1));

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
        <button onClick={() => setShowDevProfile(false)} style={{ position: 'absolute', top: '20px', right: language === 'ar' ? 'auto' : '20px', left: language === 'ar' ? '20px' : 'auto', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
        <div style={{ width: '150px', height: '150px', borderRadius: '50%', margin: '0 auto 20px', border: '5px solid #28a745', overflow: 'hidden' }}>
          <img 
            src="https://scholar.googleusercontent.com/citations?view_op=medium_photo&user=DzRrLjcAAAAJ&citpid=1" 
            alt="Dr. Daoud Tajeldeinn Ahmed Abdelkarim - GMP Specialist" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <h2 style={{ color: '#1a5928', fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '10px' }}>{t('developerName')}</h2>
        <p style={{ color: '#28a745', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px' }}>{t('developerTitle')}</p>
        <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '20px', textAlign: language === 'ar' ? 'right' : 'left', marginBottom: '30px', fontSize: '1rem' }}>
          <p style={{ lineHeight: '1.8', margin: '5px 0' }}>• {t('developerTitle')}</p>
          <p style={{ lineHeight: '1.8', margin: '5px 0' }}>• {language === 'ar' ? 'خبير GMP, GLP, ISO والجودة' : 'Pharmaceutical Training & Qualification Specialist'}</p>
          <p style={{ lineHeight: '1.8', margin: '5px 0' }}>• {language === 'ar' ? `مؤسس ${t('issuingAuthority')}` : `Founder of ${t('issuingAuthority')}`}</p>
        </div>
        <a href="https://www.credential.net/profile/daoudtajeldeinn887198/wallet" target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
          View Digital Wallet 🏆
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
        <span style={{ fontSize: '1.5rem' }}>{isUnlocked ? '⭐' : '🔒'}</span>
        <span style={{ fontSize: '0.6rem', fontWeight: 'bold', color: isUnlocked ? '#28a745' : '#999' }}>{unitId.split('-')[0].toUpperCase()}</span>
      </div>
    );
  };

  const CertificateModal = ({ isSample = false }) => {
    const [showSurvey, setShowSurvey] = useState(!isSample && !localStorage.getItem(`sqp_survey_${user?.email || 'guest'}`));

    const downloadCertificatePDF = () => {
      const input = document.getElementById('certificate-printable');
      if (!input) return;
      
      html2canvas(input, { scale: 2, useCORS: true, logging: false }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
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
            <button onClick={() => { localStorage.setItem(`sqp_survey_${user?.email || 'guest'}`, 'true'); setShowSurvey(false); }} className="btn-primary" style={{ width: '100%', padding: '15px' }}>
              {t('submitSurvey')}
            </button>
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
          overflow: 'hidden',
          fontFamily: "'IBM Plex Sans Arabic', 'IBM Plex Sans', serif"
        }}>
          {/* Subtle Watermark */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '600px', height: '600px', backgroundImage: `url(${LOGO_PATH})`,
            backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
            opacity: 0.03, pointerEvents: 'none', zIndex: 1
          }}></div>

          {isSample && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)',
              fontSize: '12rem', color: 'rgba(230,126,34,0.07)', fontWeight: 'bold', pointerEvents: 'none', zIndex: 10
            }}>SAMPLE</div>
          )}

          <div style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
            {/* Header */}
            <div style={{ position: 'absolute', top: '-30px', right: '-40px', display: 'flex', alignItems: 'center', gap: '20px', zIndex: 100 }}>
              <img src={LOGO_PATH} alt="Logo" style={{ width: '130px', height: '130px', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.1))' }} />
              <div style={{ textAlign: 'right', color: 'var(--pharma-navy)' }}>
                <div style={{ fontWeight: 'bold', fontSize: '2.2rem', lineHeight: '1.2' }}>{t('issuingAuthority')}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--regulatory-amber)' }}>{language === 'ar' ? 'لجنة الجودة والاعتماد' : 'Quality & Accreditation Board'}</div>
            </div>

            <div style={{ marginTop: '160px' }}>
              <h1 style={{ fontSize: '3.5rem', color: 'var(--pharma-navy)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>
                {t('certTitle')}
                <div style={{ fontSize: '1.6rem', color: 'var(--regulatory-amber)', marginTop: '10px', fontWeight: 'bold' }}>
                  {language === 'ar' ? 'الأكاديمية المهنية' : 'Professional Academy'}
                </div>
              </h1>
              <div style={{ width: '250px', height: '4px', backgroundColor: 'var(--pharma-gold)', margin: '20px auto' }}></div>
              <div style={{ margin: '30px 0' }}>
                <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginBottom: '15px', fontWeight: '600' }}>{t('certIntro')}</p>
                <h2 style={{ fontSize: '3.8rem', color: 'var(--pharma-blue)', fontFamily: "'IBM Plex Sans', serif", fontWeight: '700', display: 'inline-block' }}>
                  {isSample ? 'Ahmed Daoud Tajeldeinn' : (user.displayName || user.email.split('@')[0])}
                </h2>
                <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginTop: '5px', fontWeight: '500' }}>
                  {isSample ? 'daoud.specialist@quality.sd' : user.email}
                </div>
              <p style={{ fontSize: '1.4rem', margin: '25px auto', color: 'var(--text-primary)', lineHeight: '1.8', maxWidth: '850px', fontWeight: '500' }}>
                {t('certDesc')}
              </p>
            </div>

            {/* Results Grid */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px',
              padding: '25px', backgroundColor: 'var(--bg-color)', borderRadius: '15px',
              textAlign: 'right', border: '1px solid var(--border-color)', margin: '20px auto', width: '100%', maxWidth: '850px'
            }}>
              {allUnitsDefinition.map(u => (
                <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', padding: '8px 0', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>{u.title}</span>
                  <span style={{ fontWeight: '800', color: 'var(--pharma-green)', fontSize: '1.1rem' }}>%{isSample ? 100 : userProgress[u.id]}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', gridColumn: '1 / -1', marginTop: '15px', paddingTop: '15px', borderTop: '2px solid var(--pharma-gold)', fontSize: '1.8rem', fontWeight: '900', color: 'var(--pharma-navy)' }}>
                <span>{t('totalScore')}</span>
                <span style={{ color: 'var(--pharma-green)' }}>%{isSample ? 100 : totalAverage}</span>
              </div>

            {/* Footer Signatures & QR */}
            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 20px' }}>
              <div style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                <p style={{ margin: '5px 0', fontWeight: '700', fontSize: '1.1rem', color: 'var(--pharma-navy)' }}>
                  {t('dateLabel')}: {userProgress[`completionDate_academy`] ? new Date(userProgress[`completionDate_academy`]).toLocaleDateString() : new Date().toLocaleDateString()}
                </p>
                <p style={{ fontSize: '0.9rem', fontWeight: '600', letterSpacing: '1px', fontFamily: 'monospace' }}>
                  ID: {isSample ? 'VALID-SAMPLE-888' : `${user.uid?.substring(0, 8).toUpperCase()}-${new Date(userProgress[`completionDate_academy`] || new Date()).getTime().toString().substring(8)}`}
                </p>
                
                {/* Simulated QR Code for verification */}
                <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'white', border: '2px solid var(--pharma-navy)', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', fontSize: '0.6rem', color: 'var(--pharma-navy)', fontWeight: 'bold' }}>
                    <div style={{ marginBottom: '2px' }}>SCAN TO</div>
                    <div>VERIFY</div>
                    <div>[QR]</div>
                </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '120px', height: '120px', border: '4px double var(--pharma-gold)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 15px', backgroundColor: 'white', position: 'relative'
                }}>
                  <img src={LOGO_PATH} alt="Seal" style={{ width: '85px', height: '85px', opacity: 1.0 }} />
                  <div style={{ position: 'absolute', bottom: '-10px', fontSize: '0.75rem', fontWeight: 'bold', color: 'white', backgroundColor: 'var(--pharma-navy)', padding: '4px 12px', border: '1px solid var(--pharma-gold)', borderRadius: '10px' }}>
                    OFFICIAL
                  </div>
                <div style={{ width: '240px', borderTop: '2px solid var(--pharma-navy)', paddingTop: '10px', fontWeight: '800', color: 'var(--pharma-navy)', fontSize: '1.2rem' }}>
                  {t('developerName')}
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginTop: '
