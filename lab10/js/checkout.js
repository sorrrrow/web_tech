let dishesById = new Map();

function formatLine(dish) {
  if (!dish) return null;
  return `${dish.name} ${dish.price}₽`;
}

function calcTotal(order) {
  let sum = 0;
  for (const key of ["soup","main","starter","drink","dessert"]) {
    const id = order[key];
    if (id && dishesById.has(id)) sum += Number(dishesById.get(id).price) || 0;
  }
  return sum;
}

function updateFormLeft(order) {
  const soup = order.soup ? dishesById.get(order.soup) : null;
  const main = order.main ? dishesById.get(order.main) : null;
  const starter = order.starter ? dishesById.get(order.starter) : null;
  const drink = order.drink ? dishesById.get(order.drink) : null;
  const dessert = order.dessert ? dishesById.get(order.dessert) : null;

  document.getElementById("lineSoup").textContent = soup ? formatLine(soup) : "Не выбран";
  document.getElementById("lineMain").textContent = main ? formatLine(main) : "Не выбрано";
  document.getElementById("lineStarter").textContent = starter ? formatLine(starter) : "Не выбран";
  document.getElementById("lineDrink").textContent = drink ? formatLine(drink) : "Не выбран";
  document.getElementById("lineDessert").textContent = dessert ? formatLine(dessert) : "Не выбран";

  document.getElementById("lineTotal").textContent = String(calcTotal(order));
}

function createCard(dish) {
  const card = document.createElement("div");
  card.className = "dish-card";
  card.setAttribute("data-dish-id", dish.id);

  card.innerHTML = `
    <div class="dish-img">
      <img src="${dish.image}" alt="${dish.name}">
    </div>
    <div class="dish-info">
      <div class="dish-price">${dish.price}₽</div>
      <div class="dish-name">${dish.name}</div>
      <div class="dish-count">${dish.count}</div>
      <button type="button" class="dish-btn" data-action="remove">Удалить</button>
    </div>
  `;

  return card;
}

function renderCheckoutGrid(order) {
  const grid = document.getElementById("checkoutGrid");
  const empty = document.getElementById("checkoutEmpty");

  grid.innerHTML = "";

  const ids = Object.values(order).filter(v => v !== null);
  if (ids.length === 0) {
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  ids.forEach(id => {
    const dish = dishesById.get(id);
    if (dish) grid.appendChild(createCard(dish));
  });
}

function removeDishById(id) {
  const order = loadOrderFromStorage();

  for (const key of ["soup","main","starter","drink","dessert"]) {
    if (order[key] === id) order[key] = null;
  }

  saveOrderToStorage(order);
  renderCheckoutGrid(order);
  updateFormLeft(order);
}

function buildOrderPayloadFromForm(form, order) {
  const fd = new FormData(form);

  const deliveryType = fd.get("delivery_type");
  const deliveryTime = fd.get("delivery_time");

  // если by_time — время обязано быть
  if (deliveryType === "by_time" && (!deliveryTime || String(deliveryTime).trim() === "")) {
    throw new Error("Укажите время доставки");
  }

  // drink_id по ТЗ обязательный, но мы контролим через combo
  const payload = {
    full_name: String(fd.get("full_name") || ""),
    email: String(fd.get("email") || ""),
    subscribe: fd.get("subscribe") ? 1 : 0,
    phone: String(fd.get("phone") || ""),
    delivery_address: String(fd.get("delivery_address") || ""),
    delivery_type: String(deliveryType || ""),
    delivery_time: deliveryType === "by_time" ? String(deliveryTime) : null,
    comment: String(fd.get("comment") || ""),

    soup_id: order.soup,
    main_course_id: order.main,
    salad_id: order.starter,
    drink_id: order.drink,
    dessert_id: order.dessert,
  };

  return payload;
}

async function initCheckout() {
  const order = loadOrderFromStorage();

  // подгружаем все блюда одним запросом, чтобы не дергать 100 раз
  const dishes = await apiGetDishes();
  dishesById = new Map(dishes.map(d => [Number(d.id), d]));

  renderCheckoutGrid(order);
  updateFormLeft(order);

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action='remove']");
    if (!btn) return;

    const card = btn.closest("[data-dish-id]");
    if (!card) return;

    const id = Number(card.getAttribute("data-dish-id"));
    removeDishById(id);
  });

  const form = document.getElementById("orderForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const current = loadOrderFromStorage();

    // проверка комбо
    if (!isComboValid(current)) {
      const msg = getComboErrorMessage(current) || "Состав заказа не соответствует доступным комбо";
      alert(msg);
      return;
    }

    try {
      const payload = buildOrderPayloadFromForm(form, current);
      await apiCreateOrder(payload);

      clearOrderStorage();
      alert("Заказ успешно оформлен ✅");
      window.location.href = "lunch.html";
    } catch (err) {
      console.error(err);
      alert("Не удалось оформить заказ: " + err.message);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initCheckout().catch(err => {
    console.error(err);
    alert("Ошибка загрузки: " + err.message);
  });
});