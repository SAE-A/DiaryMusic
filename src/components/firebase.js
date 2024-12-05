// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set } from "firebase/database";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

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

// Firebase Authentication 초기화 (AsyncStorage 사용)
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage), // AsyncStorage를 사용하여 인증 상태 유지
});

// Firebase 실시간 데이터베이스 초기화
const database = getDatabase(app);

export { database, ref, push, set, auth };