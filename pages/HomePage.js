import { apiBaseUrl } from "../settings.js";

// 仍視為有效的訂單存活時間（毫秒）
const ACTIVE_ORDER_TTL = 6 * 60 * 60 * 1000; // 6 小時

function getCartCount() {
  try {
    const raw = localStorage.getItem("cart");
    if (!raw) return 0;
    const items = JSON.parse(raw);
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
  } catch {
    return 0;
  }
}

function getActiveLastOrder() {
  try {
    const raw = localStorage.getItem("last_order");
    if (!raw) return null;
    const obj = JSON.parse(raw);
    const now = Date.now();
    if (!obj.created_at || now - Number(obj.created_at) > ACTIVE_ORDER_TTL) return null;
    return obj;
  } catch {
    return null;
  }
}

export function renderHomePage(container) {
  // 保留其它頁面可能已存在的 class，僅加入 home-page 控制此頁面布局
  container.classList.add("home-page");
  container.innerHTML = "";

  // ===== 右上角圖示列（固定，不影響主內容排版） =====
  const topBar = document.createElement("div");
  topBar.className = "top-bar";

  const actionsRight = document.createElement("div");
  actionsRight.className = "top-actions";

  const handleNav = (targetPage) => {
    const storeSelectEl = document.getElementById("storeSelect");
    const store = storeSelectEl ? storeSelectEl.value : "";
    if (!store) {
      alert("請先選擇有效分店！");
      return;
    }
    window.location.href = `?page=${targetPage}&store=${encodeURIComponent(store)}`;
  };

  // 訂單狀態圖示：保留（隨時可看叫號）
  const statusIconBtn = document.createElement("button");
  statusIconBtn.className = "icon-btn";
  statusIconBtn.title = "查看訂單狀態";
  statusIconBtn.setAttribute("aria-label", "查看訂單狀態");
  statusIconBtn.innerHTML = `
    <svg viewBox="0 0 24 24" class="icon-svg" aria-hidden="true">
      <path d="M19 3H5a2 2 0 0 0-2 2v14l4-4h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-3.59 6.41-1.42 1.42L12 8.83l-1.99 2-1.42-1.41L12 6l3.41 3.41Z"></path>
    </svg>`;
  statusIconBtn.onclick = () => handleNav("confirm");
  actionsRight.appendChild(statusIconBtn);

  // 購物車圖示：僅在有東西時顯示
  const cartCount = getCartCount();
  if (cartCount > 0) {
    const cartIconBtn = document.createElement("button");
    cartIconBtn.className = "icon-btn";
    cartIconBtn.title = `查看購物車（${cartCount}）`;
    cartIconBtn.setAttribute("aria-label", "查看購物車");
    cartIconBtn.innerHTML = `
      <svg viewBox="0 0 24 24" class="icon-svg" aria-hidden="true">
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2Zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2ZM7.2 14h9.45c.84 0 1.57-.52 1.85-1.3l2.4-6.4A1 1 0 0 0 20 5H6.21l-.94-2H2v2h1.6l3.6 8.59-.9 2.05C5.98 16.37 6.8 17 7.76 17H20v-2H7.2Z"></path>
      </svg>`;
    cartIconBtn.onclick = () => handleNav("cart");
    actionsRight.appendChild(cartIconBtn);
  }

  topBar.appendChild(actionsRight);
  container.appendChild(topBar);

  // ===== 主內容集中容器（確保桌機與手機視覺一致） =====
  const main = document.createElement("div");
  main.className = "home-main";
  container.appendChild(main);

  // 標題
  const title = document.createElement("h2");
  title.textContent = "歡迎選購紅豆餅";
  title.className = "home-title";
  main.appendChild(title);

  // 分店選擇（置中）
  const storeSection = document.createElement("div");
  storeSection.className = "store-select-group";

  const storeLabel = document.createElement("label");
  storeLabel.textContent = "請先選擇分店：";
  storeLabel.htmlFor = "storeSelect";
  storeLabel.className = "store-label";

  const storeSelect = document.createElement("select");
  storeSelect.className = "store-select";
  storeSelect.id = "storeSelect";

  storeSection.appendChild(storeLabel);
  storeSection.appendChild(storeSelect);
  main.appendChild(storeSection);

  // 最近訂單叫號提示（有才顯示）
  const activeOrder = getActiveLastOrder();
  if (activeOrder) {
    const infoWrap = document.createElement("div");
    infoWrap.className = "order-hint-card";

    const line1 = document.createElement("div");
    line1.className = "order-hint-title";
    const num = activeOrder.order_number || activeOrder.order_id || "-";
    line1.textContent = `你目前的叫號：${num}`;

    const viewBtn = document.createElement("button");
    viewBtn.textContent = "查看訂單進度";
    viewBtn.className = "nav-button small";
    viewBtn.onclick = () => handleNav("confirm");

    const line2 = document.createElement("div");
    line2.className = "order-hint-sub";
    const storeHint = activeOrder.store ? `（${activeOrder.store}）` : "";
    line2.textContent = `點擊可查看最新進度${storeHint}`;

    infoWrap.appendChild(line1);
    infoWrap.appendChild(viewBtn);
    infoWrap.appendChild(line2);
    main.appendChild(infoWrap);
  }

  // 主行動：開始點餐
  const buttonGroup = document.createElement("div");
  buttonGroup.className = "button-group";

  const orderBtn = document.createElement("button");
  orderBtn.textContent = "開始點餐";
  orderBtn.className = "nav-button";
  orderBtn.onclick = () => handleNav("menu");

  buttonGroup.appendChild(orderBtn);
  main.appendChild(buttonGroup);

  // ===== 載入分店列表並處理預選 =====
  const params = new URLSearchParams(window.location.search);
  const storeFromUrl = params.get("store") || "";
  const storeFromLocal = localStorage.getItem("store_name") || "";

  fetch(`${apiBaseUrl}/stores?ngrok-skip-browser-warning=true`)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP 錯誤：${res.status}`);
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        throw new Error("回傳的不是 JSON，可能是 HTML 錯誤頁或被攔下");
      }
      return res.json();
    })
    .then((data) => {
      const storeNames = data.store_names || [];
      if (storeNames.length === 0) {
        alert("找不到可用分店，請聯絡店家！");
        return;
      }
      storeNames.forEach((name) => {
        const opt = document.createElement("option");
        opt.value = name.trim();
        opt.textContent = name;
        storeSelect.appendChild(opt);
      });

      if (storeFromUrl && storeNames.includes(storeFromUrl)) {
        storeSelect.value = storeFromUrl;
      } else if (storeFromLocal && storeNames.includes(storeFromLocal)) {
        storeSelect.value = storeFromLocal;
      } else {
        storeSelect.value = storeNames[0];
      }
      localStorage.setItem("store_name", storeSelect.value);
    })
    .catch((err) => {
      alert("發生錯誤：\n" + err.message);
      console.error(err);
    });

  storeSelect.onchange = () => {
    const selected = storeSelect.value;
    if (selected) localStorage.setItem("store_name", selected);
  };
}
