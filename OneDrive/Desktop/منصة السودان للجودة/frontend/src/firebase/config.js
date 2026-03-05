import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Sudan Quality Platform Configuration
// استبدل هذه البيانات ببياناتك الحقيقية من Firebase Studio
const firebaseConfig = {
  apiKey: "AIzaSyBexample-example-example-example",
  authDomain: "sudanqualityplatform.firebaseapp.com",
  projectId: "sudanqualityplatform",
  storageBucket: "sudanqualityplatform.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
