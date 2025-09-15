// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzMKhuyXTdCUknzPwbdE9yIHpjrkoJ0dw",
  authDomain: "cards-f8d41.firebaseapp.com",
  projectId: "cards-f8d41",
  storageBucket: "cards-f8d41.firebasestorage.app",
  messagingSenderId: "370615635092",
  appId: "1:370615635092:web:4ced3c18d9e807db707881",
  measurementId: "G-6087SJ4KH1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (only in browser)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
