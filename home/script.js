
/**
 * =====================================================
 * Club Management System - Stage 1 Frontend
 * File: script.js
 * =====================================================
 */

/* ---------- 1. THE EXPLORE CLUBS BUTTON ---------- */

const exploreButton = document.getElementById("explore-btn");
const welcomeMessage = document.getElementById("welcome-message");

const welcomeText =
  "Welcome to Club Management System! Discover your interests, connect with people, and become part of something amazing.";

if (exploreButton && welcomeMessage) {
  exploreButton.addEventListener("click", function () {
    welcomeMessage.textContent = welcomeText;
    welcomeMessage.classList.add("show");
  });
}

/* ---------- 2. MOBILE NAVIGATION MENU ---------- */

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.textContent = isOpen ? "✕" : "☰";

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );
  });

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

const siteHeader = document.querySelector(".site-header");

if (siteHeader) {
  window.addEventListener("scroll", function () {
    if (window.scrollY > 10) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  });
}

/* ---------- 4. AUTOMATIC FOOTER YEAR ---------- */

const currentYear = document.getElementById("current-year");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

/**
 * =====================================================
 * END OF SCRIPT
 * =====================================================
 */
