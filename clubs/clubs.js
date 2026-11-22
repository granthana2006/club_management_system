
/**
 * =====================================================
 * Club Management System
 * File: clubs.js
 * Purpose: Explore, Join and Leave Clubs
 * =====================================================
 */

/* ---------- 1. CLUB DATA ---------- */

const clubs = [
  {
    id: 1,
    name: "Coding Club",
    category: "Technology",
    icon: "💻",
    description: "Learn programming, build projects, and improve your coding skills."
  },
  {
    id: 2,
    name: "Arts and Design Club",
    category: "Creative",
    icon: "🎨",
    description: "Explore creativity through drawing, painting, and graphic design."
  },
  {
    id: 3,
    name: "Robotics Club",
    category: "Engineering",
    icon: "🤖",
    description: "Build robots, experiment with technology, and solve real-world problems."
  },
  {
    id: 4,
    name: "Photography Club",
    category: "Creative",
    icon: "📸",
    description: "Learn photography techniques and capture memorable moments."
  },
  {
    id: 5,
    name: "Entrepreneurship Club",
    category: "Business",
    icon: "🚀",
    description: "Develop business ideas, learn teamwork, and explore entrepreneurship."
  },
  {
    id: 6,
    name: "Cultural Club",
    category: "Cultural",
    icon: "🎭",
    description: "Celebrate culture through music, dance, festivals, and performances."
  }
];

/* ---------- 2. LOCAL STORAGE ---------- */

const STORAGE_KEY = "clubSphereJoinedClubs";

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

function saveJoinedClubs(joinedClubs) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(joinedClubs)
    );
  } catch (error) {
    console.error("Could not save joined clubs:", error);
    alert("Could not save your membership. Please try again.");
  }
}

/* ---------- 3. HTML ELEMENTS ---------- */

const clubsGrid = document.getElementById("clubs-grid");
const searchInput = document.getElementById("club-search");
const categoryFilter = document.getElementById("category-filter");
const totalClubsElement = document.getElementById("total-clubs");
const joinedClubsElement = document.getElementById("joined-clubs");
const resultCount = document.getElementById("clubs-result-count");
const noResults = document.getElementById("no-results");

/* ---------- 4. DISPLAY CLUBS ---------- */

function displayClubs() {
  if (
    !clubsGrid ||
    !searchInput ||
    !categoryFilter ||
    !totalClubsElement ||
    !joinedClubsElement ||
    !resultCount ||
    !noResults
  ) {
    return;
  }

  const searchText = searchInput.value.toLowerCase().trim();
  const selectedCategory = categoryFilter.value;
  const joinedClubs = getJoinedClubs();

  const filteredClubs = clubs.filter(function (club) {
    const matchesSearch =
      club.name.toLowerCase().includes(searchText) ||
      club.description.toLowerCase().includes(searchText) ||
      club.category.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "all" ||
      club.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  clubsGrid.replaceChildren();

  // Update statistics.
  totalClubsElement.textContent = clubs.length;
  joinedClubsElement.textContent = joinedClubs.length;

  resultCount.textContent =
    `${filteredClubs.length} ${filteredClubs.length === 1 ? "club" : "clubs"}`;

  noResults.hidden = filteredClubs.length !== 0;

  filteredClubs.forEach(function (club) {
    const isJoined = joinedClubs.some(function (joinedClub) {
      return joinedClub.id === club.id;
    });

    const card = document.createElement("article");
    card.className = "club-card";

    const icon = document.createElement("div");
    icon.className = "club-icon";
    icon.textContent = club.icon;

    const category = document.createElement("p");
    category.className = "club-category";
    category.textContent = club.category;

    const name = document.createElement("h3");
    name.textContent = club.name;

    const description = document.createElement("p");
    description.className = "club-description";
    description.textContent = club.description;

    const actionButton = document.createElement("button");
    actionButton.type = "button";
    actionButton.className = "club-action";
    actionButton.textContent = isJoined ? "Joined ✓" : "Join Club";

    if (isJoined) {
      actionButton.classList.add("joined");
    }

    actionButton.addEventListener("click", function () {
      if (isJoined) {
        leaveClub(club.id);
      } else {
        joinClub(club.id);
      }
    });

    card.append(
      icon,
      category,
      name,
      description,
      actionButton
    );

    clubsGrid.appendChild(card);
  });
}

/* ---------- 5. JOIN A CLUB ---------- */

function joinClub(clubId) {
  const joinedClubs = getJoinedClubs();

  const alreadyJoined = joinedClubs.some(function (club) {
    return club.id === clubId;
  });

  if (alreadyJoined) return;

  const selectedClub = clubs.find(function (club) {
    return club.id === clubId;
  });

  if (!selectedClub) return;

  joinedClubs.push(selectedClub);

  saveJoinedClubs(joinedClubs);
  displayClubs();
}

/* ---------- 6. LEAVE A CLUB ---------- */

function leaveClub(clubId) {
  const confirmed = confirm(
    "Are you sure you want to leave this club?"
  );

  if (!confirmed) return;

  const updatedClubs = getJoinedClubs().filter(function (club) {
    return club.id !== clubId;
  });

  saveJoinedClubs(updatedClubs);
  displayClubs();
}

/* ---------- 7. SEARCH CLUBS ---------- */

if (searchInput) {
  searchInput.addEventListener("input", displayClubs);
}

/* ---------- 8. FILTER CLUBS ---------- */

if (categoryFilter) {
  categoryFilter.addEventListener("change", displayClubs);
}

/* ---------- 9. FOOTER YEAR ---------- */

const clubsYear = document.getElementById("clubs-year");

if (clubsYear) {
  clubsYear.textContent = new Date().getFullYear();
}

/* ---------- 10. INITIALIZE PAGE ---------- */

displayClubs();

/**
 * =====================================================
 * END OF CLUBS JAVASCRIPT
 * =====================================================
 */
