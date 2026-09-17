const PLACEHOLDER_IMG = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200">
     <rect width="100%" height="100%" fill="#334155"/>
     <text x="50%" y="50%" fill="#94a3b8" font-family="sans-serif" font-size="16" text-anchor="middle" dominant-baseline="middle">No Image</text>
   </svg>`
);

function handleImgError(img) {
  img.onerror = null;
  img.src = PLACEHOLDER_IMG;
}
// ---------- State ----------
let articles = [];
let activeSource = "All";
let searchTerm = "";

// ---------- DOM references ----------
const newsGrid = document.getElementById("newsGrid");
const statusMsg = document.getElementById("statusMsg");
const sourceBar = document.getElementById("sourceBar");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;

const modal = document.getElementById("modal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalSource = document.getElementById("modalSource");
const modalSummary = document.getElementById("modalSummary");
const modalLink = document.getElementById("modalLink");

// ---------- Fetch ----------
async function loadArticles() {
  showSkeletons();
  try {
    const res = await fetch("https://api.spaceflightnewsapi.net/v4/articles/?limit=30");
    if (!res.ok) throw new Error("Request failed");
    const data = await res.json();
    articles = data.results.map(normalize);
    hideStatus();
    buildSourceBar();
    renderArticles();
  } catch (err) {
    showError();
  }
}

// ---------- Normalize (only function that knows the API shape) ----------
function normalize(item) {
  return {
    id: item.id,
    title: item.title,
    summary: item.summary,
    source: item.news_site,
    image: item.image_url,
    date: item.published_at,
    url: item.url
  };
}

// ---------- Filtering ----------
function getFilteredArticles() {
  return articles.filter(a => {
    const matchesSource = activeSource === "All" || a.source === activeSource;
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm) ||
      a.summary.toLowerCase().includes(searchTerm);
    return matchesSource && matchesSearch;
  });
}

// ---------- Rendering ----------
function renderArticles() {
  const list = getFilteredArticles();

  if (list.length === 0) {
    newsGrid.innerHTML = "";
    showStatus("No articles match your filters.");
    return;
  }
  hideStatus();

  newsGrid.innerHTML = list.map(a => `
    <div class="card" data-id="${a.id}" tabindex="0">
       <img src="${a.image}" alt="${a.title}" loading="lazy" onerror="handleImgError(this)">
      <div class="card-body">
        <div class="card-source">${a.source}</div>
        <div class="card-title">${a.title}</div>
        <div class="card-date">${new Date(a.date).toLocaleDateString()}</div>
      </div>
    </div>
  `).join("");
}

function showSkeletons() {
  newsGrid.innerHTML = Array(6).fill('<div class="skeleton"></div>').join("");
}

function showStatus(text) {
  statusMsg.innerHTML = text;
  statusMsg.classList.remove("hidden");
}

function showError() {
  newsGrid.innerHTML = "";
  statusMsg.innerHTML = `
    <p>Something went wrong loading the news.</p>
    <button id="retryBtn">Retry</button>
  `;
  statusMsg.classList.remove("hidden");
  document.getElementById("retryBtn").addEventListener("click", loadArticles);
}

function hideStatus() {
  statusMsg.classList.add("hidden");
}

// ---------- Source bar ----------
function buildSourceBar() {
  const sources = ["All", ...new Set(articles.map(a => a.source))];
  sourceBar.innerHTML = sources.map(s => `
    <button class="chip ${s === activeSource ? "active" : ""}" data-source="${s}">${s}</button>
  `).join("");
}

sourceBar.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  activeSource = chip.dataset.source;
  buildSourceBar();
  renderArticles();
});

// ---------- Search ----------
searchInput.addEventListener("input", (e) => {
  searchTerm = e.target.value.toLowerCase();
  renderArticles();
});

// ---------- Card click / keyboard -> modal (event delegation) ----------
newsGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (card) openModal(card.dataset.id);
});

newsGrid.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    const card = e.target.closest(".card");
    if (card) {
      e.preventDefault();
      openModal(card.dataset.id);
    }
  }
});

function openModal(id) {
  const article = articles.find(a => String(a.id) === String(id));
  if (!article) return;
  modalTitle.textContent = article.title;
  modalSource.textContent = article.source;
  modalSummary.textContent = article.summary;
  modalLink.href = article.url;
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ---------- Theme toggle ----------
function applyTheme(theme) {
  html.dataset.theme = theme;
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

themeToggle.addEventListener("click", () => {
  const next = html.dataset.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem("newshub-theme", next);
  } catch (e) { /* storage blocked, ignore */ }
  applyTheme(next);
});

// ---------- Init ----------
function init() {
  let saved = "light";
  try {
    saved = localStorage.getItem("newshub-theme") || "light";
  } catch (e) { /* storage blocked, ignore */ }
  applyTheme(saved);
  loadArticles();
}

init();