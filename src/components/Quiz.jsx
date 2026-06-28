import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { useGamification } from '../GamificationContext';
import { apiService } from '../services/api';
import { educationalContent } from '../data/content_new.js';
import '../styles/CertificateStyles.css';
import pharmaLogo from '../assets/pharma_logo.png';
import certBg from '../assets/certificate_bg.png';

const Quiz = ({ unitId, onQuizComplete, user, count = 10 }) => {
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
  const [certLang, setCertLang] = useState('bilingual');
  const [isGenerating, setIsGenerating] = useState(false);
  // Track which answers were verified as correct during the quiz
  const [answerResults, setAnswerResults] = useState([]);

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
    // Reset answer results and user answers for new quiz
    setAnswerResults([]);
    setUserAnswers([]);
    
    // Session-based rotation via localStorage
    const storageKey = `sqp_quiz_history_${unitId}${user ? '_' + (user.uid || user.email) : ''}`;
    let excludeIds = [];
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) excludeIds = JSON.parse(stored);
    } catch (e) { console.warn('LocalStorage error:', e); }

    try {
      const userIdParam = user ? (user.uid || user.email) : null;
      const response = await apiService.getQuestions(unitId, count, userIdParam, excludeIds);
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
      if (availableIds.length < count && pool.length >= count) {
        // Reset history if we run out but have enough overall
        availableIds = [...pool];
        excludeIds = [];
      } else if (availableIds.length === 0) {
        availableIds = [...pool];
        excludeIds = [];
      }

      // Select up to requested count random questions
      const randomSubset = shuffleArray(availableIds).slice(0, count);
      
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
      // Normalize correctAnswer to string for reliable comparisons across frontend/backends
      const normalizedCorrect = q.correctAnswer !== undefined && q.correctAnswer !== null ? String(q.correctAnswer) : '';

      if (q.type === 'mcq' || !q.type) {
        // Handle case where options might be missing but we expect 10 questions
        const optionsCount = q.options ? q.options.en.length : 0;
        const indices = Array.from({ length: optionsCount }, (_, i) => i);
        return {
          ...q,
          type: 'mcq',
          correctAnswer: normalizedCorrect,
          shuffledIndices: shuffleArray(indices)
        };
      }
      return { ...q, type: q.type || 'mcq', correctAnswer: normalizedCorrect };
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
        // Compare as strings to avoid type-mismatch (e.g. '0' vs 0)
        isCorrect = String(originalIdx) === String(q.correctAnswer);
      } else if (q.type === 'tf') {
        isCorrect = String(answer) === String(q.correctAnswer);
      } else if (q.type === 'fill') {
        const normalizedUser = String(answer || '').trim().toLowerCase();
        isCorrect = (q.correctAnswers || []).some(ans => ans.toLowerCase() === normalizedUser);
      }
    } else {
      // Server-side validation
      try {
        setIsVerifying(true);
        const result = await apiService.checkAnswer(q._id, answer, q.shuffledIndices);
        isCorrect = result.isCorrect;
        explanationObj = result.explanation || { ar: '', en: '' };
      } catch (error) {
        console.error('Answer verification failed:', error);
        // Fallback to local check if server fails unexpectedly
        if (q.type === 'mcq') {
          const originalIdx = q.shuffledIndices[answer];
          isCorrect = String(originalIdx) === String(q.correctAnswer);
        } else if (q.type === 'tf') {
          isCorrect = String(answer) === String(q.correctAnswer);
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
    
    // Track answer results for final scoring
    const newResults = [...answerResults];
    newResults[currentQuestionIndex] = isCorrect;
    setAnswerResults(newResults);
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
    // Use the tracked answer results instead of re-evaluating
    // This ensures we use the server-verified or locally-verified correct answers
    const correctCount = answerResults.filter(r => r === true).length;
    
    console.log('[Quiz] calculateResult - Total questions:', questions.length, 'User answers:', userAnswers);
    console.log('[Quiz] calculateResult - Answer results:', answerResults, 'Correct count:', correctCount);

    const finalScore = Math.round((correctCount / questions.length) * 100);
    console.log('[Quiz] calculateResult - Final score:', finalScore);
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

    // Mark unit as completed if score >= 90
    const currentUserId = user ? (user.uid || user.userId || user.email) : null;
    if (finalScore >= 90 && currentUserId) {
      apiService.markUnitCompleted(currentUserId, unitId, finalScore, questions.length)
        .then(response => {
          console.log('[Quiz] Unit marked as completed:', response);
        })
        .catch(error => {
          console.error('[Quiz] Failed to mark unit as completed:', error);
        });
    }

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

      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

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
    // Get unit title from unit data title property or fallback to unitId
    const unitData = educationalContent.units[unitId];
    const unitTitle = unitData?.title || 
                     (unitData?.slides?.[0]?.[language]?.title || 
                      (unitData?.slides?.[0]?.ar?.title && unitData?.slides?.[0]?.en?.title 
                       ? { ar: unitData.slides[0].ar.title, en: unitData.slides[0].en.title }
                       : { ar: unitId.replace(/-/g, ' ').toUpperCase(), en: unitId.replace(/-/g, ' ').toUpperCase() }));
    
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
          <h3>{passed ? (language === 'ar' ? 'تهانينا! لقد اجتزت الامتحان بنجاح' : 'Congratulations! You passed the exam') : (language === 'ar' ? 'للأسف لم تت[...]