
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCBeZZitpZ5S0QX9L7v44KTAPG-ZSr6x4M",
  authDomain: "webathon-968f6.firebaseapp.com",
  projectId: "webathon-968f6",
  storageBucket: "webathon-968f6.appspot.com",
  messagingSenderId: "307842537303",
  appId: "1:307842537303:web:7ac595e3be01f643325012",
  measurementId: "G-7SSFQCMNV6"
};


const app = initializeApp(firebaseConfig);
export default app;
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

