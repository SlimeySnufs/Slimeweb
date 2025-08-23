// ============================
// LoginAuthentication.js
// ============================

// Import auth from our firebase.js
import { auth } from "./firebase.js";
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// ----------------------------
// UI Helpers
// ----------------------------
function showStatus(msg, isError = false) {
  const statusEl = document.getElementById("status");
  if (!statusEl) return;
  statusEl.textContent = msg;
  statusEl.style.color = isError ? "#ff4d4d" : "#4dff88";
}

function handleAuthError(err) {
  console.error(err);
  switch (err.code) {
    case "auth/email-already-in-use":
      showStatus("Email is already registered.", true); break;
    case "auth/invalid-email":
      showStatus("Invalid email format.", true); break;
    case "auth/wrong-password":
      showStatus("Incorrect password.", true); break;
    case "auth/user-not-found":
      showStatus("No user found with this email.", true); break;
    case "auth/too-many-requests":
      showStatus("Too many login attempts. Try again later.", true); break;
    default:
      showStatus("Error: " + err.message, true);
  }
}

// ----------------------------
// Auth Actions
// ----------------------------
async function signup(email, password) {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    showStatus(`Signed up as ${userCred.user.email}`);
  } catch (err) {
    handleAuthError(err);
  }
}

async function login(email, password) {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    showStatus(`Logged in as ${userCred.user.email}`);
  } catch (err) {
    handleAuthError(err);
  }
}

async function logout() {
  try {
    await signOut(auth);
    showStatus("Logged out successfully.");
  } catch (err) {
    handleAuthError(err);
  }
}

// ----------------------------
// Detect login state
// ----------------------------
onAuthStateChanged(auth, (user) => {
  if (user) {
    showStatus(`User is logged in: ${user.email}`);
  } else {
    showStatus("Not logged in", true);
  }
});

// ----------------------------
// DOM Elements
// ----------------------------
const signupButton = document.getElementById("signup-button");
const loginButton = document.getElementById("login-button");
const logoutLink = document.getElementById("logout-link");
const forgotLink = document.getElementById("forgot-pass-link");
const showPassCheckbox = document.getElementById("show-password");
const passwordInput = document.getElementById("password");
const mainpageButton = document.getElementById("mainpage-button");

// Show/hide password
showPassCheckbox?.addEventListener("change", () => {
  passwordInput.type = showPassCheckbox.checked ? "text" : "password";
});

// ----------------------------
// Event Listeners
// ----------------------------
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

// Navigate to main page
mainpageButton?.addEventListener("click", () => {
  window.location.href = "mainpage.html";
});
