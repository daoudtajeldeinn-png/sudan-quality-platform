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
  'ich-q10': { icon: '🏆', color: '#17a2b8', title: { ar: 'نظام Q10', en: 'ICH Q10' } },
  'sterile-annex1': { icon: '🛡️', color: '#6c757d', title: { ar: 'التصنيع المعقم', en: 'Sterile Mfg' } },
  'gamp5-basics': { icon: '💻', color: '#343a40', title: { ar: 'GAMP 5', en: 'GAMP 5' } },
  'batch-records': { icon: '📝', color: '#6610f2', title: { ar: 'سجلات التشغيل', en: 'Batch Records' } },
  'nmpb-reg': { icon: '🇸🇩', color: '#009688', title: { ar: 'الرقابة الدوائية', en: 'NMPB Regulatory' } },
  'adv-gmp': { icon: '🏭+', color: '#28a745', title: { ar: 'ممارسات التصنيع المتقدمة', en: 'Adv. GMP' } },
  'adv-glp': { icon: '🔬+', color: '#007bff', title: { ar: 'تحليل بيانات GLP', en: 'Adv. GLP' } },
  'adv-iso-17025': { icon: '📊+', color: '#ffc107', title: { ar: 'التطبيق العملي لـ ISO', en: 'Adv. ISO' } },
  'adv-validation': { icon: '✅+', color: '#20c997', title: { ar: 'التحقق المتقدم', en: 'Adv. Validation' } },
  'adv-qrm': { icon: '⚠️+', color: '#e83e8c', title: { ar: 'تطبيقات QRM', en: 'Adv. QRM' } },
  'adv-gdp': { icon: '🚚+', color: '#fd7e14', title: { ar: 'سلسلة التبريد', en: 'Adv. GDP' } },
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
  const [viewMode, setViewMode] = useState('academy'); // 'academy' or 'toolkit'
  const [currentTrack, setCurrentTrack] = useState(null); // null means showing the 7 track cards
  const [userProgress, setUserProgress] = useState({
    'gmp-intro': 0, 'glp-basics': 0, 'iso-17025': 0, 'ich-guidelines': 0,
    'validation-qualification': 0, 'data-integrity': 0, 'qrm-basics': 0,
    'gdp-basics': 0, 'ich-q10': 0, 'sterile-annex1': 0, 'gamp5-basics': 0,
    'batch-records': 0, 'nmpb-reg': 0,
    'adv-gmp': 0, 'adv-glp': 0, 'adv-iso-17025': 0, 'adv-validation': 0,
    'adv-qrm': 0, 'adv-gdp': 0
  });
  const [leaderboard, setLeaderboard] = useState([]);

  const unitIds = Object.keys(UNIT_ICONS);
  const [unitStates, setUnitStates] = useState({}); // { unitId: { lectureFinished: bool } }

  const LOGO_PATH = pharmaLogo;
  const CERT_BG = certBg;

  // Load progress and state from Backend + localStorage on mount
  useEffect(() => {
    const loadInitialData = async () => {
      // 1. Initial Local Load (Fastest UI)
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

      // 2. Remote Backend Load (Reliability)
      if (user.uid) {
        try {
          const profile = await apiService.getUserProfile(user.uid);
          if (profile && profile.progress) {
            // Reconcile: High-score wins
            const remoteProgress = profile.progress.unitScores || {};
            setUserProgress(prev => {
              const reconciled = { ...prev };
              Object.keys(remoteProgress).forEach(unitId => {
                reconciled[unitId] = Math.max(prev[unitId] || 0, remoteProgress[unitId]);
              });
              return reconciled;
            });
            
            // Reconcile unit states if available
            if (profile.progress.unitStates) {
              setUnitStates(prev => ({ ...profile.progress.unitStates, ...prev }));
            }
          }
        } catch (error) {
          console.warn('Backend load failed, continuing with local data', error);
        }
      }
    };

    loadInitialData();
    logAuditTrail('eventLogin');
  }, [user.uid, user.email]);

  // Fetch leaderboard on viewMode change to Analytics
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
    localStorage.setItem(`sqp_audit_${user.email}`, JSON.stringify(currentLogs.slice(-100))); // Keep last 100 entries
  };

  const handleSignPledge = () => {
    localStorage.setItem(`sqp_pledge_${user.email}`, 'true');
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

  const currentTrackObj = currentTrack ? TRACKS.find(t => t.id === currentTrack) : null;
  const currentSectionUnits = currentTrackObj ? currentTrackObj.units : [];
  const units = allUnitsDefinition.filter(u => currentSectionUnits.includes(u.id));
  const allTrackUnits = TRACKS.flatMap(t => t.units);
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
      const allOthersPassed = allTrackUnits
        .filter(id => id !== unitId)
        .every(id => (newProgress[id] || 0) >= 90);

      if (isNewSuccess && allOthersPassed) {
        newProgress[`completionDate_academy`] = new Date().toISOString();
      }

      // Save to localStorage and Backend
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
        <button onClick={() => setShowDevProfile(false)} style={{ position: 'absolute', top: '20px', right: language === 'ar' ? 'auto' : '20px', left: language === 'ar' ? '20px' : 'auto', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
<div style={{ width: '150px', height: '150px', borderRadius: '50%', margin: '0 auto 20px', border: '5px solid #28a745', overflow: 'hidden' }}>
          {/* Dr. Daoud Tajeldeinn profile from scholar/credential.net - replace src with actual URL */}
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
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--regulatory-amber)' }}>Quality & Accreditation Board</div>
              </div>
            </div>

            <div style={{ marginTop: '160px' }}>
              <h1 style={{ fontSize: '3.5rem', color: 'var(--pharma-navy)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>
                {t('certTitle')}
                <div style={{ fontSize: '1.6rem', color: 'var(--regulatory-amber)', marginTop: '10px', fontWeight: 'bold' }}>
                  {currentSection === 'nmpb' ? t('sectionNmpb') : currentSection === 'intermediate' ? t('sectionIntermediate') : t('sectionBasic')}
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
              {units.map(u => (
                <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', padding: '8px 0', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>{t(u.id.replaceAll('-', '_'))}</span>
                  <span style={{ fontWeight: '800', color: 'var(--pharma-green)', fontSize: '1.1rem' }}>%{isSample ? 100 : userProgress[u.id]}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', gridColumn: '1 / -1', marginTop: '15px', paddingTop: '15px', borderTop: '2px solid var(--pharma-gold)', fontSize: '1.8rem', fontWeight: '900', color: 'var(--pharma-navy)' }}>
                <span>{t('totalScore')}</span>
                <span style={{ color: 'var(--pharma-green)' }}>%{isSample ? 100 : totalAverage}</span>
              </div>
            </div>

            {/* Footer Signatures & QR */}
            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 20px' }}>
              <div style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                <p style={{ margin: '5px 0', fontWeight: '700', fontSize: '1.1rem', color: 'var(--pharma-navy)' }}>
                  {t('dateLabel')}: {userProgress[`completionDate_${currentSection}`] ? new Date(userProgress[`completionDate_${currentSection}`]).toLocaleDateString() : new Date().toLocaleDateString()}
                </p>
                <p style={{ fontSize: '0.9rem', fontWeight: '600', letterSpacing: '1px', fontFamily: 'monospace' }}>
                  ID: {isSample ? 'VALID-SAMPLE-888' : `${user.uid?.substring(0, 8).toUpperCase()}-${new Date(userProgress[`completionDate_${currentSection}`] || new Date()).getTime().toString().substring(8)}`}
                </p>
                
                {/* Simulated QR Code for verification */}
                <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'white', border: '2px solid var(--pharma-navy)', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', fontSize: '0.6rem', color: 'var(--pharma-navy)', fontWeight: 'bold' }}>
                    <div style={{ marginBottom: '2px' }}>SCAN TO</div>
                    <div>VERIFY</div>
                    <div>[QR]</div>
                  </div>
                </div>
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
                </div>
                <div style={{ width: '240px', borderTop: '2px solid var(--pharma-navy)', paddingTop: '10px', fontWeight: '800', color: 'var(--pharma-navy)', fontSize: '1.2rem' }}>
                  {t('developerName')}
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginTop: '4px' }}>GMP/ISO Technical Authority</div>
                </div>
              </div>
            </div>
          </div>

          <div className="no-print" style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: '15px' }}>
            <button onClick={downloadCertificatePDF} style={{ padding: '12px 40px', fontSize: '1.1rem', backgroundColor: 'var(--pharma-navy)', color: 'white', border: 'gold 1px solid', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
              📄 {language === 'ar' ? 'تحميل PDF (رسمي)' : 'Download PDF (Official)'}
            </button>
            <button onClick={() => { window.print(); logAuditTrail('eventCert'); }} style={{ padding: '12px 40px', fontSize: '1.1rem', backgroundColor: 'var(--pharma-green)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              {t('printCert')}
            </button>
            <button onClick={() => { setShowCertificate(false); setIsSampleMode(false); }} style={{ padding: '12px 40px', fontSize: '1.1rem', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
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
        <Quiz unitId={currentUnit} onQuizComplete={handleQuizComplete} user={user} />
      </div>
    );
  }

  return (
    <div style={{
      direction: language === 'ar' ? 'rtl' : 'ltr',
      paddingBottom: '50px'
    }}>
      {showPledge && <PledgeModal />}
      {showCertificate && <CertificateModal isSample={isSampleMode} />}
      {showDevProfile && <DeveloperProfileModal />}

      {/* Header */}
      <header className="main-header glass-panel" style={{ borderRadius: '0 0 24px 24px', margin: '0 20px', backgroundColor: 'var(--primary-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img src={LOGO_PATH} alt="Pharma Logo" style={{ width: '55px', height: '55px' }} />
          <div>
            <h1 style={{ fontSize: '1.8rem', margin: 0 }}>{t('issuingAuthority')}</h1>
            <p style={{ margin: 0, opacity: 0.9 }}>Quality Specialist Management System</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={toggleTheme} className="btn-lang" title={theme === 'dark' ? t('lightMode') : t('darkMode')}>
             {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button onClick={() => setShowDevProfile(true)} className="btn-lang" style={{ backgroundColor: 'var(--primary-hover)', color: 'white' }}>
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
            <span title="Cloud Sync Active" style={{ fontSize: '0.8rem', marginLeft: '8px', opacity: 0.8 }}>☁️</span>
          </div>

          <button onClick={onLogout} className="btn-logout">
            {t('logout')}
          </button>
        </div>
      </header>

      {/* Gamification Level Bar */}
      <div className="glass-panel" style={{ 
        margin: '15px 20px 0', 
        padding: '12px 25px', 
        borderRadius: '15px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '45px', 
            height: '45px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--primary-color)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            boxShadow: '0 4px 10px var(--focus-ring)'
          }}>
            L{level}
          </div>
          <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{t('level')} {level}</div>
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span>{t('xp')}: {xp}</span>
            <span>{t('xpRange')}: {getXpToNextLevel().progress} / {getXpToNextLevel().goal}</span>
          </div>
          <div style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${getXpToNextLevel().percentage}%`, 
              height: '100%', 
              backgroundColor: 'var(--primary-color)', 
              borderRadius: '10px',
              transition: 'width 0.5s ease-out'
            }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {badges.slice(-3).map(badge => (
            <span key={badge.id} title={badge.name} style={{ fontSize: '1.5rem', cursor: 'help' }}>{badge.icon}</span>
          ))}
        </div>
      </div>

      {/* Sub Navigation */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '15px', 
        marginTop: '25px', 
        marginBottom: '10px',
        padding: '0 20px'
      }}>
        <button 
          onClick={() => setViewMode('academy')} 
          style={{ 
            padding: '12px 35px', 
            borderRadius: '15px', 
            border: 'none', 
            backgroundColor: viewMode === 'academy' ? 'var(--primary-color)' : 'var(--bg-card)',
            color: viewMode === 'academy' ? 'white' : 'var(--text-primary)',
            fontWeight: 'bold', 
            cursor: 'pointer', 
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          🎓 {t('academy')}
        </button>
        <button 
          onClick={() => setViewMode('toolkit')} 
          style={{ 
            padding: '12px 35px', 
            borderRadius: '15px', 
            border: 'none', 
            backgroundColor: viewMode === 'toolkit' ? 'var(--primary-color)' : 'var(--bg-card)',
            color: viewMode === 'toolkit' ? 'white' : 'var(--text-primary)',
            fontWeight: 'bold', 
            cursor: 'pointer', 
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          🛠️ {t('toolkit')}
        </button>
        <button 
          onClick={() => setViewMode('analytics')} 
          style={{ 
            padding: '12px 35px', 
            borderRadius: '15px', 
            border: 'none', 
            backgroundColor: viewMode === 'analytics' ? 'var(--primary-color)' : 'var(--bg-card)',
            color: viewMode === 'analytics' ? 'white' : 'var(--text-primary)',
            fontWeight: 'bold', 
            cursor: 'pointer', 
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          📊 {t('analytics') || 'Analytics'}
        </button>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        {viewMode === 'academy' ? (
          <div className="animate-fade-in">
            {/* Micro-Credentials Wallet Section */}
            <section className="glass-panel" style={{ padding: '30px', borderRadius: '24px', marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '20px', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>🎫</span> {t('microBadge')} Wallet
              </h3>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {unitIds.map(id => (
                  <MicroBadge key={id} unitId={id} score={userProgress[id]} />
                ))}
              </div>
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '30px', alignItems: 'start' }}>
              {/* Visual Icon Grid for Units / Tracks */}
              <section className="glass-panel" style={{ padding: '30px', borderRadius: '24px' }}>
                {!currentTrack ? (
                  <>
                    <h3 style={{ marginBottom: '25px', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.5rem' }}>🎓</span> {t('academy')} - {language === 'ar' ? 'المسارات الاحترافية' : 'Professional Tracks'}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                      {TRACKS.map((track) => {
                        const trackProgress = Math.round(track.units.reduce((acc, unitId) => acc + (userProgress[unitId] || 0), 0) / (track.units.length || 1));
                        const isTrackPassed = trackProgress >= 90;
                        
                        return (
                          <div 
                            key={track.id}
                            onClick={() => setCurrentTrack(track.id)}
                            style={{
                              backgroundColor: 'var(--bg-card)',
                              borderRadius: '20px',
                              padding: '25px',
                              cursor: 'pointer',
                              border: `2px solid ${isTrackPassed ? track.color : 'var(--border-color)'}`,
                              boxShadow: isTrackPassed ? `0 8px 25px ${track.color}40` : 'var(--shadow-sm)',
                              transition: 'all 0.3s ease',
                              textAlign: 'center',
                              position: 'relative',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              minHeight: '240px'
                            }}
                            className="interactive-card"
                          >
                            <div style={{
                              position: 'absolute', top: '15px', right: language === 'ar' ? 'auto' : '15px', left: language === 'ar' ? '15px' : 'auto',
                              backgroundColor: isTrackPassed ? track.color : '#6c757d', color: 'white', padding: '6px 15px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold'
                            }}>
                              {trackProgress}%
                            </div>
                            <div style={{
                              width: '85px', height: '85px', borderRadius: '50%', backgroundColor: `${track.color}20`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', marginBottom: '15px', marginTop: '10px'
                            }}>
                              {track.icon}
                            </div>
                            <h4 style={{ margin: '0 0 15px', fontSize: '1.2rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>{t(track.titleKey)}</h4>
                            <div style={{ backgroundColor: track.color, color: 'white', padding: '8px 20px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                              📚 {track.units.length} {language === 'ar' ? 'وحدات' : 'Units'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
                      <h3 style={{ color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '15px', margin: 0 }}>
                        <span style={{ fontSize: '2rem' }}>{currentTrackObj.icon}</span> 
                        {t(currentTrackObj.titleKey)}
                      </h3>
                      <button 
                        onClick={() => setCurrentTrack(null)} 
                        style={{ 
                          background: 'var(--bg-card)', border: '2px solid var(--border-color)', borderRadius: '20px', padding: '8px 20px', 
                          fontWeight: 'bold', color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                        className="btn-back-track"
                      >
                        {language === 'ar' ? '← العودة للمسارات' : '← Back to Tracks'}
                      </button>
                    </div>
                    
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
                              backgroundColor: 'var(--bg-card)',
                              borderRadius: '20px',
                              padding: '25px',
                              cursor: 'pointer',
                              border: `2px solid ${isPassed ? 'var(--primary-color)' : 'var(--border-color)'}`,
                              boxShadow: isPassed ? '0 8px 25px var(--focus-ring)' : 'var(--shadow-sm)',
                              transition: 'all 0.3s ease',
                              textAlign: 'center',
                              position: 'relative',
                              overflow: 'hidden'
                            }}
                            className="interactive-card"
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
                            
                            <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{unit.title}</h4>
                            <p style={{ margin: '0 0 15px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{unit.subtitle}</p>
                            
                            {finishedLecture && (
                              <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '6px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', display: 'inline-block' }}>
                                ✓ {language === 'ar' ? 'مكتمل' : 'Completed'}
                              </div>
                            )}
                            
                            {!finishedLecture && (
                              <div style={{ backgroundColor: unitIcon.color, color: 'white', padding: '8px 20px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', display: 'inline-block' }}>
                                {t('startStudy')} →
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </section>

              {/* Certificate Summary Sidebar */}
              <div className="certificate-sidebar">
                <div className="cert-trophy">🏆</div>
                <h2 style={{ color: 'var(--primary-color)' }}>{t('earnedCertificates')}</h2>
                <p style={{ color: 'var(--text-secondary)', margin: '15px 0' }}>
                  {allPassed ? t('earned') : t('lockedMsg')}
                </p>

                <div className="progress-container">
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${(unitIds.filter(id => (userProgress[id] || 0) >= 90).length / unitIds.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p style={{ marginTop: '10px', fontWeight: '500' }}>
                    {unitIds.filter(id => (userProgress[id] || 0) >= 90).length} / {unitIds.length} {t('completed')}
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
            </div>
          </div>
        ) : viewMode === 'toolkit' ? (
          <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
            <FMEATool />
            <BatchSignSim />
            <StabilityCalculator />
            <SamplingCalculator />
            <InspectionChecklist />
          </div>
        ) : (
          /* Analytics View */
          <div className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
              <section className="glass-panel" style={{ padding: '30px', borderRadius: '24px' }}>
                <h3 style={{ marginBottom: '25px', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.5rem' }}>📊</span> {language === 'ar' ? 'تحليل تقدمك' : 'Your Progress Analytics'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '25px', borderRadius: '20px', textAlign: 'center', border: '2px solid var(--primary-color)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{unitIds.filter(id => (userProgress[id] || 0) >= 90).length}</div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '500' }}>{language === 'ar' ? 'وحدة مكتملة' : 'Units Completed'}</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '25px', borderRadius: '20px', textAlign: 'center', border: '2px solid #ffc107' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ffc107' }}>{totalAverage}%</div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '500' }}>{language === 'ar' ? 'متوسط الدرجات' : 'Average Score'}</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '25px', borderRadius: '20px', textAlign: 'center', border: `2px solid ${allPassed ? '#28a745' : '#6c757d'}` }}>
                    <div style={{ fontSize: '2.5rem' }}>{allPassed ? '🏆' : '🔒'}</div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '500' }}>{language === 'ar' ? 'حالة الشهادة' : 'Certificate Status'}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: allPassed ? '#28a745' : '#6c757d', marginTop: '4px' }}>{allPassed ? (language === 'ar' ? 'مكتملة ✓' : 'Earned ✓') : (language === 'ar' ? 'قيد التقدم' : 'In Progress')}</div>
                  </div>
                </div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>{language === 'ar' ? '📋 تفاصيل الدرجات لكل وحدة' : '📋 Score Details by Unit'}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {units.map(unit => {
                    const score = userProgress[unit.id] || 0;
                    const isPassed = score >= 90;
                    const unitIcon = UNIT_ICONS[unit.id] || { icon: '📖', color: '#28a745' };
                    return (
                      <div key={unit.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                          <span style={{ fontWeight: '500', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}><span>{unitIcon.icon}</span> {unit.title}</span>
                          <span style={{ fontWeight: 'bold', color: isPassed ? '#28a745' : score > 0 ? '#ffc107' : 'var(--text-secondary)', minWidth: '75px', textAlign: 'right' }}>{score > 0 ? `${score}%` : (language === 'ar' ? 'لم يبدأ' : 'Not Started')}</span>
                        </div>
                        <div style={{ height: '10px', backgroundColor: 'var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
                          <div style={{ width: `${score}%`, height: '100%', backgroundColor: isPassed ? '#28a745' : score > 0 ? '#ffc107' : 'transparent', borderRadius: '10px', transition: 'width 1.5s cubic-bezier(0.25, 1, 0.5, 1)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Leaderboard Sidebar */}
              <section className="glass-panel" style={{ padding: '25px', borderRadius: '24px' }}>
                <h3 style={{ marginBottom: '20px', color: '#ffc107', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>🥇</span> {t('leaderboard')}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {leaderboard.length > 0 ? (
                    leaderboard.sort((a, b) => b.xp - a.xp).map((entry, idx) => (
                      <div key={idx} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px', 
                        padding: '10px', 
                        borderRadius: '12px',
                        backgroundColor: entry.userId === user.uid ? 'rgba(40,167,69,0.1)' : 'transparent',
                        border: entry.userId === user.uid ? '1px solid #28a745' : '1px solid transparent'
                      }}>
                        <div style={{ fontWeight: 'bold', width: '25px', color: idx === 0 ? '#ffc107' : 'var(--text-secondary)' }}>#{idx + 1}</div>
                        <div style={{ fontSize: '1.2rem' }}>{entry.photoURL ? <img src={entry.photoURL} style={{ width: '24px', height: '24px', borderRadius: '50%' }} /> : (entry.isUser || entry.userId === user.uid ? '⭐' : '👤')}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{entry.displayName || (entry.userId === user.uid ? t('you') : 'Trainee')}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Lvl {entry.level || 1} • {entry.xp || 0} XP</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
                      {language === 'ar' ? 'جاري تحميل المتصدرين...' : 'Loading Leaderboard...'}
                    </div>
                  )}
                </div>
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  💡 {language === 'ar' ? 'نتائج بقية المتدربين تظهر هنا بناءً على أدائهم الفعلي.' : 'Live trainee rankings based on actual platform performance.'}
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer style={{ textAlign: 'center', padding: '40px', color: '#888', borderTop: '1px solid #eee' }}>
        <p style={{ fontWeight: 'bold' }}>{t('issuingAuthority')} - Certified Educational Platform</p>
        <p style={{ fontSize: '0.9rem' }}>Developed & Maintained by <span style={{ color: '#28a745', fontWeight: 'bold' }}>{t('developerName')}</span></p>
        <p style={{ fontSize: '0.8rem' }}>© {new Date().getFullYear()} Sudan Quality Platform. All International Patents Reserved.</p>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        .main-header { padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; color: white; }
        .user-profile { display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.2); padding: 5px 15px; border-radius: 40px; backdrop-filter: blur(5px); }
        .user-profile img { width: 32px; height: 32px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.5); }
        .btn-lang { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 8px 15px; border-radius: 8px; cursor: pointer; transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); font-weight: bold; backdrop-filter: blur(5px); }
        .btn-lang:hover { background: rgba(255,255,255,0.3); transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .btn-logout { background: #dc3545; color: white; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: all 0.3s; }
        .btn-logout:hover { background: #c82333; transform: scale(1.05); }
        .btn-primary { background: var(--primary-color); color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: bold; padding: 12px 30px; transition: all 0.3s; }
        .btn-primary:hover { background: var(--primary-hover); transform: translateY(-2px); box-shadow: 0 8px 20px var(--focus-ring); }
        .btn-secondary { background: #6c757d; color: white; border: none; border-radius: 12px; cursor: pointer; padding: 10px 20px; transition: 0.2s; }
        .btn-secondary:hover { background: #5a6268; }
        .certificate-sidebar { background-color: var(--bg-card); border: 1px solid var(--border-color); padding: 30px; border-radius: 24px; box-shadow: var(--shadow-md); display: flex; flex-direction: column; justify-content: center; text-align: center; height: fit-content; transition: 0.3s; }
        .certificate-sidebar h2 { color: var(--primary-color); }
        .certificate-sidebar p { color: var(--text-secondary); margin: 15px 0; }
        .cert-trophy { font-size: 4.5rem; margin-bottom: 10px; text-shadow: 0 10px 20px rgba(0,0,0,0.1); animation: float 3s ease-in-out infinite; }
        .progress-container { margin: 20px 0; }
        .progress-bar-bg { width: 100%; height: 12px; background-color: var(--border-color); border-radius: 6px; overflow: hidden; }
        .progress-bar-fill { height: 100%; background-color: var(--primary-color); transition: width 1.5s cubic-bezier(0.25, 1, 0.5, 1); }
        .btn-cert { width: 100%; padding: 18px; border-radius: 16px; border: none; background-color: var(--border-color); color: var(--text-secondary); font-size: 1.2rem; font-weight: bold; cursor: not-allowed; box-shadow: none; transition: 0.3s; }
        .btn-cert.active { background-color: var(--primary-color); color: white; cursor: pointer; box-shadow: 0 10px 20px var(--focus-ring); }
        .btn-cert.active:hover { background-color: var(--primary-hover); transform: translateY(-3px) scale(1.02); }
        .interactive-card { 
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
          position: relative;
          overflow: hidden;
        }
        .interactive-card::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
          transform: rotate(30deg);
          transition: all 0.6s;
          opacity: 0;
        }
        .interactive-card:hover { 
          transform: translateY(-8px) scale(1.02); 
          box-shadow: var(--shadow-xl);
          border-color: var(--primary-color);
        }
        .interactive-card:hover::after {
          animation: shine 1.5s;
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes shine {
          0% { opacity: 1; left: -100%; top: -100%; }
          100% { opacity: 0; left: 100%; top: 100%; }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(76, 175, 80, 0); }
          100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
        }
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
