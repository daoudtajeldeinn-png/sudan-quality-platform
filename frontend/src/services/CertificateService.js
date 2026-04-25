import { db } from "../firebase/config";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import apiService from './api';

export class CertificateService {
<<<<<<< HEAD
<<<<<<< HEAD
  /**
   * Save certificate to MongoDB (Primary) and Firestore (Secondary/Mirror)
   */
  static async saveCertificate(userId, userName, unitId, unitName, score, percentage) {
    const certNumber = `SQP-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const certData = { userId, userName, unitId, unitName, score, percentage, certNumber, status: "active", createdAt: new Date().toISOString() };
    
    try {
      // 1. Save to MongoDB (Priority) - We'll add this endpoint to apiService if it doesn't exist
      await apiService.awardCertificate(certData);
      console.log("Certificate saved to MongoDB");
    } catch (e) {
      console.warn("MongoDB save failed, relying on Firestore fallback", e);
    }

    try {
      // 2. Mirror to Firestore for legacy compatibility
      const firestoreData = { ...certData, createdAt: serverTimestamp() };
      await addDoc(collection(db, "certificates"), firestoreData);
      console.log("Certificate mirrored to Firestore");
    } catch (e) {
      console.error("Firestore mirror failed", e);
    }

    return certData;
  }

  static async getCertificateByNumber(certNumber) {
    // 1. Always prioritize MongoDB (via Backend)
    try {
      const res = await apiService.verifyCertificateByNumber(certNumber);
      if (res && res.found) return { id: res.id, ...res.data };
    } catch (e) {
      console.warn('Backend lookup failed, falling back to Firestore:', e);
    }

    // 2. Fallback to direct Firestore lookup (Legacy)
    try {
      const q = query(collection(db, "certificates"), where("certNumber", "==", certNumber), where("status", "==", "active"));
      const snap = await getDocs(q);
      return !snap.empty ? { id: snap.docs[0].id, ...snap.docs[0].data() } : null;
    } catch (e) {
      console.error("Critical: Firestore lookup also failed", e);
      return null;
    }
  }

  static async checkUserCertificate(userId, unitId) {
    // 1. Always prioritize MongoDB (via Backend)
    try {
      const res = await apiService.getUserCertificates(userId);
      // Logic to find specific unit certificate in list
      if (res && res.certificates) {
        return res.certificates.find(c => c.unitId === unitId && c.status === 'active');
      }
    } catch (e) {
      console.warn('Backend user cert check failed, falling back to Firestore:', e);
    }

    // 2. Fallback to direct Firestore lookup (Legacy)
    try {
      const q = query(collection(db, "certificates"), where("userId", "==", userId), where("unitId", "==", unitId), where("status", "==", "active"));
      const snap = await getDocs(q);
      return !snap.empty ? snap.docs[0].data() : null;
    } catch (e) {
      return null;
=======
=======
  /**
   * Save certificate to MongoDB (Primary) and Firestore (Secondary/Mirror)
   */
>>>>>>> 6e99791776742434a56d4862508810f8b0037935
  static async saveCertificate(userId, userName, unitId, unitName, score, percentage) {
    const certNumber = `SQP-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const certData = { userId, userName, unitId, unitName, score, percentage, certNumber, status: "active", createdAt: new Date().toISOString() };
    
    try {
      // 1. Save to MongoDB (Priority) - We'll add this endpoint to apiService if it doesn't exist
      await apiService.awardCertificate(certData);
      console.log("Certificate saved to MongoDB");
    } catch (e) {
      console.warn("MongoDB save failed, relying on Firestore fallback", e);
    }

    try {
      // 2. Mirror to Firestore for legacy compatibility
      const firestoreData = { ...certData, createdAt: serverTimestamp() };
      await addDoc(collection(db, "certificates"), firestoreData);
      console.log("Certificate mirrored to Firestore");
    } catch (e) {
      console.error("Firestore mirror failed", e);
    }

    return certData;
  }

  static async getCertificateByNumber(certNumber) {
    // 1. Always prioritize MongoDB (via Backend)
    try {
      const res = await apiService.verifyCertificateByNumber(certNumber);
      if (res && res.found) return { id: res.id, ...res.data };
    } catch (e) {
      console.warn('Backend lookup failed, falling back to Firestore:', e);
    }

    // 2. Fallback to direct Firestore lookup (Legacy)
    try {
      const q = query(collection(db, "certificates"), where("certNumber", "==", certNumber), where("status", "==", "active"));
      const snap = await getDocs(q);
      return !snap.empty ? { id: snap.docs[0].id, ...snap.docs[0].data() } : null;
    } catch (e) {
      console.error("Critical: Firestore lookup also failed", e);
      return null;
    }
  }

  static async checkUserCertificate(userId, unitId) {
    // 1. Always prioritize MongoDB (via Backend)
    try {
      const res = await apiService.getUserCertificates(userId);
      // Logic to find specific unit certificate in list
      if (res && res.certificates) {
        return res.certificates.find(c => c.unitId === unitId && c.status === 'active');
      }
    } catch (e) {
      console.warn('Backend user cert check failed, falling back to Firestore:', e);
    }

    // 2. Fallback to direct Firestore lookup (Legacy)
    try {
      const q = query(collection(db, "certificates"), where("userId", "==", userId), where("unitId", "==", unitId), where("status", "==", "active"));
      const snap = await getDocs(q);
      return !snap.empty ? snap.docs[0].data() : null;
<<<<<<< HEAD
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
=======
    } catch (e) {
      return null;
>>>>>>> 6e99791776742434a56d4862508810f8b0037935
    }
  }
}
