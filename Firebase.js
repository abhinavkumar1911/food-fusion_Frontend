// src/Firebase.js

// Firebase SDK imports
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

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
const app = initializeApp(firebaseConfig);

// Analytics (conditionally initialize)
let analytics = null;
isAnalyticsSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

// Firestore + offline persistence
const db = getFirestore(app);
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open. IndexedDB persistence only works in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('Current browser does not support IndexedDB persistence.');
  }
});

// Auth
const auth = getAuth(app);

// ✅ Safe dev-only test setting for OTP
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  try {
    auth.settings.appVerificationDisabledForTesting = true;
  } catch (err) {
    console.warn("Warning: Cannot disable app verification for testing", err);
  }
}

// Exports
export {
  auth,
  db,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
};
