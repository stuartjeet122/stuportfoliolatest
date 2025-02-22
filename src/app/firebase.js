import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZGaCOG4UToh7i4BHfClouVIaElq0DM44",
  authDomain: "stuportfolio-2733c.firebaseapp.com",
  databaseURL: "https://stuportfolio-2733c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "stuportfolio-2733c",
  storageBucket: "stuportfolio-2733c.appspot.com",
  messagingSenderId: "1074803399029",
  appId: "1:1074803399029:web:355664373bd5f145761b3c",
  measurementId: "G-KT218WYNY6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Only initialize Firebase Analytics on the client-side
let analytics;
if (typeof window !== "undefined" && typeof window.navigator !== "undefined") {
  analytics = getAnalytics(app);
}

// Initialize Firestore
const db = getFirestore(app);

export { db, analytics };
