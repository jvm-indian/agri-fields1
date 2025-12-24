import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyATNgrs_n2nbsvNW5FP50E0rZdhVUyioXs",
  authDomain: "agriculture-9176a.firebaseapp.com",
  projectId: "agriculture-9176a",
  storageBucket: "agriculture-9176a.firebasestorage.app",
  messagingSenderId: "289322856794",
  appId: "1:289322856794:web:7c3130ff940f28b60d0363"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;