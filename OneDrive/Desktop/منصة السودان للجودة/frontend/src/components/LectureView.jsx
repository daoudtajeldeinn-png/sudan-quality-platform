import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { educationalContent } from '../data/content';

const LectureView = ({ unitId, onProceedToQuiz, onBack }) => {
  const { language, t } = useLanguage();
  const unit = educationalContent.units[unitId];
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [completedSlides, setCompletedSlides] = useState([0]); // First slide is always unlocked
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!unit) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <p>مادة علمية غير متوفرة حالياً لهذه الوحدة.</p>
        <button onClick={onBack} style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>{t('back')}</button>
      </div>
    );
  }

  const slides = unit.slides;
  const currentSlide = slides[currentSlideIndex];
  const progress = ((completedSlides.length) / slides.length) * 100;

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      const nextIdx = currentSlideIndex + 1;
      if (!completedSlides.includes(nextIdx)) {
        setCompletedSlides(prev => [...prev, nextIdx]);
      }
      setCurrentSlideIndex(nextIdx);
    } else {
      onProceedToQuiz();
    }
  };

  const handleJumpToSlide = (index) => {
    setCurrentSlideIndex(index);
    if (!completedSlides.includes(index)) {
      setCompletedSlides(prev => [...prev, index]);
    }
  };

  const renderContent = () => {
    if (currentSlide.type === 'learning') {
      return (
        <div className="slide-content animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ color: '#28a745', marginBottom: '30px', fontSize: '2.2rem', fontWeight: '800' }}>
            {currentSlide[language].title}
          </h2>
          <div style={{ fontSize: '1.3rem', lineHeight: '1.9', color: '#2c3e50', whiteSpace: 'pre-line' }}>
            {currentSlide[language].text}
          </div>
        </div>
      );
    }

    if (currentSlide.type === 'discussion') {
      return (
        <div className="slide-content discussion-slide animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            padding: '15px 30px',
            borderRadius: '50px',
            backgroundColor: '#fff3cd',
            color: '#856404',
            marginBottom: '30px',
            fontWeight: 'bold',
            border: '1px solid #ffeeba'
          }}>
            <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>💡</span>
            {language === 'ar' ? 'وقت النقاش وعصف ذهني' : 'Discussion & Brainstorming'}
          </div>
          <h2 style={{ color: '#28a745', marginBottom: '30px', fontSize: '2rem' }}>{currentSlide[language].title}</h2>
          <div style={{
            fontSize: '1.4rem',
            lineHeight: '2',
            color: '#333',
            padding: '40px',
            backgroundColor: 'rgba(40, 167, 69, 0.05)',
            borderRadius: '24px',
            borderRight: language === 'ar' ? '6px solid #28a745' : 'none',
            borderLeft: language === 'en' ? '6px solid #28a745' : 'none',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
          }}>
            {currentSlide[language].text}
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
      backgroundColor: '#f4f7f6',
      direction: language === 'ar' ? 'rtl' : 'ltr',
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      overflow: 'hidden'
    }}>
      {/* LMS Header */}
      <header style={{
        height: '70px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e1e8ed',
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
              border: '1px solid #ddd',
              padding: '8px 15px',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#555',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {language === 'ar' ? '✕ إغلاق' : '✕ Close'}
          </button>
          <div style={{ height: '30px', width: '1px', backgroundColor: '#eee' }}></div>
          <h1 style={{ fontSize: '1.2rem', margin: 0, color: '#2c3e50', fontWeight: '700' }}>
            {unitId.toUpperCase().replace('-', ' ')}
          </h1>
        </div>

        <div style={{ flex: 1, maxWidth: '400px', margin: '0 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#666' }}>
            <span>{Math.round(progress)}% {t('completed')}</span>
          </div>
          <div style={{ height: '8px', backgroundColor: '#e9ecef', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#28a745', transition: 'width 0.5s ease' }}></div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Can add user profile here if needed */}
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Curriculum Sidebar */}
        <aside style={{
          width: isSidebarOpen ? '320px' : '0',
          backgroundColor: '#fff',
          borderRight: language === 'en' ? '1px solid #e1e8ed' : 'none',
          borderLeft: language === 'ar' ? '1px solid #e1e8ed' : 'none',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fcfcfc' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#1a2b3c' }}>{t('courseCurriculum')}</h3>
          </div>
          <div style={{ flex: 1 }}>
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                onClick={() => handleJumpToSlide(idx)}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #f9f9f9',
                  cursor: 'pointer',
                  backgroundColor: currentSlideIndex === idx ? '#f0fff4' : 'transparent',
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
                  border: completedSlides.includes(idx) ? 'none' : '2px solid #ddd',
                  backgroundColor: completedSlides.includes(idx) ? '#28a745' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px'
                }}>
                  {completedSlides.includes(idx) ? '✓' : (idx + 1)}
                </div>
                <div style={{ flex: 1, fontSize: '0.95rem', fontWeight: currentSlideIndex === idx ? '600' : '400', color: currentSlideIndex === idx ? '#28a745' : '#444' }}>
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
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        >
          {isSidebarOpen ? '←' : '→'}
        </button>

        {/* Main Content Area */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '900px',
            backgroundColor: '#fff',
            padding: '60px',
            borderRadius: '20px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ flex: 1 }}>
              {renderContent()}
            </div>

            <div style={{
              marginTop: '60px',
              paddingTop: '30px',
              borderTop: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <button
                onClick={() => currentSlideIndex > 0 && setCurrentSlideIndex(currentSlideIndex - 1)}
                disabled={currentSlideIndex === 0}
                style={{
                  padding: '12px 25px',
                  borderRadius: '10px',
                  border: '1px solid #ddd',
                  backgroundColor: '#fff',
                  color: currentSlideIndex === 0 ? '#ccc' : '#555',
                  cursor: currentSlideIndex === 0 ? 'not-allowed' : 'pointer',
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
                  backgroundColor: '#28a745',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  boxShadow: '0 6px 20px rgba(40, 167, 69, 0.25)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                {currentSlideIndex === slides.length - 1
                  ? (language === 'ar' ? 'بدء الامتحان النهائي' : 'Start Final Exam')
                  : (language === 'ar' ? 'إكمال ومتابعة →' : 'Complete and Continue →')}
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
