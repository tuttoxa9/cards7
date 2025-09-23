// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
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

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
