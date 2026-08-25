import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { useGamification } from '../GamificationContext';
import { educationalContent } from '../data/content_new.js';
import CourseSlides from './CourseSlides';

// Unit-specific colors for visual consistency
const UNIT_COLORS = {
  'gmp-intro': '#10b981', // Emerald
  'glp-basics': '#3b82f6', // Blue
  'iso-17025': '#f59e0b', // Amber
  'ich-guidelines': '#ef4444', // Red
  'validation-qualification': '#06b6d4', // Cyan
  'data-integrity': '#8b5cf6', // Violet
  'qrm-basics': '#ec4899', // Pink
  'gdp-basics': '#f97316', // Orange
  'ich-q10': '#0891b2', // Dark Cyan
  'sterile-annex1': '#64748b', // Slate
  'gamp5-basics': '#475569', // Slate (Professional Steel)
  'batch-records': '#6366f1', // Indigo (Modern Digital)
  'nmpb-reg': '#059669', // Sudan Emerald
  'adv-gmp': '#059669',
  'adv-glp': '#2563eb',
  'adv-iso-17025': '#d97706',
  'adv-validation': '#0891b2',
  'adv-qrm': '#db2777',
  'adv-gdp': '#ea580c'
};

const SPECIAL_COURSE_UNITS = ['capa', 'iso-9001', 'qc-lab', 'ipqc'];

