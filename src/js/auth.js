import { createClient } from '@supabase/supabase-js';

// ✅ Supabase Initialization using .env variables
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

// ✅ Check auth state and show/hide sections
async function checkAuthAndToggleForm() {
  const { data: { user } } = await supabase.auth.getUser();

  const loginSection = document.getElementById('auth-section');
  const appointmentSection = document.getElementById('appointment');
  const logoutContainer = document.getElementById('logout-container');

  if (user) {
    loginSection.style.display = 'none';
    appointmentSection.style.display = 'block';
    logoutContainer.style.display = 'block';
  } else {
    loginSection.style.display = 'block';
    appointmentSection.style.display = 'none';
    logoutContainer.style.display = 'none';
  }
}

// ✅ Handle Login
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  console.log("🔐 Logging in:", email);

  const { error, data } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("❌ Login failed:", error.message);
    showToast("❌ Login failed: " + error.message, "error");
    return;
  }

  showToast("✅ You have logged in!");
  checkAuthAndToggleForm();
}

// ✅ Handle Register
async function handleRegister(event) {
  event.preventDefault();

  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  console.log("📝 Registering:", email);

  const { error, data } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error("❌ Registration failed:", error.message);
    showToast("❌ Registration failed: " + error.message, "error");
    return;
  }

  showToast("✅ Registered! Please check your email.");
}

// ✅ Handle Logout
async function handleLogout() {
  await supabase.auth.signOut();

  // Reset UI
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
  document.getElementById('register-email').value = '';
  document.getElementById('register-password').value = '';

  checkAuthAndToggleForm();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast("You have logged out.");
}

// ✅ Toggle Forms
function toggleToRegister(event) {
  event.preventDefault();
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'flex';
}

function toggleToLogin(event) {
  event.preventDefault();
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('login-form').style.display = 'flex';
}

// ✅ Toast Notification Helper
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.textContent = message;

  toast.style.padding = "12px 20px";
  toast.style.borderRadius = "8px";
  toast.style.color = "#fff";
  toast.style.minWidth = "200px";
  toast.style.maxWidth = "300px";
  toast.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
  toast.style.fontSize = "14px";
  toast.style.opacity = "0.95";
  toast.style.transition = "transform 0.3s ease, opacity 0.3s ease";
  toast.style.transform = "translateY(0)";
  toast.style.backgroundColor = type === "error" ? "#b33427" : "#2ecc71";

  const container = document.getElementById("toast-container") || document.body;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ✅ DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
  checkAuthAndToggleForm();

  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const logoutBtn = document.getElementById('logout-btn');
  const toggleToRegisterLink = document.getElementById('toggle-to-register');
  const toggleToLoginLink = document.getElementById('toggle-to-login');

  if (loginForm) loginForm.onsubmit = handleLogin;
  if (registerForm) registerForm.onsubmit = handleRegister;
  if (logoutBtn) logoutBtn.onclick = handleLogout;
  if (toggleToRegisterLink) toggleToRegisterLink.onclick = toggleToRegister;
  if (toggleToLoginLink) toggleToLoginLink.onclick = toggleToLogin;
});
