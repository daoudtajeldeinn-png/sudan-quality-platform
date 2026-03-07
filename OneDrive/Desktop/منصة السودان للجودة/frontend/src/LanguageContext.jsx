import React, { createContext, useState, useContext, useEffect } from 'react';

// Define the available languages and their string resources
export const translations = {
    ar: {
        dashboardTitle: 'لوحة التحكم - منصة السودان للجودة',
        logout: 'تسجيل الخروج',
        progressSummary: 'ملخص التقدم',
        availableUnits: 'الوحدات المتاحة',
        earnedCertificates: 'الشهادات المكتسبة',
        startStudy: 'ابدأ الدراسة',
        backToDashboard: '← العودة للوحة التحكم',
        congrats: 'مبروك! لقد نجحت في الاختبار بدرجة',
        failed: 'لم تنجح في الاختبار. درجتك:',
        tryAgain: 'حاول مرة أخرى.',
        gmpDesc: 'التصنيع الجيد',
        glpDesc: 'المختبر الجيد',
        isoDesc: 'المعايير الدولية',
        ichDesc: 'التوحيد الدولي',
        unit1: 'الوحدة الأولى',
        unit2: 'الوحدة الثانية',
        unit3: 'الوحدة الثالثة',
        unit4: 'الوحدة الرابعة',
        unit5: 'الوحدة الخامسة',
        unit6: 'الوحدة السادسة',
        unit7: 'الوحدة السابعة',
        introGMP: 'مقدمة في GMP',
        glpBasics: 'مبادئ GLP',
        iso17025: 'معايير ISO 17025',
        ichGuidelines: 'إرشادات ICH',
        valQual: 'التحقق وصلاحية الأداء',
        dataIntegrity: 'سلامة ونزاهة البيانات',
        qrmBasics: 'إدارة مخاظر الجودة',
        gmpCert: 'شهادة GMP',
        earned: 'مكتسبة',
        completed: 'مكتمل',
        quizTitle: 'اختبار الوحدة',
        loading: 'جاري التحميل...',
        next: 'التالي',
        finish: 'إنهاء',
        score: 'النتيجة',
        question: 'السؤال',
        of: 'من',
        correctAnswerInfo: 'الإجابة الصحيحة كانت',
        lectureTitle: 'المادة العلمية للوحدة',
        proceedToQuiz: 'الانتقال إلى الاختبار',
        errorLoading: 'حدث خطأ في تحميل الأسئلة من الخادم. تم تفعيل وضع العرض التجريبي (Demo Mode).',
        courseCurriculum: 'منهج الدورة',
        back: 'رجوع',
    },
    en: {
        dashboardTitle: 'Dashboard - Sudan Quality Platform',
        logout: 'Logout',
        progressSummary: 'Progress Summary',
        availableUnits: 'Available Units',
        earnedCertificates: 'Earned Certificates',
        startStudy: 'Start Study',
        backToDashboard: '← Back to Dashboard',
        congrats: 'Congratulations! You passed the test with a score of',
        failed: 'You did not pass the test. Your score:',
        tryAgain: 'Try again.',
        gmpDesc: 'Good Manufacturing',
        glpDesc: 'Good Laboratory',
        isoDesc: 'International Standards',
        ichDesc: 'Intl Harmonization',
        unit1: 'Unit 1',
        unit2: 'Unit 2',
        unit3: 'Unit 3',
        unit4: 'Unit 4',
        unit5: 'Unit 5',
        unit6: 'Unit 6',
        unit7: 'Unit 7',
        introGMP: 'Introduction to GMP',
        glpBasics: 'GLP Basics',
        iso17025: 'ISO 17025 Standards',
        ichGuidelines: 'ICH Guidelines',
        valQual: 'Validation & Qualification',
        dataIntegrity: 'Data Integrity (ALCOA+)',
        qrmBasics: 'Quality Risk Management',
        gmpCert: 'GMP Certificate',
        earned: 'Earned',
        completed: 'Completed',
        quizTitle: 'Unit Quiz',
        loading: 'Loading...',
        next: 'Next',
        finish: 'Finish',
        score: 'Score',
        question: 'Question',
        of: 'of',
        correctAnswerInfo: 'The correct answer was',
        lectureTitle: 'Unit Study Material',
        proceedToQuiz: 'Proceed to Quiz',
        errorLoading: 'Error loading questions from server. Demo Mode activated.',
        courseCurriculum: 'Course Curriculum',
        back: 'Back',
    }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Try to get language from local storage, default to Arabic
    const [language, setLanguage] = useState(() => {
        const savedLang = localStorage.getItem('appLanguage');
        return savedLang || 'ar';
    });

    useEffect(() => {
        localStorage.setItem('appLanguage', language);
        // Set text direction on the body element
        document.body.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prevLang => prevLang === 'ar' ? 'en' : 'ar');
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
