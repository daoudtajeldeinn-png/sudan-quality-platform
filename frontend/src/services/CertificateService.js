import { db } from "../firebase/config";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import apiService from './api';

export class CertificateService {
  static async saveCertificate(userId, userName, unitId, unitName, score, percentage) {
    const certNumber = `SQP-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const certData = { userId, userName, unitId, unitName, score, percentage, certNumber, status: "active", createdAt: serverTimestamp() };
    const docRef = await addDoc(collection(db, "certificates"), certData);
    return { id: docRef.id, ...certData };
  }
  static async getCertificateByNumber(certNumber) {
    // prefer backend verification endpoint
    try {
      const res = await apiService.verifyCertificateByNumber(certNumber);
      if (res && res.found) return { id: res.id, ...res.data };
      return null;
    } catch (e) {
      // fallback to direct Firestore lookup
      const q = query(collection(db, "certificates"), where("certNumber", "==", certNumber), where("status", "==", "active"));
      const snap = await getDocs(q);
      return !snap.empty ? { id: snap.docs[0].id, ...snap.docs[0].data() } : null;
    }
  }
  static async checkUserCertificate(userId, unitId) {
    try {
      const res = await apiService.checkUserCertificate(userId, unitId);
      if (res && res.found) return res.data;
      return null;
    } catch (e) {
      const q = query(collection(db, "certificates"), where("userId", "==", userId), where("unitId", "==", unitId), where("status", "==", "active"));
      const snap = await getDocs(q);
      return !snap.empty ? snap.docs[0].data() : null;
    }
  }
}
