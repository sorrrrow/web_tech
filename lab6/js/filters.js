window.ACTIVE_FILTERS = {
  soup: null,
  main: null,
  starter: null,
  drink: null,
  dessert: null
};

function clearActiveButtons(category) {
  document.querySelectorAll(`.filters[data-filters-for="${category}"] .filter-btn`)
    .forEach(btn => btn.classList.remove("active"));
}

function handleFilterClick(e) {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;

  const filtersBlock = btn.closest(".filters");
  if (!filtersBlock) return;

  const category = filtersBlock.getAttribute("data-filters-for");
  const kind = btn.getAttribute("data-kind");

  const isAlreadyActive = window.ACTIVE_FILTERS[category] === kind;

  clearActiveButtons(category);

  if (isAlreadyActive) {
    window.ACTIVE_FILTERS[category] = null;
  } else {
    window.ACTIVE_FILTERS[category] = kind;
    btn.classList.add("active");
  }

  if (typeof renderAll === "function") {
    renderAll(window.ACTIVE_FILTERS);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", handleFilterClick);
});