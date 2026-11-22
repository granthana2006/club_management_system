
/**
 * =====================================================
 * CLUB MANAGEMENT SYSTEM
 * Authentication JavaScript
 * File: auth.js
 * =====================================================
 */

/* ---------- 1. LOGIN FORM ---------- */

const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

if (loginForm && loginMessage) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get login details.
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    // Reset previous message.
    loginMessage.className = "form-message";
    loginMessage.textContent = "";

    // Check empty fields.
    if (email === "" || password === "") {
      loginMessage.textContent = "Please fill in all the fields.";
      loginMessage.classList.add("error");
      return;
    }

    // Validate email.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      loginMessage.textContent = "Please enter a valid email address.";
      loginMessage.classList.add("error");
      return;
    }

    // Check password length.
    if (password.length < 6) {
      loginMessage.textContent =
        "Password must contain at least 6 characters.";

      loginMessage.classList.add("error");
      return;
    }

    // Get registered student details, if available.
    let student = null;

    try {
      student = JSON.parse(
        localStorage.getItem("clubSphereStudent")
      );
    } catch (error) {
      console.error("Could not read student details:", error);
    }

    // Get the student's name.
    let studentName = email.split("@")[0];

    if (student && student.email === email) {
      studentName = student.fullName;
    }

    // Save student information for the dashboard.
    localStorage.setItem("clubSphereStudentName", studentName);
    localStorage.setItem("clubSphereStudentEmail", email);

    // Frontend demonstration only.
    loginMessage.textContent = "Login successful! Redirecting...";
    loginMessage.classList.add("success");

    // Open the dashboard.
    window.location.href = "../dashboard/dashboard.html";
  });
}

/* ---------- 2. FORGOT PASSWORD ---------- */

const forgotPasswordLink = document.getElementById("forgot-password");

if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener("click", function (event) {
    event.preventDefault();

    alert(
      "Password recovery functionality will be added in a future stage."
    );
  });
}

/* ---------- 3. REGISTRATION FORM ---------- */

const registerForm = document.getElementById("register-form");
const registerMessage = document.getElementById("register-message");

if (registerForm && registerMessage) {
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get registration details.
    const fullName = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const studentId = document.getElementById("student-id").value.trim();
    const department = document.getElementById("department").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const termsAccepted = document.getElementById("terms").checked;

    // Reset previous message.
    registerMessage.className = "form-message";
    registerMessage.textContent = "";

    // Check empty fields.
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

    // Validate email.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      registerMessage.textContent = "Please enter a valid email address.";
      registerMessage.classList.add("error");
      return;
    }

    // Validate password length.
    if (password.length < 6) {
      registerMessage.textContent =
        "Password must contain at least 6 characters.";

      registerMessage.classList.add("error");
      return;
    }

    // Check password confirmation.
    if (password !== confirmPassword) {
      registerMessage.textContent = "Passwords do not match.";
      registerMessage.classList.add("error");
      return;
    }

    // Check terms and conditions.
    if (!termsAccepted) {
      registerMessage.textContent =
        "Please accept the Terms and Conditions.";

      registerMessage.classList.add("error");
      return;
    }

    // Save basic student details.
    // Never save the password in localStorage.
    const student = {
      fullName: fullName,
      email: email,
      studentId: studentId,
      department: department
    };

    try {
      localStorage.setItem(
        "clubSphereStudent",
        JSON.stringify(student)
      );

      localStorage.setItem(
        "clubSphereStudentName",
        fullName
      );
    } catch (error) {
      registerMessage.textContent =
        "Could not save your details. Please try again.";

      registerMessage.classList.add("error");
      return;
    }

    // Show success message.
    registerMessage.textContent =
      "Registration successful! Redirecting to login...";

    registerMessage.classList.add("success");

    // Clear password fields.
    document.getElementById("register-password").value = "";
    document.getElementById("confirm-password").value = "";

    // Redirect to login page.
    window.location.href = "login.html";
  });
}

/**
 * =====================================================
 * END OF AUTHENTICATION JAVASCRIPT
 * =====================================================
 */
