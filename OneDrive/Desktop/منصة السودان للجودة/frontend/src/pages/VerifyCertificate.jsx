import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CertificateService } from '../services/CertificateService';
import { QRCodeSVG } from 'qrcode.react';

export const VerifyCertificate = () => {
  const [searchParams] = useSearchParams();
  const [certNumber, setCertNumber] = useState(searchParams.get('id') || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certNumber.trim()) return;
    
    setLoading(true);
    const certificate = await CertificateService.getCertificateByNumber(certNumber.toUpperCase());
    setResult(certificate);
    setLoading(false);
  };

  useEffect(() => {
    if (searchParams.get('id')) {
      handleVerify({ preventDefault: () => {} });
    }
  }, []);

  return (
    <div style={{ 
      maxWidth: '900px', 
      margin: '0 auto', 
      padding: '40px 20px',
      fontFamily: 'system-ui, sans-serif',
      direction: 'rtl'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#10b981', fontSize: '2.5rem', marginBottom: '10px' }}>
          التحقق من الشهادة
        </h1>
        <p style={{ color: '#6b7280' }}>تحقق من صحة شهادات منصة السودان للجودة</p>
      </div>

      <form onSubmit={handleVerify} style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={certNumber}
            onChange={(e) => setCertNumber(e.target.value)}
            placeholder="SQP-XXXXXXXX-XXX"
            style={{
              flex: '1',
              padding: '15px 20px',
              fontSize: '16px',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              minWidth: '250px',
              textAlign: 'center'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '15px 30px',
              backgroundColor: loading ? '#9ca3af' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'جاري التحقق...' : 'تحقق'}
          </button>
        </div>
      </form>

      {result && (
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '2px solid #10b981',
          borderRadius: '16px',
          padding: '40px',
          position: 'relative'
        }}>
          <div style={{ 
            position: 'absolute', 
            top: '20px', 
            left: '20px',
            backgroundColor: '#10b981',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            ✅ شهادة معتمدة
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '30px' }}>
            <h2 style={{ color: '#065f46', fontSize: '2rem', marginBottom: '5px' }}>
              {result.userName}
            </h2>
            <p style={{ color: '#6b7280' }}>حاصل على شهادة إتمام الوحدة التدريبية</p>
          </div>

          <div style={{ 
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '12px',
            marginBottom: '25px',
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>الوحدة</p>
              <p style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '18px' }}>{result.unitName}</p>
            </div>
            <div>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>النتيجة</p>
              <p style={{ fontWeight: 'bold', color: '#059669', fontSize: '24px' }}>{result.percentage}%</p>
            </div>
            <div>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>تاريخ الإصدار</p>
              <p style={{ fontWeight: 'bold', color: '#1f2937' }}>
                {result.createdAt?.toDate().toLocaleDateString('ar-SD')}
              </p>
            </div>
            <div>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>الرقم</p>
              <p style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{result.certNumber}</p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
            <QRCodeSVG value={window.location.href} size={100} bgColor="#f0fdf4" fgColor="#065f46" />
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>امسح للتحقق</p>
            </div>
          </div>
        </div>
      )}

      {result === null && !loading && searchParams.get('id') && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '2px solid #ef4444',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#dc2626' }}>❌ الشهادة غير موجودة</h2>
        </div>
      )}
    </div>
  );
};
