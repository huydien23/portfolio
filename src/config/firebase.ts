// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9f0gibSOX_yhgFcFWmA-5aijgT2KsJVo",
  authDomain: "cloud-portfolio-fd0d5.firebaseapp.com",
  projectId: "cloud-portfolio-fd0d5",
  storageBucket: "cloud-portfolio-fd0d5.firebasestorage.app",
  messagingSenderId: "779021418012",
  appId: "1:779021418012:web:2d715fc982cf62d3ede9d9",
  measurementId: "G-QQD050R0QS",
  databaseURL: "https://cloud-portfolio-fd0d5-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

export default app;