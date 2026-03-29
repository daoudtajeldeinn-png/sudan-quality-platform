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

  if (loading) return <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}>Ã«—Ì «· Õﬁﬁ...</div>;
  return allowed ? children : null;
}
