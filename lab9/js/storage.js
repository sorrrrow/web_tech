const STORAGE_KEY = "fc_order_v1";

/**
 * Храним ТОЛЬКО id блюд (или null).
 * Формат:
 * {
 *   soup: number|null,
 *   main: number|null,
 *   starter: number|null,
 *   drink: number|null,
 *   dessert: number|null
 * }
 */
function getEmptyOrder() {
  return { soup: null, main: null, starter: null, drink: null, dessert: null };
}

function loadOrderFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getEmptyOrder();
    const obj = JSON.parse(raw);
    return {
      soup: obj.soup ?? null,
      main: obj.main ?? null,
      starter: obj.starter ?? null,
      drink: obj.drink ?? null,
      dessert: obj.dessert ?? null,
    };
  } catch (e) {
    return getEmptyOrder();
  }
}

function saveOrderToStorage(orderObj) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orderObj));
}

function clearOrderStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

function setDishId(category, idOrNull) {
  const order = loadOrderFromStorage();
  order[category] = idOrNull;
  saveOrderToStorage(order);
  return order;
}

function getSelectedIdsArray() {
  const o = loadOrderFromStorage();
  return Object.values(o).filter(v => v !== null);
}