const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes";

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

async function loadDishes() {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    window.DISHES = data.map(d => ({
      ...d,
      category: normalizeCategory(d.category),
    }));

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
  } catch (err) {
    console.error("loadDishes() failed:", err);
    alert("Не удалось загрузить блюда с API. Открой консоль — там будет ошибка 👀");
  }
}

document.addEventListener("DOMContentLoaded", loadDishes);