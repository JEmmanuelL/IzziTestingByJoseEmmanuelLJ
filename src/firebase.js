import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBtcQwK1jgIte_pwIToQUF3kjtN13lnVoU",
  authDomain: "testingizzi.firebaseapp.com",
  projectId: "testingizzi",
  storageBucket: "testingizzi.firebasestorage.app",
  messagingSenderId: "29731891705",
  appId: "1:29731891705:web:9bb8be354e7c1ffd4ab528"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
