import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set } from "firebase/database";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCNZwVUDtrgYzAGboKbA47EeYFPAKGhw5I",
  authDomain: "diarymusic-ab59a.firebaseapp.com",
  databaseURL: "https://diarymusic-ab59a-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "diarymusic-ab59a",
  storageBucket: "diarymusic-ab59a.firebasestorage.app",
  messagingSenderId: "749717686670",
  appId: "1:749717686670:web:f3ceeccd9935ff8b1ffcdf"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, ref, push, set, auth };