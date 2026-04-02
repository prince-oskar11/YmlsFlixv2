const API = "https://api.jikan.moe/v4";
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

async function fetchAnime(endpoint) {
  const res = await fetch(API + endpoint);
  const data = await res.json();
  return data.data;
}

function createCard(anime) {
  return `
  <div class="card" onclick="openDetails(${anime.mal_id})">
    <img src="${anime.images.jpg.image_url}">
    <div class="overlay ep">${anime.episodes || "?"}</div>
    <div class="overlay age">${anime.rating || "?"}</div>
    <div class="overlay rate">${anime.score || "?"}</div>
  </div>`;
}

async function goHome() {
  const anime = await fetchAnime("/top/anime");
  renderList(anime);
}

function renderList(list) {
  document.getElementById("content").innerHTML =
    list.map(createCard).join("");
}

async function openDetails(id) {
  const res = await fetch(`${API}/anime/${id}`);
  const anime = (await res.json()).data;

  document.getElementById("content").innerHTML = `
    <h2>${anime.title}</h2>
    <img src="${anime.images.jpg.image_url}">
    <p>${anime.synopsis}</p>
    <button onclick="addWishlist(${id})">Add Wishlist</button>
    <button onclick="playTrailer('${anime.trailer.embed_url}')">Play Trailer</button>
  `;
}

function addWishlist(id) {
  wishlist.push(id);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  alert("Added!");
}

async function showWishlist() {
  let html = "<h2>Wishlist</h2>";
  for (let id of wishlist) {
    const res = await fetch(`${API}/anime/${id}`);
    const anime = (await res.json()).data;
    html += createCard(anime);
  }
  document.getElementById("content").innerHTML = html;
}

function playTrailer(url) {
  document.getElementById("playerModal").classList.remove("hidden");
  document.getElementById("videoPlayer").src = url;
}

function nextEpisode() {
  alert("Next episode logic here");
}

// SEARCH
document.getElementById("search").addEventListener("input", async (e) => {
  let q = e.target.value;
  if (!q) return;

  const res = await fetch(`${API}/anime?q=${q}`);
  const data = (await res.json()).data;

  document.getElementById("suggestions").innerHTML =
    data.slice(0, 5).map(a => `<div onclick="openDetails(${a.mal_id})">${a.title}</div>`).join("");
});

// PROFILE
function showProfile() {
  document.getElementById("content").innerHTML = `
    <h2>Profile</h2>
    <input id="user" placeholder="Username or Email">
    <input id="pass" type="password" placeholder="Password">
    <button onclick="signup()">Sign Up</button>
    <button onclick="login()">Sign In</button>
    <button onclick="logout()">Sign Out</button>
    <button onclick="clearHistory()">Clear History</button>
  `;
}

function signup() {
  localStorage.setItem("user", document.getElementById("user").value);
  localStorage.setItem("pass", document.getElementById("pass").value);
  alert("Account created");
}

function login() {
  alert("Signed in");
}

function logout() {
  alert("Logged out");
}

function clearHistory() {
  if (confirm("Are you sure?")) {
    localStorage.clear();
  }
}

// INSTALL PWA
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  deferredPrompt = e;
});

document.getElementById("installBtn").onclick = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
  }
};

// INIT
goHome();
