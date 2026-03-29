import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { CertificateService } from '../services/CertificateService';

export const ProtectedCertificateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const { unitId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const certificate = await CertificateService.checkUserCertificate(user.uid, unitId);
        
        if (certificate && certificate.percentage >= 70) {
          setAllowed(true);
        } else {
          navigate(`/unit/${unitId}/quiz`);
        }
      } catch (error) {
        console.error(error);
        navigate('/error');
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, checkAccess);
    return () => unsubscribe();
  }, [unitId, navigate]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        جاري التحقق من الصلاحية...
      </div>
    );
  }

  return allowed ? children : null;
};
