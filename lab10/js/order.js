const STORAGE_KEY = "fc_order_v1";

function getEmptyOrder() {
  return {
    soup_id: null,
    main_course_id: null,
    salad_id: null,
    drink_id: null,
    dessert_id: null,
  };
}

function loadOrderFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getEmptyOrder();
    const parsed = JSON.parse(raw);
    return { ...getEmptyOrder(), ...parsed };
  } catch (e) {
    return getEmptyOrder();
  }
}

function saveOrderToStorage(order) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
}

function clearOrderStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

function hasAnySelected(order) {
  return !!(order.soup_id || order.main_course_id || order.salad_id || order.drink_id || order.dessert_id);
}

function findDishById(id) {
  return (window.DISHES || []).find(d => Number(d.id) === Number(id));
}

function orderToSelectedForValidate(order) {
  return {
    soup: order.soup_id,
    main: order.main_course_id,
    starter: order.salad_id,
    drink: order.drink_id,
    dessert: order.dessert_id,
  };
}

function calcTotal(order) {
  const ids = [order.soup_id, order.main_course_id, order.salad_id, order.drink_id, order.dessert_id].filter(Boolean);
  let sum = 0;
  ids.forEach(id => {
    const dish = findDishById(id);
    if (dish) sum += Number(dish.price) || 0;
  });
  return sum;
}

function updateSelectedCardsUI() {
  const order = loadOrderFromStorage();

  document.querySelectorAll(".dish-card").forEach(card => {
    const id = card.getAttribute("data-id");
    if (!id) return;

    const isSelected =
      Number(id) === Number(order.soup_id) ||
      Number(id) === Number(order.main_course_id) ||
      Number(id) === Number(order.salad_id) ||
      Number(id) === Number(order.drink_id) ||
      Number(id) === Number(order.dessert_id);

    card.classList.toggle("is-selected", isSelected);

    const btn = card.querySelector(".dish-btn");
    if (btn) {
      if (document.body.dataset.page === "lunch") {
        btn.textContent = isSelected ? "Удалить" : "Добавить";
      }
    }
  });

  if (document.body.dataset.page === "lunch") {
    updateStickyBar();
  }

  if (document.body.dataset.page === "order") {
    updateOrderFormPreview();
  }
}

window.updateSelectedCardsUI = updateSelectedCardsUI;

function restoreSelectionFromStorage() {
  updateSelectedCardsUI();
}
window.restoreSelectionFromStorage = restoreSelectionFromStorage;

function categoryToField(category) {
  if (category === "soup") return "soup_id";
  if (category === "main") return "main_course_id";
  if (category === "starter") return "salad_id";
  if (category === "drink") return "drink_id";
  if (category === "dessert") return "dessert_id";
  return null;
}

function handleLunchCardClick(e) {
  const btn = e.target.closest(".dish-btn");
  if (!btn) return;

  const card = e.target.closest(".dish-card");
  if (!card) return;

  const dishId = Number(card.getAttribute("data-id"));
  if (!dishId) return;

  const dish = findDishById(dishId);
  if (!dish) return;

  const field = categoryToField(dish.category);
  if (!field) return;

  const order = loadOrderFromStorage();

  if (Number(order[field]) === dishId) {
    order[field] = null;
  } else {
    order[field] = dishId;
  }

  saveOrderToStorage(order);
  updateSelectedCardsUI();
}

function updateStickyBar() {
  const bar = document.getElementById("checkoutBar");
  const totalEl = document.getElementById("checkoutTotal");
  const link = document.getElementById("checkoutLink");
  const hint = document.getElementById("checkoutHint");

  if (!bar || !totalEl || !link) return;

  const order = loadOrderFromStorage();
  const any = hasAnySelected(order);

  if (!any) {
    bar.classList.add("is-hidden");
    return;
  }

  bar.classList.remove("is-hidden");

  const total = calcTotal(order);
  totalEl.textContent = `${total}₽`;

  const validate = (typeof validateCombo === "function")
    ? validateCombo(orderToSelectedForValidate(order))
    : { ok: false, message: "Проверка комбо не подключена" };

  if (validate.ok) {
    link.classList.remove("is-disabled");
    link.setAttribute("aria-disabled", "false");
    link.tabIndex = 0;
    if (hint) hint.textContent = "Можно оформлять ✅";
  } else {
    link.classList.add("is-disabled");
    link.setAttribute("aria-disabled", "true");
    link.tabIndex = -1;
    if (hint) hint.textContent = validate.message || "Собери валидное комбо";
  }
}

