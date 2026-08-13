import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { isSupported, getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCtbCNpk39MjhZkaVPOKjiovBexuO3_W_o",
  authDomain: "decisive-octane-472816-d3.web.app",
  projectId: "decisive-octane-472816-d3",
  storageBucket: "decisive-octane-472816-d3.firebasestorage.app",
  messagingSenderId: "338906119415",
  appId: "1:338906119415:web:2767a85e29b0b5b1a727f2",
  measurementId: "G-66V5HKTPD0"
};

const app = initializeApp(firebaseConfig);

// Initialize Analytics only if supported (avoids unhandled rejections in
// environments where remote-config fetch fails, e.g. ad-blockers or SSR).
let analytics = null;
(async () => {
  try {
    const supported = await isSupported();
    if (supported) {
      analytics = getAnalytics(app);
    }
  } catch (e) {
    console.warn('Analytics init skipped:', e.message);
  }
})();

export const auth = getAuth(app);
export const db = getFirestore(app);
export { analytics };
export default app;
