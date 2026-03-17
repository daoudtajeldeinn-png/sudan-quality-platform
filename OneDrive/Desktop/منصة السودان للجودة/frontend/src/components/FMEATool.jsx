import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

const FMEATool = () => {
    const { t, language } = useLanguage();
    const [severity, setSeverity] = useState(5);
    const [occurrence, setOccurrence] = useState(5);
    const [detectability, setDetectability] = useState(5);
    const [rpn, setRpn] = useState(125);
    const [riskInfo, setRiskInfo] = useState({ level: 'Medium', color: '#ffc107' });

    useEffect(() => {
        const calculatedRpn = severity * occurrence * detectability;
        setRpn(calculatedRpn);

        let level = '';
        let color = '';

        if (calculatedRpn < 40) {
            level = t('lowRisk');
            color = '#28a745';
        } else if (calculatedRpn < 100) {
            level = t('medRisk');
            color = '#ffc107';
        } else if (calculatedRpn < 200) {
            level = t('highRisk');
            color = '#fd7e14';
        } else {
            level = t('criticalRisk');
            color = '#dc3545';
        }

        setRiskInfo({ level, color });
    }, [severity, occurrence, detectability, t]);

    const SliderField = ({ label, value, onChange, min = 1, max = 10 }) => (
        <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{label}</label>
                <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{value}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '5px',
                    background: 'var(--bg-color-secondary)',
                    outline: 'none',
                    cursor: 'pointer',
                    WebkitAppearance: 'none'
                }}
            />
        </div>
    );

    return (
        <div className="fmea-container animate-fade-in" style={{
            direction: language === 'ar' ? 'rtl' : 'ltr',
            color: 'var(--text-primary)'
        }}>
            <div className="glass-panel" style={{
                backgroundColor: 'var(--bg-card)',
                padding: '30px',
                borderRadius: '24px',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-color)'
            }}>
                <h3 style={{ marginBottom: '25px', color: 'var(--primary-color)', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem', marginInlineEnd: '10px' }}>📊</span>
                    {t('fmeaTitle')}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    <div className="inputs-section">
                        <SliderField label={t('severity')} value={severity} onChange={setSeverity} />
                        <SliderField label={t('occurrence')} value={occurrence} onChange={setOccurrence} />
                        <SliderField label={t('detectability')} value={detectability} onChange={setDetectability} />
                    </div>

                    <div className="result-section" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'var(--bg-color)',
                        borderRadius: '20px',
                        padding: '20px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                            RPN (S × O × D)
                        </div>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: riskInfo.color, marginBottom: '10px' }}>
                            {rpn}
                        </div>
                        <div style={{
                            padding: '8px 20px',
                            borderRadius: '50px',
                            backgroundColor: riskInfo.color,
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}>
                            {riskInfo.level}
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '30px', padding: '15px', borderRadius: '12px', backgroundColor: 'var(--bg-color-secondary)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {language === 'ar' 
                      ? 'ملاحظة: تساعد هذه الأداة في تحديد أولويات المخاطر بناءً على حاصل ضرب الشدة والتكرار والقدرة على الكشف. اتبع دائماً السياسات الداخلية لشركتك.' 
                      : 'Note: This tool helps prioritize risks based on the product of Severity, Occurrence, and Detectability. Always follow your internal company policies.'}
                </div>
            </div>
        </div>
    );
};

export default FMEATool;