const LectureView = ({ unitId, onProceedToQuiz, onBack }) => {
  const { language, t, theme } = useLanguage();
  const { addXp, updateStats, stats } = useGamification();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [completedSlides, setCompletedSlides] = useState([0]); // First slide is always unlocked
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const [slideKey, setSlideKey] = useState(0); // For animation trigger
  
  if (SPECIAL_COURSE_UNITS.includes(unitId)) {
    return <CourseSlides unitId={unitId} onStartQuiz={onProceedToQuiz} onBack={onBack} />;
  }

  // Get the unit content - ensure it exists
  const unit = educationalContent?.units?.[unitId];

  // Get slides first
  const slides = unit?.slides || [];

  // Get unit info - use defaults if not available
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
      onProceedToQuiz();
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
        addXp(30); // Award XP for completing lecture
        updateStats({ lecturesCompleted: stats.lecturesCompleted + 1 });
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
        backgroundColor: unitColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '30px',
        boxShadow: `0 10px 40px ${unitColor}40`
      }}>
        <span style={{ fontSize: '3rem' }}>📖</span>
      </div>
      
      <h2 style={{
        color: unitColor,
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
        backgroundColor: unitColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '30px',
        boxShadow: `0 10px 40px ${unitColor}40`
      }}>
        <span style={{ fontSize: '3rem' }}>🎉</span>
      </div>

      <h2 style={{ 
        color: unitColor,
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
        color: unitColor,
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
    const slide = currentSlide;
    const lang = slide[language] || slide['ar'];
    const text = lang?.text || '';
    const title = lang?.title || '';
    const color = unitColor;

    const parseLines = (txt) => txt.split('\n').filter(l => l.trim()).map((line, idx) => {
      const t = line.trim();
      if (/^\d+\./.test(t)) {
        const m = t.match(/^(\d+)\.(.*)$/);
        return <div key={idx} style={{display:'flex',gap:'10px',alignItems:'flex-start',marginBottom:'10px'}}><span style={{minWidth:'26px',height:'26px',borderRadius:'50%',background:color,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.7rem',fontWeight:'800',flexShrink:0}}>{m[1]}</span><span style={{color:'#334155',fontSize:'0.9rem',lineHeight:1.7}}>{m[2].trim()}</span></div>;
      }
      if (t.startsWith('✔') || t.startsWith('✓')) {
        return <div key={idx} style={{display:'flex',gap:'8px',alignItems:'flex-start',marginBottom:'8px'}}><span style={{color:'#10b981',fontWeight:'800',fontSize:'1rem',flexShrink:0}}>✓</span><span style={{color:'#334155',fontSize:'0.9rem',lineHeight:1.7}}>{t.replace(/^[✔✓]\s*/,'')}</span></div>;
      }
      if (t.startsWith('•') || t.startsWith('-')) {
        return <div key={idx} style={{display:'flex',gap:'8px',alignItems:'flex-start',marginBottom:'8px'}}><span style={{color:color,fontWeight:'800',fontSize:'1.1rem',flexShrink:0}}>•</span><span style={{color:'#334155',fontSize:'0.9rem',lineHeight:1.7}}>{t.replace(/^[•\-]\s*/,'')}</span></div>;
      }
      if (t.length < 80 && t.endsWith(':')) {
        return <div key={idx} style={{fontWeight:'700',color:color,fontSize:'0.9rem',marginTop:'12px',marginBottom:'6px',borderBottom:`2px solid ${color}33`,paddingBottom:'4px'}}>{t}</div>;
      }
      return <p key={idx} style={{color:'#334155',fontSize:'0.9rem',lineHeight:1.8,marginBottom:'8px'}}>{t}</p>;
    });

    const headerBlock = (label) => (
      <div style={{background:`linear-gradient(135deg,${color},${color}cc)`,padding:'16px 24px',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div>
          <div style={{fontSize:'0.65rem',color:'rgba(255,255,255,0.7)',letterSpacing:'0.1em',marginBottom:'4px'}}>{label}</div>
          <h2 style={{color:'#fff',fontSize:'1.2rem',fontWeight:'800',margin:0,lineHeight:1.3}}>{title}</h2>
        </div>
        {slide.regulatoryRef && <div style={{fontSize:'0.62rem',color:'rgba(255,255,255,0.8)',lineHeight:1.8,whiteSpace:'nowrap'}}>★ {slide.regulatoryRef.body}<br/><span style={{opacity:0.7}}>{slide.regulatoryRef.code}</span></div>}
      </div>
    );

    if (slide.type === 'casestudy') return (
      <div key={slideKey} className="animate-fade-in" style={{maxWidth:'860px',margin:'0 auto',padding:'0 16px',direction:language==='ar'?'rtl':'ltr'}}>
        <div style={{background:'#fff',borderRadius:'20px',overflow:'hidden',boxShadow:'0 4px 24px rgba(0,0,0,0.08)',border:`2px solid ${color}22`}}>
          {headerBlock('📋 CASE STUDY')}
          <div style={{padding:'20px 24px',background:'#fffbf0'}}>
            <div style={{display:'flex',gap:'8px',marginBottom:'12px'}}><span style={{fontSize:'1.3rem'}}>📌</span><span style={{fontWeight:'700',color:color}}>{language==='ar'?'دراسة حالة واقعية':'Real Case Study'}</span></div>
            {parseLines(text)}
          </div>
        </div>
      </div>
    );

    if (slide.type === 'discussion') return (
      <div key={slideKey} className="animate-fade-in" style={{maxWidth:'860px',margin:'0 auto',padding:'0 16px',direction:language==='ar'?'rtl':'ltr'}}>
        <div style={{background:'#fff',borderRadius:'20px',overflow:'hidden',boxShadow:'0 4px 24px rgba(0,0,0,0.08)',border:`2px solid ${color}22`}}>
          {headerBlock('💡 DISCUSSION')}
          <div style={{padding:'24px',background:`${color}06`}}>{parseLines(text)}</div>
        </div>
      </div>
    );

    return (
      <div key={slideKey} className="animate-fade-in" style={{maxWidth:'860px',margin:'0 auto',padding:'0 16px',direction:language==='ar'?'rtl':'ltr'}}>
        <div style={{background:'#fff',borderRadius:'20px',overflow:'hidden',boxShadow:'0 4px 24px rgba(0,0,0,0.08)',border:`2px solid ${color}22`,minHeight:'380px'}}>
          {headerBlock(`SLIDE ${currentSlideIndex + 1} / ${slides.length}`)}
          <div style={{padding:'20px 24px'}}>{parseLines(text)}</div>
          {text.length < 300 && <div style={{margin:'0 24px 20px',padding:'12px 16px',background:`${color}0f`,border:`1px dashed ${color}66`,borderRadius:'10px'}}><div style={{color:color,fontWeight:'700',fontSize:'0.75rem',marginBottom:'4px'}}>💡 Key Point</div><div style={{color:'#1e293b',fontSize:'0.85rem',fontWeight:'600'}}>{language==='ar'?'راجع هذا المحتوى بعناية قبل الامتحان':'Review this content carefully before the exam'}</div></div>}
        </div>
      </div>
    );
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
      <header style={{
        height: '70px',
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 30px',
        zIndex: 100
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
                  gap: '12px'
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
        >
          {isSidebarOpen ? '←' : '→'}
        </button>

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
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
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
                  fontWeight: '600',
                  border: 'none',
                  background: 'none'
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
                  boxShadow: `0 6px 20px ${unitColor}40`
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
      `}} />
    </div>
  );
};

export default LectureView;
