import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Cấu hình Firebase của bạn
const firebaseConfig = {
    apiKey: "AIzaSyBtn0L85dppZIolX8TNUhMntAfkYWyUTYY",
    authDomain: "phygen1.firebaseapp.com",
    projectId: "phygen1",
    storageBucket: "phygen1.appspot.com",
    messagingSenderId: "1077325853840",
    appId: "1:1077325853840:web:d96cb08fdafbf7154c1415"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Thêm cấu hình cho Google Provider
googleProvider.setCustomParameters({
    prompt: 'select_account'
}); 