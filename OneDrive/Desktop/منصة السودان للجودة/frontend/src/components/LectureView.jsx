import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

const demoLectures = {
    'gmp-intro': {
        title: { ar: 'مقدمة في ممارسات التصنيع الجيد (GMP)', en: 'Introduction to Good Manufacturing Practices (GMP)' },
        content: {
            ar: `
        <h3>ما هي ممارسات التصنيع الجيد؟</h3>
        <p>ممارسات التصنيع الجيد (GMP) هي نظام يضمن أن المنتجات يتم تصنيعها والتحكم فيها باستمرار وفقًا لمعايير الجودة. وهي مصممة لتقليل المخاطر التي ينطوي عليها أي إنتاج صيدلاني لا يمكن القضاء عليها من خلال اختبار المنتج النهائي.</p>
        
        <h3>المبادئ الرئيسية لـ GMP:</h3>
        <ul>
          <li>يجب أن تكون مرافق التصنيع نظيفة وتحافظ على بيئة صحية.</li>
          <li>يجب التحكم بشكل صارم في التلوث البيئي لتقليل خطر التلوث للمنتج.</li>
          <li>يجب أن تكون عمليات التصنيع محددة بوضوح ومراقبة.</li>
          <li>يجب تدريب المشغلين على تنفيذ وتسجيل الإجراءات للتعامل مع أي مشكلة.</li>
        </ul>
        <p>الرجوع إلى: <a href="https://www.who.int/teams/health-product-policy-and-standards/standards-and-norms/gmp" target="_blank" rel="noopener noreferrer">WHO GMP Guidelines</a></p>
      `,
            en: `
        <h3>What are Good Manufacturing Practices?</h3>
        <p>Good Manufacturing Practices (GMP) is a system for ensuring that products are consistently produced and controlled according to quality standards. It is designed to minimize the risks involved in any pharmaceutical production that cannot be eliminated through testing the final product.</p>
        
        <h3>Key Principles of GMP:</h3>
        <ul>
          <li>Manufacturing facilities must maintain a clean and hygienic manufacturing area.</li>
          <li>Environmental contamination must be strictly controlled to minimize the risk of adulteration.</li>
          <li>Manufacturing processes are clearly defined and controlled.</li>
          <li>Operators are trained to carry out and document procedures to handle any issues.</li>
        </ul>
        <p>Reference: <a href="https://www.who.int/teams/health-product-policy-and-standards/standards-and-norms/gmp" target="_blank" rel="noopener noreferrer">WHO GMP Guidelines</a></p>
      `
        }
    },
    'glp-basics': {
        title: { ar: 'مبادئ الممارسة المخبرية الجيدة (GLP)', en: 'Basics of Good Laboratory Practice (GLP)' },
        content: {
            ar: '<p>تركز GLP على جودة ونزاهة بيانات الاختبار وتتعلق بالتنظيم والعملية والظروف التي يتم في ظلها تخطيط الدراسات المعملية وإجراؤها ومراقبتها وتسجيلها والإبلاغ عنها.</p>',
            en: '<p>GLP focuses on the quality and integrity of test data and relates to the organization, process and conditions under which laboratory studies are planned, performed, monitored, recorded and reported.</p>'
        }
    },
    'iso-17025': {
        title: { ar: 'معايير ISO 17025', en: 'ISO 17025 Standards' },
        content: {
            ar: '<p>ISO/IEC 17025 هي المعيار الدولي للمتطلبات العامة لكفاءة مختبرات الفحص والمعايرة.</p>',
            en: '<p>ISO/IEC 17025 is the international standard for the general requirements for the competence of testing and calibration laboratories.</p>'
        }
    },
    'ich-guidelines': {
        title: { ar: 'إرشادات المجلس الدولي للتنسيق (ICH)', en: 'ICH Guidelines' },
        content: {
            ar: '<p>يجمع ICH بين السلطات التنظيمية وصناعة الأدوية لمناقشة الجوانب العلمية والتقنية لتسجيل الأدوية.</p>',
            en: '<p>ICH brings together the regulatory authorities and pharmaceutical industry to discuss scientific and technical aspects of drug registration.</p>'
        }
    }
};

const LectureView = ({ unitId, onProceedToQuiz, onBack }) => {
    const { language, t } = useLanguage();
    const lectureData = demoLectures[unitId];

    if (!lectureData) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>لا توجد مادة علمية متاحة لهذه الوحدة حاليا.</p>
                <button onClick={onProceedToQuiz}>{t('proceedToQuiz')}</button>
            </div>
        );
    }

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
                <h2 style={{ color: '#28a745', marginBottom: '20px', borderBottom: '2px solid #28a745', paddingBottom: '10px' }}>
                    {lectureData.title[language] || lectureData.title['ar']}
                </h2>

                <div style={{ lineHeight: '1.6', fontSize: '16px', color: '#333' }}
                    dangerouslySetInnerHTML={{ __html: lectureData.content[language] || lectureData.content['ar'] }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
                    <button
                        onClick={onBack}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        {t('backToDashboard')}
                    </button>

                    <button
                        onClick={onProceedToQuiz}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {t('proceedToQuiz')} →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LectureView;
