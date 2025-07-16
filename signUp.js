document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signupForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !email || !password) {
      alert("Please fill in all fields!");
      return;
    }

    // Save user data (mocked with localStorage)
    const userData = { username, email, password };
    localStorage.setItem("user_" + username, JSON.stringify(userData));

    // alert("Account created successfully!");
    form.reset();
    window.location.href = "Hompage.html"; // Redirect to homepage
  });
});
