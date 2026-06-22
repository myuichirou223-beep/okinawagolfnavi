const tournamentCards = document.querySelectorAll("#tournaments .info-card");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

let activeTournamentFilter = "all";
let activeCourseAreaFilter = "all";
let activeCourseTypeFilter = "all";
let activePracticeFilter = "all";
let activePracticeAreaFilter = "all";
let activeTournamentSort = "asc";

function setMobileMenu(open) {
  document.body.classList.toggle("mobile-menu-open", open);
  menuToggle?.setAttribute("aria-expanded", String(open));
}

function itemMatchesTournamentFilter(item) {
  if (!item.closest("#tournaments")) return true;
  if (activeTournamentFilter === "all") return true;

  return (item.dataset.category || "").split(" ").includes(activeTournamentFilter);
}

function itemMatchesCourseAreaFilter(item) {
  if (activeCourseAreaFilter === "all") return true;

  return item.dataset.area === activeCourseAreaFilter;
}

function itemMatchesCourseTypeFilter(item) {
  if (activeCourseTypeFilter === "all") return true;

  return (item.dataset.courseType || "").split(" ").includes(activeCourseTypeFilter);
}

function itemMatchesPracticeFilter(item) {
  if (activePracticeFilter === "all") return true;

  return item.dataset.practiceCategory === activePracticeFilter;
}

function itemMatchesPracticeAreaFilter(item) {
  if (activePracticeAreaFilter === "all") return true;

  return item.dataset.practiceArea === activePracticeAreaFilter;
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
  document.querySelectorAll("#tournaments .searchable").forEach((item) => {
    const shouldShow = itemMatchesTournamentFilter(item);
    item.classList.toggle("is-hidden", !shouldShow);
  });

  document.querySelectorAll("#courses .course-row").forEach((item) => {
    const shouldShow = itemMatchesCourseAreaFilter(item) && itemMatchesCourseTypeFilter(item);
    item.classList.toggle("is-hidden", !shouldShow);
  });

  document.querySelectorAll("#practice .practice-row").forEach((item) => {
    const shouldShow = itemMatchesPracticeFilter(item) && itemMatchesPracticeAreaFilter(item);
    item.classList.toggle("is-hidden", !shouldShow);
  });

  updateEmptyStates();
}

function sortTournamentItems() {
  const scheduleList = document.querySelector(".schedule-list");
  if (!scheduleList) return;

  const items = [...scheduleList.querySelectorAll(".schedule-item")];
  items
    .sort((a, b) => {
      const dateA = Number(a.dataset.sortDate || "99999999");
      const dateB = Number(b.dataset.sortDate || "99999999");
      return activeTournamentSort === "asc" ? dateA - dateB : dateB - dateA;
    })
    .forEach((item) => scheduleList.append(item));
}

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const scheduleFilterButton = target.closest("[data-schedule-filter]");
  if (scheduleFilterButton) {
    const section = scheduleFilterButton.closest(".upcoming-schedule-section");
    const filter = scheduleFilterButton.dataset.scheduleFilter || "all";
    const cards = section?.querySelectorAll("[data-schedule-type]") || [];
    let visibleCount = 0;

    section?.querySelectorAll("[data-schedule-filter]").forEach((button) => {
      const isActive = button === scheduleFilterButton;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });

    cards.forEach((card) => {
      const isVisible = filter === "all" || card.dataset.scheduleType === filter;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    const emptyMessage = section?.querySelector("[data-schedule-empty]");
    if (emptyMessage) emptyMessage.hidden = visibleCount > 0;
    return;
  }

  const menuButton = target.closest(".menu-toggle");
  if (menuButton) {
    setMobileMenu(!document.body.classList.contains("mobile-menu-open"));
    return;
  }

  const navLink = target.closest(".site-nav a");
  if (navLink) {
    setMobileMenu(false);
  }

  const sortButton = target.closest(".sort-button");
  if (sortButton) {
    activeTournamentSort = sortButton.dataset.sortOrder;
    document.querySelectorAll(".sort-button").forEach((item) => item.classList.remove("is-active"));
    sortButton.classList.add("is-active");
    sortTournamentItems();
    applyFilters();
    return;
  }

  const tournamentFilterButton = target.closest(".filter-button");
  if (tournamentFilterButton) {
    activeTournamentFilter = tournamentFilterButton.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("is-active"));
    tournamentFilterButton.classList.add("is-active");
    applyFilters();
    return;
  }

  const courseFilterButton = target.closest(".course-filter-button");
  if (courseFilterButton) {
    activeCourseAreaFilter = courseFilterButton.dataset.areaFilter;
    document.querySelectorAll(".course-filter-button").forEach((item) => item.classList.remove("is-active"));
    courseFilterButton.classList.add("is-active");
    applyFilters();
    return;
  }

  const courseTypeFilterButton = target.closest(".course-type-filter-button");
  if (courseTypeFilterButton) {
    activeCourseTypeFilter = courseTypeFilterButton.dataset.typeFilter;
    document.querySelectorAll(".course-type-filter-button").forEach((item) => item.classList.remove("is-active"));
    courseTypeFilterButton.classList.add("is-active");
    applyFilters();
    return;
  }

  const practiceFilterButton = target.closest(".practice-filter-button");
  if (practiceFilterButton) {
    activePracticeFilter = practiceFilterButton.dataset.practiceFilter;
    document.querySelectorAll(".practice-filter-button").forEach((item) => item.classList.remove("is-active"));
    practiceFilterButton.classList.add("is-active");
    applyFilters();
    return;
  }

  const practiceAreaFilterButton = target.closest(".practice-area-filter-button");
  if (practiceAreaFilterButton) {
    activePracticeAreaFilter = practiceAreaFilterButton.dataset.practiceAreaFilter;
    document.querySelectorAll(".practice-area-filter-button").forEach((item) => item.classList.remove("is-active"));
    practiceAreaFilterButton.classList.add("is-active");
    applyFilters();
    return;
  }

});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMobileMenu(false);
  }
});

window.addEventListener("resize", () => {
  if (window.matchMedia("(min-width: 901px)").matches) {
    setMobileMenu(false);
  }
});

tournamentCards.forEach((card) => {
  card.setAttribute("tabindex", "0");
});

sortTournamentItems();
applyFilters();
