import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { CertificateService } from "../services/CertificateService";

export const ProtectedCertificateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const { unitId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async (user) => {
      if (!user) { navigate("/login"); return; }
      try {
        const cert = await CertificateService.checkUserCertificate(user.uid, unitId);
        if (cert && cert.percentage >= 70) setAllowed(true);
        else navigate(`/unit/${unitId}/quiz`);
      } catch (e) { navigate("/error"); }
      finally { setLoading(false); }
    };
    const unsub = onAuthStateChanged(auth, checkAccess);
    return () => unsub();
  }, [unitId, navigate]);

  if (loading) return <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}>ÌÇÑí ÇáÊÍŞŞ...</div>;
  if (allowed) return children;

  // If not allowed, show a friendly message (navigation should already redirect to quiz)
  return (
    <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',height:'70vh',padding:20}}>
      <h2 style={{color:'#dc2626'}}>ÛíÑ ãÓãæÍ ÈÇáÏÎæá</h2>
      <p style={{color:'#6b7280',textAlign:'center',maxWidth:600}}>
        íÈÏæ Ãäß áã Êõßãá ÇáãÊØáÈÇÊ ÇááÇÒãÉ ááÍÕæá Úáì ÇáÔåÇÏÉ Ãæ ÇáäÓÈÉ ÃŞá ãä ÇáÍÏ ÇáãØáæÈ. ÓíÊã ÊæÌíåß áÇÌÊíÇÒ ÇáÇÎÊÈÇÑ.
      </p>
      <button onClick={() => navigate(`/unit/${unitId}/quiz`)} style={{marginTop:20,padding:'10px 20px',backgroundColor:'#10b981',color:'white',border:'none',borderRadius:8,cursor:'pointer'}}>
        ÇáÇäÊŞÇá ááÇÎÊÈÇÑ
      </button>
    </div>
  );
}
