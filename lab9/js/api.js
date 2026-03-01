// js/api.js

// ✅ БАЗОВЫЙ URL API (для Netlify/GitHub Pages по ТЗ)
const API_BASE_URL = "https://edu.std-900.ist.mospolytech.ru";

// ✅ ВСТАВЬ СЮДА СВОЙ API KEY (UUIDv4)
const API_KEY = "a0f8c61f-9dc3-46d4-ab60-dd9410ec179b";

// соберём URL с api_key всегда в query
function withApiKey(url) {
  const u = new URL(url);
  u.searchParams.set("api_key", API_KEY);
  return u.toString();
}

// приводим категории от API к тем, что ждёт твой сайт
function normalizeCategory(apiCategory) {
  const map = {
    "soup": "soup",
    "main-course": "main",
    "salad": "starter",
    "starter": "starter",
    "drink": "drink",
    "dessert": "dessert",
  };

  return map[apiCategory] || apiCategory;
}

async function apiGetDishes() {
  const url = withApiKey(`${API_BASE_URL}/labs/api/dishes`);
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API /dishes error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  return data.map(d => ({
    ...d,
    category: normalizeCategory(d.category),
  }));
}

async function apiCreateOrder(orderPayload) {
  const url = withApiKey(`${API_BASE_URL}/labs/api/orders`);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderPayload),
  });

  // сервер может вернуть JSON с error
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) {}

  if (!res.ok) {
    const msg = (data && data.error) ? data.error : `HTTP ${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  return data;
}

// ===== ЛР9: Orders API =====

async function apiGetOrders() {
  const url = withApiKey(`${API_BASE_URL}/labs/api/orders`);
  const res = await fetch(url);

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) {}

  if (!res.ok) {
    const msg = (data && data.error) ? data.error : `HTTP ${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  return data || [];
}

async function apiGetOrderById(orderId) {
  const url = withApiKey(`${API_BASE_URL}/labs/api/orders/${orderId}`);
  const res = await fetch(url);

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) {}

  if (!res.ok) {
    const msg = (data && data.error) ? data.error : `HTTP ${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  return data;
}

async function apiUpdateOrder(orderId, patch) {
  const url = withApiKey(`${API_BASE_URL}/labs/api/orders/${orderId}`);

  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) {}

  if (!res.ok) {
    const msg = (data && data.error) ? data.error : `HTTP ${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  return data;
}

async function apiDeleteOrder(orderId) {
  const url = withApiKey(`${API_BASE_URL}/labs/api/orders/${orderId}`);

  const res = await fetch(url, { method: "DELETE" });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) {}

  if (!res.ok) {
    const msg = (data && data.error) ? data.error : `HTTP ${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  return data;
}

// грузим блюда при старте (как в ЛР7)
async function loadDishes() {
  try {
    const dishes = await apiGetDishes();

    window.DISHES = dishes;
    document.dispatchEvent(new Event("dishesLoaded"));

    if (!window.ACTIVE_FILTERS) {
      window.ACTIVE_FILTERS = {
        soup: null,
        main: null,
        starter: null,
        drink: null,
        dessert: null,
      };
    }

    if (typeof renderAll === "function") {
      renderAll(window.ACTIVE_FILTERS);
    }

    // ✅ важно для ЛР8: после загрузки блюд применяем выбор из localStorage
    if (typeof restoreSelectionFromStorage === "function") {
      restoreSelectionFromStorage();
    }

  } catch (err) {
    console.error("loadDishes() failed:", err);
    alert("Не удалось загрузить блюда с API. Открой консоль — там будет ошибка 👀");
  }
}

document.addEventListener("DOMContentLoaded", loadDishes);