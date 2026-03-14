import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { apiService } from '../services/api';
import { educationalContent } from '../data/content';

const Quiz = ({ unitId, onQuizComplete }) => {
  const { language, t } = useLanguage();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizState, setQuizState] = useState('loading'); // loading, active, completed
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLastAnswerCorrect, setIsLastAnswerCorrect] = useState(true);

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
    try {
      const response = await apiService.getQuestions(unitId);
      if (response && response.length > 0) {
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

      // Select 10 random questions from the pool to prevent repetition
      const randomSubset = shuffleArray(pool).slice(0, 10);

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

  const handleAnswerSelect = (answer) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newUserAnswers);

    const q = questions[currentQuestionIndex];
    let isCorrect = false;
    if (q.type === 'mcq') {
      const originalIdx = q.shuffledIndices[answer];
      isCorrect = originalIdx === q.correctAnswer;
    } else if (q.type === 'tf') {
      isCorrect = answer === q.correctAnswer;
    } else if (q.type === 'fill') {
      const normalizedUser = String(answer || '').trim().toLowerCase();
      isCorrect = (q.correctAnswers || []).some(ans => ans.toLowerCase() === normalizedUser);
    }

    setIsLastAnswerCorrect(isCorrect);
    setShowExplanation(!isCorrect);
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
    let correctCount = 0;
    questions.forEach((q, index) => {
      const userAnswer = userAnswers[index];
      if (q.type === 'mcq') {
        const originalIndex = q.shuffledIndices[userAnswer];
        if (originalIndex === q.correctAnswer) correctCount++;
      } else if (q.type === 'tf') {
        if (userAnswer === q.correctAnswer) correctCount++;
      } else if (q.type === 'fill') {
        const normalizedUser = String(userAnswer || '').trim().toLowerCase();
        const isCorrect = q.correctAnswers.some(ans => ans.toLowerCase() === normalizedUser);
        if (isCorrect) correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setQuizState('completed');

    if (onQuizComplete) {
      onQuizComplete({
        score: finalScore,
        passed: finalScore >= 90,
        unitId
      });
    }
  };

  if (quizState === 'loading') {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '80px 50px',
        direction: language === 'ar' ? 'rtl' : 'ltr'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          margin: '0 auto 30px',
          borderRadius: '50%',
          backgroundColor: '#f0fff4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '4px solid #28a745',
          animation: 'pulse 1.5s infinite'
        }}>
          <span style={{ fontSize: '2.5rem' }}>📝</span>
        </div>
        <h2 style={{ color: '#28a745', marginBottom: '20px', fontSize: '1.8rem' }}>
          {language === 'ar' ? 'جاري تحميل الأسئلة التقنية...' : 'Loading Technical Questions...'}
        </h2>
        <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '30px' }}>
          {language === 'ar' 
            ? 'يرجى الانتظار قليلاً أثناء تحميل الامتحان'
            : 'Please wait while the exam is being loaded'}
        </p>
        <div style={{
          width: '200px',
          height: '8px',
          backgroundColor: '#eee',
          borderRadius: '10px',
          margin: '0 auto',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '50%',
            height: '100%',
            backgroundColor: '#28a745',
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
    );
  }

  // Safety check - if no questions loaded, show error
  if (!questions || questions.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px',
        direction: language === 'ar' ? 'rtl' : 'ltr'
      }}>
        <div style={{ 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffc107',
          borderRadius: '12px',
          padding: '40px',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '3px solid #ffc107'
          }}>
            <span style={{ fontSize: '2rem' }}>⚠️</span>
          </div>
          <h2 style={{ color: '#856404', marginBottom: '15px', fontSize: '1.5rem' }}>
            {language === 'ar' ? 'لا توجد أسئلة متاحة' : 'No Questions Available'}
          </h2>
          <p style={{ color: '#856404', marginBottom: '15px', lineHeight: '1.6' }}>
            {language === 'ar' 
              ? 'عذراً، لم يتم العثور على أسئلة لهذه الوحدة.'
              : 'Sorry, no questions were found for this unit.'}
          </p>
          <p style={{ color: '#666', marginBottom: '25px', fontSize: '0.95rem' }}>
            {language === 'ar' 
              ? 'سيتم توجيهك لإعادة المحاولة'
              : 'You will be redirected to try again'}
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
              style={{ padding: '12px 30px', backgroundColor: '#ffc107', color: '#000' }}
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

  if (quizState === 'error') {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px',
        direction: language === 'ar' ? 'rtl' : 'ltr'
      }}>
        <div style={{ 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb',
          borderRadius: '12px',
          padding: '40px',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '3px solid #dc3545'
          }}>
            <span style={{ fontSize: '2rem' }}>❌</span>
          </div>
          <h2 style={{ color: '#721c24', marginBottom: '15px', fontSize: '1.5rem' }}>
            {language === 'ar' ? 'حدث خطأ في التحميل' : 'Loading Error'}
          </h2>
          <p style={{ color: '#721c24', marginBottom: '15px', lineHeight: '1.6' }}>
            {language === 'ar' 
              ? 'عذراً، حدث خطأ أثناء تحميل الامتحان.'
              : 'Sorry, an error occurred while loading the exam.'}
          </p>
          <p style={{ color: '#666', marginBottom: '25px', fontSize: '0.95rem' }}>
            {language === 'ar' 
              ? 'يرجى التحقق من الاتصال وحاولة مرة أخرى'
              : 'Please check your connection and try again'}
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
              style={{ padding: '12px 30px', backgroundColor: '#dc3545' }}
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
    return (
      <div className="result-card animate-fade-in" style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '40px',
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        direction: language === 'ar' ? 'rtl' : 'ltr'
      }}>
        <h2 style={{ fontSize: '3rem', color: passed ? '#28a745' : '#dc3545', marginBottom: '10px' }}>
          %{score}
        </h2>
        <h3>{passed ? (language === 'ar' ? 'تهانينا! لقد اجتزت الامتحان' : 'Congratulations! You passed') : (language === 'ar' ? 'للأسف لم تتخطى درجة النجاح (90%)' : 'Sorry, you didn\'t reach the passing score (90%)')}</h3>

        {!passed && (
          <p style={{ color: '#dc3545', fontWeight: 'bold', margin: '15px 0' }}>
            {t('scoreLowWarning')}
          </p>
        )}

        <p style={{ margin: '20px 0', color: '#666' }}>
          {language === 'ar' ? 'لقد تمت مراجعة إجاباتك بناءً على المعايير العالمية.' : 'Your answers have been reviewed based on international standards.'}
        </p>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button onClick={() => window.location.reload()} className="btn-primary" style={{
            padding: '12px 30px',
            backgroundColor: !passed ? '#6c757d' : '#28a745'
          }}>
            {language === 'ar' ? 'العودة للوحة القيادة' : 'Back to Dashboard'}
          </button>

          {!passed && (
            <button onClick={() => {
              setCurrentQuestionIndex(0);
              setUserAnswers([]);
              setQuizState('active');
              loadQuestions();
            }} className="btn-primary" style={{ padding: '12px 30px', backgroundColor: '#dc3545' }}>
              {t('retakeBtn')}
            </button>
          )}
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
        <h2 style={{ margin: 0 }}>{t('quizTitle')} {isDemoMode && <span style={{ fontSize: '0.8rem', color: '#666' }}>(Enhanced Multi-Type)</span>}</h2>
        <span style={{ fontWeight: 'bold', color: '#28a745' }}>{currentQuestionIndex + 1} / {questions.length}</span>
      </div>

      <div className="question-card" style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '24px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        border: '1px solid #eee'
      }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px', fontWeight: '500' }}>
          {currentQuestion.questionText[language]}
        </p>

        {currentQuestion.type === 'mcq' && (
          <div className="options-stack" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentQuestion.shuffledIndices.map((originalIdx, btnIdx) => (
              <button
                key={btnIdx}
                className={`option-btn ${userAnswers[currentQuestionIndex] === btnIdx ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(btnIdx)}
                style={{
                  padding: '15px 20px',
                  textAlign: language === 'ar' ? 'right' : 'left',
                  borderRadius: '12px',
                  border: '2px solid',
                  borderColor: userAnswers[currentQuestionIndex] === btnIdx ? '#28a745' : '#f0f0f0',
                  backgroundColor: userAnswers[currentQuestionIndex] === btnIdx ? '#f0fff4' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '0.95rem'
                }}
              >
                {currentQuestion.options[language][originalIdx]}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'tf' && (
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              className={`option-btn ${userAnswers[currentQuestionIndex] === true ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(true)}
              style={{
                flex: 1, padding: '15px', borderRadius: '12px', border: '2px solid',
                borderColor: userAnswers[currentQuestionIndex] === true ? '#28a745' : '#f0f0f0',
                backgroundColor: userAnswers[currentQuestionIndex] === true ? '#f0fff4' : 'white',
                cursor: 'pointer'
              }}
            >
              {t('true')}
            </button>
            <button
              className={`option-btn ${userAnswers[currentQuestionIndex] === false ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(false)}
              style={{
                flex: 1, padding: '15px', borderRadius: '12px', border: '2px solid',
                borderColor: userAnswers[currentQuestionIndex] === false ? '#dc3545' : '#f0f0f0',
                backgroundColor: userAnswers[currentQuestionIndex] === false ? '#fff5f5' : 'white',
                cursor: 'pointer'
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
                border: '2px solid #28a745',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>
        )}

        {showExplanation && !isLastAnswerCorrect && currentQuestion.explanation && (
          <div className="explanation-box animate-fade-in" style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#fff5f5',
            border: '1px solid #feb2b2',
            borderRadius: '12px',
            color: '#c53030',
            fontSize: '0.9rem'
          }}>
            <strong style={{ display: 'block', marginBottom: '5px' }}>⚠️ {t('logicHint')}:</strong>
            {currentQuestion.explanation[language]}
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
