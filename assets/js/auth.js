// ─────────────────────────────────────────────────────────────
// FotoGrids Dashboard — Password gate
const DASHBOARD_PASSWORD = 'm0ndrian';
// ─────────────────────────────────────────────────────────────
const TOKEN_KEY = 'fg_dash_auth';

function checkAuth() {
  if (sessionStorage.getItem(TOKEN_KEY) !== 'unlocked') {
    document.getElementById('auth-overlay').style.display = 'flex';
  }
}

function submitPassword() {
  const input = document.getElementById('auth-input').value;
  if (input === DASHBOARD_PASSWORD) {
    sessionStorage.setItem(TOKEN_KEY, 'unlocked');
    document.getElementById('auth-overlay').style.display = 'none';
    document.getElementById('auth-error').style.display = 'none';
  } else {
    document.getElementById('auth-error').style.display = 'block';
    document.getElementById('auth-input').focus();
  }
}

document.addEventListener('DOMContentLoaded', checkAuth);
