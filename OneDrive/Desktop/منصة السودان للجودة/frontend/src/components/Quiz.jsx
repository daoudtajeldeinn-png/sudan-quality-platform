import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { apiService } from '../services/api';

const Quiz = ({ unitId, onQuizComplete }) => {
  const { language, t } = useLanguage();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizState, setQuizState] = useState('loading'); // loading, active, completed
  const [score, setScore] = useState(0);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // تحميل الأسئلة من الـ Backend
    loadQuestions();
  }, [unitId]);

  const demoQuestions = {
    'gmp-intro': [
      {
        _id: 'd1',
        questionText: {
          ar: 'ما هو الهدف الرئيسي من تطبيق مبادئ GMP؟',
          en: 'What is the primary objective of applying GMP principles?'
        },
        options: {
          ar: ['تقليل التكاليف', 'ضمان جودة وسلامة المنتجات الدوائية', 'زيادة الإنتاج فقط', 'تحسين التسويق'],
          en: ['Reduce costs', 'Ensure quality and safety of pharmaceutical products', 'Increase production only', 'Improve marketing']
        },
        correctAnswer: 1, // Store locally for demo mode
        explanation: {
          ar: 'الهدف الرئيسي من GMP هو ضمان أن المنتجات الدوائية تُنتج وفقاً لأعلى معايير الجودة والسلامة',
          en: 'The primary goal of GMP is to ensure that medicinal products are produced to the highest quality and safety standards'
        }
      },
      {
        _id: 'd2',
        questionText: {
          ar: 'أي من العوامل التالية يُعتبر جزءاً أساسياً من نظام GMP؟',
          en: 'Which of the following is considered a core part of the GMP system?'
        },
        options: {
          ar: ['التنظيف والتعقيم', 'تقليل عدد الموظفين', 'استخدام أحدث المعدات فقط', 'التركيز على الربح فقط'],
          en: ['Cleaning and sanitation', 'Reducing staff count', 'Using newest equipment only', 'Focusing on profit only']
        },
        correctAnswer: 0,
        explanation: {
          ar: 'التنظيف والتعقيم من المبادئ الأساسية في تطبيق GMP لضمان عدم تلوث المنتجات',
          en: 'Cleaning and sanitation are fundamental principles in GMP to prevent product contamination'
        }
      }
    ],
    'glp-basics': [
      {
        _id: 'd3',
        questionText: {
          ar: 'ما هو الفرق الأساسي بين GLP و GMP؟',
          en: 'What is the primary difference between GLP and GMP?'
        },
        options: {
          ar: ['GLP للإنتاج و GMP للمختبرات', 'GLP للمختبرات و GMP للإنتاج', 'كلاهما للإنتاج', 'كلاهما للمختبرات'],
          en: ['GLP for production, GMP for labs', 'GLP for labs, GMP for production', 'Both for production', 'Both for labs']
        },
        correctAnswer: 1,
        explanation: {
          ar: 'GLP يطبق على المختبرات بينما GMP يطبق على التصنيع',
          en: 'GLP (Good Laboratory Practice) applies to labs, while GMP (Good Manufacturing Practice) applies to manufacturing'
        }
      }
    ],
    'iso-17025': [
      {
        _id: 'd4',
        questionText: {
          ar: 'ما هو التركيز الأساسي لمعيار ISO 17025؟',
          en: 'What is the primary focus of ISO 17025?'
        },
        options: {
          ar: ['إدارة الجودة في المكاتب', 'كفاءة مختبرات الفحص والمعايرة', 'تصنيع السيارات', 'الأمن الغذائي'],
          en: ['Office quality management', 'Competence of testing and calibration laboratories', 'Car manufacturing', 'Food safety']
        },
        correctAnswer: 1,
        explanation: {
          ar: 'ISO 17025 هو المعيار العالمي لكفاءة مختبرات الفحص والمعايرة',
          en: 'ISO 17025 is the international standard for the competence of testing and calibration laboratories'
        }
      }
    ],
    'ich-guidelines': [
      {
        _id: 'd5',
        questionText: {
          ar: 'ما هو الهدف من دلائل ICH؟',
          en: 'What is the purpose of ICH guidelines?'
        },
        options: {
          ar: ['توحيد المتطلبات التقنية للمنتجات الدوائية', 'زيادة أسعار الأدوية', 'تقليل عدد الأدوية المتاحة', 'التشجيع على عدم التوثيق'],
          en: ['Harmonize technical requirements for pharmaceuticals', 'Increase drug prices', 'Reduce available drugs', 'Encourage lack of documentation']
        },
        correctAnswer: 0,
        explanation: {
          ar: 'هدف ICH هو تحقيق التوافق العالمي في المتطلبات التقنية لضمان الجودة والسلامة والفعالية',
          en: 'The goal of ICH is to achieve global harmonization in technical requirements to ensure quality, safety, and efficacy'
        }
      }
    ]
  };

  const loadQuestions = async () => {
    try {
      setQuizState('loading');
      setIsDemoMode(false);
      console.log('Fetching questions for:', unitId);
      const questionsData = await apiService.getQuestions(unitId, 10);
      setQuestions(questionsData);
      setQuizState('active');
    } catch (error) {
      console.warn('Backend connection failed, using Demo Mode questions');
      const fallbackData = demoQuestions[unitId] || demoQuestions['gmp-intro'];
      setQuestions(fallbackData);
      setIsDemoMode(true);
      setQuizState('active');
    }
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      let correctAnswers = 0;

      // Check answers (Try backend first, then local fallback)
      for (const question of questions) {
        const userAnswer = userAnswers[question._id];
        
        try {
          const response = await fetch('http://localhost:5000/api/questions/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questionId: question._id, userAnswer }),
          });

          if (response.ok) {
            const result = await response.json();
            if (result.isCorrect) correctAnswers++;
            continue;
          }
        } catch (e) {
          // Local fallback for check if backend fails
          if (userAnswer === question.correctAnswer) {
            correctAnswers++;
          }
        }
      }

      const finalScore = (correctAnswers / questions.length) * 100;
      setScore(finalScore);
      setQuizState('completed');

      if (onQuizComplete) {
        onQuizComplete(finalScore);
      }

    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  if (quizState === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '50px', direction: language === 'ar' ? 'rtl' : 'ltr' }}>
        <div>{t('loading')}</div>
      </div>
    );
  }

  if (quizState === 'error') {
    return (
      <div style={{ textAlign: 'center', padding: '50px', direction: language === 'ar' ? 'rtl' : 'ltr', color: 'red' }}>
        <div>{t('errorLoading')}</div>
        <button
          onClick={loadQuestions}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {t('tryAgain')}
        </button>
      </div>
    );
  }

  if (quizState === 'completed') {
    return (
      <div style={{
        textAlign: 'center',
        padding: '50px',
        direction: language === 'ar' ? 'rtl' : 'ltr',
        backgroundColor: score >= 90 ? '#d4edda' : '#f8d7da',
        borderRadius: '10px',
        margin: '20px'
      }}>
        <h2>{score >= 90 ? `🎉 ${t('congrats')}` : `❌ ${t('failed')}`}</h2>
        <p>{t('score')}: {score.toFixed(1)}%</p>
        {score >= 90 ? (
          <div>
            <p>🏆 لقد حصلت على الشهادة!</p>
            <button
              onClick={() => window.print()}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginLeft: '10px'
              }}
            >
              طباعة الشهادة
            </button>
          </div>
        ) : (
          <div>
            <p>حاول مرة أخرى لتحسين نتيجتك</p>
            <button
              onClick={() => {
                setQuizState('active');
                setCurrentQuestionIndex(0);
                setUserAnswers({});
              }}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              إعادة الاختبار
            </button>
          </div>
        )}
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQuestion?._id];

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      direction: language === 'ar' ? 'rtl' : 'ltr',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2>
            {t('quizTitle')}: {unitId} 
             {isDemoMode && <span style={{ fontSize: '0.6em', color: '#666', marginLeft: '10px' }}>(Demo Mode)</span>}
          </h2>
          <div>
            {t('question')} {currentQuestionIndex + 1} {t('of')} {questions.length}
          </div>
        </div>

        {currentQuestion && (
          <div>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>
              {currentQuestion.questionText[language] || currentQuestion.questionText}
            </h3>

            <div style={{ marginBottom: '30px' }}>
              {(currentQuestion.options[language] || currentQuestion.options).map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion._id, index)}
                  style={{
                    padding: '15px',
                    margin: '10px 0',
                    border: selectedAnswer === index ? '2px solid #28a745' : '1px solid #ddd',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    backgroundColor: selectedAnswer === index ? '#e8f5e9' : 'white',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = selectedAnswer === index ? '#e8f5e9' : '#f8f9fa'}
                  onMouseOut={(e) => e.target.style.backgroundColor = selectedAnswer === index ? '#e8f5e9' : 'white'}
                >
                  <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name={`question-${currentQuestion._id}`}
                      checked={selectedAnswer === index}
                      onChange={() => handleAnswerSelect(currentQuestion._id, index)}
                      style={{ marginRight: '10px' }}
                    />
                    {option}
                  </label>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '30px'
            }}>
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                style={{
                  padding: '10px 20px',
                  backgroundColor: currentQuestionIndex === 0 ? '#6c757d' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                {language === 'ar' ? 'السابق' : 'Previous'}
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === undefined}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: selectedAnswer === undefined ? '#6c757d' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: selectedAnswer === undefined ? 'not-allowed' : 'pointer'
                  }}
                >
                  {t('next')}
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(userAnswers).length < questions.length}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: Object.keys(userAnswers).length < questions.length ? '#6c757d' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: Object.keys(userAnswers).length < questions.length ? 'not-allowed' : 'pointer'
                  }}
                >
                  {t('finish')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;

