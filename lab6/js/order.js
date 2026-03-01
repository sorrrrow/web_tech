const selected = {
  soup: null,
  main: null,
  starter: null,
  drink: null,
  dessert: null
};

function getDishByKeyword(keyword) {
  return DISHES.find(d => d.keyword === keyword) || null;
}

function calcTotal() {
  let sum = 0;
  Object.keys(selected).forEach(cat => {
    if (selected[cat]) sum += selected[cat].price;
  });
  return sum;
}

function setHiddenFields() {
  document.getElementById("soupKeyword").value = selected.soup ? selected.soup.keyword : "";
  document.getElementById("mainKeyword").value = selected.main ? selected.main.keyword : "";
  document.getElementById("starterKeyword").value = selected.starter ? selected.starter.keyword : "";
  document.getElementById("drinkKeyword").value = selected.drink ? selected.drink.keyword : "";
  document.getElementById("dessertKeyword").value = selected.dessert ? selected.dessert.keyword : "";
  document.getElementById("totalPrice").value = calcTotal();
}

function updateOrderUI() {
  const emptyText = document.querySelector(".order-empty");

  const rows = {
    soup: { row: document.getElementById("orderSoupRow"), value: document.getElementById("orderSoupValue"), empty: "Блюдо не выбрано" },
    main: { row: document.getElementById("orderMainRow"), value: document.getElementById("orderMainValue"), empty: "Блюдо не выбрано" },
    starter: { row: document.getElementById("orderStarterRow"), value: document.getElementById("orderStarterValue"), empty: "Блюдо не выбрано" },
    drink: { row: document.getElementById("orderDrinkRow"), value: document.getElementById("orderDrinkValue"), empty: "Напиток не выбран" },
    dessert: { row: document.getElementById("orderDessertRow"), value: document.getElementById("orderDessertValue"), empty: "Блюдо не выбрано" }
  };

  const totalBlock = document.getElementById("orderTotal");
  const totalValue = document.getElementById("orderTotalValue");

  const anySelected = Object.values(selected).some(v => !!v);

  if (!anySelected) {
    emptyText.classList.remove("is-hidden");
    Object.values(rows).forEach(r => r.row.classList.add("is-hidden"));
    totalBlock.classList.add("is-hidden");
    setHiddenFields();
    return;
  }

  emptyText.classList.add("is-hidden");

  Object.keys(rows).forEach(cat => {
    rows[cat].row.classList.remove("is-hidden");
    rows[cat].value.textContent = selected[cat]
      ? `${selected[cat].name} ${selected[cat].price}₽`
      : rows[cat].empty;
  });

  const total = calcTotal();
  totalBlock.classList.toggle("is-hidden", total === 0);
  totalValue.textContent = `${total}₽`;

  setHiddenFields();
}

function updateSelectedCardsUI() {
  document.querySelectorAll(".dish-card.is-selected")
    .forEach(card => card.classList.remove("is-selected"));

  Object.keys(selected).forEach(cat => {
    const dish = selected[cat];
    if (!dish) return;

    const card = document.querySelector(`.dish-card[data-dish="${dish.keyword}"]`);
    if (card) card.classList.add("is-selected");
  });
}

function handleDishClick(e) {
  const card = e.target.closest(".dish-card");
  if (!card) return;

  const keyword = card.getAttribute("data-dish");
  const dish = getDishByKeyword(keyword);
  if (!dish) return;

  selected[dish.category] = dish;

  updateOrderUI();
  updateSelectedCardsUI();
}

function handleFormReset() {
  Object.keys(selected).forEach(cat => selected[cat] = null);
  updateOrderUI();
  updateSelectedCardsUI();
}

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", handleDishClick);

  const form = document.getElementById("orderForm");
  if (form) {
    form.addEventListener("reset", handleFormReset);
  }

  updateOrderUI();
  updateSelectedCardsUI();
});
