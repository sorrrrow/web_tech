function sortByName(a, b) {
  return a.name.localeCompare(b.name, "ru");
}

function createDishCard(dish) {
  const card = document.createElement("div");
  card.className = "dish-card";
  card.setAttribute("data-dish", dish.keyword);

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

function renderCategory(category, gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  grid.innerHTML = "";

  const items = DISHES
    .filter(d => d.category === category)
    .sort(sortByName);

  items.forEach(dish => {
    grid.appendChild(createDishCard(dish));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCategory("soup", "soupGrid");
  renderCategory("main", "mainGrid");
  renderCategory("drink", "drinkGrid");
});