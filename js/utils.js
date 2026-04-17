const API_BASE = "https://resume-analyzer-production-eea9.up.railway.app";

const getToken = () => localStorage.getItem('token');

const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const isLoggedIn = () => !!getToken();

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/index.html';   // ✅ FIXED
};

const redirectIfGuest = () => {
  if (!isLoggedIn()) {
    window.location.href = '/pages/auth.html';   // ✅ FIXED
  }
};

const renderNavbar = () => {
  const user = getUser();

  const themeToggle = `
    <button class="theme-toggle" onclick="toggleTheme()" id="themeBtn">🌙</button>
  `;

  if (user) {
    return `
      <nav>
        <a href="/index.html" class="nav-logo">Resume<span>IQ</span></a>
        <div class="nav-links">
          <a href="/pages/dashboard.html" class="nav-link">Dashboard</a>
          <a href="/pages/analyzer.html" class="nav-link">New Analysis</a>
          ${themeToggle}
          <div class="dropdown">
            <div class="nav-avatar" onclick="toggleDropdown()">${user.name.charAt(0).toUpperCase()}</div>
            <div class="dropdown-menu" id="dropdownMenu">
              <span class="dropdown-item" style="color: var(--text-secondary); font-size:12px;">${user.email}</span>
              <hr style="border-color: var(--border);">
              <a class="dropdown-item danger" onclick="logout()">Logout</a>
            </div>
          </div>
        </div>
      </nav>
    `;
  } else {
    return `
      <nav>
        <a href="/index.html" class="nav-logo">Resume<span>IQ</span></a>
        <div class="nav-links">
          <a href="/pages/analyzer.html" class="nav-link">Try Free</a>
          ${themeToggle}
          <div class="nav-guest">
            <a href="/pages/auth.html" class="btn-outline">Login</a>
            <a href="/pages/auth.html" class="btn-primary">Sign Up</a>
          </div>
        </div>
      </nav>
    `;
  }
};

const toggleDropdown = () => {
  document.getElementById('dropdownMenu').classList.toggle('open');
};

const toggleTheme = () => {
  const body = document.body;
  const isDark = body.getAttribute('data-theme') === 'dark';
  body.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
  document.getElementById('themeBtn').textContent = isDark ? '🌙' : '☀️';
};

const initTheme = () => {
  const saved = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', saved);
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = saved === 'dark' ? '☀️' : '🌙';
};

document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('dropdownMenu');
  if (dropdown && !e.target.closest('.dropdown')) {
    dropdown.classList.remove('open');
  }
});