
/* =====================================================
   Club Management System - Stage 1 Frontend
   File: script.js
   ===================================================== */


/* ---------- 1. THE EXPLORE CLUBS BUTTON ---------- */

// Find the Explore button and welcome message
const exploreButton = document.getElementById("explore-btn");
const welcomeMessage = document.getElementById("welcome-message");

// Welcome message text
const welcomeText =
  "Welcome to Club Management System! Discover your interests, connect with people, and become part of something amazing.";

// Listen for a click on the Explore button
if (exploreButton && welcomeMessage) {

  exploreButton.addEventListener("click", function () {

    // Display the welcome message
    welcomeMessage.textContent = welcomeText;

    // Reveal the message using the CSS "show" class
    welcomeMessage.classList.add("show");

  });

}


/* ---------- 2. MOBILE NAVIGATION MENU ---------- */

// Find the menu button and navigation links
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {

  // Open or close the mobile menu
  menuToggle.addEventListener("click", function () {

    const isOpen = navLinks.classList.toggle("open");

    // Change the menu icon
    menuToggle.textContent = isOpen ? "✕" : "☰";

    // Update accessibility attributes
    menuToggle.setAttribute("aria-expanded", String(isOpen));

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );

  });


  // Close the menu after clicking a navigation link
  navLinks.addEventListener("click", function (event) {

    const clickedLink = event.target.closest("a");

    if (clickedLink) {

      navLinks.classList.remove("open");

      menuToggle.textContent = "☰";

      menuToggle.setAttribute("aria-expanded", "false");

      menuToggle.setAttribute("aria-label", "Open menu");

    }

  });

}


/* ---------- 3. NAVBAR SHADOW WHEN SCROLLING ---------- */

// Find the header using its CSS class
const siteHeader = document.querySelector(".site-header");

if (siteHeader) {

  window.addEventListener("scroll", function () {

    // Add shadow when the page is scrolled more than 10px
    if (window.scrollY > 10) {

      siteHeader.classList.add("scrolled");

    } else {

      siteHeader.classList.remove("scrolled");

    }

  });

}


/* ---------- 4. AUTOMATIC FOOTER YEAR ---------- */

// Find the footer year element
const currentYear = document.getElementById("current-year");

if (currentYear) {

  // Display the current year automatically
  currentYear.textContent = new Date().getFullYear();

}


/* =====================================================
   END OF SCRIPT
   ===================================================== */
