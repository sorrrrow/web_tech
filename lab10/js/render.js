function sortByName(a, b) {
  return a.name.localeCompare(b.name, "ru");
}

function createDishCard(dish) {
  const card = document.createElement("div");
  card.className = "dish-card";
  card.setAttribute("data-dish", dish.keyword);
  card.setAttribute("data-id", dish.id);

  card.innerHTML = `
    <img src="${dish.image}" alt="${dish.name}">
    <p class="dish-price">${dish.price}₽</p>
    <p class="dish-title">${dish.name}</p>
    <div class="dish-bottom">
      <p class="dish-weight">${dish.count}</p>
      <button class="dish-btn" type="button">Добавить</button>
    </div>
  `;

  return card;
}

function renderCategory(category, gridId, kindFilter = null) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  grid.innerHTML = "";

  let items = (window.DISHES || []).filter(d => d.category === category);

  if (kindFilter) {
    items = items.filter(d => d.kind === kindFilter);
  }

  items.sort(sortByName);

  items.forEach(dish => grid.appendChild(createDishCard(dish)));

  if (typeof updateSelectedCardsUI === "function") {
    updateSelectedCardsUI();
  }
}

function renderAll(activeFilters) {
  renderCategory("soup", "soupGrid", activeFilters.soup);
  renderCategory("main", "mainGrid", activeFilters.main);
  renderCategory("starter", "starterGrid", activeFilters.starter);
  renderCategory("drink", "drinkGrid", activeFilters.drink);
  renderCategory("dessert", "dessertGrid", activeFilters.dessert);
}