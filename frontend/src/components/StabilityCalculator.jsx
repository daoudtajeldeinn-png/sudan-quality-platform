import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';

const StabilityCalculator = () => {
  const { language, t } = useLanguage();
  const [initialAssay, setInitialAssay] = useState(100);
  const [currentAssay, setCurrentAssay] = useState(98.5);
  const [monthsAccelerated, setMonthsAccelerated] = useState(6);
  const [result, setResult] = useState(null);

  // Simplified Arrhenius Calculation:
  // Q10 = 2 (standard approx for pharmaceutical degradation)
  // Acceleration factor (40C to 30C) = 2^((40-30)/10) = 2
  const calculateShelfLife = () => {
    if (initialAssay <= currentAssay) {
      alert(language === 'ar' ? 'يجب أن تكون الدرجة الأولية أكبر من الحالية' : 'Initial assay must be greater than current assay');
      return;
    }

    const degradationPerMonth = (initialAssay - currentAssay) / monthsAccelerated;
    const lowerLimit = 95; // Standard pharmacopeial limit
    const shelfLifeAccelerated = (initialAssay - lowerLimit) / degradationPerMonth;
    
    // Convert accelerated to real-time (Zone IVb: 30C/75%RH)
    // Applying Zone IVb adjustment factor (Q10 = 2)
    const shelfLifeRealTime = Math.floor(shelfLifeAccelerated * 2);
    
    setResult({
      months: shelfLifeRealTime,
      degradationRate: degradationPerMonth.toFixed(3),
      limit: lowerLimit
    });
  };

  return (
    <div className="glass-panel" style={{ padding: '25px', borderRadius: '20px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
      <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>🌡️</span> {language === 'ar' ? 'حاسبة الثبات (Zone IVb)' : 'Stability Calculator (Zone IVb)' }
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
        {language === 'ar' ? 'توقع الصلاحية بناءً على بيانات التخزين المتسارع (40°C) لمناخ السودان (30°C).' : 'Predict shelf life based on accelerated data (40°C) for Sudan climate (30°C).'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div className="input-group">
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>{language === 'ar' ? 'التحليل الأولي (%)' : 'Initial Assay (%)'}</label>
          <input 
            type="number" 
            value={initialAssay} 
            onChange={(e) => setInitialAssay(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-primary)' }}
          />
        </div>

        <div className="input-group">
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>{language === 'ar' ? 'التحليل الحالي (بعد التخزين)' : 'Current Assay (After storage)'}</label>
          <input 
            type="number" 
            value={currentAssay} 
            onChange={(e) => setCurrentAssay(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-primary)' }}
          />
        </div>

        <div className="input-group">
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>{language === 'ar' ? 'مدة التخزين المتسارع (أشهر)' : 'Accelerated Period (Months)'}</label>
          <input 
            type="number" 
            value={monthsAccelerated} 
            onChange={(e) => setMonthsAccelerated(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-primary)' }}
          />
        </div>

        <button onClick={calculateShelfLife} className="btn-primary" style={{ marginTop: '10px' }}>
          {language === 'ar' ? 'حساب الصلاحية المتوقعة' : 'Calculate Predicted Shelf-life'}
        </button>

        {result && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>{language === 'ar' ? 'الصلاحية المتوقعة (عند 30°C):' : 'Predicted Shelf-life (at 30°C):'}</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{result.months} {language === 'ar' ? 'شهر' : 'Months'}</div>
            <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>
              {language === 'ar' ? `معدل التحلل: ${result.degradationRate}% / شهر` : `Degradation Rate: ${result.degradationRate}% / month`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StabilityCalculator;
