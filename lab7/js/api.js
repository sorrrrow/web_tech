// api.js
const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes";

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

  return map[apiCategory] || apiCategory; // если вдруг прилетит новое — оставим как есть
}

async function loadDishes() {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // кладём в глобалку, как раньше было с DISHES
    window.DISHES = data.map(d => ({
      ...d,
      category: normalizeCategory(d.category),
    }));

    // если фильтры ещё не объявлены — создадим
    if (!window.ACTIVE_FILTERS) {
      window.ACTIVE_FILTERS = {
        soup: null,
        main: null,
        starter: null,
        drink: null,
        dessert: null,
      };
    }

    // рендерим всё
    if (typeof renderAll === "function") {
      renderAll(window.ACTIVE_FILTERS);
    }
  } catch (err) {
    console.error("loadDishes() failed:", err);
    alert("Не удалось загрузить блюда с API. Открой консоль — там будет ошибка 👀");
  }
}

document.addEventListener("DOMContentLoaded", loadDishes);