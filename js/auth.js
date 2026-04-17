const switchTab = (tab) => {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const loginTab = document.getElementById('loginTab');
  const signupTab = document.getElementById('signupTab');

  if (tab === 'login') {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
  } else {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
  }
};

// 🔐 LOGIN
const handleLogin = async () => {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const errorEl = document.getElementById('loginError');

  errorEl.textContent = '';

  if (!email || !password) {
    errorEl.textContent = 'Please fill in all fields';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.message || 'Login failed';
      return;
    }

    // ✅ Save user
    localStorage.setItem('token', data.token);
    localStorage.setItem(
      'user',
      JSON.stringify({ name: data.name, email: data.email })
    );

    // ✅ Redirect
    window.location.href = 'dashboard.html';

  } catch (err) {
    console.error(err);
    errorEl.textContent = 'Something went wrong. Try again.';
  }
};

// 🆕 SIGNUP
const handleSignup = async () => {
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value.trim();
  const errorEl = document.getElementById('signupError');

  errorEl.textContent = '';

  if (!name || !email || !password) {
    errorEl.textContent = 'Please fill in all fields';
    return;
  }

  if (password.length < 6) {
    errorEl.textContent = 'Password must be at least 6 characters';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.message || 'Signup failed';
      return;
    }

    // ✅ Save user
    localStorage.setItem('token', data.token);
    localStorage.setItem(
      'user',
      JSON.stringify({ name: data.name, email: data.email })
    );

    // ✅ Redirect
    window.location.href = 'dashboard.html';

  } catch (err) {
    console.error(err);
    errorEl.textContent = 'Something went wrong. Try again.';
  }
};