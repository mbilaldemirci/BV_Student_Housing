const API_BASE = 'http://localhost:4000';

const loginForm = document.getElementById('loginForm');
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const loginMsgEl = document.getElementById('login-message');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = loginEmailInput.value.trim();
    const password = loginPasswordInput.value;

    if (!email || !password) {
      loginMsgEl.textContent = 'Please fill in both fields.';
      loginMsgEl.style.color = 'red';
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        loginMsgEl.textContent = data.error || 'Login failed';
        loginMsgEl.style.color = 'red';
      } else {
        loginMsgEl.textContent = 'Login successful';
        loginMsgEl.style.color = 'green';

        console.log('Logged in user:', data.user);

        // optional redirect after login:
        // setTimeout(() => window.location.href = 'index.html', 1000);
      }
    } catch (err) {
      console.error(err);
      loginMsgEl.textContent = 'Network error. Try again later.';
      loginMsgEl.style.color = 'red';
    }
  });
}
