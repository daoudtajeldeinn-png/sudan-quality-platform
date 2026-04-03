import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { useGamification } from '../GamificationContext';
import { apiService } from '../services/api';
import { educationalContent } from '../data/content_new.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../styles/CertificateStyles.css';
import pharmaLogo from '../assets/pharma_logo.png';
import certBg from '../assets/certificate_bg.png';

const Quiz = ({ unitId, onQuizComplete, user }) => {
  const { language, t, theme } = useLanguage();
  const { addXp, awardBadge, updateStats, stats } = useGamification();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizState, setQuizState] = useState('loading'); // loading, active, completed
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLastAnswerCorrect, setIsLastAnswerCorrect] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState({ ar: '', en: '' });
  const [certName, setCertName] = useState(user?.displayName || '');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, [unitId]);

  const shuffleArray = (array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const loadQuestions = async () => {
    // Session-based rotation via localStorage
    const storageKey = `sqp_quiz_history_${unitId}${user ? '_' + (user.uid || user.email) : ''}`;
    let excludeIds = [];
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) excludeIds = JSON.parse(stored);
    } catch (e) { console.warn('LocalStorage error:', e); }

    try {
      const userIdParam = user ? (user.uid || user.email) : null;
      const response = await apiService.getQuestions(unitId, 10, userIdParam, excludeIds);
      if (response && response.length > 0) {
        // Track seen questions for next time (useful for Demo Mode where DB history isn't saved)
        const selectedIds = response.map(q => q._id);
        localStorage.setItem(storageKey, JSON.stringify([...excludeIds, ...selectedIds]));

        setQuestions(processQuestions(response));
        setQuizState('active');
        setIsDemoMode(false);
      } else {
        throw new Error('No questions found');
      }
    } catch (error) {
      console.warn('Backend connection failed, using Randomized Advanced Demo Mode questions', error);
      // Check if unit exists in educational content
      const unitData = educationalContent.units[unitId];
      if (!unitData) {
        console.error('Unit not found:', unitId);
        setQuizState('error');
        return;
      }
      const pool = unitData.examQuestionPool;
      
      if (!pool || pool.length === 0) {
        console.error('No questions in pool for unit:', unitId);
        setQuizState('error');
        return;
      }

      // Local rotation logic
      let availableIds = pool.filter(id => !excludeIds.includes(id));
      if (availableIds.length < 10 && pool.length >= 10) {
        // Reset history if we run out but have enough overall
        availableIds = [...pool];
        excludeIds = [];
      } else if (availableIds.length === 0) {
        availableIds = [...pool];
        excludeIds = [];
      }

      // Select up to 10 random questions
      const randomSubset = shuffleArray(availableIds).slice(0, 10);
      
      localStorage.setItem(storageKey, JSON.stringify([...excludeIds, ...randomSubset]));

      const rawQuestions = randomSubset.map(id => {
        const q = educationalContent.allQuestions[id];
        if (!q) {
          console.warn('Question not found:', id);
          return null;
        }
        return { ...q, _id: id };
      }).filter(q => q !== null);

      if (rawQuestions.length === 0) {
        console.error('No valid questions found for unit:', unitId);
        setQuizState('error');
        return;
      }

      setQuestions(processQuestions(rawQuestions));
      setIsDemoMode(true);
      setQuizState('active');
    }
  };

  const processQuestions = (rawQuestions) => {
    return rawQuestions.map(q => {
      if (q.type === 'mcq' || !q.type) {
        // Handle case where options might be missing but we expect 10 questions
        const optionsCount = q.options ? q.options.en.length : 0;
        const indices = Array.from({ length: optionsCount }, (_, i) => i);
        return {
          ...q,
          type: 'mcq',
          shuffledIndices: shuffleArray(indices)
        };
      }
      return { ...q, type: q.type || 'mcq' };
    });
  };

  const handleAnswerSelect = async (answer) => {
    if (isVerifying) return;
    
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newUserAnswers);

    const q = questions[currentQuestionIndex];
    let isCorrect = false;
    let explanationObj = q.explanation || { ar: '', en: '' };

    if (isDemoMode) {
      // Local validation for Demo Mode
      if (q.type === 'mcq') {
        const originalIdx = q.shuffledIndices[answer];
        isCorrect = originalIdx === q.correctAnswer;
      } else if (q.type === 'tf') {
        isCorrect = answer === q.correctAnswer;
      } else if (q.type === 'fill') {
        const normalizedUser = String(answer || '').trim().toLowerCase();
        isCorrect = (q.correctAnswers || []).some(ans => ans.toLowerCase() === normalizedUser);
      }
    } else {
      // Server-side validation
      try {
        setIsVerifying(true);
        const result = await apiService.checkAnswer(q._id, answer);
        isCorrect = result.isCorrect;
        explanationObj = result.explanation || { ar: '', en: '' };
      } catch (error) {
        console.error('Answer verification failed:', error);
        // Fallback to local check if server fails unexpectedly
        if (q.type === 'mcq') {
          const originalIdx = q.shuffledIndices[answer];
          isCorrect = originalIdx === q.correctAnswer;
        } else if (q.type === 'tf') {
          isCorrect = answer === q.correctAnswer;
        } else if (q.type === 'fill') {
          const normalizedUser = String(answer || '').trim().toLowerCase();
          isCorrect = (q.correctAnswers || []).some(ans => ans.toLowerCase() === normalizedUser);
        }
      } finally {
        setIsVerifying(false);
      }
    }

    setIsLastAnswerCorrect(isCorrect);
    setCurrentExplanation(explanationObj);
    setShowExplanation(!isCorrect);

    // Track score locally for immediate feedback if needed, 
    // though calculateResult handles the final tally
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    // We will re-verify all answers for the final score locally 
    // as we've kept track of correctness status in a more robust flow
    // In a real production app, we might want a final scoresheet from the server
    let correctCount = 0;
    questions.forEach((q, index) => {
      const userAnswer = userAnswers[index];
      if (q.type === 'mcq') {
        const originalIndex = q.shuffledIndices[userAnswer];
        // Note: For now we trust the local state for speed, 
        // as individual checks were already done via handleAnswerSelect
        if (originalIndex === q.correctAnswer) correctCount++;
      } else if (q.type === 'tf') {
        if (userAnswer === q.correctAnswer) correctCount++;
      } else if (q.type === 'fill') {
        const normalizedUser = String(userAnswer || '').trim().toLowerCase();
        const isCorrect = (q.correctAnswers || []).some(ans => ans.toLowerCase() === normalizedUser);
        if (isCorrect) correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setQuizState('completed');

    // --- Gamification Rewards ---
    if (finalScore >= 90) {
      addXp(50); // Standard pass reward
      if (finalScore === 100) {
        addXp(50); // Bonus for perfect score
        awardBadge('perfect_score', t('perfectScoreBadge') || 'Perfect Score', '💎');
        updateStats({ perfectScores: stats.perfectScores + 1 });
      }
      
      // Special badge for NMPB unit
      if (unitId === 'nmpb-reg') {
        awardBadge('sudan_expert', t('sudanExpertBadge') || 'Sudan Regulatory Expert', '🇸🇩');
      }

      // Achievement for completing first quiz
      if (stats.totalQuizzes === 0) {
        awardBadge('first_quiz', t('speedLearnerBadge') || 'First Achievement', '🚀');
      }
    }
    updateStats({ totalQuizzes: stats.totalQuizzes + 1 });

    if (onQuizComplete) {
      onQuizComplete({
        score: finalScore,
        passed: finalScore >= 90,
        unitId
      });
    }
    // Legacy PDF removed - handled by Dashboard award system
  };

  const generatePDF = async () => {
    if (!certName.trim()) {
      alert(language === 'ar' ? 'يرجى إدخال الاسم لإصدار الشهادة' : 'Please enter a name for the certificate');
      return;
    }

    setIsGenerating(true);
    const element = document.getElementById('certificate-template');
    
    try {
      // Ensure fonts are ideally loaded by this point; with scale and useCORS, html2canvas should see them.
      // Small delay can help ensure the engine has calculated the layout for the off-screen element
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false, // Set to true if debugging is needed
        letterRendering: true, // Can help with specific font issues
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
        hotfixes: ["px_scaling"] // Important for consistent pixel sizes
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height, undefined, 'FAST');
      const filename = `Certificate_${unitId}_${certName.replace(/\s+/g, '_')}.pdf`;
      pdf.save(filename);
      
      awardBadge('certified', t('certifiedBadge') || 'Certified Professional', '📜');
    } catch (error) {
      console.error('Certificate generation failed:', error);
      alert(language === 'ar' ? 'عذراً، فشل إصدار الشهادة. يرجى المحاولة مرة أخرى.' : 'Error generating certificate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (quizState === 'loading') {
    return (
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Inter, Arial, sans-serif',
        direction: language === 'ar' ? 'rtl' : 'ltr',
        color: 'var(--text-primary)'
      }}>
        {/* Quiz Header */}
        <div className="glass-panel" style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          padding: '25px',
          marginBottom: '30px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
          margin: '0 auto 30px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '4px solid var(--primary-color)',
          animation: 'pulse 1.5s infinite'
        }}>
          <span style={{ fontSize: '2.5rem' }}>📝</span>
        </div>
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '20px', fontSize: '1.8rem' }}>
          {language === 'ar' ? 'جاري تحضير الأسئلة...' : 'Preparing Questions...'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '30px', textAlign: 'center' }}>
          {language === 'ar' 
            ? 'يرجى الانتظار قليلاً. قد يستغرق الخادم لحظات للاستيقاظ لأول مرة.'
            : 'Please wait a moment. The server may take a few seconds to wake up for the first time.'}
        </p>
        <div style={{
          width: '200px',
          height: '8px',
          backgroundColor: 'var(--bg-color-secondary)',
          borderRadius: '10px',
          margin: '0 auto',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '50%',
            height: '100%',
            backgroundColor: 'var(--primary-color)',
            borderRadius: '10px',
            animation: 'loading 1.5s infinite'
          }}></div>
        </div>
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          @keyframes loading {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          `
        }} />
      </div>
    </div>
    );
  }

  // Safety check - if no questions loaded, show error
  if (!questions || questions.length === 0) {
    if (quizState === 'error') { // This block handles explicit errors during loading
      return (
        <div style={{ 
          textAlign: 'center', 
          padding: '50px',
          direction: language === 'ar' ? 'rtl' : 'ltr'
        }}>
          <div className="glass-panel" style={{ 
            backgroundColor: 'var(--bg-error)', 
            border: '1px solid var(--border-error)',
            borderRadius: '12px',
            padding: '40px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              border: '3px solid var(--border-error)'
            }}>
              <span style={{ fontSize: '2rem' }}>❌</span>
            </div>
            <h2 style={{ color: 'var(--text-error)', marginBottom: '15px', fontSize: '1.5rem' }}>
              {language === 'ar' ? 'حدث خطأ في التحميل' : 'Loading Error'}
            </h2>
            <p style={{ color: 'var(--text-error)', marginBottom: '15px', lineHeight: '1.6' }}>
              {language === 'ar' 
                ? 'عذراً، حدث خطأ أثناء تحميل الامتحان.'
                : 'Sorry, an error occurred while loading the exam.'}
            </p>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '25px', fontSize: '0.95rem' }}>
              {language === 'ar' 
                ? 'يرجى التحقق من الاتصال وحاولة مرة أخرى'
                : 'Please check your connection and try again'}
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button 
                onClick={() => window.location.reload()}
                className="btn-primary"
                style={{ padding: '12px 30px', backgroundColor: 'var(--btn-error-bg)' }}
              >
                {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="btn-secondary"
                style={{ padding: '12px 30px' }}
              >
                {language === 'ar' ? 'العودة للرئيسية' : 'Go Back'}
              </button>
            </div>
          </div>
        </div>
      );
    }
    // This block handles cases where questions array is empty but quizState is not explicitly 'error'
    // (e.g., if backend returned empty array or demo mode failed to find questions)
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px',
        direction: language === 'ar' ? 'rtl' : 'ltr'
      }}>
        <div className="glass-panel" style={{ 
          backgroundColor: 'var(--bg-warning)', 
          border: '1px solid var(--border-warning)',
          borderRadius: '12px',
          padding: '40px',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '3px solid var(--border-warning)'
          }}>
            <span style={{ fontSize: '2rem' }}>⚠️</span>
          </div>
          <h2 style={{ color: 'var(--text-warning)', marginBottom: '15px', fontSize: '1.5rem' }}>
            {language === 'ar' ? 'لا توجد أسئلة متاحة' : 'No Questions Available'}
          </h2>
          <p style={{ color: 'var(--text-warning)', marginBottom: '15px', lineHeight: '1.6' }}>
            {language === 'ar' 
              ? 'عذراً، لم يتم العثور على أسئلة لهذه الوحدة.'
              : 'Sorry, no questions were found for this unit.'}
          </p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '25px', fontSize: '0.95rem' }}>
            {language === 'ar' 
              ? 'سيتم توجيهك لإعادة المحاولة'
              : 'You will be redirected to try again'}
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
              style={{ padding: '12px 30px', backgroundColor: 'var(--btn-warning-bg)', color: 'var(--btn-warning-text)' }}
            >
              {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="btn-secondary"
              style={{ padding: '12px 30px' }}
            >
              {language === 'ar' ? 'العودة للرئيسية' : 'Go Back'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizState === 'completed') {
    const passed = score >= 90;
    const unitTitle = educationalContent.units[unitId]?.title || { ar: unitId, en: unitId };
    
    return (
      <div className="result-container" style={{ position: 'relative' }}>
        <div className="result-card animate-fade-in" style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '40px',
          textAlign: 'center',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-lg)',
          direction: language === 'ar' ? 'rtl' : 'ltr'
        }}>
          <h2 style={{ fontSize: '3rem', color: passed ? 'var(--primary-color)' : 'var(--text-error)', marginBottom: '10px' }}>
            %{score}
          </h2>
          <h3>{passed ? (language === 'ar' ? 'تهانينا! لقد اجتزت الامتحان بنجاح' : 'Congratulations! You passed the exam') : (language === 'ar' ? 'للأسف لم تتخطى درجة النجاح (90%)' : 'Sorry, you didn\'t reach the passing score (90%)')}</h3>

          {passed && (
            <div className="certificate-action-box" style={{ 
              marginTop: '30px', 
              padding: '25px', 
              backgroundColor: 'rgba(40, 167, 69, 0.05)', 
              borderRadius: '16px',
              border: '1px dashed var(--primary-color)' 
            }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '15px', color: 'var(--text-secondary)' }}>
                {language === 'ar' ? 'أدخل اسمك كما تود أن يظهر في الشهادة:' : 'Enter your name as you want it to appear on the certificate:'}
              </p>
              <input 
                type="text" 
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                placeholder={language === 'ar' ? 'الاسم الثنائي أو الثلاثي' : 'Your Full Name'}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  marginBottom: '15px',
                  textAlign: 'center',
                  fontSize: '1.1rem'
                }}
              />
              <button 
                onClick={generatePDF} 
                disabled={isGenerating || !certName.trim()}
                className="btn-primary"
                style={{ 
                  width: '100%', 
                  padding: '15px', 
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                {isGenerating ? '⌛...' : '🎓'} {language === 'ar' ? 'تحميل الشهادة المعتمدة (PDF)' : 'Download Certified Certificate (PDF)'}
              </button>
            </div>
          )}

          {!passed && (
            <p style={{ color: 'var(--text-error)', fontWeight: 'bold', margin: '15px 0' }}>
              {t('scoreLowWarning')}
            </p>
          )}

          <p style={{ margin: '20px 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {language === 'ar' ? 'لقد تمت مراجعة إجاباتك بناءً على معايير الجودة العالمية.' : 'Your answers have been reviewed based on international quality standards.'}
          </p>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
            <button onClick={() => window.location.reload()} className="btn-secondary" style={{ padding: '12px 30px' }}>
              {language === 'ar' ? 'العودة للوحة القيادة' : 'Back to Dashboard'}
            </button>

            {!passed && (
              <button onClick={() => {
                setCurrentQuestionIndex(0);
                setUserAnswers([]);
                setQuizState('active');
                loadQuestions();
              }} className="btn-primary" style={{ padding: '12px 30px', backgroundColor: 'var(--btn-error-bg)' }}>
                {t('retakeBtn')}
              </button>
            )}
          </div>
        </div>

        {/* Hidden Certificate Template for PDF Rendering */}
        <div id="certificate-template" className={`certificate-container ${language === 'ar' ? 'rtl-cert' : ''}`} style={{ 
          position: 'absolute', // Absolute instead of Fixed to avoid viewport clipping
          top: '-9999px', // Far off-screen
          left: '0',
          width: '1123px',
          height: '794px',
          zIndex: -1,
          opacity: 1 // Must be 1 for capture
        }}>
          <img src={certBg} className="certificate-bg" alt="bg" />
          <div className="certificate-content">
            <img src={pharmaLogo} className="cert-logo" alt="logo" />
            <h1 className="cert-header">
              {language === 'ar' ? 'شهادة إتمام' : 'Certificate of Completion'}
            </h1>
            <p className="cert-text">
              {language === 'ar' ? 'يُشهد المجلس القومي للأدوية والسموم بأن:' : 'This is to certify that:'}
            </p>
            <div className="cert-name">{certName}</div>
            <p className="cert-text" style={{ marginTop: '20px' }}>
              {language === 'ar' ? 'قد اجتاز بنجاح الدورة التدريبية المتخصصة في:' : 'has successfully completed the professional training in:'}
            </p>
            <div className="cert-track">
              {unitTitle[language]}
            </div>
            <div className="cert-details">
              <div className={`cert-detail-item ${language === 'ar' ? 'rtl' : ''}`}>
                <div className="cert-label">{language === 'ar' ? 'التاريخ' : 'Date'}</div>
                <div className="cert-value">{new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</div>
              </div>
              <div className={`cert-detail-item ${language === 'ar' ? 'rtl' : ''}`}>
                <div className="cert-label">{language === 'ar' ? 'النتيجة' : 'Final Score'}</div>
                <div className="cert-value">%{score}</div>
              </div>
            </div>
          </div>
          <div className="cert-verification">
            Verification ID: SQP-{unitId.toUpperCase()}-{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container animate-fade-in" style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      direction: language === 'ar' ? 'rtl' : 'ltr'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>{t('quizTitle')} {isDemoMode && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>(Enhanced Multi-Type)</span>}</h2>
        <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{currentQuestionIndex + 1} / {questions.length}</span>
      </div>

      <div className="glass-panel" style={{
        backgroundColor: 'var(--bg-card)',
        padding: '40px',
        borderRadius: '24px',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-color)'
      }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px', fontWeight: '500', color: 'var(--text-primary)' }}>
          {currentQuestion.questionText[language]}
        </p>

        {currentQuestion.type === 'mcq' && (
          <div className="options-stack" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentQuestion.shuffledIndices.map((originalIdx, btnIdx) => {
              const isSelected = userAnswers[currentQuestionIndex] === btnIdx;
              return (
                <button
                  key={btnIdx}
                  className={`option-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(btnIdx)}
                  style={{
                    padding: '15px 20px',
                    textAlign: language === 'ar' ? 'right' : 'left',
                    borderRadius: '12px',
                    border: `2px solid ${isSelected ? 'var(--primary-color)' : 'var(--border-color)'}`,
                    backgroundColor: isSelected ? 'var(--bg-selected)' : 'var(--bg-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '0.95rem',
                    color: 'var(--text-primary)'
                  }}
                >
                  {currentQuestion.options[language][originalIdx]}
                </button>
              );
            })}
          </div>
        )}

        {currentQuestion.type === 'tf' && (
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              className={`option-btn ${userAnswers[currentQuestionIndex] === true ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(true)}
              style={{
                flex: 1, padding: '15px', borderRadius: '12px', border: '2px solid',
                borderColor: userAnswers[currentQuestionIndex] === true ? 'var(--primary-color)' : 'var(--border-color)',
                backgroundColor: userAnswers[currentQuestionIndex] === true ? 'var(--bg-selected)' : 'var(--bg-color)',
                cursor: 'pointer',
                color: 'var(--text-primary)'
              }}
            >
              {t('true')}
            </button>
            <button
              className={`option-btn ${userAnswers[currentQuestionIndex] === false ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(false)}
              style={{
                flex: 1, padding: '15px', borderRadius: '12px', border: '2px solid',
                borderColor: userAnswers[currentQuestionIndex] === false ? 'var(--text-error)' : 'var(--border-color)',
                backgroundColor: userAnswers[currentQuestionIndex] === false ? 'var(--bg-error-light)' : 'var(--bg-color)',
                cursor: 'pointer',
                color: 'var(--text-primary)'
              }}
            >
              {t('false')}
            </button>
          </div>
        )}

        {currentQuestion.type === 'fill' && (
          <div>
            <input
              type="text"
              value={userAnswers[currentQuestionIndex] || ''}
              onChange={(e) => handleAnswerSelect(e.target.value)}
              placeholder={t('placeholderFill')}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '12px',
                border: '2px solid var(--primary-color)',
                fontSize: '1rem',
                outline: 'none',
                backgroundColor: 'var(--bg-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        )}

        {showExplanation && !isLastAnswerCorrect && (currentExplanation[language] || currentQuestion.explanation?.[language]) && (
          <div className="explanation-box animate-fade-in" style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: 'var(--bg-error-light)',
            border: '1px solid var(--border-error)',
            borderRadius: '12px',
            color: 'var(--text-error)',
            fontSize: '0.9rem'
          }}>
            <strong style={{ display: 'block', marginBottom: '5px' }}>⚠️ {t('logicHint')}:</strong>
            {currentExplanation[language] || currentQuestion.explanation?.[language]}
          </div>
        )}

        <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn-primary"
            disabled={userAnswers[currentQuestionIndex] === undefined || userAnswers[currentQuestionIndex] === ''}
            onClick={handleNext}
            style={{
              padding: '10px 35px',
              borderRadius: '10px',
              backgroundColor: (userAnswers[currentQuestionIndex] === undefined || userAnswers[currentQuestionIndex] === '') ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              cursor: (userAnswers[currentQuestionIndex] === undefined || userAnswers[currentQuestionIndex] === '') ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {currentQuestionIndex === questions.length - 1 ? t('submitExam') : t('next')}
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .option-btn:hover:not(.selected) {
          border-color: #28a745 !important;
          background-color: #fafafa !important;
        }
        .animate-fade-in {
          animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default Quiz;
