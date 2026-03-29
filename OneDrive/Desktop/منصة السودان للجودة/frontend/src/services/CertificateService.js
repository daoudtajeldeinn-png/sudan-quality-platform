import { db } from '../firebase/config';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

export class CertificateService {
  static async saveCertificate(userId, userName, unitId, unitName, score, percentage) {
    const certNumber = `SQP-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    const certificateData = {
      userId,
      userName,
      unitId,
      unitName,
      score,
      percentage,
      certNumber,
      status: 'active',
      createdAt: serverTimestamp(),
      verifyUrl: `https://decisive-octane-472816-d3.web.app/verify?id=${certNumber}`
    };

    const docRef = await addDoc(collection(db, 'certificates'), certificateData);
    return { id: docRef.id, ...certificateData };
  }

  static async getCertificateByNumber(certNumber) {
    const q = query(
      collection(db, 'certificates'),
      where('certNumber', '==', certNumber),
      where('status', '==', 'active')
    );
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
    }
    return null;
  }

  static async checkUserCertificate(userId, unitId) {
    const q = query(
      collection(db, 'certificates'),
      where('userId', '==', userId),
      where('unitId', '==', unitId),
      where('status', '==', 'active')
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty ? querySnapshot.docs[0].data() : null;
  }
}
