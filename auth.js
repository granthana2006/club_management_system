
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

/* ---------- 3. REGISTRATION FORM ---------- */

// Find the registration form and message element
const registerForm = document.getElementById("register-form");
const registerMessage = document.getElementById("register-message");

if (registerForm && registerMessage) {

  registerForm.addEventListener("submit", function (event) {

    // Prevent page refresh
    event.preventDefault();

    // Get registration details
    const fullName = document.getElementById("register-name").value.trim();

    const email = document.getElementById("register-email").value.trim();

    const studentId = document.getElementById("student-id").value.trim();

    const department = document.getElementById("department").value;

    const password = document.getElementById("register-password").value;

    const confirmPassword = document.getElementById("confirm-password").value;

    const termsAccepted = document.getElementById("terms").checked;

    // Reset previous message
    registerMessage.className = "form-message";
    registerMessage.textContent = "";

    // Check empty fields
    if (
      fullName === "" ||
      email === "" ||
      studentId === "" ||
      department === "" ||
      password === "" ||
      confirmPassword === ""
    ) {

      registerMessage.textContent = "Please fill in all the fields.";
      registerMessage.classList.add("error");

      return;
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

      registerMessage.textContent = "Please enter a valid email address.";
      registerMessage.classList.add("error");

      return;
    }

    // Validate password length
    if (password.length < 6) {

      registerMessage.textContent = "Password must contain at least 6 characters.";
      registerMessage.classList.add("error");

      return;
    }

    // Check whether passwords match
    if (password !== confirmPassword) {

      registerMessage.textContent = "Passwords do not match.";
      registerMessage.classList.add("error");

      return;
    }

    // Check terms and conditions
    if (!termsAccepted) {

      registerMessage.textContent = "Please accept the Terms and Conditions.";
      registerMessage.classList.add("error");

      return;
    }

    // Frontend demonstration only
    registerMessage.textContent =
      "Registration form validated successfully! Real account creation will be added later.";

    registerMessage.classList.add("success");

    // Clear password fields after successful validation
    document.getElementById("register-password").value = "";
    document.getElementById("confirm-password").value = "";

  });

}


/* =====================================================
   END OF REGISTRATION FUNCTIONALITY
   ===================================================== */

