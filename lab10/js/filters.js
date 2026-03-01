window.ACTIVE_FILTERS = {
  soup: null,
  main: null,
  starter: null,
  drink: null,
  dessert: null
};

function getCategory(btn, filtersBlock) {
  const fromBtn = btn.getAttribute("data-category");
  if (fromBtn) return fromBtn;

  const fromBlock = filtersBlock?.getAttribute("data-filters-for");
  if (fromBlock) return fromBlock;

  return null;
}

function clearActiveButtons(filtersBlock, category) {
  if (filtersBlock) {
    filtersBlock.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  }

  if (category) {
    document.querySelectorAll(`.filter-btn[data-category="${category}"]`).forEach(b => b.classList.remove("active"));
  }
}

function handleFilterClick(e) {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;

  const filtersBlock = btn.closest(".filters");
  if (!filtersBlock) return;

  const category = getCategory(btn, filtersBlock);
  if (!category) return;

  const kind = btn.getAttribute("data-kind");
  if (!kind) return;

  const isAlreadyActive = window.ACTIVE_FILTERS[category] === kind;

  clearActiveButtons(filtersBlock, category);

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