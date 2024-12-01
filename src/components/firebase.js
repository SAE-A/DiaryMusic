// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCEXTyoQ_WoK8ViGvIom7MV4iVcKD9It2k",
    authDomain: "pj01-8ecc7.firebaseapp.com",
    projectId: "pj01-8ecc7",
    storageBucket: "pj01-8ecc7.firebasestorage.app",
    messagingSenderId: "614174998325",
    appId: "1:614174998325:web:e9708b50a3f1096159167c",
    measurementId: "G-V10FWWGDCF",
    databaseURL: "https://pj01-8ecc7-default-rtdb.firebaseio.com/"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };