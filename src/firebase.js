// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "@firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: "online-shop-fdb92.firebaseapp.com",
    projectId: "online-shop-fdb92",
    storageBucket: "online-shop-fdb92.appspot.com",
    messagingSenderId: "1008680065923",
    appId: "1:1008680065923:web:3741513bae1bb692df74b6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Lấy dữ liệu từ database realtime
export const database = getDatabase(app);
// Xác thực auth trên firebase
export const auth = getAuth(app);
// Lấy Filestore từ firestore database để lưu tài khoản người dùng sau khi auth
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
