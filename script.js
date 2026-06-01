const searchInput = document.querySelector("#site-search");
const clearSearchButton = document.querySelector("#clear-search");
const filterButtons = document.querySelectorAll(".filter-button");
const searchableItems = document.querySelectorAll(".searchable");
const tournamentCards = document.querySelectorAll("#tournaments .info-card");

let activeTournamentFilter = "all";

function normalizeText(value) {
  return value.toLowerCase().replace(/\s+/g, "");
}

function itemMatchesSearch(item, query) {
  if (!query) return true;

  const text = normalizeText(`${item.textContent} ${item.dataset.keywords || ""}`);
  return text.includes(query);
}

function itemMatchesTournamentFilter(item) {
  if (!item.closest("#tournaments")) return true;
  if (activeTournamentFilter === "all") return true;

  return (item.dataset.category || "").split(" ").includes(activeTournamentFilter);
}

function getEmptyMessage(section) {
  let message = section.querySelector(".empty-message");

  if (!message) {
    message = document.createElement("p");
    message.className = "empty-message";
    message.textContent = "条件に一致する情報がありません。キーワードを変えてお試しください。";
    section.append(message);
  }

  return message;
}

function updateEmptyStates() {
  document.querySelectorAll(".section").forEach((section) => {
    const items = section.querySelectorAll(".searchable");
    if (!items.length) return;

    const hasVisibleItem = [...items].some((item) => !item.classList.contains("is-hidden"));
    const message = getEmptyMessage(section);
    message.classList.toggle("is-hidden", hasVisibleItem);
  });
}

function applyFilters() {
  const query = normalizeText(searchInput.value.trim());

  searchableItems.forEach((item) => {
    const shouldShow = itemMatchesSearch(item, query) && itemMatchesTournamentFilter(item);
    item.classList.toggle("is-hidden", !shouldShow);
  });

  updateEmptyStates();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeTournamentFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    applyFilters();
  });
});

searchInput.addEventListener("input", applyFilters);

clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  activeTournamentFilter = "all";
  filterButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === "all");
  });
  applyFilters();
  searchInput.focus();
});

tournamentCards.forEach((card) => {
  card.setAttribute("tabindex", "0");
});

applyFilters();
