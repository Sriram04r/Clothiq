import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAw67Qp_CSTIYCq-3s7EIXC8kZQ6ll7GpA",
  authDomain: "clothiq-7314a.firebaseapp.com",
  projectId: "clothiq-7314a",
  storageBucket: "clothiq-7314a.firebasestorage.app",
  messagingSenderId: "930212381030",
  appId: "1:930212381030:web:1234567890abcdef" // Dummy web app ID to satisfy initialization
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
