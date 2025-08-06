// Firebase SDK imports
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  browserLocalPersistence
} from "firebase/auth";

// ✅ Firebase config via environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

console.log("🔥 Firebase config loaded:", firebaseConfig);


// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Firestore
const db = getFirestore(app);

// ✅ Auth
const auth = getAuth(app);

// ✅ Enable offline persistence (safe fallback)
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.warn("Multiple tabs open. Persistence can only be enabled in one tab.");
  } else {
    console.error("Persistence error:", err);
  }
});

// ✅ Disable Recaptcha during development (localhost only)
try {
  if (window.location.hostname === "localhost" && auth?.settings) {
    auth.settings.appVerificationDisabledForTesting = true;
  }
} catch (error) {
  console.warn("Cannot disable Recaptcha verification for testing:", error);
}

// ✅ Export everything needed
export {
  db,
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  browserLocalPersistence
};
