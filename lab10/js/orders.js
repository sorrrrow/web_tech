function toast(message, type = "success") {
  const root = document.getElementById("toastRoot");
  if (!root) return;

  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = message;

  root.appendChild(el);

  setTimeout(() => el.remove(), 2800);
}

function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  const s = new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  }).format(d);
  return s.replace(",", "");
}

function dishById(id) {
  return (window.DISHES || []).find(d => Number(d.id) === Number(id)) || null;
}

function orderDishList(order) {
  const ids = [
    order.soup_id,
    order.main_course_id,
    order.salad_id,
    order.drink_id,
    order.dessert_id
  ].filter(Boolean);

  return ids.map(id => dishById(id)).filter(Boolean);
}

function orderTotal(order) {
  return orderDishList(order).reduce((sum, d) => sum + (Number(d.price) || 0), 0);
}

function orderShortComposition(order) {
  return orderDishList(order).map(d => d.name).join(", ");
}

function deliveryLabel(order) {
  if (order.delivery_type === "by_time") {
    return order.delivery_time || "—";
  }
  return "Как можно скорее (с 7:00 до 23:00)";
}

function closeModal() {
  const root = document.getElementById("modalRoot");
  if (root) root.innerHTML = "";
}

function openModal({ title, bodyNode, actions }) {
  const root = document.getElementById("modalRoot");
  if (!root) return;

  root.innerHTML = "";

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay-9";

  const modal = document.createElement("div");
  modal.className = "modal-9";

  const header = document.createElement("div");
  header.className = "modal-9-header";

  const h = document.createElement("h3");
  h.className = "modal-9-title";
  h.textContent = title;

  const close = document.createElement("button");
  close.type = "button";
  close.className = "modal-9-close";
  close.textContent = "×";
  close.addEventListener("click", closeModal);

  header.appendChild(h);
  header.appendChild(close);

  const body = document.createElement("div");
  body.className = "modal-9-body";
  body.appendChild(bodyNode);

  const footer = document.createElement("div");
  footer.className = "modal-9-actions";

  (actions || []).forEach(a => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `btn9 ${a.variant || "secondary"}`;
    btn.textContent = a.text;
    btn.addEventListener("click", a.onClick);
    footer.appendChild(btn);
  });

  modal.appendChild(header);
  modal.appendChild(body);
  modal.appendChild(footer);
  overlay.appendChild(modal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  root.appendChild(overlay);
}

function minutesFromHHMM(hhmm) {
  const [h, m] = String(hhmm || "").split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return h * 60 + m;
}

function validateEditForm(data) {
  if (!data.full_name.trim()) return "Укажите ФИО";
  if (!data.email.trim()) return "Укажите email";
  if (!data.phone.trim()) return "Укажите телефон";
  if (!data.delivery_address.trim()) return "Укажите адрес доставки";
  if (data.delivery_type !== "now" && data.delivery_type !== "by_time") return "Выберите тип доставки";

  if (data.delivery_type === "by_time") {
    if (!data.delivery_time) return "Укажите время доставки";

    const t = minutesFromHHMM(data.delivery_time);
    if (t === null) return "Неверный формат времени";
    if (t < 7 * 60 || t > 23 * 60) return "Время доставки должно быть с 07:00 до 23:00";
    if (t % 5 !== 0) return "Время доставки должно быть с шагом 5 минут";

    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    if (nowMin >= 7 * 60 && nowMin <= 23 * 60 && t <= nowMin) {
      return "Время доставки не должно быть раньше текущего времени";
    }
  }

  return null;
}

let ORDERS_CACHE = [];

