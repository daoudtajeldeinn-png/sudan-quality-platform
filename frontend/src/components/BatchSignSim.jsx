import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';

const BatchSignSim = () => {
    const { t, language } = useLanguage();
    const [logs, setLogs] = useState([
        { id: 1, time: new Date(Date.now() - 3600000).toISOString(), user: 'System', action: 'Batch Created', reason: 'Initial Initialization' },
        { id: 2, time: new Date(Date.now() - 1800000).toISOString(), user: 'QC_Manager', action: 'Materials Verified', reason: 'Release for Production' }
    ]);
    const [name, setName] = useState('');
    const [reason, setReason] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSign = (e) => {
        e.preventDefault();
        if (!name || !reason) return;

        const newLog = {
            id: Date.now(),
            time: new Date().toISOString(),
            user: name,
            action: 'Electronic Signature Applied',
            reason: reason
        };

        setLogs([newLog, ...logs]);
        setName('');
        setReason('');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div className="batch-sim-container animate-fade-in" style={{
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
                    <span style={{ fontSize: '1.5rem', marginInlineEnd: '10px' }}>🖋️</span>
                    {t('batchSim')}
                </h3>

                <form onSubmit={handleSign} style={{ marginBottom: '30px', backgroundColor: 'var(--bg-color)', padding: '20px', borderRadius: '15px', border: '1px dashed var(--primary-color)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>{t('signerName')}</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
                                placeholder="e.g. Ali Ahmed"
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>{t('signReason')}</label>
                            <select 
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
                                required
                            >
                                <option value="">-- {language === 'ar' ? 'اختر السبب' : 'Select Reason'} --</option>
                                <option value="Review">Review</option>
                                <option value="Approval">Approval</option>
                                <option value="Verification">Verification</option>
                                <option value="Author">Author</option>
                            </select>
                        </div>
                    </div>
                    <button 
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', padding: '12px', borderRadius: '10px', fontWeight: 'bold' }}
                    >
                        {t('confirmSign')}
                    </button>
                    {showSuccess && (
                        <div style={{ marginTop: '10px', textAlign: 'center', color: '#28a745', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            ✅ {language === 'ar' ? 'تم التوقيع بنجاح في سجل التدقيق' : 'Signed successfully in Audit Trail'}
                        </div>
                    )}
                </form>

                <div className="audit-trail-section">
                    <h4 style={{ marginBottom: '15px', fontSize: '1.1rem', borderBottom: '2px solid var(--bg-color-secondary)', paddingBottom: '5px' }}>
                        📑 {t('auditTrail')}
                    </h4>
                    <div style={{ maxHeight: '250px', overflowY: 'auto', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead style={{ backgroundColor: 'var(--bg-color-secondary)', position: 'sticky', top: 0 }}>
                                <tr>
                                    <th style={{ padding: '10px', textAlign: language === 'ar' ? 'right' : 'left' }}>Timestamp</th>
                                    <th style={{ padding: '10px', textAlign: language === 'ar' ? 'right' : 'left' }}>User</th>
                                    <th style={{ padding: '10px', textAlign: language === 'ar' ? 'right' : 'left' }}>Action</th>
                                    <th style={{ padding: '10px', textAlign: language === 'ar' ? 'right' : 'left' }}>Reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map(log => (
                                    <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>{new Date(log.time).toLocaleString()}</td>
                                        <td style={{ padding: '8px', fontWeight: '600' }}>{log.user}</td>
                                        <td style={{ padding: '8px' }}>{log.action}</td>
                                        <td style={{ padding: '8px', fontStyle: 'italic' }}>{log.reason}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BatchSignSim;
