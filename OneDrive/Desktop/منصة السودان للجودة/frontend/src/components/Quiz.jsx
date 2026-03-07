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
      console.warn('Backend connection failed, using Randomized Advanced Demo Mode questions');
      const unitData = educationalContent.units[unitId] || educationalContent.units['gmp-intro'];
      const pool = unitData.examQuestionPool;

      // Select 10 random questions from the pool to prevent repetition
      const randomSubset = shuffleArray(pool).slice(0, 10);

      const rawQuestions = randomSubset.map(id => ({
        ...educationalContent.allQuestions[id],
        _id: id
      }));

      setQuestions(processQuestions(rawQuestions));
      setIsDemoMode(true);
      setQuizState('active');
    }
  };

  const processQuestions = (rawQuestions) => {
    return rawQuestions.map(q => {
      if (q.type === 'mcq' || !q.type) {
        const options = q.options ? q.options[language] : null;
        if (!options) return { ...q, type: 'mcq', shuffledOptions: [], newCorrectAnswer: -1 };

        const correctText = options[q.correctAnswer];
        const shuffledOptions = shuffleArray([...options]);
        const newCorrectIndex = shuffledOptions.indexOf(correctText);

        return {
          ...q,
          type: 'mcq',
          shuffledOptions,
          newCorrectAnswer: newCorrectIndex
        };
      }
      return q; // T/F and Fill and handled directly
    });
  };

  const handleAnswerSelect = (answer) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newUserAnswers);
  };

  const handleNext = () => {
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
        if (userAnswer === q.newCorrectAnswer) correctCount++;
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
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div className="spinner"></div>
        <p>{t('loadingQuestions')}</p>
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
        <p style={{ margin: '20px 0', color: '#666' }}>
          {language === 'ar' ? 'لقد تمت مراجعة إجاباتك بناءً على المعايير العالمية.' : 'Your answers have been reviewed based on international standards.'}
        </p>
        <button onClick={() => window.location.reload()} className="btn-primary" style={{ padding: '12px 30px' }}>
          {language === 'ar' ? 'العودة للوحة القيادة' : 'Back to Dashboard'}
        </button>
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
          <div className="options-stack" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentQuestion.shuffledOptions.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${userAnswers[currentQuestionIndex] === index ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(index)}
                style={{
                  padding: '18px 25px',
                  textAlign: language === 'ar' ? 'right' : 'left',
                  borderRadius: '16px',
                  border: '2px solid',
                  borderColor: userAnswers[currentQuestionIndex] === index ? '#28a745' : '#f0f0f0',
                  backgroundColor: userAnswers[currentQuestionIndex] === index ? '#f0fff4' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '1rem'
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'tf' && (
          <div style={{ display: 'flex', gap: '20px' }}>
            <button
              className={`option-btn ${userAnswers[currentQuestionIndex] === true ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(true)}
              style={{
                flex: 1, padding: '20px', borderRadius: '16px', border: '2px solid',
                borderColor: userAnswers[currentQuestionIndex] === true ? '#28a745' : '#f0f0f0',
                backgroundColor: userAnswers[currentQuestionIndex] === true ? '#f0fff4' : 'white',
                cursor: 'pointer'
              }}
            >
              {language === 'ar' ? 'صح' : 'True'}
            </button>
            <button
              className={`option-btn ${userAnswers[currentQuestionIndex] === false ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(false)}
              style={{
                flex: 1, padding: '20px', borderRadius: '16px', border: '2px solid',
                borderColor: userAnswers[currentQuestionIndex] === false ? '#dc3545' : '#f0f0f0',
                backgroundColor: userAnswers[currentQuestionIndex] === false ? '#fff5f5' : 'white',
                cursor: 'pointer'
              }}
            >
              {language === 'ar' ? 'خطأ' : 'False'}
            </button>
          </div>
        )}

        {currentQuestion.type === 'fill' && (
          <div>
            <input
              type="text"
              value={userAnswers[currentQuestionIndex] || ''}
              onChange={(e) => handleAnswerSelect(e.target.value)}
              placeholder={language === 'ar' ? 'اكتب إجابتك هنا...' : 'Type your answer here...'}
              style={{
                width: '100%',
                padding: '18px',
                borderRadius: '16px',
                border: '2px solid #28a745',
                fontSize: '1.1rem',
                outline: 'none'
              }}
            />
          </div>
        )}

        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn-primary"
            disabled={userAnswers[currentQuestionIndex] === undefined || userAnswers[currentQuestionIndex] === ''}
            onClick={handleNext}
            style={{
              padding: '12px 40px',
              borderRadius: '12px',
              backgroundColor: (userAnswers[currentQuestionIndex] === undefined || userAnswers[currentQuestionIndex] === '') ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              cursor: (userAnswers[currentQuestionIndex] === undefined || userAnswers[currentQuestionIndex] === '') ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {currentQuestionIndex === questions.length - 1 ? (language === 'ar' ? 'تسليم الامتحان' : 'Submit Exam') : (language === 'ar' ? 'التالي' : 'Next')}
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
