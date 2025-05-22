import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTgdZDyNWEeBTf7a7I8IiaZO1wSGZkJqk",
  authDomain: "prodhub-4d8ef.firebaseapp.com",
  projectId: "prodhub-4d8ef",
  storageBucket: "prodhub-4d8ef.firebasestorage.com",
  messagingSenderId: "1040135094109",
  appId: "1:1040135094109:web:054570cba0577300faf2b4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;