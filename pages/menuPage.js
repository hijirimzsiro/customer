import { apiBaseUrl } from "../settings.js";

/* =========================
   🧩 購物車存取 + 計算
   ========================= */
function readCart() {
  try { return JSON.parse(localStorage.getItem("cart") || "[]"); }
  catch { return []; }
}
function writeCart(items) {
  localStorage.setItem("cart", JSON.stringify(items));
}
function calcSubtotal() {
  const cart = readCart();
  return cart.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);
}
function calcCount() {
  const cart = readCart();
  return cart.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
}

/* =========================
   🔔 Toast（非阻斷提示）
   ========================= */
let toastTimer = null;
function showToast(msg) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2500);
}

/* =========================
   📌 底部黏住摘要列（暫計 + 帶徽章購物車）
   ========================= */
function ensureStickySummary(onGoCart) {
  let bar = document.querySelector(".sticky-summary");
  if (!bar) {
    bar = document.createElement("div");
    bar.className = "sticky-summary";
    bar.innerHTML = `
      <span class="sum-text">暫計：$<span class="sum-val">0</span></span>
      <button class="sticky-cart-btn" type="button">🛒 前往購物車 <span class="badge">0</span></button>
    `;
    document.body.appendChild(bar);
    bar.querySelector(".sticky-cart-btn").addEventListener("click", onGoCart);
  }
  updateStickySummary();
}
function updateStickySummary() {
  const sumEl = document.querySelector(".sticky-summary .sum-val");
  if (sumEl) sumEl.textContent = calcSubtotal();
  const btn = document.querySelector(".sticky-summary .sticky-cart-btn");
  const badge = document.querySelector(".sticky-summary .badge");
  const count = calcCount();
  if (badge) badge.textContent = count;
  if (btn) btn.disabled = count === 0;
}

/* =========================
   🔗 導航到購物車（保留 store 參數）
   ========================= */
function goCart() {
  const qs = new URLSearchParams(location.search);
  const store = qs.get("store") || localStorage.getItem("store_name") || "";
  if (!store) {
    alert("請先選擇有效分店！");
    return;
  }
  window.location.href = `?page=cart&store=${encodeURIComponent(store)}`;
}

/* =========================
   🧱 基本 UI 工具
   ========================= */
function createButton(text, className, onClick) {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.className = className;
  if (onClick) btn.onclick = onClick;
  return btn;
}

function createQuantityInput(onChange) {
  const quantityBox = document.createElement('div');
  quantityBox.className = 'quantity-input';

  const minusBtn = createButton('-', 'btn');
  const plusBtn = createButton('+', 'btn');
  const input = document.createElement('input');
  input.type = 'number';
  input.value = 0;
  input.min = 0;
  input.className = 'quantity-display';

  const sync = () => { if (onChange) onChange(Number(input.value || 0)); };

  minusBtn.onclick = () => {
    const current = parseInt(input.value) || 0;
    input.value = Math.max(0, current - 1);
    sync();
  };
  plusBtn.onclick = () => {
    const current = parseInt(input.value) || 0;
    input.value = Math.min(99, current + 1);
    sync();
  };
  input.addEventListener('input', () => {
    let v = parseInt(input.value);
    if (isNaN(v) || v < 0) v = 0;
    if (v > 99) v = 99;
    input.value = v;
    sync();
  });

  quantityBox.appendChild(minusBtn);
  quantityBox.appendChild(input);
  quantityBox.appendChild(plusBtn);

  return quantityBox;
}

/* =========================
   🧁 單張菜單卡片
   ========================= */
function createMenuCard(item) {
  const card = document.createElement('div');
  card.className = 'menu-card';

  const img = document.createElement('img');
  img.src = item.imgUrl;
  img.alt = item.name;
  img.className = 'menu-image';

  const info = document.createElement('div');
  info.className = 'menu-info';

  const name = document.createElement('h3');
  name.textContent = item.name;

  const price = document.createElement('p');
  price.textContent = `價格: $${item.price}`;
  price.className = 'menu-price';

  info.appendChild(name);
  info.appendChild(price);

  const actions = document.createElement('div');
  actions.className = 'menu-actions';

  // 數量 + 加入購物車（0 時禁用；加入後歸 0；防連點）
  let adding = false;
  const addButton = createButton('🛒 加入購物車', 'cart-btn add-to-cart');

  const quantityBox = createQuantityInput((q) => {
    addButton.disabled = (q <= 0);
  });
  const input = quantityBox.querySelector('input');
  addButton.disabled = true;

  addButton.onclick = () => {
    if (adding) return;
    const qty = parseInt(input.value);
    if (isNaN(qty) || qty <= 0) return;

    adding = true;
    setTimeout(() => (adding = false), 300);

    const cart = readCart();
    const existing = cart.find(i => String(i.menu_id) === String(item.menu_id));
    if (existing) {
      existing.quantity = Number(existing.quantity || 0) + qty;
    } else {
      cart.push({ ...item, quantity: qty });
    }
    writeCart(cart);

    // 視覺回饋 & 更新摘要列
    showToast(`${item.name} x${qty} 已加入購物車`);
    updateStickySummary();

    // 歸零 & 禁用按鈕
    input.value = 0;
    addButton.disabled = true;
  };

  actions.appendChild(quantityBox);
  actions.appendChild(addButton);

  card.appendChild(img);
  card.appendChild(info);
  card.appendChild(actions);

  return card;
}

/* =========================
   📄 主渲染
   ========================= */
export async function renderMenuPage(container) {
  container.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = '請選擇想購買的品項';
  title.className = 'order-title';
  container.appendChild(title);

  const menuArea = document.createElement('div');
  menuArea.className = 'menu-container';
  container.appendChild(menuArea);

  try {
    const response = await fetch(`${apiBaseUrl}/public_menus?ngrok-skip-browser-warning=true`);
    if (!response.ok) throw new Error('Load failed');

    const result = await response.json();
    const menu = result.menus || [];

    menu.forEach(item => {
      const card = createMenuCard(item);
      menuArea.appendChild(card);
    });

    // 底部摘要列（含徽章購物車）
    ensureStickySummary(goCart);
  } catch (err) {
    const warning = document.createElement('p');
    warning.textContent = '無法載入菜單，請稍後再試';
    warning.style.color = 'red';
    container.appendChild(warning);
    console.error('Menu load error: ', err);
  }
}
