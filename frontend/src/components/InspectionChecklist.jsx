import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';

const CHECKLIST_DATA = {
  ar: [
    { id: 'doc', category: 'الوثائق (Documentation)', items: [
        'هل يوجد سجل تشغيل كامل لكل دفعة؟',
        'هل بروتوكولات التحقق محدثة وموقعة؟',
        'هل توجد سياسات واضحة لسلامة البيانات (ALCOA)?'
      ] 
    },
    { id: 'prod', category: 'الإنتاج (Production)', items: [
        'هل يتم التحكم في درجة الحرارة والرطوبة؟',
        'هل توجد علامات حالة التنظيف على الماكينات؟',
        'هل يتم ارتداء ملابس العمل المناسبة (Gowning)?'
      ]
    },
    { id: 'qc', category: 'الجودة (QC)', items: [
        'هل الأجهزة معايرة ولها بطاقة معايرة؟',
        'هل الكواشف الكيميائية ضمن تاريخ الصلاحية؟',
        'هل يتم الاحتفاظ بعينات مرجعية كافية؟'
      ]
    }
  ],
  en: [
    { id: 'doc', category: 'Documentation', items: [
        'Is there a complete Batch Record for every batch?',
        'Are validation protocols updated and signed?',
        'Are there clear Data Integrity (ALCOA) policies?'
      ]
    },
    { id: 'prod', category: 'Production', items: [
        'Are temperature and humidity controlled and logged?',
        'Are cleaning status labels present on all equipment?',
        'Is proper gowning followed by all personnel?'
      ]
    },
    { id: 'qc', category: 'Quality Control', items: [
        'Are instruments calibrated with visible labels?',
        'Are chemical reagents within their expiry dates?',
        'Are sufficient reference samples retained?'
      ]
    }
  ]
};

const InspectionChecklist = () => {
  const { language } = useLanguage();
  const [checkedItems, setCheckedItems] = useState({});
  const categories = CHECKLIST_DATA[language === 'ar' ? 'ar' : 'en'];

  const handleToggle = (catId, index) => {
    const key = `${catId}-${index}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const calculateScore = () => {
    const total = categories.reduce((acc, cat) => acc + cat.items.length, 0);
    const checked = Object.values(checkedItems).filter(v => v).length;
    return Math.round((checked / total) * 100);
  };

  const score = calculateScore();

  return (
    <div className="glass-panel" style={{ padding: '25px', borderRadius: '20px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', gridColumn: '1 / -1' }}>
      <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>📋</span> {language === 'ar' ? 'قائمة تفتيش الجاهزية (Audit Checklist)' : 'GMP Readiness Checklist'}
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '25px' }}>
        {language === 'ar' ? 'قم بتقييم درجة جاهزية المصنع للتفتيش الرسمي بناءً على متطلبات NMPB و WHO.' : 'Assess your facility\'s readiness for official inspection based on NMPB and WHO standards.'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
        {categories.map(cat => (
          <div key={cat.id}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid var(--primary-color)' }}>{cat.category}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cat.items.map((item, idx) => (
                <label key={idx} style={{ 
                  display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer',
                  padding: '8px', borderRadius: '8px', backgroundColor: checkedItems[`${cat.id}-${idx}`] ? 'rgba(40,167,69,0.05)' : 'transparent',
                  transition: '0.2s'
                }}>
                  <input 
                    type="checkbox" 
                    checked={!!checkedItems[`${cat.id}-${idx}`]} 
                    onChange={() => handleToggle(cat.id, idx)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{item}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '30px', padding: '20px', backgroundColor: 'var(--bg-body)', borderRadius: '15px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-color)'
      }}>
        <div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            {language === 'ar' ? 'درجة الجاهزية الكلية:' : 'Total Readiness Score:'}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {score < 50 ? (language === 'ar' ? '❌ حاجة فورية للتحسين' : '❌ Critical improvements needed') : 
             score < 90 ? (language === 'ar' ? '⚠️ جاهزية متوسطة' : '⚠️ Intermediate readiness') : 
             (language === 'ar' ? '✅ جاهزية ممتازة' : '✅ Excellent readiness')}
          </div>
        </div>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: score > 80 ? '#28a745' : score > 50 ? '#ffc107' : '#dc3545' }}>
          %{score}
        </div>
      </div>
    </div>
  );
};

export default InspectionChecklist;
