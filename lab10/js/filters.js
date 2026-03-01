// filters.js
window.ACTIVE_FILTERS = {
  soup: null,
  main: null,
  starter: null,
  drink: null,
  dessert: null
};

function getCategory(btn, filtersBlock) {
  // 1) приоритет у data-category на кнопке
  const fromBtn = btn.getAttribute("data-category");
  if (fromBtn) return fromBtn;

  // 2) если нет — берем data-filters-for у блока фильтров
  const fromBlock = filtersBlock?.getAttribute("data-filters-for");
  if (fromBlock) return fromBlock;

  return null;
}

function clearActiveButtons(filtersBlock, category) {
  // чистим активность только внутри этого блока (надежно)
  if (filtersBlock) {
    filtersBlock.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  }

  // на всякий пожарный: если где-то используются data-category на кнопках — тоже почистим
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