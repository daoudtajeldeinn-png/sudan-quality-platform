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
        unit8: 'الوحدة الثامنة',
        introGMP: 'مقدمة في GMP',
        glpBasics: 'مبادئ GLP',
        iso17025: 'معايير ISO 17025',
        ichGuidelines: 'إرشادات ICH',
        valQual: 'التحقق وصلاحية الأداء',
        dataIntegrity: 'سلامة ونزاهة البيانات',
        qrmBasics: 'إدارة مخاظر الجودة',
        gdpBasics: 'ممارسات التوزيع الجيدة GDP',
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
        arnProgress: 'تقدم الدلائل',
        totalScore: 'الدرجة الكلية',
        certTitle: 'شهادة التميز المهني',
        certIntro: 'نشهد بأن السيد/السيدة:',
        certDesc: 'قد استوفى بنجاح كافة المتطلبات الشاملة وأظهر الكفاءة المهنية في البرنامج التدريبي المتقدم لإدارة الجودة الدوائية، والذي يشمل معايير الـ GMP، GLP، ISO 17025، وإرشادات الـ ICH وفقاً لمتطلبات منظمة الصحة العالمية وتميزنا في مجال الجودة الدوائية الشاملة.',
        lockedMsg: 'الشهادة مقفلة: أكمل جميع الوحدات بنسبة 90% أو أكثر لفك القفل.',
        viewCert: 'عرض الشهادة',
        printCert: 'طباعة الشهادة',
        scoreLabel: 'الدرجة',
        dateLabel: 'تاريخ الإصدار',
        gmp_intro: 'مقدمة في الجودة GMP',
        glp_basics: 'أساسيات المختبر GLP',
        iso_17025: 'كفاءة المختبرات ISO',
        ich_guidelines: 'إرشادات الـ ICH',
        validation_qualification: 'التحقق والتأهيل',
        data_integrity: 'نزاهة البيانات',
        qrm_basics: 'إدارة المخاطر QRM',
        gdp_basics: 'ممارسات التوزيع GDP',
        issuingAuthority: 'منصة السودان للجودة',
        developerName: 'د. داود تاج الدين أحمد عبد الكريم',
        developerTitle: 'خبير GMP, GLP, ISO والتحقق من الجودة',
        microBadge: 'وسام الإنجاز المصغر',
        badgeId: 'معرف الوسام',
        developerProfile: 'الملف الشخصي للمطور والمؤسس',
        pledgeTitle: 'ميثاق نزاهة البيانات والالتزام المهني',
        pledgeText: 'أقر أنا المتدرب بالالتزام التام بمعايير نزاهة البيانات (ALCOA++)، وأتعهد بأداء هذا التدريب بنفسي وبالأمانة العلمية المطلوبة، مع الحفاظ على سرية المواد التعليمية وعدم تسريب أسئلة الامتحانات وفق متطلبات WHO و GMP.',
        pledgeAgree: 'أوافق وأتعهد بالالتزام',
        lectureLocked: 'المحاضرة قيد المتابعة',
        viewAllSlides: 'يجب استعراض كافة الشرائح لفتح الاختبار',
        auditLog: 'سجل التدقيق الرقمي',
        eventLogin: 'تسجيل دخول',
        eventQuiz: 'بدء اختبار',
        eventCert: 'استخراج شهادة',
        eventPledge: 'توقيع الميثاق',
        sampleCert: 'نموذج الشهادة المشجع',
        surveyTitle: 'تقييم فعالية التدريب (ICH Q10)',
        surveyQ1: 'هل غطت المادة العلمية احتياجاتك المعرفية؟',
        surveyQ2: 'كيف تقيم مستوى سهولة استخدام المنصة؟',
        surveyQ3: 'هل تشعر بزيادة كفاءتك بعد هذا التدريب؟',
        submitSurvey: 'إرسال التقييم واستلام الشهادة',
        quizTitle: 'اختبار الكفاءة المهنية',
        loadingQuestions: 'جاري تحميل الأسئلة الفنية...',
        submitExam: 'تسليم الامتحان',
        next: 'التالي',
        true: 'صح',
        false: 'خطأ',
        placeholderFill: 'اكتب إجابتك هنا...',
        logicHint: 'المنطق العلمي',
        retakeBtn: 'إعادة الاختبار للنجاح (90%)',
        scoreLowWarning: 'درجتك الحالية لا تؤهلك للحصول على الشهادة. يرجى المذاكرة وإعادة المحاولة.'
    },
    en: {
        // ... same structure for English
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
        unit8: 'Unit 8',
        introGMP: 'Introduction to GMP',
        glpBasics: 'GLP Basics',
        iso17025: 'ISO 17025 Standards',
        ichGuidelines: 'ICH Guidelines',
        valQual: 'Validation & Qualification',
        dataIntegrity: 'Data Integrity (ALCOA+)',
        qrmBasics: 'Quality Risk Management',
        gdpBasics: 'Good Distribution Practices GDP',
        issuingAuthority: 'Sudan Quality Platform',
        developerName: 'Dr. Daoud Tajeldeinn Ahmed Abdelkarim',
        developerTitle: 'GMP, GLP, ISO & Quality Specialist',
        microBadge: 'Micro-credential Badge',
        badgeId: 'Badge ID',
        developerProfile: 'Developer & Founder Profile',
        certTitle: 'Certificate of Professional Excellence',
        certIntro: 'This is to certify that:',
        certDesc: 'Has successfully fulfilled the comprehensive requirements and demonstrated professional proficiency in the Advanced Pharmaceutical Quality Management Program, encompassing WHO GMP, GLP, ISO 17025, and ICH Guidelines, with excellence in Comprehensive Pharmaceutical Quality.',
        pledgeTitle: 'Data Integrity & Professional Pledge',
        pledgeText: 'I hereby pledge to strictly adhere to Data Integrity standards (ALCOA++), promising to perform this training personally and with the required scientific honesty, maintaining the confidentiality of materials and exams as per WHO and GMP requirements.',
        pledgeAgree: 'I Agree and Pledge',
        lectureLocked: 'Lecture in Progress',
        viewAllSlides: 'You must view all slides to unlock the exam',
        auditLog: 'Digital Audit Trail',
        eventLogin: 'Login',
        eventQuiz: 'Started Quiz',
        eventCert: 'Generated Certificate',
        eventPledge: 'Signed Pledge',
        sampleCert: 'Sample Certificate (Encouragement)',
        surveyTitle: 'Effectiveness Assessment (ICH Q10)',
        surveyQ1: 'Did the materials cover your knowledge needs?',
        surveyQ2: 'How do you rate the platform usability?',
        surveyQ3: 'Do you feel a competency increase after this training?',
        submitSurvey: 'Submit Survey & Get Certificate',
        gmp_intro: 'GMP Introduction',
        glp_basics: 'GLP Basics',
        iso_17025: 'ISO 17025 Competence',
        ich_guidelines: 'ICH Guidelines',
        validation_qualification: 'Validation & Qualification',
        data_integrity: 'Data Integrity',
        qrm_basics: 'Quality Risk Management (QRM)',
        gdp_basics: 'Good Distribution Practices (GDP)',
        totalScore: 'Total Score',
        quizTitle: 'Professional Competency Exam',
        loadingQuestions: 'Loading technical questions...',
        submitExam: 'Submit Exam',
        next: 'Next',
        true: 'True',
        false: 'False',
        placeholderFill: 'Type your answer here...',
        logicHint: 'Technical Logic',
        retakeBtn: 'Retake Exam to Pass (90%)',
        scoreLowWarning: 'Your current score is below the passing threshold. Please review and try again.'
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
