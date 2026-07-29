import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CertificateService } from "../services/CertificateService";

export const VerifyCertificate = () => {
  const [searchParams] = useSearchParams();
  const [certNumber, setCertNumber] = useState(searchParams.get("id") || "");
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certNumber.trim()) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);
    try {
      const certificate = await CertificateService.getCertificateByNumber(certNumber.toUpperCase());
      if (certificate) {
        setResult(certificate);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error('Verify error:', err);
      setNotFound(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (searchParams.get("id")) {
      handleVerify({ preventDefault: () => {} });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f2f7 0%, #e4e8f0 100%)',
      padding: '40px 20px',
      fontFamily: "'IBM Plex Sans Arabic', 'Inter', sans-serif",
      direction: 'rtl',
    }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎓</div>
          <h1 style={{ color: "#0f2557", fontSize: "2rem", fontWeight: '800', margin: '0 0 8px' }}>
            التحقق من الشهادة
          </h1>
          <p style={{ color: "#64748b", fontSize: '15px', margin: 0 }}>
            منصة السودان للجودة — Sudan Quality Platform
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleVerify} style={{
          background: "white", padding: "28px", borderRadius: "18px",
          boxShadow: "0 4px 20px rgba(15,37,87,0.08)", marginBottom: "24px"
        }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f2557', marginBottom: '10px' }}>
            رقم الشهادة / Certificate Number
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={certNumber}
              onChange={(e) => setCertNumber(e.target.value)}
              placeholder="SQP-XXXXXXXX-XXXXX"
              style={{
                flex: "1", padding: "14px 16px", fontSize: "15px",
                border: "2px solid #e4e8f0", borderRadius: "12px",
                textAlign: "center", outline: 'none', fontFamily: 'monospace',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "14px 28px",
                background: loading ? "#94a3b8" : "linear-gradient(135deg,#0f2557,#1a3a7a)",
                color: "white", border: "none", borderRadius: "12px",
                fontWeight: "700", fontSize: '14px',
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "⌛ جاري البحث..." : "🔍 تحقق"}
            </button>
          </div>
        </form>

        {/* Result: found */}
        {result && (
          <div style={{
            background: "linear-gradient(135deg, #eafaf3, #d4edda)",
            border: "2px solid #1d9e75", borderRadius: "18px",
            padding: "32px", textAlign: "center",
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
            <div style={{ fontSize: '12px', color: '#0f6e56', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '8px' }}>
              شهادة صالحة ومعتمدة
            </div>
            <h2 style={{ color: "#0f2557", fontSize: '1.5rem', margin: '0 0 8px' }}>
              {result.userName}
            </h2>
            <p style={{ fontSize: '15px', color: '#1a3a7a', margin: '0 0 16px' }}>
              أكمل بنجاح: <strong>{result.unitName}</strong>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#1d9e75' }}>{result.percentage || result.score}%</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>الدرجة</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f2557', marginTop: '6px' }}>
                  {result.createdAt ? new Date(result.createdAt).toLocaleDateString('ar-EG') : '—'}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>تاريخ الإصدار</div>
              </div>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace', background: 'rgba(255,255,255,0.6)', padding: '8px 16px', borderRadius: '10px', display: 'inline-block' }}>
              {result.certNumber}
            </div>
          </div>
        )}

        {/* Result: not found */}
        {notFound && (
          <div style={{
            background: "#fee2e2", border: "2px solid #dc2626",
            borderRadius: "18px", padding: "32px", textAlign: "center",
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>❌</div>
            <h2 style={{ color: "#dc2626", fontSize: '1.3rem', margin: '0 0 8px' }}>
              الشهادة غير موجودة
            </h2>
            <p style={{ color: '#991b1b', fontSize: '14px' }}>
              لم نتمكن من العثور على شهادة بهذا الرقم. تأكد من الرقم وحاول مرة أخرى.
            </p>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '12px', color: '#94a3b8' }}>
          © 2026 Sudan Quality Platform
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;
