const API_BASE = 'http://localhost:4000';

const registerForm = document.getElementById('registerForm');
const usernameInput = document.getElementById('reg-username');
const emailInput = document.getElementById('reg-email');
const passwordInput = document.getElementById('reg-password');
const messageEl = document.getElementById('register-message');

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!username || !email || !password) {
      messageEl.textContent = 'Please fill in all fields.';
      messageEl.style.color = 'red';
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        messageEl.textContent = data.error || 'Registration failed';
        messageEl.style.color = 'red';
      } else {
        messageEl.textContent = 'Registered successfully. You can log in now.';
        messageEl.style.color = 'green';

      }
    } catch (err) {
      console.error(err);
      messageEl.textContent = 'Network error. Try again later.';
      messageEl.style.color = 'red';
    }
  });
}
