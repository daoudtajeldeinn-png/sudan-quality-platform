import React, { useState, useEffect } from 'react';

const Quiz = ({ unitId, onQuizComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizState, setQuizState] = useState('loading'); // loading, active, completed
  const [score, setScore] = useState(0);

  useEffect(() => {
    // تحميل الأسئلة من الـ Backend
    loadQuestions();
  }, [unitId]);

  const loadQuestions = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/questions/${unitId}/10`);
      if (response.ok) {
        const questionsData = await response.json();
        setQuestions(questionsData);
        setQuizState('active');
      } else {
        console.error('Failed to load questions');
        setQuizState('error');
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      setQuizState('error');
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
      
      // التحقق من الإجابات
      for (const question of questions) {
        const response = await fetch('http://localhost:5000/api/questions/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            questionId: question._id,
            userAnswer: userAnswers[question._id]
          }),
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.isCorrect) {
            correctAnswers++;
          }
        }
      }
      
      const finalScore = (correctAnswers / questions.length) * 100;
      setScore(finalScore);
      setQuizState('completed');
      
      // إرسال النتيجة للـ Backend
      if (onQuizComplete) {
        onQuizComplete(finalScore);
      }
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  if (quizState === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '50px', direction: 'rtl' }}>
        <div>جاري تحميل الأسئلة...</div>
      </div>
    );
  }

  if (quizState === 'error') {
    return (
      <div style={{ textAlign: 'center', padding: '50px', direction: 'rtl', color: 'red' }}>
        <div>حدث خطأ في تحميل الأسئلة</div>
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
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (quizState === 'completed') {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px', 
        direction: 'rtl',
        backgroundColor: score >= 90 ? '#d4edda' : '#f8d7da',
        borderRadius: '10px',
        margin: '20px'
      }}>
        <h2>{score >= 90 ? '🎉 مبارك! لقد نجحت في الاختبار' : '❌ لم تنجح في الاختبار'}</h2>
        <p>درجتك: {score.toFixed(1)}%</p>
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
      direction: 'rtl',
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
          <h2>اختبار الوحدة: {unitId}</h2>
          <div>
            السؤال {currentQuestionIndex + 1} من {questions.length}
          </div>
        </div>

        {currentQuestion && (
          <div>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>
              {currentQuestion.questionText}
            </h3>
            
            <div style={{ marginBottom: '30px' }}>
              {currentQuestion.options.map((option, index) => (
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
                السابق
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
                  التالي
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
                  إنهاء الاختبار
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
