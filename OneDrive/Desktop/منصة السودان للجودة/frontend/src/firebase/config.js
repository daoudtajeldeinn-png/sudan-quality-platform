import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Sudan Quality Platform Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtbCNpk39MjhZkaVPOKjiovBexuO3_W_o",
  authDomain: "sudanqualityplatform-11938593.firebaseapp.com",
  projectId: "sudanqualityplatform-11938593",
  storageBucket: "sudanqualityplatform-11938593.firebasestorage.app",
  messagingSenderId: "338906119415",
  appId: "1:338906119415:web:2767a85e29b0b5b1a727f2",
  measurementId: "G-66V5HKTPD0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
