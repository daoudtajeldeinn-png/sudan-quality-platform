import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CertificateService } from "../services/CertificateService";

export const VerifyCertificate = () => {
  const [searchParams] = useSearchParams();
  const [certNumber, setCertNumber] = useState(searchParams.get("id") || "");
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
    if (searchParams.get("id")) {
      handleVerify({ preventDefault: () => {} });
    }
  }, []);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px", direction: "rtl" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ color: "#10b981", fontSize: "2.5rem" }}>«· Õﬁﬁ „‰ «·‘Â«œ…</h1>
        <p style={{ color: "#6b7280" }}> Õﬁﬁ „‰ ’Õ… ‘Â«œ«  „‰’… «·”Êœ«‰ ··ÃÊœ…</p>
      </div>

      <form onSubmit={handleVerify} style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", marginBottom: "30px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <input type="text" value={certNumber} onChange={(e) => setCertNumber(e.target.value)} placeholder="SQP-XXXXXXXX-XXX" style={{ flex: "1", padding: "15px", fontSize: "16px", border: "2px solid #e5e7eb", borderRadius: "10px", textAlign: "center" }} />
          <button type="submit" disabled={loading} style={{ padding: "15px 30px", backgroundColor: loading ? "#9ca3af" : "#10b981", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Ã«—Ì «· Õﬁﬁ..." : " Õﬁﬁ"}
          </button>
        </div>
      </form>

      {result && (
        <div style={{ backgroundColor: "#f0fdf4", border: "2px solid #10b981", borderRadius: "16px", padding: "40px", textAlign: "center" }}>
          <h2 style={{ color: "#065f46" }}>{result.userName}</h2>
          <p>Õ«’· ⁄·Ï ‘Â«œ… {result.unitName}</p>
          <p style={{ fontSize: "24px", color: "#059669" }}>«·‰ ÌÃ…: {result.percentage}%</p>
          <p>«·—ﬁ„: {result.certNumber}</p>
        </div>
      )}

      {result === null && !loading && searchParams.get("id") && (
        <div style={{ backgroundColor: "#fee2e2", border: "2px solid #ef4444", borderRadius: "16px", padding: "40px", textAlign: "center" }}>
          <h2 style={{ color: "#dc2626" }}>? «·‘Â«œ… €Ì— „ÊÃÊœ…</h2>
        </div>
      )}
    </div>
  );
}
