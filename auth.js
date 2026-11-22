
/* =====================================================
   CLUB MANAGEMENT SYSTEM
   Authentication JavaScript
   File: auth.js
   ===================================================== */


/* ---------- 1. LOGIN FORM ---------- */

// Find the login form and message element
const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

// Run when the login form is submitted
if (loginForm && loginMessage) {

  loginForm.addEventListener("submit", function (event) {

    // Prevent the browser from refreshing the page
    event.preventDefault();

    // Get the entered email and password
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    // Reset previous message
    loginMessage.className = "form-message";
    loginMessage.textContent = "";

    // Check whether the fields are empty
    if (email === "" || password === "") {

      loginMessage.textContent = "Please fill in all the fields.";
      loginMessage.classList.add("error");

      return;
    }

    // Basic email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

      loginMessage.textContent = "Please enter a valid email address.";
      loginMessage.classList.add("error");

      return;
    }

    // Check minimum password length
    if (password.length < 6) {

      loginMessage.textContent = "Password must contain at least 6 characters.";
      loginMessage.classList.add("error");

      return;
    }

    // Frontend demonstration only
    loginMessage.textContent =
      "Your form has been validated successfully! Real login authentication will be added later.";

    loginMessage.classList.add("success");

  });

}


/* ---------- 2. FORGOT PASSWORD LINK ---------- */

const forgotPasswordLink = document.getElementById("forgot-password");

if (forgotPasswordLink) {

  forgotPasswordLink.addEventListener("click", function (event) {

    // Prevent the placeholder link from navigating
    event.preventDefault();

    alert("Password recovery functionality will be added in a future stage.");

  });

}


/* =====================================================
   END OF AUTHENTICATION JAVASCRIPT
   ===================================================== */
