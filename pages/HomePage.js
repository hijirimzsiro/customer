import { apiBaseUrl } from "../settings.js";

// 仍視為有效的訂單存活時間（毫秒）
const ACTIVE_ORDER_TTL = 6 * 60 * 60 * 1000; // 6 小時

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

  // ===== 主內容集中容器（絕對置中：水平＋垂直） =====
  const main = document.createElement("div");
  main.className = "home-main";
  container.appendChild(main);

  // 標題
  const title = document.createElement("h2");
  title.textContent = "歡迎選購紅豆餅";
  title.className = "home-title";
  main.appendChild(title);

  // 分店選擇區
  const storeSection = document.createElement("div");
  storeSection.className = "store-select-group";
  main.appendChild(storeSection);

  // 原生 select（無障礙與備援，平時隱藏）
  const nativeSelect = document.createElement("select");
  nativeSelect.className = "store-select native-hidden placeholder";
  nativeSelect.id = "storeSelect";
  storeSection.appendChild(nativeSelect);

  // 自訂選單容器
  const custom = document.createElement("div");
  custom.className = "custom-select";
  custom.innerHTML = `
    <button type="button" class="custom-select__toggle" aria-haspopup="listbox" aria-expanded="false">
      請先選擇分店
      <span class="custom-select__arrow" aria-hidden="true"></span>
    </button>
    <ul class="custom-select__menu" role="listbox" tabindex="-1" hidden></ul>
  `;
  storeSection.appendChild(custom);

  const toggleBtn = custom.querySelector(".custom-select__toggle");
  const menu = custom.querySelector(".custom-select__menu");

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
    viewBtn.onclick = () => {
      const store = getSelectedStore() || localStorage.getItem("store_name") || "";
      if (!store) {
        alert("請先選擇有效分店！");
        return;
      }
      window.location.href = `?page=confirm&store=${encodeURIComponent(store)}`;
    };

    const line2 = document.createElement("div");
    line2.className = "order-hint-sub";
    const storeHint = activeOrder.store ? `（${activeOrder.store}）` : "";
    line2.textContent = `點擊可查看最新進度${storeHint}`;

    infoWrap.appendChild(line1);
    infoWrap.appendChild(viewBtn);
    infoWrap.appendChild(line2);
    main.appendChild(infoWrap);
  }

  // 主行動按鈕
  const buttonGroup = document.createElement("div");
  buttonGroup.className = "button-group";

  const goOrder = document.createElement("button");
  goOrder.textContent = "開始點餐";
  goOrder.className = "nav-button";
  goOrder.onclick = () => {
    const store = getSelectedStore() || localStorage.getItem("store_name") || "";
    if (!store) {
      alert("請先選擇有效分店！");
      return;
    }
    window.location.href = `?page=menu&store=${encodeURIComponent(store)}`;
  };

  const viewStatus = document.createElement("button");
  viewStatus.textContent = "查看訂單狀態";
  viewStatus.className = "nav-button";
  viewStatus.onclick = () => {
    const store = getSelectedStore() || localStorage.getItem("store_name") || "";
    if (!store) {
      alert("請先選擇有效分店！");
      return;
    }
    window.location.href = `?page=confirm&store=${encodeURIComponent(store)}`;
  };

  buttonGroup.appendChild(goOrder);
  buttonGroup.appendChild(viewStatus);
  main.appendChild(buttonGroup);

  // ===== 載入分店列表（不預選、不儲存預設） =====
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

      // 原生 select：放 placeholder（隱藏於列表）、再塞選項
      const ph = document.createElement("option");
      ph.value = "";
      ph.textContent = "請先選擇分店";
      ph.disabled = true;
      ph.selected = true;
      ph.hidden = true;
      nativeSelect.appendChild(ph);

      // 自訂選單清單
      menu.innerHTML = "";

      storeNames.forEach((name) => {
        const trimmed = name.trim();

        // 原生 select option
        const opt = document.createElement("option");
        opt.value = trimmed;
        opt.textContent = trimmed;
        nativeSelect.appendChild(opt);

        // 自訂選單 item
        const li = document.createElement("li");
        li.className = "custom-select__option";
        li.setAttribute("role", "option");
        li.setAttribute("data-value", trimmed);
        li.textContent = trimmed;
        li.onclick = () => selectStore(trimmed);
        menu.appendChild(li);
      });

      // 預設顯示 placeholder
      toggleBtn.textContent = "請先選擇分店";
      toggleBtn.appendChild(Object.assign(document.createElement("span"), { className: "custom-select__arrow", ariaHidden: "true" }));
    })
    .catch((err) => {
      alert("發生錯誤：\n" + err.message);
      console.error(err);
    });

  // ===== 自訂選單交互 =====
  function openMenu() {
    menu.hidden = false;
    toggleBtn.setAttribute("aria-expanded", "true");
    // 讓菜單寬度永遠等於容器寬度（避免手機溢出）
    menu.style.minWidth = custom.clientWidth + "px";
  }
  function closeMenu() {
    menu.hidden = true;
    toggleBtn.setAttribute("aria-expanded", "false");
  }

  toggleBtn.addEventListener("click", () => {
    if (menu.hidden) openMenu();
    else closeMenu();
  });

  document.addEventListener("click", (e) => {
    if (!custom.contains(e.target)) closeMenu();
  });

  function selectStore(value, userTriggered = true) {
    // 同步自訂選單 UI
    toggleBtn.textContent = value;
    toggleBtn.appendChild(Object.assign(document.createElement("span"), { className: "custom-select__arrow", ariaHidden: "true" }));

    // 同步原生 select 值（備援）
    nativeSelect.value = value;
    nativeSelect.classList.remove("placeholder");

    // 存 localStorage
    localStorage.setItem("store_name", value);

    if (userTriggered) closeMenu();
  }

  function getSelectedStore() {
    return nativeSelect.value || "";
  }

  // 保留原來 onchange 的行為
  nativeSelect.onchange = () => {
    const selected = nativeSelect.value;
    if (!selected) {
      nativeSelect.classList.add("placeholder");
      return;
    }
    nativeSelect.classList.remove("placeholder");
    localStorage.setItem("store_name", selected);
    // 同步到自訂按鈕文字
    toggleBtn.textContent = selected;
    toggleBtn.appendChild(Object.assign(document.createElement("span"), { className: "custom-select__arrow", ariaHidden: "true" }));
  };
}
