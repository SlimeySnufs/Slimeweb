// ============================
// firebase.js
// ============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCTVSoGt3d4QY9OZd3v3tFoZe5trhFeHkw",
  authDomain: "slimeweb-52397.firebaseapp.com",
  projectId: "slimeweb-52397",
  storageBucket: "slimeweb-52397.appspot.com",
  messagingSenderId: "344893534568",
  appId: "1:344893534568:web:8b124d5d41805141abe6dd",
  measurementId: "G-09ZGF6B0R0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
