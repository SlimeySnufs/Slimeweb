// ============================
// ClickerSystem.js (Firebase version)
// ============================

// HTML elements
const target = document.getElementById("target");
const scoreEl = document.getElementById("score");
let currentUser = null;

// Local state split into:
// - baseScore: last *committed* score in Firestore
// - pendingDelta: clicks since last successful commit
let baseScore = 0;
let pendingDelta = 0;

// Import Firebase
import { auth, db } from "/assets/js/Firebase/firebase.js";
import { doc, getDoc, setDoc, updateDoc, increment, onSnapshot } 
  from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// ----------------------------
// LocalStorage helpers
// ----------------------------
const LS_BASE = uid => `clicker:base:${uid}`;
const LS_PENDING = uid => `clicker:pending:${uid}`;

function writeLocal(uid, base, pending) {
  localStorage.setItem(LS_BASE(uid), String(base));
  localStorage.setItem(LS_PENDING(uid), String(pending));
}

function readLocal(uid) {
  const base = parseInt(localStorage.getItem(LS_BASE(uid)) || "0", 10);
  const pending = parseInt(localStorage.getItem(LS_PENDING(uid)) || "0", 10);
  return { base, pending };
}

function updateUI() {
  scoreEl.textContent = `Score: ${baseScore + pendingDelta}`;
}

// ----------------------------
// Target movement
// ----------------------------
function moveTarget() {
  const padding = 10;
  const rect = target.getBoundingClientRect();
  const maxX = window.innerWidth - rect.width - padding;
  const maxY = window.innerHeight - rect.height - padding;
  const x = Math.random() * (maxX - padding) + padding;
  const y = Math.random() * (maxY - padding) + padding;
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
}

// ----------------------------
// Score handling (clicks)
// ----------------------------
const addScore = (e) => {
  e.preventDefault();
  if (!currentUser) return;

  pendingDelta += 1; // not committed yet
  writeLocal(currentUser.uid, baseScore, pendingDelta);
  updateUI();
  moveTarget();
};

// ----------------------------
// Firestore helpers
// ----------------------------
async function saveDeltaFirestore(userId, delta) {
  if (!userId || delta === 0) return;
  const scoreRef = doc(db, "scores", userId);
  try {
    await updateDoc(scoreRef, { value: increment(delta) });
  } catch (err) {
    if (err.code === "not-found") {
      await setDoc(scoreRef, { value: delta });
    } else {
      throw err;
    }
  }
}

async function loadRemoteFirestore(userId) {
  if (!userId) return 0;
  const snap = await getDoc(doc(db, "scores", userId));
  return snap.exists() ? (snap.data().value || 0) : 0;
}

// ----------------------------
// Flush logic (commit pendingDelta)
// ----------------------------
let saveInterval = null;

async function flushScore() {
  if (!currentUser) return;
  const { base, pending } = readLocal(currentUser.uid);
  if (pending <= 0) return;

  try {
    await saveDeltaFirestore(currentUser.uid, pending);
    baseScore = Math.max(baseScore, base) + pending;
    pendingDelta = 0;
    writeLocal(currentUser.uid, baseScore, pendingDelta);
    updateUI();
  } catch (err) {
    console.error("[Firestore] Failed to flush score:", err);
  }
}

// ----------------------------
// Exit-safe persistence
// ----------------------------
function persistOnExit() {
  if (!currentUser) return;
  writeLocal(currentUser.uid, baseScore, pendingDelta);
}

window.addEventListener("pagehide", persistOnExit);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") persistOnExit();
});
window.addEventListener("beforeunload", persistOnExit);

// ----------------------------
// Intercept button navigation
// ----------------------------
function attachNavSave(buttonId, redirectUrl) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    await flushScore();
    window.location.href = redirectUrl;
  });
}

attachNavSave("mainpageBtn", "/mainpage/");

// Optional: intercept all internal <a> links
document.addEventListener("click", async (e) => {
  const a = e.target.closest("a");
  if (!a) return;
  const sameOrigin = a.origin === window.location.origin;
  const sameTab = !a.target || a.target === "_self";
  const normalClick = e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
  if (sameOrigin && sameTab && normalClick && a.href) {
    e.preventDefault();
    await flushScore();
    window.location.href = a.href;
  }
}, true);

// ----------------------------
// Auth + initial load
// ----------------------------
let unsubscribe = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "loginpage.html";
    return;
  }

  currentUser = user;

  // Restore local state
  const local = readLocal(user.uid);
  baseScore = local.base || 0;
  pendingDelta = local.pending || 0;

  // Load Firestore remote and reconcile
  const remoteVal = await loadRemoteFirestore(user.uid);
  if (remoteVal > baseScore) {
    baseScore = remoteVal;
    writeLocal(user.uid, baseScore, pendingDelta);
  }
  updateUI();

  // Real-time listener
  if (unsubscribe) unsubscribe();
  unsubscribe = onSnapshot(doc(db, "scores", user.uid), (snap) => {
    const remote = snap.exists() ? (snap.data().value || 0) : 0;
    if (remote > baseScore) {
      baseScore = remote;
      writeLocal(user.uid, baseScore, pendingDelta);
      updateUI();
    }
  });

  // Periodic flush
  if (!saveInterval) saveInterval = setInterval(flushScore, 15000);
});

// ----------------------------
// UI events
// ----------------------------
target.addEventListener("click", addScore);
target.addEventListener("touchstart", addScore, { passive: false });
window.addEventListener("resize", moveTarget);
moveTarget();
