// ===============================
// AUTH GUARD (SESSION BASED)
// ===============================
const loggedInEmail = sessionStorage.getItem("email");
const loggedInUsername = sessionStorage.getItem("username");
const currentPage = window.location.pathname;

// Redirect to login ONLY if not logged in
if (!loggedInEmail && !currentPage.includes("login.html")) {
  window.location.href = "login.html";
}

// ===============================
// CONFIG
// ===============================
const API_URL = "http://localhost:3000/api";
let allEvents = [];

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  if (path.includes("index.html")) {
    loadFeed();
    setupCategoryFilter();
    setupSearch();
  }

  if (path.includes("create.html")) {
    initCreateEvent();
  }

  if (path.includes("profile.html")) {
    loadMyEvents();
  }
});

// ===============================
// LOGOUT
// ===============================
function logout(e) {
  e.preventDefault(); // 🔴 VERY IMPORTANT
  sessionStorage.clear();
  window.location.href = "login.html";
}

// ===============================
// LOAD ALL EVENTS
// ===============================
async function loadFeed() {
  const container = document.getElementById("feedContainer");
  const loading = document.getElementById("loadingSpinner");
  const noEvents = document.getElementById("noEvents");

  if (loading) loading.style.display = "block";
  container.innerHTML = "";

  try {
    const res = await fetch(`${API_URL}/events`);
    allEvents = await res.json();

    loading.style.display = "none";

    if (!allEvents.length) {
      noEvents.style.display = "block";
      return;
    }

    noEvents.style.display = "none";
    renderEvents(allEvents);
  } catch (err) {
    console.error(err);
    loading.style.display = "none";
    noEvents.style.display = "block";
  }
}

// ===============================
// RENDER EVENTS
// ===============================
function renderEvents(events) {
  const container = document.getElementById("feedContainer");

  if (!events.length) {
    container.innerHTML = `<p style="text-align:center;">No events found</p>`;
    return;
  }

  container.innerHTML = events.map(createPostCard).join("");
}

function createPostCard(event) {
  // ✅ ONLY TRUST DB IDENTITY
  const username = event.createdByUsername || "User";
  const avatarLetter = username.charAt(0).toUpperCase();

  return `
    <div class="post-card">
      <div class="post-header">
        <div class="post-avatar">${avatarLetter}</div>
        <div class="post-user-info">
          <div class="post-username">${username}</div>
          <div class="post-location">📍 ${event.location}</div>
        </div>
      </div>

      <img 
        src="${event.image || "https://via.placeholder.com/600x400"}"
        class="post-image"
      >

      <div class="post-content">
        <span class="post-category">${event.category}</span>
        <div class="post-title">${event.title}</div>
        <div class="post-description">${event.description}</div>
      </div>
    </div>
  `;
}

// ===============================
// CATEGORY FILTER
// ===============================
function setupCategoryFilter() {
  const storyItems = document.querySelectorAll(".story-item");

  storyItems.forEach(item => {
    item.addEventListener("click", () => {
      const category = item.getAttribute("data-category");

      if (!category) {
        renderEvents(allEvents);
      } else {
        renderEvents(allEvents.filter(e => e.category === category));
      }
    });
  });
}

// ===============================
// SEARCH
// ===============================
function setupSearch() {
  const searchBar = document.getElementById("searchBar");
  if (!searchBar) return;

  searchBar.addEventListener("input", e => {
    const value = e.target.value.toLowerCase();

    renderEvents(
      allEvents.filter(ev =>
        ev.title.toLowerCase().includes(value) ||
        ev.description.toLowerCase().includes(value) ||
        ev.location.toLowerCase().includes(value)
      )
    );
  });
}

// ===============================
// CREATE EVENT
// ===============================
function initCreateEvent() {
  const form = document.getElementById("createEventForm");
  if (!form) return;

  form.addEventListener("submit", createEvent);
}

async function createEvent(e) {
  e.preventDefault();

  if (!loggedInEmail || !loggedInUsername) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  const eventData = {
    title: title.value.trim(),
    description: description.value.trim(),
    date: date.value,
    time: time.value,
    location: location.value.trim(),
    category: category.value,
    organizer: organizer.value.trim(),
    price: Number(price.value) || 0,
    maxAttendees: Number(maxAttendees.value) || null,
    contact: contact.value.trim(),
    image: image?.value || "",

    // ✅ FINAL IDENTITY
    createdBy: loggedInEmail,
    createdByUsername: loggedInUsername
  };

  try {
    const res = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData)
    });

    if (!res.ok) {
      alert("Error creating event");
      return;
    }

    alert("Event created successfully 🎉");
    window.location.href = "index.html";
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

// ===============================
// PROFILE PAGE
// ===============================
async function loadMyEvents() {
  const container = document.getElementById("myEventsContainer");

  try {
    const res = await fetch(`${API_URL}/events`);
    const events = await res.json();

    const myEvents = events.filter(
      event => event.createdBy === loggedInEmail
    );

    if (!myEvents.length) {
      container.innerHTML = `<p>You haven’t created any events yet.</p>`;
      return;
    }

    container.innerHTML = myEvents.map(createPostCard).join("");
  } catch (err) {
    console.error(err);
  }
}
