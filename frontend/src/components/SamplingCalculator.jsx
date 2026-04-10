import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';

const SamplingCalculator = () => {
  const { language, t } = useLanguage();
  const [batchSize, setBatchSize] = useState(100);
  const [result, setResult] = useState(null);

  const calculateSampling = () => {
    if (batchSize <= 0) {
      alert(language === 'ar' ? 'يجب أن يكون حجم التشغيلة أكبر من صفر' : 'Batch size must be greater than zero');
      return;
    }

    // Standard √n+1 Rule (WHO/GMP)
    const n = Math.ceil(Math.sqrt(batchSize) + 1);
    
    // Level II (More rigorous for critical materials)
    const level2 = Math.ceil(Math.sqrt(batchSize) * 0.4 + 1); // Simplified example
    
    setResult({
      samples: n,
      criticalSamples: level2
    });
  };

  return (
    <div className="glass-panel" style={{ padding: '25px', borderRadius: '20px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
      <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>📦</span> {language === 'ar' ? 'حاسبة أخذ العينات (√n+1)' : 'Sampling Calculator (√n+1)'}
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
        {language === 'ar' ? 'حساب عدد العينات المطلوبة بناءً على قاعدة الجودة العالمية (WHO/GMP).' : 'Calculate required sample size based on international WHO/GMP standards.'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div className="input-group">
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>{language === 'ar' ? 'حجم التشغيلة (N)' : 'Batch Size (N)'}</label>
          <input 
            type="number" 
            value={batchSize} 
            onChange={(e) => setBatchSize(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-primary)' }}
          />
        </div>

        <button onClick={calculateSampling} className="btn-primary" style={{ marginTop: '10px' }}>
          {language === 'ar' ? 'حساب عدد العينات' : 'Calculate Sample Size'}
        </button>

        {result && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ padding: '15px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '12px', textAlign: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>{language === 'ar' ? 'العينة المطلوبة (n):' : 'Required Sample Size (n):'}</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{result.samples} {language === 'ar' ? 'حاويات' : 'Units'}</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: 'rgba(232, 62, 140, 0.1)', color: 'var(--pharma-pink)', borderRadius: '10px', fontSize: '0.85rem', border: '1px dashed var(--pharma-pink)' }}>
              ⚠️ {language === 'ar' ? 'للمواد الحرجة (Critical)، يوصى بمراجعة خطة أخذ العينات المتعمقة.' : 'For critical materials, advanced Level II sampling plan may be required.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SamplingCalculator;
