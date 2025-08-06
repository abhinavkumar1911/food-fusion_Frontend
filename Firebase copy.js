// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore,enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
console.log("FIREBASE CONFIG:", firebaseConfig);
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db =getFirestore(app)
const auth = getAuth(app);


// ✅ Safely apply test setting (fixes the error you're getting)
try {
  if (window.location.hostname === "localhost" && auth.settings) {
    auth.settings.appVerificationDisabledForTesting = true;
  }
} catch (error) {
  console.warn("Warning: Cannot set appVerificationDisabledForTesting", error);
}

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  }})
export { auth, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber };

