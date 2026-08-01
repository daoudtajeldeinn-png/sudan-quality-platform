import React, { useState, useEffect } from 'react';
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
import { LOGO_B64, SEAL_B64 } from '../assets/certAssets.js';
import certBg from '../assets/certificate_bg.png';
import goldSeal from '../assets/gold_seal.png';
import { QRCodeCanvas } from 'qrcode.react';
import apiService from '../services/api';
import '../styles/CertificateStyles.css';

// Unit grouping
const TRACKS = [
  { id: 'qms', titleKey: 'track_qms', units: ['gmp-intro', 'ich-q10', 'adv-gmp'], icon: '🏆', color: '#17a2b8' },
  { id: 'sterile', titleKey: 'track_sterile', units: ['sterile-annex1'], icon: '🛡️', color: '#6c757d' },
  { id: 'data_integrity', titleKey: 'track_data_integrity', units: ['data-integrity', 'gamp5-basics', 'batch-records'], icon: '💻', color: '#6610f2' },
  { id: 'qrm', titleKey: 'track_qrm', units: ['qrm-basics', 'adv-qrm'], icon: '⚠️', color: '#e83e8c' },
  { id: 'validation', titleKey: 'track_validation', units: ['validation-qualification', 'adv-validation'], icon: '✅', color: '#20c997' },
  { id: 'gdp', titleKey: 'track_gdp', units: ['gdp-basics', 'adv-gdp'], icon: '🚚', color: '#fd7e14' },
  { id: 'regulatory', titleKey: 'track_regulatory', units: ['nmpb-reg', 'ich-guidelines', 'glp-basics', 'iso-17025', 'adv-glp', 'adv-iso-17025'], icon: '⚖️', color: '#009688' },
  { id: 'advanced_validation', titleKey: 'track_advanced_validation', units: ['cleaning-validation', 'process-validation', 'hold-time-stability', 'method-validation', 'equipment-qualification'], icon: '🧪', color: '#6610f2' },
  { id: 'quality_systems', titleKey: 'track_quality_systems', units: ['capa', 'iso-9001', 'qc-lab', 'ipqc'], icon: '🎯', color: '#e11d48' },
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
  'cleaning-validation': { icon: '🧼', color: '#17a2b8', title: { ar: 'التحقق من التنظيف', en: 'Cleaning Validation' } },
  'process-validation': { icon: '🔄', color: '#10b981', title: { ar: 'التحقق من العمليات', en: 'Process Validation' } },
  'hold-time-stability': { icon: '⏳', color: '#f59e0b', title: { ar: 'ثبات فترة الاستبقاء', en: 'Hold Time Stability' } },
  'method-validation': { icon: '🧪', color: '#3b82f6', title: { ar: 'التحقق من طرق التحليل', en: 'Analytical Method Validation' } },
  'equipment-qualification': { icon: '⚙️', color: '#8b5cf6', title: { ar: 'تأهيل الأجهزة والمرافق', en: 'Equipment Qualification' } },
  'capa':     { icon: '🔧', color: '#e11d48', title: { ar: 'إدارة CAPA', en: 'CAPA Management' } },
  'iso-9001': { icon: '📋', color: '#0ea5e9', title: { ar: 'ISO 9001', en: 'ISO 9001 QMS' } },
  'qc-lab':   { icon: '🧫', color: '#10b981', title: { ar: 'مختبر ضبط الجودة', en: 'QC Laboratory' } },
  'ipqc':     { icon: '🏭', color: '#f59e0b', title: { ar: 'رقابة الجودة أثناء العملية', en: 'IPQC' } },
};

