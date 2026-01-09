let isLoginMode = true;

const formTitle = document.getElementById("formTitle");
const toggleText = document.getElementById("toggleText");
const toggleMode = document.getElementById("toggleMode");
const submitBtn = document.getElementById("submitBtn");

toggleMode.addEventListener("click", e => {
  e.preventDefault();
  isLoginMode = !isLoginMode;

  if (isLoginMode) {
    formTitle.textContent = "Login";
    submitBtn.textContent = "Login";
    toggleText.textContent = "New here?";
    toggleMode.textContent = "Sign up";
  } else {
    formTitle.textContent = "Sign Up";
    submitBtn.textContent = "Register";
    toggleText.textContent = "Already have an account?";
    toggleMode.textContent = "Login";
  }
});

document.getElementById("authForm").addEventListener("submit", e => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (isLoginMode) {
    const user = users.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      alert("Invalid email or password");
      return;
    }

    // ✅ SESSION LOGIN
    sessionStorage.setItem("email", user.email);
    sessionStorage.setItem("username", user.username);

    window.location.href = "index.html";

  } else {
    const exists = users.some(u => u.email === email);
    if (exists) {
      alert("User already exists");
      return;
    }

    const username = prompt("Choose a username");
    if (!username) return;

    users.push({ email, password, username });
    localStorage.setItem("users", JSON.stringify(users));

    sessionStorage.setItem("email", email);
    sessionStorage.setItem("username", username);

    window.location.href = "index.html";
  }
});
