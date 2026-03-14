import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { educationalContent } from '../data/content_new.js';

// Unit-specific colors for visual consistency
const UNIT_COLORS = {
  'gmp-intro': '#28a745',
  'glp-basics': '#007bff',
  'iso-17025': '#ffc107',
  'ich-guidelines': '#dc3545',
  'validation-qualification': '#20c997',
  'data-integrity': '#6610f2',
  'qrm-basics': '#e83e8c',
  'gdp-basics': '#fd7e14',
};

const LectureView = ({ unitId, onComplete, onBack }) => {
  const { language, t, theme } = useLanguage();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [completedSlides, setCompletedSlides] = useState([0]); // First slide is always unlocked
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const [slideKey, setSlideKey] = useState(0); // For animation trigger
  
  // Get the unit content - ensure it exists
  const unit = educationalContent?.units?.[unitId];

  // Get slides first
  const slides = unit?.slides || [];

  // Get unit info - use defaults if not available
  // Content.js may not have title/description, so use fallbacks
  const unitTitle = slides?.[0]?.[language]?.title || unitId.toUpperCase().replace('-', ' ');
  const unitDescription = unit?.description?.[language] || (language === 'ar' 
    ? 'دراسة شاملة لمبادئ الجودة الدوائية' 
    : 'Comprehensive study of pharmaceutical quality principles');
  const unitLearningObjectives = unit?.learningObjectives || [];

  if (!unit || slides.length === 0) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <p>مادة علمية غير متوفرة حالياً لهذه الوحدة.</p>
        <button onClick={onBack} style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>{t('back')}</button>
      </div>
    );
  }

  const currentSlide = slides[currentSlideIndex];
  const progress = ((completedSlides.length) / slides.length) * 100;

  // Get the unit color
  const unitColor = UNIT_COLORS[unitId] || '#28a745';

  const handleNext = () => {
    if (showWelcome) {
      setShowWelcome(false);
      return;
    }
    if (showCompletion) {
      onComplete();
      return;
    }
    if (currentSlideIndex < slides.length - 1) {
      const nextIdx = currentSlideIndex + 1;
      if (!completedSlides.includes(nextIdx)) {
        setCompletedSlides(prev => [...prev, nextIdx]);
      }
      // Trigger animation
      setSlideKey(prev => prev + 1);
      setCurrentSlideIndex(nextIdx);
    } else {
      // Final slide reached
      if (completedSlides.length >= slides.length) {
        setShowCompletion(true);
      } else {
        alert(language === 'ar' ? 'يرجى استعراض جميع الشرائح أولاً' : 'Please view all slides first');
      }
    }
  };

  const handlePrevious = () => {
    if (showWelcome) return;
    if (showCompletion) {
      setShowCompletion(false);
      return;
    }
    if (currentSlideIndex > 0) {
      // Trigger animation
      setSlideKey(prev => prev + 1);
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleJumpToSlide = (index) => {
    setShowWelcome(false);
    setShowCompletion(false);
    setCurrentSlideIndex(index);
    if (!completedSlides.includes(index)) {
      setCompletedSlides(prev => [...prev, index]);
    }
  };

  const renderWelcomeScreen = () => (
    <div className="welcome-screen animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '40px'
    }}>
      <div style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        backgroundColor: '#28a745',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '30px',
        boxShadow: '0 10px 40px rgba(40, 167, 69, 0.3)'
      }}>
        <span style={{ fontSize: '3rem' }}>📚</span>
      </div>
      
      <h2 style={{ 
        color: '#28a745', 
        fontSize: '2.5rem', 
        marginBottom: '20px',
        fontWeight: '800'
      }}>
        {language === 'ar' ? 'مرحباً بك' : 'Welcome'}
      </h2>
      
      <p style={{
        fontSize: '1.5rem',
        color: 'var(--text-primary)',
        marginBottom: '10px'
      }}>
        {language === 'ar' ? 'الطالب:' : 'Student:'} <strong>{t('userName')}</strong>
      </p>
      
      <h3 style={{
        fontSize: '1.8rem',
        color: 'var(--text-primary)',
        marginTop: '20px',
        marginBottom: '30px'
      }}>
        {unitTitle}
      </h3>
      
      <p style={{
        fontSize: '1.1rem',
        color: 'var(--text-secondary)',
        maxWidth: '600px',
        lineHeight: '1.8'
      }}>
        {unitDescription}
      </p>
      
      <div style={{
        marginTop: '40px',
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {unitLearningObjectives && unitLearningObjectives.map((obj, idx) => (
          <div key={idx} style={{
            backgroundColor: 'var(--bg-card)',
            padding: '15px 25px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            maxWidth: '300px',
            color: 'var(--text-primary)'
          }}>
            <span style={{ marginLeft: language === 'ar' ? '0' : '10px', marginRight: language === 'ar' ? '10px' : '0' }}>✓</span>
            {obj[language]}
          </div>
        ))}
      </div>
    </div>
  );

  const renderCompletionScreen = () => (
    <div className="completion-screen animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '40px'
    }}>
      <div style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        backgroundColor: '#28a745',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '30px',
        boxShadow: '0 10px 40px rgba(40, 167, 69, 0.3)'
      }}>
        <span style={{ fontSize: '3rem' }}>🎉</span>
      </div>
      
      <h2 style={{ 
        color: '#28a745', 
        fontSize: '2.5rem', 
        marginBottom: '20px',
        fontWeight: '800'
      }}>
        {language === 'ar' ? 'تهانينا!' : 'Congratulations!'}
      </h2>
      
      <p style={{
        fontSize: '1.3rem',
        color: 'var(--text-primary)',
        marginBottom: '10px'
      }}>
        {language === 'ar' ? 'لقد أكملت:' : 'You have completed:'}
      </p>
      
      <h3 style={{
        fontSize: '1.8rem',
        color: 'var(--text-primary)',
        marginTop: '10px',
        marginBottom: '20px'
      }}>
        {unitTitle}
      </h3>
      
      <p style={{
        fontSize: '1.5rem',
        color: '#28a745',
        marginBottom: '30px'
      }}>
        {language === 'ar' ? 'الطالب:' : 'Student:'} <strong>{t('userName')}</strong>
      </p>
      
      <div style={{
        backgroundColor: 'var(--bg-card)',
        padding: '20px 40px',
        borderRadius: '16px',
        border: '2px solid var(--border-color)',
        marginBottom: '30px'
      }}>
        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-primary)',
          margin: '0'
        }}>
          {language === 'ar' ? 'أنت الآن جاهز لاجتياز الامتحان النهائي' : 'You are now ready to take the final exam'}
        </p>
      </div>
      
      <p style={{
        fontSize: '1rem',
        color: 'var(--text-secondary)'
      }}>
        {language === 'ar' 
          ? `لقد استعرضت ${completedSlides.length} من ${slides.length} شريحة`
          : `You have viewed ${completedSlides.length} of ${slides.length} slides`}
      </p>
    </div>
  );

  const renderContent = () => {
    if (currentSlide.type === 'learning') {
      // Parse bullet lists from text (e.g., "- Item")
      const parseBullets = (text) => {
        return text.split('\n').map((line, idx) => {
          if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
            return <li key={idx} style={{ marginBottom: '0.8rem', fontSize: '1.25rem' }}>{line.trim().substring(2).trim()}</li>;
          }
          return <p key={idx} style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>{line}</p>;
        });
      };

      return (
        <div key={slideKey} className="slide-content animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '25px'
          }}>
          </div>
          <div style={{ 
            fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', 
            lineHeight: '1.6', 
            color: 'var(--text-primary)', 
            textAlign: language === 'ar' ? 'right' : 'left',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto',
            textJustify: 'inter-word',
            padding: '0 10px'
          }}>
            {parseBullets(currentSlide[language].text)}
          </div>
        </div>
      );
    }

    if (currentSlide.type === 'discussion') {
      return (
        <div key={slideKey} className="slide-content discussion-slide animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', padding: '0 20px' }}>
          <div style={{
            display: 'inline-block',
            padding: '15px 30px',
            borderRadius: '50px',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-primary)',
            marginBottom: '30px',
            fontWeight: 'bold',
            border: '1px solid var(--border-color)'
          }}>
            <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>💡</span>
            {language === 'ar' ? 'وقت النقاش وعصف ذهني' : 'Discussion & Brainstorming'}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '25px'
          }}>
          </div>
          <div style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.4rem)',
            lineHeight: '1.9',
            color: 'var(--text-primary)',
            padding: '40px',
            backgroundColor: `${unitColor}08`,
            borderRadius: '24px',
            borderRight: language === 'ar' ? `6px solid ${unitColor}` : 'none',
            borderLeft: language === 'en' ? `6px solid ${unitColor}` : 'none',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            textAlign: language === 'ar' ? 'right' : 'left',
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
          }}>
            {currentSlide[language].text.split('\n').map((line, idx) => (
              line.trim() ? <p key={idx} style={{ marginBottom: '1rem' }}>{line}</p> : <br key={idx} />
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-color)',
      direction: language === 'ar' ? 'rtl' : 'ltr',
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      overflow: 'hidden'
    }}>
      {/* LMS Header */}
      <header style={{
        height: '70px',
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 30px',
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: '1px solid var(--border-color)',
              padding: '8px 15px',
              borderRadius: '8px',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {language === 'ar' ? '✕ إغلاق' : '✕ Close'}
          </button>
          <div style={{ height: '30px', width: '1px', backgroundColor: 'var(--border-color)' }}></div>
          <h1 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-primary)', fontWeight: '700' }}>
            {unitId.toUpperCase().replace('-', ' ')}
          </h1>
        </div>

        <div style={{ flex: 1, maxWidth: '400px', margin: '0 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
            <span>{Math.round(progress)}% {t('completed')}</span>
          </div>
          <div style={{ height: '8px', backgroundColor: 'var(--bg-color)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${showWelcome || showCompletion ? 0 : progress}%`, height: '100%', backgroundColor: unitColor, transition: 'width 0.5s ease' }}></div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {t('userName') && (
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
              fontWeight: '600'
            }}>
              👤 {t('userName')}
            </div>
          )}
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Curriculum Sidebar */}
        <aside style={{
          width: isSidebarOpen ? '320px' : '0',
          backgroundColor: 'var(--bg-card)',
          borderRight: language === 'en' ? '1px solid var(--border-color)' : 'none',
          borderLeft: language === 'ar' ? '1px solid var(--border-color)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>{t('courseCurriculum')}</h3>
          </div>
          <div style={{ flex: 1 }}>
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                onClick={() => handleJumpToSlide(idx)}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  backgroundColor: currentSlideIndex === idx ? 'var(--focus-ring)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: completedSlides.includes(idx) ? 'none' : `2px solid ${unitColor}50`,
                  backgroundColor: completedSlides.includes(idx) ? unitColor : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px'
                }}>
                  {completedSlides.includes(idx) ? '✓' : (idx + 1)}
                </div>
                <div style={{ flex: 1, fontSize: '0.95rem', fontWeight: currentSlideIndex === idx ? '600' : '400', color: currentSlideIndex === idx ? unitColor : 'var(--text-primary)' }}>
                  {slide[language].title}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: language === 'en' ? 'unset' : '30px',
            left: language === 'en' ? '30px' : 'unset',
            zIndex: 1000,
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)'
          }}
          title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        >
          {isSidebarOpen ? '←' : '→'}
        </button>

        {/* Main Content Area - Vertical Slides Display */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{
            width: '100%',
            minHeight: '65vh',
            backgroundColor: 'var(--bg-card)',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{
                backgroundColor: unitColor,
                color: 'white',
                padding: '6px 12px',
                borderRadius: '15px',
                fontSize: '0.85rem',
                fontWeight: 'bold'
              }}>
                {currentSlideIndex + 1} / {slides.length}
              </span>
              <h2 style={{ color: unitColor, margin: 0, fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: '800' }}>
                {currentSlide[language].title}
              </h2>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {showWelcome && renderWelcomeScreen()}
              {showCompletion && renderCompletionScreen()}
              {!showWelcome && !showCompletion && renderContent()}
            </div>

            <div style={{
              marginTop: '50px',
              paddingTop: '30px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <button
                onClick={handlePrevious}
                disabled={showWelcome}
                style={{
                  padding: '12px 25px',
                  borderRadius: '10px',
                  color: showWelcome ? '#ccc' : '#555',
                  cursor: showWelcome ? 'not-allowed' : 'pointer',
                  fontWeight: '600'
                }}
              >
                {language === 'ar' ? '← السابق' : '← Previous'}
              </button>

              <button
                onClick={handleNext}
                style={{
                  padding: '14px 40px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: unitColor,
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  boxShadow: `0 6px 20px ${unitColor}40`,
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                {showWelcome 
                  ? (language === 'ar' ? 'ابدأ التعلم →' : 'Start Learning →')
                  : showCompletion
                    ? (language === 'ar' ? 'بدء الامتحان →' : 'Start Exam →')
                    : currentSlideIndex === slides.length - 1
                      ? (language === 'ar' ? 'إنهاء ومتابعة →' : 'Finish and Continue →')
                      : (language === 'ar' ? 'الشريحة التالية →' : 'Next Slide →')}
              </button>
            </div>
          </div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .animate-fade-in {
          animation: slideUp 0.5s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        aside::-webkit-scrollbar {
          width: 6px;
        }
        aside::-webkit-scrollbar-thumb {
          background-color: #e1e8ed;
          border-radius: 10px;
        }
        main::-webkit-scrollbar {
          width: 8px;
        }
        main::-webkit-scrollbar-thumb {
          background-color: #d1d8dd;
          border-radius: 10px;
        }
      `}} />
    </div>
  );
};

export default LectureView;