const Dashboard = ({ user, onLogout, authToken, activeTab, certToOpen, onCertClosed }) => {
  const { language, toggleLanguage, t, theme, toggleTheme } = useLanguage();
  const { xp, level, badges, getXpToNextLevel, stats, updateStats, addXp, awardBadge } = useGamification();
  const [userCertLevel, setUserCertLevel] = useState(1);
  const [certificates, setCertificates] = useState([]);
  const [currentUnit, setCurrentUnit] = useState(null);
  const [completedUnits, setCompletedUnits] = useState({});

  const [isLectureMode, setIsLectureMode] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    if (certToOpen) {
      setSelectedCert(certToOpen);
      setShowCertificate(true);
    }
  }, [certToOpen]);

  useEffect(() => {
    if (certToOpen) {
      setSelectedCert(certToOpen);
      setShowCertificate(true);
    }
  }, [certToOpen]);
  const [isSampleMode, setIsSampleMode] = useState(false);
  const [showPledge, setShowPledge] = useState(false);
  const [showDevProfile, setShowDevProfile] = useState(false);
  const [viewMode, setViewMode] = useState(activeTab || 'academy');

  useEffect(() => {
    if (activeTab && activeTab !== 'certificates' && activeTab !== 'leaderboard') {
      setViewMode(activeTab);
    }
  }, [activeTab]); 
  const [currentTrack, setCurrentTrack] = useState(null); 
  const [userProgress, setUserProgress] = useState(() => {
    const defaults = {
      'gmp-intro': 0, 'glp-basics': 0, 'iso-17025': 0, 'ich-guidelines': 0,
      'validation-qualification': 0, 'data-integrity': 0, 'qrm-basics': 0,
      'gdp-basics': 0, 'ich-q10': 0, 'sterile-annex1': 0, 'gamp5-basics': 0,
      'batch-records': 0, 'nmpb-reg': 0,
      'adv-gmp': 0, 'adv-glp': 0, 'adv-iso-17025': 0, 'adv-validation': 0,
      'adv-qrm': 0, 'adv-gdp': 0, 'cleaning-validation': 0,
      'process-validation': 0, 'hold-time-stability': 0, 'method-validation': 0, 'equipment-qualification': 0,
      'capa': 0, 'iso-9001': 0, 'qc-lab': 0, 'ipqc': 0
    };
    try {
      // Try all sqp_progress_ keys to find any saved progress
      const keys = Object.keys(localStorage).filter(k => k.startsWith('sqp_progress_'));
      if (keys.length > 0) {
        const saved = localStorage.getItem(keys[0]);
        if (saved) return { ...defaults, ...JSON.parse(saved) };
      }
    } catch(e) {}
    return defaults;
  });
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [unitStates, setUnitStates] = useState({}); 
  const [streak, setStreak] = useState(0);
  const unitIds = Object.keys(userProgress).filter(id => !id.startsWith('completionDate'));

  const CACHE_NAME = 'sqp-v3';
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
          setProgressLoaded(true);
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
          setProgressLoaded(true);
          if (profile && profile.progress) {
            const remoteProgress = profile.progress.unitScores || {};
            setUserProgress(prev => {
              const reconciled = { ...prev };
              let needsSync = false;
              Object.keys(remoteProgress).forEach(unitId => {
                if ((prev[unitId] || 0) > (remoteProgress[unitId] || 0)) {
                  needsSync = true;
                }
                reconciled[unitId] = Math.max(prev[unitId] || 0, remoteProgress[unitId]);
              });

              if (needsSync && user.uid) {
                console.log('Pushing reconciled local progress to cloud...');
                apiService.syncUserStats(user.uid, {
                  progress: {
                    unitScores: reconciled,
                    unitStates: unitStates,
                    totalScore: Math.round(Object.values(reconciled).filter(b => typeof b === 'number').reduce((a, b) => a + b, 0) / (Object.values(reconciled).filter(b => typeof b === 'number').length || 1))
                  }
                }, authToken).catch(e => console.error('Initial sync failed', e));
              }
              return reconciled;
            });
            setProgressLoaded(true);
            setUserCertLevel(profile.progress.level || 1);
            if (profile.progress.unitStates) {
              setUnitStates(prev => ({ ...profile.progress.unitStates, ...prev }));
            }
            // Load completed units from profile
            if (profile.completedUnits) {
              setCompletedUnits(profile.completedUnits);
            }
            try {
                const certsData = await apiService.getUserCertificates(user.uid, authToken);
                const currentCerts = certsData.certificates || [];
                setCertificates(currentCerts);
                
                // Retroactive fix: for ALL units the user has already passed (90%+) but has no cert yet
                // Use the reconciled progress which has both local + remote scores
                const reconciledProgress = (() => {
                  try {
                    const local = JSON.parse(localStorage.getItem(`sqp_progress_${user.email}`) || '{}');
                    const remote = profile.progress.unitScores || {};
                    const merged = { ...remote };
                    Object.keys(local).forEach(k => {
                      if (!isNaN(local[k])) merged[k] = Math.max(merged[k] || 0, local[k]);
                    });
                    return merged;
                  } catch { return {}; }
                })();

                const certifiedUnitIds = currentCerts.map(c => c.unitId).filter(Boolean);
                const passingUnits = Object.entries(reconciledProgress)
                  .filter(([id, sc]) => !isNaN(sc) && sc >= 80 && !certifiedUnitIds.includes(id));

                for (const [unitId, score] of passingUnits) {
                  const unitDef = [
                    { id: 'gmp-intro', title: t('introGMP') }, { id: 'glp-basics', title: t('glpBasics') },
                    { id: 'iso-17025', title: t('iso17025') }, { id: 'ich-guidelines', title: t('ichGuidelines') },
                    { id: 'validation-qualification', title: t('valQual') }, { id: 'data-integrity', title: t('dataIntegrity') },
                    { id: 'qrm-basics', title: t('qrmBasics') }, { id: 'gdp-basics', title: t('gdpBasics') },
                    { id: 'ich-q10', title: t('ichQ10') }, { id: 'sterile-annex1', title: t('annex1') },
                    { id: 'gamp5-basics', title: t('gamp5') }, { id: 'batch-records', title: t('batchRecords') },
                    { id: 'nmpb-reg', title: t('nmpbReg') }, { id: 'adv-gmp', title: t('adv_gmp') },
                    { id: 'adv-glp', title: t('adv_glp') }, { id: 'adv-iso-17025', title: t('adv_iso_17025') },
                    { id: 'adv-validation', title: t('adv_validation') }, { id: 'adv-qrm', title: t('adv_qrm') },
                    { id: 'adv-gdp', title: t('adv_gdp') }, { id: 'cleaning-validation', title: t('cleaningValidation') },
                    { id: 'process-validation', title: t('processValidation') },
                    { id: 'hold-time-stability', title: t('holdTimeStability') },
                    { id: 'method-validation', title: t('methodValidation') },
                    { id: 'equipment-qualification', title: t('equipmentQualification') },
                  ].find(u => u.id === unitId);

                  if (!unitDef) continue;
                  console.log(`[RetroAward] Issuing cert for: ${unitId} (${score}%)`);
                  try {
                    await apiService.awardCertificate({
                      userId: user.uid,
                      userName: user.displayName || user.email,
                      unitId,
                      unitName: unitDef.title,
                      score,
                      percentage: score
                    });
                  } catch (certErr) {
                    console.warn(`[RetroAward] Failed for ${unitId}:`, certErr);
                  }
                }

                if (passingUnits.length > 0) {
                  const updatedCerts = await apiService.getUserCertificates(user.uid, authToken);
                  setCertificates(updatedCerts.certificates || []);
                }
            } catch (err) { console.warn('Certs fetch error', err); }
            
            try {
                const leaderboardData = await apiService.getLeaderboard(authToken);
                if (leaderboardData && Array.isArray(leaderboardData)) {
                    setLeaderboard(leaderboardData);
                }
            } catch (err) { console.warn('Leaderboard fetch error', err); }
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
    if (viewMode === 'academy' && !currentTrack && authToken) {
      apiService.getLeaderboard(authToken)
        .then(data => setLeaderboard(data))
        .catch(err => console.error('Leaderboard fetch failed', err));
    }
  }, [viewMode, currentTrack, authToken]);

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
    { id: 'cleaning-validation', title: t('cleaningValidation'), subtitle: t('unit_spec'), color: '#17a2b8' },
    { id: 'process-validation', title: t('processValidation'), subtitle: t('unit_spec'), color: '#10b981' },
    { id: 'hold-time-stability', title: t('holdTimeStability'), subtitle: t('unit_spec'), color: '#f59e0b' },
    { id: 'method-validation', title: t('methodValidation'), subtitle: t('unit_spec'), color: '#3b82f6' },
    { id: 'equipment-qualification', title: t('equipmentQualification'), subtitle: t('unit_spec'), color: '#8b5cf6' },
  ];

  const currentTrackObj = currentTrack ? TRACKS.find(t => t.id === currentTrack) : null;
  const currentSectionUnits = currentTrackObj ? currentTrackObj.units : [];
  const units = allUnitsDefinition.filter(u => currentSectionUnits.includes(u.id));
  const allTrackUnits = TRACKS.flatMap(t => t.units);

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
    setUnitStates(prev => {
      const newStates = { ...prev, [unitId]: { ...prev[unitId], lectureFinished: true } };
      localStorage.setItem(`sqp_states_${user.email}`, JSON.stringify(newStates));
      return newStates;
    });
    setIsLectureMode(false);
  };

  const handleQuizComplete = (result) => {
    const { score, unitId } = result;
    const passingThreshold = unitId === 'adv-iso-17025' ? 80 : 90;
    const passed = score >= passingThreshold;
    logAuditTrail('eventQuiz', unitId);

    console.log('[QuizComplete] Score:', score, 'UnitId:', unitId, 'User:', user?.uid, 'Email:', user?.email);

    if (passed && user?.uid) {
      setCompletedUnits(prev => ({
        ...prev,
        [unitId]: {
          completed: true,
          score,
          completedAt: new Date().toISOString(),
        },
      }));

      setUnitStates(prev => {
        const updated = {
          ...prev,
          [unitId]: { ...prev[unitId], lectureFinished: true, quizPassed: true, score },
        };
        if (user?.email) localStorage.setItem(`sqp_states_${user.email}`, JSON.stringify(updated));
        return updated;
      });

      apiService.markUnitCompleted(user.uid, unitId, score, result.totalQuestions || 0)
        .then(response => {
          if (response?.completedUnits) {
            setCompletedUnits(prev => ({ ...prev, ...response.completedUnits }));
          }
        })
        .catch(err => console.error('[QuizComplete] markUnitCompleted failed:', err));
    }

    setUserProgress(prev => {
      console.log('[QuizComplete] Previous progress:', prev);
      console.log('[QuizComplete] Previous score for unit', unitId, ':', prev[unitId]);
      const isNewSuccess = passed && (!prev[unitId] || prev[unitId] < passingThreshold);
      const newProgress = { ...prev, [unitId]: Math.max(prev[unitId] || 0, score) };
      
      console.log('[QuizComplete] Updated unitId:', unitId, 'New score for unit:', newProgress[unitId]);
      console.log('[QuizComplete] Full new progress:', JSON.stringify(newProgress));
      
      if (passed && user?.uid) {
        (async () => {
          try {
            // Use UNIT_ICONS for unitName to get proper English title
            const unitName = UNIT_ICONS[unitId]?.title?.en || unitId;
            console.log('[QuizComplete] Awarding certificate for unit:', unitId, 'unitName:', unitName);
            const response = await apiService.awardCertificate({
              userId: user.uid,
              userName: user.displayName || user.email,
              unitId,
              unitName,
              score,
              percentage: score
            });
            
            console.log('[QuizComplete] Certificate response:', response);
            
            // Refresh certificates list
            const certsData = await apiService.getUserCertificates(user.uid, authToken);
            setCertificates(certsData.certificates || []);
            
            if (response.certificate) {
              alert(language === 'ar' 
                ? 'تهانينا! تم إصدار شهادتك بنجاح. يمكنك العثور عليها في قسم الشهادات بالأسفل.' 
                : 'Congratulations! Your certificate has been issued successfully. You can find it in the certificates section below.');
            } else {
              // Fallback for unexpected cases
              alert(language === 'ar' ? 'تم تسجيل تقدمك بنجاح!' : 'Your progress has been recorded successfully!');
            }
          } catch (e) {
            console.error('[QuizComplete] Award failed', e);
          }
        })();
      }

      if (isNewSuccess) {
        if (unitId === 'cleaning-validation') {
          awardBadge('cleaning-expert', 'Cleaning Expert 🧼', '🧼');
        } else if (unitId === 'equipment-qualification') {
          awardBadge('qualification-master', 'Qualification Master ⚙️', '⚙️');
        } else if (unitId === 'method-validation') {
          awardBadge('analytical-expert', 'Analytical Expert 🧪', '🧪');
        } else if (unitId === 'process-validation' || unitId === 'hold-time-stability') {
          if (newProgress['process-validation'] >= 80 && newProgress['hold-time-stability'] >= 80) {
            awardBadge('validation-expert', 'Validation Expert 🔄', '🔄');
          }
        }
      }

      const allOthersPassed = allTrackUnits.filter(id => id !== unitId).every(id => (newProgress[id] || 0) >= 80);

      if (isNewSuccess && allOthersPassed) newProgress[`completionDate_academy`] = new Date().toISOString();
      
      const storageKey = `sqp_progress_${user.email}`;
      console.log('[QuizComplete] Saving to localStorage:', storageKey, 'Progress:', newProgress);
      localStorage.setItem(storageKey, JSON.stringify(newProgress));
      
      if (user.uid) {
        console.log('[QuizComplete] Syncing to backend...');
        const syncedUnitStates = passed
          ? { ...unitStates, [unitId]: { ...unitStates[unitId], lectureFinished: true, quizPassed: true, score } }
          : unitStates;
        apiService.syncUserStats(user.uid, {
          progress: {
            unitScores: newProgress,
            unitStates: syncedUnitStates,
            lastPlayed: unitId,
            totalScore: Math.round(Object.values(newProgress).reduce((a, b) => a + b, 0) / (Object.values(newProgress).length || 1))
          }
        }, authToken).catch(err => console.error('[QuizComplete] Sync failed:', err));
      }
      return newProgress;
    });
    setCurrentUnit(null);
  };

  const totalAverage = Math.round(allTrackUnits.reduce((a, id) => a + (userProgress[id] || 0), 0) / (allTrackUnits.length || 1));
  const certifiedUnitIds = certificates.map(c => c.unitId).filter(Boolean);
  const allPassed = allTrackUnits.length > 0 && allTrackUnits.every(id => 
    certifiedUnitIds.includes(id) || (userProgress[id] || 0) >= 80
  );

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
    const isUnlocked = certifiedUnitIds.includes(unitId) || score >= 80;
    return (
      <div 
        className={isUnlocked ? 'badge-unlocked' : 'badge-locked'}
        style={{
          width: '90px', height: '90px', borderRadius: '50%',
          background: isUnlocked ? 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)' : 'rgba(255, 255, 255, 0.4)',
          border: isUnlocked ? '3px solid var(--primary-color)' : '2px dashed var(--border-color)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '5px', textAlign: 'center', cursor: isUnlocked ? 'pointer' : 'default',
          opacity: isUnlocked ? 1 : 0.8, 
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          boxShadow: isUnlocked ? '0 8px 25px rgba(27, 79, 138, 0.15)' : 'none',
          backdropFilter: isUnlocked ? 'none' : 'blur(4px)',
          transform: 'translateY(0)'
        }} 
        onMouseEnter={(e) => { if(isUnlocked) e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)'; }}
        onMouseLeave={(e) => { if(isUnlocked) e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
        onClick={() => isUnlocked && alert(`${t('microBadge')}: ${unitId.toUpperCase()}\n${t('badgeId')}: SQP-B-${unitId.substring(0, 3).toUpperCase()}-${score}`)}
      >
        <span style={{ fontSize: '2rem', filter: isUnlocked ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' : 'opacity(0.6) grayscale(100%)' }}>
          {isUnlocked ? '🥇' : '🔐'}
        </span>
        <span style={{ fontSize: '0.65rem', fontWeight: '800', marginTop: '4px', color: isUnlocked ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
          {unitId.split('-')[0].toUpperCase()}
        </span>
      </div>
    );
  };

  const CertificateModal = ({ isSample = false, certData = null }) => {
    const [showSurvey, setShowSurvey] = useState(!isSample && !certData && !localStorage.getItem(`sqp_survey_${user.email}`));
    const [certLang, setCertLang] = useState('en'); 
    const [viewType, setViewType] = useState('cert'); // 'cert' or 'transcript'

    const downloadPDF = async (filename) => {
      const input = document.getElementById('certificate-printable');
      if (!input) return;
      window.scrollTo(0, 0);
      
      try {
        await document.fonts.ready;
      } catch (e) {
        console.warn('Font loading wait failed', e);
      }
      
      await new Promise(resolve => setTimeout(resolve, 800));

      try {
        const html2canvas = (await import('html2canvas')).default;
        const { jsPDF } = await import('jspdf');

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
          const pdfHeight = pdf.internal.pageSize.getHeight();
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
          pdf.save(`${isSample ? 'SAMPLE_' : ''}${filename}.pdf`);
          if (prevLang === 'ar') setCertLang('ar');
          // Restore original image sources
          Array.from(document.querySelectorAll('#certificate-printable img[alt="Logo"]')).forEach((img, i) => { img.src = origLogoSrcs[i] || img.src; });
          Array.from(document.querySelectorAll('#certificate-printable img[alt="Gold Seal"]')).forEach((img, i) => { img.src = origSealSrcs[i] || img.src; });
          logAuditTrail('eventCert');
        });
      } catch (error) {
        console.error('Failed to load PDF libraries dynamically:', error);
        alert(language === 'ar' ? 'فشل تحميل مكتبات الشهادة. يرجى المحاولة مرة أخرى.' : 'Failed to load certificate libraries. Please try again.');
      }
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

    // Get unit name from certData or map from unitId using UNIT_ICONS
    const getUnitName = (cert) => {
      if (cert?.unitName) return cert.unitName;
      if (cert?.unitType) return cert.unitType;
      if (cert?.unitId && UNIT_ICONS[cert.unitId]) {
        return certLang === 'ar' ? UNIT_ICONS[cert.unitId].title.ar : UNIT_ICONS[cert.unitId].title.en;
      }
      return certLang === 'ar' ? 'التخصصية' : 'Specialized';
    };

    const unitName = certData ? getUnitName(certData) : null;

    const certContent = {
      en: {
        authority: 'Sudan Quality Platform',
        subAuthority: 'Quality & Accreditation Board',
        title: 'CERTIFICATE OF COMPLETION',
        transcriptTitle: 'ACADEMIC TRANSCRIPT & COURSE DETAILS',
        intro: 'This is to certify that',
        issueDate: certData ? new Date(certData.issueDate?.toDate?.() || certData.issueDate || certData.createdAt?.toDate?.() || certData.createdAt || Date.now()).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
        desc: certData ? `Has successfully completed the ${unitName} unit and demonstrated professional proficiency.` : 'Has successfully completed the Professional Pharmaceutical Training Program and demonstrated exceptional proficiency in GxP standards, Quality Management Systems, and Regulatory Compliance.',
        date: 'Date',
        name: 'Ahmed Daoud Tajeldeinn',
        unitHead: 'Unit/Module Name',
        scoreHead: 'Score',
        statusHead: 'Status'
      },
      ar: {
        authority: 'منصة السودان للجودة',
        subAuthority: 'مجلس الجودة والاعتماد البرامجي',
        title: 'شهادة إتمام تدريب',
        transcriptTitle: 'السجل الأكاديمي وتفاصيل البرنامج',
        intro: 'نشهد بأن المتدرب/ـة',
        issueDate: certData ? new Date(certData.issueDate?.toDate?.() || certData.issueDate || certData.createdAt?.toDate?.() || certData.createdAt || Date.now()).toLocaleDateString('ar-EG') : new Date().toLocaleDateString('ar-EG'),
        desc: certData ? `قد أكمل بنجاح وحدة ${unitName} وأظهر كفاءة احترافية متميزة.` : 'قد أكمل بنجاح برنامج التدريب الدوائي الاحترافي وأظهر كفاءة استثنائية في معايير GxP، نظم إدارة الجودة، والامتثال الرقابي.',
        date: 'التاريخ',
        name: 'أحمد داؤود تاجر الدين',
        unitHead: 'الوحدة / المسار',
        scoreHead: 'الدرجة',
        statusHead: 'الحالة'
      }
    };

    const current = certContent[certLang];

    return (
      <div className="certificate-modal-overlay" style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(10, 22, 40, 0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 2000, padding: '40px', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
          <div id="certificate-printable" className={`certificate-container ${certLang === 'ar' ? 'rtl-cert' : ''}`} style={{
            backgroundColor: 'var(--bg-card)', width: '297mm', height: '210mm',
            padding: '40px 60px', borderRadius: '4px', position: 'relative',
            border: '15px solid var(--pharma-navy)', outline: '5px solid var(--pharma-gold)', outlineOffset: '-25px',
            textAlign: 'center',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)', direction: certLang === 'ar' ? 'rtl' : 'ltr',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            fontFamily: certLang === 'ar' ? "'IBM Plex Sans Arabic', 'Amiri', serif" : "'Inter', 'IBM Plex Sans', sans-serif"
          }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: '600px', height: '600px', backgroundImage: `url(${LOGO_PATH})`,
              backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
              opacity: 0.03, pointerEvents: 'none', zIndex: 1
            }}></div>

            <div style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              {/* Header */}
              <div style={{ 
                position: 'absolute', top: '-10px', 
                right: certLang === 'ar' ? '-20px' : 'auto', 
                left: certLang === 'en' ? '-20px' : 'auto', 
                display: 'flex', 
                flexDirection: certLang === 'ar' ? 'row' : 'row-reverse',
                alignItems: 'center', gap: '20px', zIndex: 100 
              }}>
                <div style={{ textAlign: certLang === 'ar' ? 'right' : 'left', color: 'var(--pharma-navy)' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.8rem', lineHeight: '1.2' }}>{current.authority}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--regulatory-amber)' }}>{current.subAuthority}</div>
                </div>
                <img src={LOGO_PATH} alt="Logo" style={{ width: '100px', height: '100px' }} />
              </div>

              {viewType === 'cert' ? (
                <div style={{ marginTop: '130px' }}>
                  <h1 style={{ fontSize: '3.2rem', color: 'var(--pharma-navy)', marginBottom: '5px', textTransform: certLang === 'ar' ? 'none' : 'uppercase', letterSpacing: certLang === 'ar' ? 'normal' : '2px', fontWeight: '800' }}>
                    {current.title}
                  </h1>
                  <div style={{ width: '200px', height: '4px', backgroundColor: 'var(--pharma-gold)', margin: '15px auto' }}></div>
                  <div style={{ margin: '20px 0' }}>
                    <p style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: '600' }}>{current.intro}</p>
                    <h2 style={{ fontSize: '3.6rem', color: 'var(--pharma-blue)', fontWeight: '700' }}>
                      {isSample ? current.name : (user.displayName || user.email.split('@')[0])}
                    </h2>
                  </div>
                  <p style={{ fontSize: '1.3rem', margin: '20px auto', color: 'var(--text-primary)', lineHeight: '1.8', maxWidth: '850px', fontWeight: '500' }}>
                    {current.desc}
                  </p>
                </div>
              ) : (
                <div style={{ marginTop: '110px', textAlign: 'center' }}>
                  <h2 style={{ fontSize: '2.2rem', color: 'var(--pharma-navy)', marginBottom: '20px' }}>{current.transcriptTitle}</h2>
                  <div style={{ maxHeight: '400px', overflowY: 'hidden', padding: '0 40px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid var(--border-color)' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--pharma-navy)', color: 'white' }}>
                          <th style={{ padding: '12px', border: '1px solid #ddd' }}>{current.unitHead}</th>
                          <th style={{ padding: '12px', border: '1px solid #ddd' }}>{current.scoreHead}</th>
                          <th style={{ padding: '12px', border: '1px solid #ddd' }}>{current.statusHead}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {unitIds.map(id => (
                          <tr key={id}>
                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: certLang === 'ar' ? 'right' : 'left' }}>{certLang === 'ar' ? UNIT_ICONS[id].title.ar : UNIT_ICONS[id].title.en}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold', color: 'var(--pharma-green)' }}>%{userProgress[id]}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', color: userProgress[id] >= 80 ? '#28a745' : '#999' }}>{userProgress[id] >= 80 ? 'PASSED' : 'PENDING'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '1.4rem', color: 'var(--pharma-navy)' }}>
                    {language === 'ar' ? 'متوسط الدرجات الكلي' : 'Overall Performance Average'}: %{totalAverage}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 20px' }}>
                <div style={{ textAlign: certLang === 'ar' ? 'right' : 'left', color: 'var(--text-secondary)' }}>
                  <p style={{ margin: '5px 0', fontWeight: '700', fontSize: '1rem', color: 'var(--pharma-navy)' }}>
                    {current.date}: {certData ? new Date(certData.issueDate || certData.createdAt || Date.now()).toLocaleDateString() : (userProgress['completionDate_academy'] ? new Date(userProgress['completionDate_academy']).toLocaleDateString() : new Date().toLocaleDateString())}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                    <div style={{ backgroundColor: 'white', padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}>
                      <QRCodeCanvas 
                        value={`https://decisive-octane-472816-d3.web.app/verify?id=${certData?.certNumber || certData?.verificationId || user.uid}`} 
                        size={65} 
                        level="H" 
                        includeMargin={false}
                      />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textAlign: 'left' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--pharma-navy)' }}>CERTIFICATE VERIFICATION</div>
                      <div>SCAN TO VALIDATE AUTHENTICITY</div>
                      <div style={{ fontFamily: 'monospace', letterSpacing: '1px', marginTop: '3px' }}>
                        ID: {user.uid?.substring(0, 8).toUpperCase()}-{new Date(userProgress['completionDate_academy'] || Date.now()).getTime().toString().substring(8)}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Gold Seal - Center */}
                <div style={{ textAlign: 'center' }}>
                  <img src={goldSeal} alt="Gold Seal" style={{ width: '140px', height: 'auto' }} />
                </div>
                {/* Signature - Right */}
                <div style={{ textAlign: 'center' }}>
                  <img src={LOGO_PATH} alt="Logo" style={{ width: '55px', height: '55px' }} />
                  <div style={{ width: '200px', borderTop: '2px solid var(--pharma-navy)', paddingTop: '8px', marginTop: '25px', fontWeight: '800', color: 'var(--pharma-navy)', fontSize: '1rem' }}>
                    {t('developerName')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls - Moved outside #certificate-printable */}
          <div className="no-print" style={{ display: 'flex', gap: '15px', zIndex: 3000, paddingBottom: '40px' }}>
            <button onClick={() => setCertLang(certLang === 'en' ? 'ar' : 'en')} className="btn-lang" style={{ background: '#6c757d', minWidth: '150px' }}>
              🌐 {certLang === 'en' ? 'Arabic' : 'English'}
            </button>
            <button onClick={() => setViewType(viewType === 'cert' ? 'transcript' : 'cert')} className="btn-lang" style={{ background: 'var(--regulatory-amber)', minWidth: '150px' }}>
               {viewType === 'cert' ? '📄 View Details' : '📜 View Certificate'}
            </button>
            <button onClick={() => downloadPDF(viewType === 'cert' ? 'Certificate' : 'Transcript')} className="btn-primary" style={{ minWidth: '150px' }}>
              ⬇️ Download {viewType === 'cert' ? 'PDF' : 'Details'}
            </button>
            <button onClick={() => { setShowCertificate(false); setIsSampleMode(false); setSelectedCert(null); if(onCertClosed) onCertClosed(); }} className="btn-logout" style={{ background: '#333', minWidth: '100px' }}>
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
        <Quiz 
          unitId={currentUnit} 
          onQuizComplete={handleQuizComplete} 
          user={user} 
          count={['cleaning-validation', 'process-validation', 'hold-time-stability', 'equipment-qualification'].includes(currentUnit) ? 15 : 10}
        />
      </div>
    );
  }

  return (
    <div style={{ direction: language === 'ar' ? 'rtl' : 'ltr', paddingBottom: '50px' }}>
      {showPledge && <PledgeModal />}
      {showCertificate && <CertificateModal isSample={isSampleMode} certData={selectedCert} />}
      {showDevProfile && <DeveloperProfileModal />}

      {!activeTab && <header className="main-header glass-panel" style={{ borderRadius: '0 0 24px 24px', margin: '0 20px', backgroundColor: 'var(--primary-color)' }}>
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
      </header>}

      {/* PROMINENT BANNER — only show when not in StudentShell */}
      {!activeTab && <div style={{
        background: 'linear-gradient(90deg, #d4edda, #c3e6cb)',
        color: '#155724',
        padding: '20px',
        textAlign: 'center',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        margin: '20px',
        borderRadius: '24px',
        borderBottom: '4px solid #28a745',
        boxShadow: '0 2px 10px rgba(40,167,69,0.2)'
      }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>📜 <strong>قواعد الشهادات</strong></div>
        <div>
          <span>نظام المنصة: <strong style={{ color: '#28a745' }}>شهادة معتمدة لكل كورس على حدة</strong></span>
        </div>
      </div>}

      {/* Certificates Section — hidden in StudentShell (has own tab) */}
      {!activeTab && <section style={{ padding: '30px', borderRadius: '24px', margin: '0 20px 30px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#17a2b8' }}>🎯 الشهادات المحقّقة ({certificates.length})</h3>
        <div style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#28a745', fontWeight: 'bold' }}>
          كل كورس اكتمل بنسبة 90%+ = شهادة
        </div>
        {certificates.length > 0 ? certificates.map(cert => (
          <div key={cert._id || cert.certificateId || cert.certNumber} style={{ padding: '15px', marginBottom: '10px', background: '#d4edda', borderRadius: '10px', borderLeft: '5px solid #28a745', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{cert.unitName || cert.unitType || 'شهادة'}</strong>
              {cert.level && <span style={{ marginRight: '8px', marginLeft: '8px', background: '#28a745', color: 'white', borderRadius: '6px', padding: '2px 8px', fontSize: '0.8rem' }}>L{cert.level}</span>}
              {cert.score && <span style={{ color: '#155724' }}>{cert.score}%</span>}
              {cert.certNumber && <div style={{ fontSize: '0.75rem', color: '#6c757d', marginTop: '2px' }}>{cert.certNumber}</div>}
            </div>
            <button onClick={() => { setSelectedCert(cert); setShowCertificate(true); }} className="btn-primary" style={{ padding: '5px 15px', fontSize: '0.8rem' }}>
              👁️ عرض
            </button>
          </div>
        )) : <p style={{ color: '#6c757d' }}>ابدأ الكورسات لتحقيق شهاداتك!</p>}
      </section>}


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

            
            <div className='cert-main-grid' style={{ display: 'grid', gap: '40px' }}>
              <section className="glass-panel" style={{ padding: '35px', borderRadius: '24px' }}>
                {!currentTrack ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                    {TRACKS.map(track => (
                      <div key={track.id} onClick={() => setCurrentTrack(track.id)} className="interactive-card-premium track-card" 
                        style={{ padding: '35px 25px', borderRadius: '20px', textAlign: 'center' }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = track.color; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                      >
                        <div style={{ fontSize: '3.5rem', marginBottom: '20px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>{track.icon}</div>
                        <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{t(track.titleKey)}</h4>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <button onClick={() => setCurrentTrack(null)} style={{ marginBottom: '25px', padding: '10px 20px', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateX(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}>
                      <span>←</span> {language === 'ar' ? 'رجوع' : 'Back'}
                    </button>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '25px' }}>
                      {units.map(unit => {
                        const isCompleted = completedUnits[unit.id]?.completed || (userProgress[unit.id] || 0) >= 80;
                        const completionScore = completedUnits[unit.id]?.score || userProgress[unit.id] || 0;
                        return (
                          <div key={unit.id} onClick={() => handleStartUnit(unit.id)} className="interactive-card-premium" style={{ padding: '30px 20px', borderRadius: '20px', textAlign: 'center', borderTop: `4px solid ${unit.color}`, position: 'relative' }}>
                            {isCompleted && (
                              <div style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: '#10b981', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', boxShadow: '0 2px 10px rgba(16,185,129,0.3)' }}>✓</div>
                            )}
                            <div style={{ fontSize: '3rem', marginBottom: '15px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}>{UNIT_ICONS[unit.id]?.icon}</div>
                            <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>{unit.title}</h4>
                            {isCompleted && (
                              <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: '800', background: 'rgba(16,185,129,0.1)', padding: '5px 12px', borderRadius: '12px', display: 'inline-block' }}>
                                {completionScore}%
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>
              
              <div className="cert-sidebar-premium">
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at center, rgba(201, 162, 39, 0.1) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
                {/* Badge Wallet — moved here from full-width section */}
                <div style={{ marginBottom: '20px', padding: '16px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ color: 'var(--primary-color)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                    <span>🏅</span> {t('microBadge')} Wallet
                  </h4>
                  <div className="wallet-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {unitIds.map(id => <MicroBadge key={id} unitId={id} score={userProgress[id]} />)}
                  </div>
                </div>
                <div className="cert-trophy" style={{ fontSize: '5rem', marginBottom: '20px', filter: 'drop-shadow(0 10px 15px rgba(201, 162, 39, 0.3))', animation: allPassed ? 'pulse-glow 3s infinite' : 'none', borderRadius: '50%' }}>🏆</div>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '15px', zIndex: 1 }}>{t('earnedCertificates')}</h2>
                {allPassed && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '10px', zIndex: 1 }}>{language === 'ar' ? 'تهانينا! لقد أتممت جميع المتطلبات.' : 'Congratulations! You met all requirements.'}</p>}
                <button disabled={!allPassed} onClick={() => setShowCertificate(true)} className={`btn-cert-premium ${allPassed ? 'active' : ''}`} style={{ zIndex: 1 }}>
                  {allPassed ? (language === 'ar' ? '✨ عرض الشهادة ✨' : '✨ View Certificate ✨') : '🔒 Locked'}
                </button>
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
            <div className='cert-main-grid' style={{ display: 'grid', gap: '30px' }}>
              <section className="glass-panel" style={{ padding: '30px', borderRadius: '24px', background: 'var(--bg-card)' }}>
                <h3 style={{ marginBottom: '25px', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.5rem' }}>📊</span> {language === 'ar' ? 'تحليل تقدمك الدراسي' : 'Your Learning Analytics'}
                </h3>
                
                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                  <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', padding: '25px', borderRadius: '20px', textAlign: 'center', border: '1px solid #10b981' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>{allTrackUnits.filter(id => (userProgress[id] || 0) >= 80).length}</div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '500' }}>{language === 'ar' ? 'وحدة مكتملة' : 'Units Completed'}</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.05)', padding: '25px', borderRadius: '20px', textAlign: 'center', border: '1px solid #f59e0b' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{totalAverage}%</div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '500' }}>{language === 'ar' ? 'متوسط الدرجات' : 'Average Score'}</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.05)', padding: '25px', borderRadius: '20px', textAlign: 'center', border: '1px solid #6366f1' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#6366f1' }}>{allTrackUnits.filter(id => (userProgress[id] || 0) >= 80).length * 2}h</div>
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
                    const isPassed = score >= 80;
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
                        {language === 'ar' ? 'يتبقى لك' : 'You have'} {allTrackUnits.length - allTrackUnits.filter(id => (userProgress[id] || 0) >= 80).length} {language === 'ar' ? 'وحدات للوصول للدرجة المطلوبة (90%+).' : 'units remaining to reach the required score (90%+).'}
                      </p>
                    )}
                  </div>
                  <div style={{ marginTop: '20px', height: '10px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${(allTrackUnits.filter(id => (userProgress[id] || 0) >= 80).length / allTrackUnits.length) * 100}%`, 
                      height: '100%', 
                      background: 'white', 
                      borderRadius: '10px',
                      boxShadow: '0 0 15px rgba(255,255,255,0.5)'
                    }} />
                  </div>
                  <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {Math.round((allTrackUnits.filter(id => (userProgress[id] || 0) >= 80).length / allTrackUnits.length) * 100)}% {language === 'ar' ? 'مكتمل' : 'Complete'}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '20px', color: '#6c757d', borderTop: '1px solid #eee', marginTop: '40px' }}>
        <p>© 2026 منصة السودان للجودة - PharmaQMS v1.0.6</p>
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
