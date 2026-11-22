
/* =====================================================
   Club Management System
   File: dashboard.js
   Purpose: Make the student dashboard functional
   ===================================================== */


/* ---------- 1. MOBILE SIDEBAR ---------- */

const sidebar = document.querySelector(".sidebar");
const sidebarToggle = document.getElementById("sidebar-toggle");

if (sidebar && sidebarToggle) {

  sidebarToggle.addEventListener("click", function () {

    const isOpen = sidebar.classList.toggle("open");

    sidebarToggle.setAttribute("aria-expanded", String(isOpen));

  });

  // Close the sidebar after clicking a navigation link
  sidebar.querySelectorAll("a").forEach(function (link) {

    link.addEventListener("click", function () {

      sidebar.classList.remove("open");
      sidebarToggle.setAttribute("aria-expanded", "false");

    });

  });

}


/* ---------- 2. STUDENT NAME ---------- */

// Read the student's name if it has been saved in the browser.
// If no name is saved, display "Student".

const studentName =
  localStorage.getItem("clubSphereStudentName") || "Student";

const headerStudentName =
  document.getElementById("header-student-name");

const welcomeMessage =
  document.getElementById("dashboard-welcome");

const profileAvatar =
  document.getElementById("profile-avatar");

if (headerStudentName) {
  headerStudentName.textContent = studentName;
}

if (welcomeMessage) {
  welcomeMessage.textContent = `Welcome back, ${studentName}!`;
}

if (profileAvatar) {
  profileAvatar.textContent = studentName.charAt(0).toUpperCase();
}


/* ---------- 3. LOAD JOINED CLUBS ---------- */

// This is the localStorage key shared with the clubs page.
const STORAGE_KEY = "clubSphereJoinedClubs";

// Get the saved clubs from the browser.
function getJoinedClubs() {

  try {

    const savedClubs = JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    );

    return Array.isArray(savedClubs) ? savedClubs : [];

  } catch (error) {

    console.error("Could not load joined clubs:", error);
    return [];

  }

}


/* ---------- 4. DISPLAY JOINED CLUBS ---------- */

function displayJoinedClubs() {

  const joinedClubs = getJoinedClubs();

  const myClubsList = document.getElementById("my-clubs-list");
  const myClubsCount = document.getElementById("my-clubs-count");

  if (!myClubsList) return;

  // Update the number of joined clubs.
  if (myClubsCount) {
    myClubsCount.textContent = joinedClubs.length;
  }

  // Clear the previous content.
  myClubsList.replaceChildren();

  // Show a message if the student has not joined any clubs.
  if (joinedClubs.length === 0) {

    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";

    const message = document.createElement("p");
    message.textContent = "You haven't joined any clubs yet.";

    const link = document.createElement("a");
    link.href = "clubs.html";
    link.className = "dashboard-primary-button";
    link.textContent = "Explore Clubs";

    emptyState.append(message, link);
    myClubsList.appendChild(emptyState);

    return;

  }

  // Display every club the student has joined.
  joinedClubs.forEach(function (club) {

    const card = document.createElement("div");
    card.className = "dashboard-club-card";

    const icon = document.createElement("div");
    icon.className = "club-card-icon";
    icon.textContent = club.icon || "🎯";

    const info = document.createElement("div");
    info.className = "club-card-info";

    const name = document.createElement("h3");
    name.textContent = club.name;

    const category = document.createElement("p");
    category.textContent = club.category || "Student Club";

    info.append(name, category);

    const leaveButton = document.createElement("button");
    leaveButton.className = "small-action";
    leaveButton.type = "button";
    leaveButton.textContent = "Leave";

    leaveButton.addEventListener("click", function () {

      leaveClub(club.id);

    });

    card.append(icon, info, leaveButton);
    myClubsList.appendChild(card);

  });

}


/* ---------- 5. LEAVE A CLUB ---------- */

function leaveClub(clubId) {

  const confirmed = confirm(
    "Are you sure you want to leave this club?"
  );

  if (!confirmed) return;

  const updatedClubs = getJoinedClubs().filter(function (club) {

    return club.id !== clubId;

  });

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedClubs)
  );

  // Refresh the dashboard.
  displayJoinedClubs();

}


/* ---------- 6. DASHBOARD FOOTER YEAR ---------- */

const dashboardYear = document.getElementById("dashboard-year");

if (dashboardYear) {
  dashboardYear.textContent = new Date().getFullYear();
}


/* ---------- 7. INITIALIZE DASHBOARD ---------- */

// Run this when the dashboard loads.
displayJoinedClubs();


/* =====================================================
   END OF DASHBOARD JAVASCRIPT
   ===================================================== */
