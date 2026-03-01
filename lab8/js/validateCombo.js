function showModal(message) {
  const old = document.querySelector(".modal-overlay");
  if (old) old.remove();

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "modal";

  const text = document.createElement("p");
  text.className = "modal-text";
  text.textContent = message;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "modal-btn";
  btn.textContent = "Окей 👌";

  btn.addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });

  modal.appendChild(text);
  modal.appendChild(btn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function validateCombo(selected) {
  const hasSoup = !!selected.soup;
  const hasMain = !!selected.main;
  const hasStarter = !!selected.starter;
  const hasDrink = !!selected.drink;

  const any = hasSoup || hasMain || hasStarter || hasDrink || !!selected.dessert;

  if (!hasSoup && !hasMain && !hasStarter && !hasDrink) {
    return { ok: false, message: "Ничего не выбрано. Выберите блюда для заказа" };
  }

  const combo1 = hasSoup && hasMain && hasStarter && hasDrink;
  const combo2 = hasSoup && hasMain && hasDrink && !hasStarter;
  const combo3 = hasSoup && hasStarter && hasDrink && !hasMain;
  const combo4 = hasMain && hasStarter && hasDrink && !hasSoup;
  const combo5 = hasMain && hasDrink && !hasSoup && !hasStarter;

  if (combo1 || combo2 || combo3 || combo4 || combo5) {
    return { ok: true, message: "" };
  }

  if (hasDrink === false && (hasSoup || hasMain || hasStarter)) {
    return { ok: false, message: "Выберите напиток" };
  }

  if (hasSoup && !hasMain && !hasStarter) {
    return { ok: false, message: "Выберите главное блюдо/салат/стартер" };
  }

  if (hasStarter && !hasSoup && !hasMain) {
    return { ok: false, message: "Выберите суп или главное блюдо" };
  }

  if ((hasDrink || selected.dessert) && !hasMain && !hasSoup) {
    return { ok: false, message: "Выберите главное блюдо" };
  }

  return { ok: false, message: "Проверьте выбор блюд для комбо" };
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("orderForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    if (typeof selected === "undefined") return;

    const result = validateCombo(selected);
    if (!result.ok) {
      e.preventDefault();
      showModal(result.message);
    }
  });
});