document.getElementById('login-form').onsubmit = function(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const errorDiv = document.getElementById('login-error');
  errorDiv.textContent = '';
  fetch('login.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username, password})
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      window.location.href = "admin.html";
    } else {
      errorDiv.textContent = data.error || "Login failed";
    }
  })
  .catch(() => {
    errorDiv.textContent = "Network error. Please try again.";
  });
};