function preventDisabledCheckoutClick(e) {
  const link = e.target.closest("#checkoutLink");
  if (!link) return;

  if (link.classList.contains("is-disabled")) {
    e.preventDefault();

    const order = loadOrderFromStorage();
    const validate = validateCombo(orderToSelectedForValidate(order));

    if (typeof showModal === "function") {
      showModal(validate.message || "Собери валидное комбо");
    } else {
      alert(validate.message || "Собери валидное комбо");
    }
  }
}

function createDishCardForOrder(dish) {
  const card = document.createElement("div");
  card.className = "dish-card";
  card.setAttribute("data-id", dish.id);

  card.innerHTML = `
    <img src="${dish.image}" alt="${dish.name}">
    <p class="dish-price">${dish.price}₽</p>
    <p class="dish-title">${dish.name}</p>
    <div class="dish-bottom">
      <p class="dish-weight">${dish.count}</p>
      <button class="dish-btn dish-btn-danger" type="button" data-action="remove">Удалить</button>
    </div>
  `;

  return card;
}

function renderOrderComposition() {
  const wrap = document.getElementById("orderComposition");
  const empty = document.getElementById("orderEmptyText");
  if (!wrap || !empty) return;

  wrap.innerHTML = "";

  const order = loadOrderFromStorage();
  const ids = [order.soup_id, order.main_course_id, order.salad_id, order.drink_id, order.dessert_id].filter(Boolean);

  if (ids.length === 0) {
    empty.classList.remove("is-hidden");
    return;
  }

  empty.classList.add("is-hidden");

  ids.forEach(id => {
    const dish = findDishById(id);
    if (!dish) return;
    wrap.appendChild(createDishCardForOrder(dish));
  });
}

function removeDishFromOrderById(dishId) {
  const order = loadOrderFromStorage();

  if (Number(order.soup_id) === dishId) order.soup_id = null;
  if (Number(order.main_course_id) === dishId) order.main_course_id = null;
  if (Number(order.salad_id) === dishId) order.salad_id = null;
  if (Number(order.drink_id) === dishId) order.drink_id = null;
  if (Number(order.dessert_id) === dishId) order.dessert_id = null;

  saveOrderToStorage(order);
}

function handleOrderPageRemove(e) {
  const btn = e.target.closest('button[data-action="remove"]');
  if (!btn) return;

  const card = btn.closest(".dish-card");
  if (!card) return;

  const dishId = Number(card.getAttribute("data-id"));
  if (!dishId) return;

  removeDishFromOrderById(dishId);

  card.remove();

  const order = loadOrderFromStorage();
  if (!hasAnySelected(order) || ([order.soup_id, order.main_course_id, order.salad_id, order.drink_id, order.dessert_id].filter(Boolean).length === 0)) {
    const empty = document.getElementById("orderEmptyText");
    if (empty) empty.classList.remove("is-hidden");
  }

  updateOrderFormPreview();
}

function setPreviewRow(catKey, titleElId, priceElId, rowId, dishId, emptyText) {
  const row = document.getElementById(rowId);
  const titleEl = document.getElementById(titleElId);
  const priceEl = document.getElementById(priceElId);

  if (!row || !titleEl || !priceEl) return;

  if (!dishId) {
    row.classList.remove("is-hidden");
    titleEl.textContent = emptyText;
    priceEl.textContent = "";
    return;
  }

  const dish = findDishById(dishId);
  row.classList.remove("is-hidden");
  titleEl.textContent = dish ? dish.name : emptyText;
  priceEl.textContent = dish ? `${dish.price}₽` : "";
}

