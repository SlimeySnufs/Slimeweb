import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCTVSoGt3d4QY9OZd3v3tFoZe5trhFeHkw",
  authDomain: "slimeweb-52397.firebaseapp.com",
  projectId: "slimeweb-52397",
  storageBucket: "slimeweb-52397.firebasestorage.app",
  messagingSenderId: "344893534568",
  appId: "1:344893534568:web:8b124d5d41805141abe6dd",
  measurementId: "G-09ZGF6B0R0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Utility: show status message
function showStatus(msg, isError = false) {
  const statusEl = document.getElementById("status");
  if (!statusEl) return;
  statusEl.textContent = msg;
  statusEl.style.color = isError ? "#ff4d4d" : "#4dff88"; // red or green
}

// Centralized error handler
function handleAuthError(err) {
  console.error(err);
  switch(err.code) {
    case "auth/email-already-in-use":
      showStatus("Email is already registered.", true);
      break;
    case "auth/invalid-email":
      showStatus("Invalid email format.", true);
      break;
    case "auth/wrong-password":
      showStatus("Incorrect password.", true);
      break;
    case "auth/user-not-found":
      showStatus("No user found with this email.", true);
      break;
    case "auth/too-many-requests":
      showStatus("Too many login attempts. Try again later.", true);
      break;
    default:
      showStatus("Error: " + err.message, true);
  }
}

// Sign up
async function signup(email, password) {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    showStatus(`Signed up as ${userCred.user.email}`);
  } catch (err) {
    handleAuthError(err);
  }
}

// Log in
async function login(email, password) {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    showStatus(`Logged in as ${userCred.user.email}`);
  } catch (err) {
    handleAuthError(err);
  }
}

// Log out
async function logout() {
  try {
    await signOut(auth);
    showStatus("Logged out successfully.");
  } catch (err) {
    handleAuthError(err);
  }
}

// Detect login state
onAuthStateChanged(auth, (user) => {
  if (user) {
    showStatus(`User is logged in: ${user.email}`);
  } else {
    showStatus("Not logged in", true);
  }
});

// DOM elements
const signupButton = document.getElementById("signup-button");
const loginButton = document.getElementById("login-button");
const logoutLink = document.getElementById("logout-link");
const forgotLink = document.getElementById("forgot-pass-link");
const showPassCheckbox = document.getElementById("show-password");
const passwordInput = document.getElementById("password");
const mainpageButton = document.getElementById("mainpage-button");

// Show/hide password
showPassCheckbox.addEventListener("change", () => {
  passwordInput.type = showPassCheckbox.checked ? "text" : "password";
});

// Button hooks
signupButton?.addEventListener("click", () => {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;
  if (!email || !password) return showStatus("Enter email and password.", true);
  signup(email, password);
});

loginButton?.addEventListener("click", () => {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;
  if (!email || !password) return showStatus("Enter email and password.", true);
  login(email, password);
});

logoutLink?.addEventListener("click", () => logout());

// Forgot password
forgotLink?.addEventListener("click", () => {
  const email = document.getElementById("email")?.value;
  if (!email) return alert("Enter your email to reset password.");
  sendPasswordResetEmail(auth, email)
    .then(() => alert("Password reset email sent!"))
    .catch(err => alert("Error: " + err.message));
});

// Main page button
mainpageButton?.addEventListener("click", () => {
    window.location.href = "sidepage.html";
    window.history.pushState(null, "", window.location.href);
});
