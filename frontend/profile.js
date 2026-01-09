const API_URL = "http://localhost:3000/api";
const loggedInEmail = localStorage.getItem("loggedInUser");

document.addEventListener("DOMContentLoaded", loadMyEvents);

async function loadMyEvents() {
  const container = document.getElementById("profileEvents");
  const noEvents = document.getElementById("noMyEvents");

  // Redirect if not logged in
  if (!loggedInEmail) {
    window.location.href = "login.html";
    return;
  }

  container.innerHTML = "";
  noEvents.style.display = "none";

  try {
    const res = await fetch(`${API_URL}/events`);
    const events = await res.json();

    // ✅ FILTER USING createdByEmail
    const myEvents = events.filter(
      event => event.createdByEmail === loggedInEmail
    );

    if (!myEvents.length) {
      noEvents.style.display = "block";
      return;
    }

    container.innerHTML = myEvents.map(createMyEventCard).join("");
  } catch (err) {
    console.error(err);
    noEvents.style.display = "block";
  }
}

function createMyEventCard(event) {
  return `
    <div class="post-card">
      <div class="post-header">
        <div class="post-avatar">
          ${event.createdByUser?.charAt(0).toUpperCase() || "U"}
        </div>
        <div class="post-user-info">
          <div class="post-username">${event.createdByUser}</div>
          <div class="post-location">📍 ${event.location}</div>
        </div>
      </div>

      <img 
        src="${event.image || "https://via.placeholder.com/600x400"}"
        class="post-image"
      >

      <div class="post-content">
        <span class="post-category">${event.category}</span>
        <h3>${event.title}</h3>
        <p>${event.description}</p>

        <div class="post-meta">
          📅 ${new Date(event.date).toDateString()} | 🕐 ${event.time}
        </div>

        <button 
          onclick="deleteEvent('${event._id}')"
          style="
            margin-top:1rem;
            background:#ef4444;
            color:white;
            border:none;
            padding:0.6rem 1rem;
            border-radius:6px;
            cursor:pointer;
          ">
          🗑 Delete Event
        </button>
      </div>
    </div>
  `;
}

async function deleteEvent(eventId) {
  if (!confirm("Are you sure you want to delete this event?")) return;

  try {
    const res = await fetch(`${API_URL}/events/${eventId}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      alert("Failed to delete event");
      return;
    }

    alert("Event deleted successfully");
    loadMyEvents();
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}