function updateOrderFormPreview() {
  const totalEl = document.getElementById("orderTotalValue");
  const totalWrap = document.getElementById("orderTotal");

  const order = loadOrderFromStorage();

  setPreviewRow("soup", "pvSoupName", "pvSoupPrice", "pvSoupRow", order.soup_id, "Не выбран");
  setPreviewRow("main", "pvMainName", "pvMainPrice", "pvMainRow", order.main_course_id, "Не выбрано");
  setPreviewRow("starter", "pvStarterName", "pvStarterPrice", "pvStarterRow", order.salad_id, "Не выбран");
  setPreviewRow("drink", "pvDrinkName", "pvDrinkPrice", "pvDrinkRow", order.drink_id, "Не выбран");
  setPreviewRow("dessert", "pvDessertName", "pvDessertPrice", "pvDessertRow", order.dessert_id, "Не выбран");

  const total = calcTotal(order);
  if (totalWrap && totalEl) {
    totalWrap.classList.remove("is-hidden");
    totalEl.textContent = `${total}₽`;
  }
}

function buildOrderPayloadFromForm(form) {
  const order = loadOrderFromStorage();
  const fd = new FormData(form);

  const deliveryType = fd.get("delivery_type");
  const deliveryTime = fd.get("delivery_time");

  const payload = {
    full_name: fd.get("full_name"),
    email: fd.get("email"),
    subscribe: fd.get("subscribe") ? 1 : 0,
    phone: fd.get("phone"),
    delivery_address: fd.get("delivery_address"),
    delivery_type: deliveryType,
    comment: fd.get("comment") || "",
    drink_id: order.drink_id,
  };

  if (order.soup_id) payload.soup_id = order.soup_id;
  if (order.main_course_id) payload.main_course_id = order.main_course_id;
  if (order.salad_id) payload.salad_id = order.salad_id;
  if (order.dessert_id) payload.dessert_id = order.dessert_id;

  if (deliveryType === "by_time") {
    payload.delivery_time = deliveryTime || "";
  }

  return payload;
}

function isValidDeliveryTimeIfNeeded(form) {
  const type = form.querySelector('input[name="delivery_type"]:checked')?.value;
  const time = form.querySelector('#deliveryTime')?.value;

  if (type !== "by_time") return { ok: true, message: "" };

  if (!time) {
    return { ok: false, message: "Укажите время доставки" };
  }

  const now = new Date();
  const [hh, mm] = time.split(":").map(Number);
  const chosen = new Date();
  chosen.setHours(hh, mm, 0, 0);

  if (chosen.getTime() < now.getTime()) {
    return { ok: false, message: "Время доставки не должно быть раньше текущего времени" };
  }

  return { ok: true, message: "" };
}

async function handleOrderSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const order = loadOrderFromStorage();

  const combo = validateCombo(orderToSelectedForValidate(order));
  if (!combo.ok) {
    if (typeof showModal === "function") showModal(combo.message);
    else alert(combo.message);
    return;
  }

  const timeCheck = isValidDeliveryTimeIfNeeded(form);
  if (!timeCheck.ok) {
    if (typeof showModal === "function") showModal(timeCheck.message);
    else alert(timeCheck.message);
    return;
  }

  const payload = buildOrderPayloadFromForm(form);

  try {
    if (typeof apiCreateOrder !== "function") {
      throw new Error("apiCreateOrder не подключен.");
    }

    await apiCreateOrder(payload);

    clearOrderStorage();

    if (typeof showModal === "function") {
      showModal("Заказ успешно оформлен! 🎉");
    } else {
      alert("Заказ успешно оформлен! 🎉");
    }

    renderOrderComposition();
    updateOrderFormPreview();
    form.reset();

  } catch (err) {
    console.error("Order submit failed:", err);
    alert(`Ошибка оформления заказа: ${err.message}`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page === "lunch") {
    document.addEventListener("click", handleLunchCardClick);
    document.addEventListener("click", preventDisabledCheckoutClick);
    updateStickyBar();
  }

  if (document.body.dataset.page === "order") {
    renderOrderComposition();
    updateOrderFormPreview();

    document.addEventListener("click", handleOrderPageRemove);

    const form = document.getElementById("orderForm");
    if (form) form.addEventListener("submit", handleOrderSubmit);

    document.addEventListener("dishesLoaded", () => {
      renderOrderComposition();
      updateOrderFormPreview();
      updateSelectedCardsUI();
    });
  }
});