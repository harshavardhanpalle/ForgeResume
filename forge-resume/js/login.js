document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.auth-tab');
  const panels = document.querySelectorAll('.auth-panel');
  const card = document.querySelector('.auth-card');
  const success = document.getElementById('authSuccess');
  const successTitle = document.getElementById('authSuccessTitle');
  const successBody = document.getElementById('authSuccessBody');
  const resetBtn = document.getElementById('authReset');

  // URL hash support: login.html#signup opens the signup tab directly
  if (window.location.hash === '#signup') {
    activateTab('signup');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab.getAttribute('data-tab')));
  });

  function activateTab(name) {
    tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === name));
    panels.forEach(p => p.classList.toggle('active', p.getAttribute('data-panel') === name));
  }

  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showSuccess('Welcome back.', 'This is a UI-only demo, so no real session was created — but in a live deployment you\'d land in your resume dashboard now.');
  });

  document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showSuccess('Welcome to Forge.', 'This is a UI-only demo, so no account was actually created — but in a real deployment you\'d land in the resume editor right now.');
  });

  function showSuccess(title, body) {
    successTitle.textContent = title;
    successBody.textContent = body;
    document.querySelectorAll('.auth-tabs, .auth-panel').forEach(el => el.style.display = 'none');
    success.classList.add('show');
  }

  resetBtn.addEventListener('click', () => {
    success.classList.remove('show');
    document.querySelector('.auth-tabs').style.display = 'flex';
    activateTab('login');
    document.querySelectorAll('.auth-panel').forEach(p => p.style.display = '');
  });
});
