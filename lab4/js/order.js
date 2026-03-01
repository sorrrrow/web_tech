const selected = {
  soup: null,
  main: null,
  drink: null
};

function getDishByKeyword(keyword) {
  return DISHES.find(d => d.keyword === keyword) || null;
}

function setHiddenFields() {
  const soupKeyword = document.getElementById("soupKeyword");
  const mainKeyword = document.getElementById("mainKeyword");
  const drinkKeyword = document.getElementById("drinkKeyword");
  const totalPrice = document.getElementById("totalPrice");

  soupKeyword.value = selected.soup ? selected.soup.keyword : "";
  mainKeyword.value = selected.main ? selected.main.keyword : "";
  drinkKeyword.value = selected.drink ? selected.drink.keyword : "";
  totalPrice.value = calcTotal();
}

function calcTotal() {
  let sum = 0;
  if (selected.soup) sum += selected.soup.price;
  if (selected.main) sum += selected.main.price;
  if (selected.drink) sum += selected.drink.price;
  return sum;
}

function updateOrderUI() {
  const emptyText = document.querySelector(".order-empty");

  const soupRow = document.getElementById("orderSoupRow");
  const mainRow = document.getElementById("orderMainRow");
  const drinkRow = document.getElementById("orderDrinkRow");

  const soupValue = document.getElementById("orderSoupValue");
  const mainValue = document.getElementById("orderMainValue");
  const drinkValue = document.getElementById("orderDrinkValue");

  const totalBlock = document.getElementById("orderTotal");
  const totalValue = document.getElementById("orderTotalValue");

  const anySelected = !!(selected.soup || selected.main || selected.drink);

  // если ничего не выбрано
  if (!anySelected) {
    emptyText.classList.remove("is-hidden");
    soupRow.classList.add("is-hidden");
    mainRow.classList.add("is-hidden");
    drinkRow.classList.add("is-hidden");
    totalBlock.classList.add("is-hidden");
    setHiddenFields();
    return;
  }

  emptyText.classList.add("is-hidden");

  // суп
  soupRow.classList.remove("is-hidden");
  soupValue.textContent = selected.soup
    ? `${selected.soup.name} ${selected.soup.price}₽`
    : "Блюдо не выбрано";

  // главное
  mainRow.classList.remove("is-hidden");
  mainValue.textContent = selected.main
    ? `${selected.main.name} ${selected.main.price}₽`
    : "Блюдо не выбрано";

  // напиток
  drinkRow.classList.remove("is-hidden");
  drinkValue.textContent = selected.drink
    ? `${selected.drink.name} ${selected.drink.price}₽`
    : "Напиток не выбран";

  // стоимость (показываем только если хоть что-то выбрано)
  const total = calcTotal();
  totalBlock.classList.toggle("is-hidden", total === 0);
  totalValue.textContent = `${total}₽`;

  setHiddenFields();
}

function updateSelectedCardsUI() {
  // Снимаем подсветку со всех
  document.querySelectorAll(".dish-card.is-selected")
    .forEach(card => card.classList.remove("is-selected"));

  // Вешаем подсветку на выбранные (по keyword)
  ["soup", "main", "drink"].forEach(cat => {
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

  // записываем выбор в нужную категорию
  selected[dish.category] = dish;

  updateOrderUI();
  updateSelectedCardsUI();
}

// reset формы должен чистить и выбор
function handleFormReset() {
  selected.soup = null;
  selected.main = null;
  selected.drink = null;
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