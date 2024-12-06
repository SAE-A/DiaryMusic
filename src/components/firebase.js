// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set } from "firebase/database";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Firestore 가져오기
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyANeegQOvFkQPIhlq4ld5_yWevJeGvbU3I",
    authDomain: "mastermb-4ee54.firebaseapp.com",
    databaseURL: "https://mastermb-4ee54-default-rtdb.firebaseio.com",
    projectId: "mastermb-4ee54",
    storageBucket: "mastermb-4ee54.firebasestorage.app",
    messagingSenderId: "1073194397184",
    appId: "1:1073194397184:web:ac0f3a0f26b6e2c7e872e5",
    measurementId: "G-5MG0N743KK"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firebase Authentication 초기화 (AsyncStorage 사용)
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Firebase 실시간 데이터베이스 초기화
const database = getDatabase(app);

// Firebase Firestore 초기화
const db = getFirestore(app); // Firestore 인스턴스 생성

export { database, ref, push, set, auth, db }; // Firestore를 export
