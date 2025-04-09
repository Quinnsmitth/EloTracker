import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBKhesP91pSeoMqvVePDy4ZCAWZw_HZFKI",
    authDomain: "elotracker-26af7.firebaseapp.com",
    projectId: "elotracker-26af7",
    storageBucket: "elotracker-26af7.firebasestorage.app",
    messagingSenderId: "750404308071",
    appId: "1:750404308071:web:adedf4d59e2aea03f6d8c2",
    measurementId: "G-10Y3YH60YR"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const firestore = getFirestore(app);
const db = getDatabase();

export { app, auth, firestore, db};