function renderOrdersTable(orders) {
  const tbody = document.getElementById("ordersTbody");
  const hint = document.getElementById("ordersHint");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!orders.length) {
    if (hint) hint.textContent = "У вас пока нет заказов 🙃 Оформите один на странице «Оформить заказ»";
    return;
  }

  if (hint) hint.textContent = "";

  orders.forEach((order, idx) => {
    const tr = document.createElement("tr");

    const total = orderTotal(order);

    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${formatDateTime(order.created_at)}</td>
      <td>${orderShortComposition(order)}</td>
      <td>${total}₽</td>
      <td>${order.delivery_type === "now" ? `<span class="badge-now">${deliveryLabel(order)}</span>` : deliveryLabel(order)}</td>
      <td>
        <div class="orders-actions">
          <button class="icon-btn" title="Подробнее" data-action="view" data-id="${order.id}">👁</button>
          <button class="icon-btn" title="Редактировать" data-action="edit" data-id="${order.id}">✏️</button>
          <button class="icon-btn danger" title="Удалить" data-action="delete" data-id="${order.id}">🗑</button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

async function refreshOrders() {
  const hint = document.getElementById("ordersHint");
  if (hint) hint.textContent = "Загружаю заказы… ⏳";

  const orders = await apiGetOrders();
  orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  ORDERS_CACHE = orders;
  renderOrdersTable(orders);
}

function openViewModal(order) {
  const grid = document.createElement("div");
  grid.className = "modal-9-grid";

  const dishLines = orderDishList(order)
    .map(d => `${d.name} (${d.price}₽)`)
    .join(", ");

  const addRow = (k, v) => {
    const kk = document.createElement("div");
    kk.className = "k";
    kk.textContent = k;

    const vv = document.createElement("div");
    vv.textContent = v || "—";

    grid.appendChild(kk);
    grid.appendChild(vv);
  };

  addRow("Дата оформления", formatDateTime(order.created_at));
  addRow("Имя получателя", order.full_name);
  addRow("Адрес доставки", order.delivery_address);
  addRow("Время доставки", deliveryLabel(order));
  addRow("Телефон", order.phone);
  addRow("Email", order.email);
  addRow("Комментарий", order.comment || "—");
  addRow("Состав заказа", dishLines || "—");
  addRow("Стоимость", `${orderTotal(order)}₽`);

  openModal({
    title: "Просмотр заказа",
    bodyNode: grid,
    actions: [
      { text: "Ок", variant: "secondary", onClick: closeModal }
    ]
  });
}

function openDeleteModal(order) {
  const body = document.createElement("div");
  body.innerHTML = `<p style="margin:0;font-weight:700;">Вы уверены, что хотите удалить заказ №${order.id}?</p>`;

  openModal({
    title: "Удаление заказа",
    bodyNode: body,
    actions: [
      { text: "Отмена", variant: "secondary", onClick: closeModal },
      {
        text: "Да",
        variant: "danger",
        onClick: async () => {
          try {
            await apiDeleteOrder(order.id);
            closeModal();
            toast("Заказ успешно удалён ✅", "success");
            await refreshOrders();
          } catch (e) {
            toast(`Ошибка удаления: ${e.message}`, "error");
          }
        }
      }
    ]
  });
}

function openEditModal(order) {
  const body = document.createElement("div");

  body.innerHTML = `
    <div class="modal-9-grid">
      <div class="k">Дата оформления</div><div>${formatDateTime(order.created_at)}</div>

      <div class="k">Имя получателя</div>
      <div><input id="ed_full_name" type="text" style="width:100%" value="${(order.full_name || "").replaceAll('"', "&quot;")}" /></div>

      <div class="k">Адрес доставки</div>
      <div><input id="ed_address" type="text" style="width:100%" value="${(order.delivery_address || "").replaceAll('"', "&quot;")}" /></div>

      <div class="k">Тип доставки</div>
      <div>
        <label style="margin-right:12px;">
          <input type="radio" name="ed_delivery_type" value="now" ${order.delivery_type === "now" ? "checked" : ""} />
          Как можно скорее
        </label>
        <label>
          <input type="radio" name="ed_delivery_type" value="by_time" ${order.delivery_type === "by_time" ? "checked" : ""} />
          К указанному времени
        </label>
      </div>

      <div class="k">Время доставки</div>
      <div>
        <input id="ed_time" type="time" min="07:00" max="23:00" step="300" value="${order.delivery_time || ""}" />
      </div>

      <div class="k">Телефон</div>
      <div><input id="ed_phone" type="text" style="width:100%" value="${(order.phone || "").replaceAll('"', "&quot;")}" /></div>

      <div class="k">Email</div>
      <div><input id="ed_email" type="email" style="width:100%" value="${(order.email || "").replaceAll('"', "&quot;")}" /></div>

      <div class="k">Комментарий</div>
      <div><textarea id="ed_comment" rows="4" style="width:100%">${order.comment || ""}</textarea></div>

      <div class="k">Состав заказа</div>
      <div>${orderShortComposition(order) || "—"}</div>

      <div class="k">Стоимость</div>
      <div>${orderTotal(order)}₽</div>
    </div>
  `;

  const getDeliveryType = () => {
    const r = body.querySelector("input[name='ed_delivery_type']:checked");
    return r ? r.value : "";
  };

  const toggleTimeDisabled = () => {
    const t = body.querySelector("#ed_time");
    const type = getDeliveryType();
    t.disabled = (type !== "by_time");
    if (type !== "by_time") t.value = "";
  };

  body.addEventListener("change", (e) => {
    if (e.target && e.target.name === "ed_delivery_type") toggleTimeDisabled();
  });

  toggleTimeDisabled();

  openModal({
    title: "Редактирование заказа",
    bodyNode: body,
    actions: [
      { text: "Отмена", variant: "secondary", onClick: closeModal },
      {
        text: "Сохранить",
        variant: "primary",
        onClick: async () => {
          const data = {
            full_name: String(body.querySelector("#ed_full_name").value || ""),
            delivery_address: String(body.querySelector("#ed_address").value || ""),
            delivery_type: getDeliveryType(),
            delivery_time: String(body.querySelector("#ed_time").value || ""),
            phone: String(body.querySelector("#ed_phone").value || ""),
            email: String(body.querySelector("#ed_email").value || ""),
            comment: String(body.querySelector("#ed_comment").value || ""),
          };

          if (data.delivery_type === "now") data.delivery_time = null;

          const err = validateEditForm(data);
          if (err) {
            toast(err, "error");
            return;
          }

          const patch = {};
          if (data.full_name !== order.full_name) patch.full_name = data.full_name;
          if (data.email !== order.email) patch.email = data.email;
          if (data.phone !== order.phone) patch.phone = data.phone;
          if (data.delivery_address !== order.delivery_address) patch.delivery_address = data.delivery_address;
          if (data.delivery_type !== order.delivery_type) patch.delivery_type = data.delivery_type;

          const oldTime = order.delivery_time || null;
          const newTime = data.delivery_time || null;
          if (newTime !== oldTime) patch.delivery_time = newTime;

          if ((data.comment || "") !== (order.comment || "")) patch.comment = data.comment;

          if (Object.keys(patch).length === 0) {
            toast("Нечего сохранять 🙂", "success");
            closeModal();
            return;
          }

          try {
            await apiUpdateOrder(order.id, patch);
            closeModal();
            toast("Заказ успешно изменён ✅", "success");
            await refreshOrders();
          } catch (e) {
            toast(`Ошибка сохранения: ${e.message}`, "error");
          }
        }
      }
    ]
  });
}

function findOrderInCache(id) {
  return ORDERS_CACHE.find(o => Number(o.id) === Number(id)) || null;
}

function onTableClick(e) {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const id = Number(btn.getAttribute("data-id"));
  const action = btn.getAttribute("data-action");
  const order = findOrderInCache(id);

  if (!order) {
    toast("Не нашёл заказ в списке. Обнови страницу 🙃", "error");
    return;
  }

  if (action === "view") openViewModal(order);
  if (action === "edit") openEditModal(order);
  if (action === "delete") openDeleteModal(order);
}

document.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("ordersTable");
  if (table) table.addEventListener("click", onTableClick);

  document.addEventListener("dishesLoaded", () => {
    refreshOrders().catch(err => {
      console.error(err);
      toast(err.message || "Ошибка загрузки заказов", "error");
      const hint = document.getElementById("ordersHint");
      if (hint) hint.textContent = "Не удалось загрузить заказы 😢";
    });
  });

  if (window.DISHES && window.DISHES.length) {
    refreshOrders().catch(err => toast(err.message, "error"));
  }
});