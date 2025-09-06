console.log('script.js loaded');
// On page load, check for token and familyId and redirect accordingly
window.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('token');
  const familyId = localStorage.getItem('familyId');
  const current = window.location.pathname.split('/').pop();
  if (token && familyId && current !== 'dashboard.html') {
    window.location.href = 'dashboard.html';
  } else if (token && !familyId && current !== 'community.html') {
    window.location.href = 'community.html';
  } else if (!token && current !== 'index.html') {
    window.location.href = 'index.html';
  }
  // Redirect to community page if familyId exists in localStorage
  if (localStorage.getItem('familyId')) {
    window.location.href = 'community.html';
  }
});
function showLogin() {
  document.getElementById("signupBox").style.display = "none";
  document.getElementById("loginBox").style.display = "block";
}

function showSignup() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("signupBox").style.display = "block";
}

// Password validation rules
function validatePassword(password) {
  const rules = [
    /.{8,}/,        // At least 8 characters
    /[A-Z]/,        // At least one uppercase letter
    /[a-z]/,        // At least one lowercase letter
    /[0-9]/,        // At least one number
    /[!@#$%^&*]/    // At least one special character
  ];
  return rules.every(rule => rule.test(password));
}

function signup() {
  let username = document.getElementById("signupUsername").value;
  let email = document.getElementById("signupEmail").value;
  let password = document.getElementById("signupPassword").value;
  let confirmPassword = document.getElementById("signupConfirm").value;
  let passwordRules = document.getElementById("passwordRules");

  if (!validatePassword(password)) {
    passwordRules.style.display = "block";
    alert("Password does not meet the required rules.");
    return;
  } else {
    passwordRules.style.display = "none";
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // Backend signup
  fetch('https://node-hackathon-backend.vercel.app/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        // Store familyId if present
        if (data.familyId) {
          localStorage.setItem('familyId', data.familyId);
        }
        alert('Sign Up Successful!');
        window.location.href = 'community.html';
      } else {
        alert(data.message || 'Sign Up failed');
      }
    })
    .catch(() => alert('Sign Up failed'));
}

function login() {
  let username = document.getElementById("loginUsername").value;
  let password = document.getElementById("loginPassword").value;

  if (username === "" || password === "") {
    alert("Please fill in both fields.");
    return;
  }

  // Backend login
  fetch('https://node-hackathon-backend.vercel.app/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      console.log('Login response:', data);
      if (data.token) {
        localStorage.setItem('token', data.token);
        // Store familyId if present
        if ( data.familyId) {
          localStorage.setItem('familyId', data.familyId);
          alert('Login Successful!');
          window.location.href = 'dashboard.html';
          return;
        }
        alert('Login Successful!');
        window.location.href = 'community.html';
      } else {
        alert(data.message || 'Login failed');
      }
    })
    .catch(() => alert('Login failed'));
}