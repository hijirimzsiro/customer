import { apiBaseUrl } from "../settings.js";

export function renderHomePage(container) {
  container.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = '歡迎選購紅豆餅';
  title.className = 'home-title';
  container.appendChild(title);

  const storeSection = document.createElement('div');
  storeSection.className = 'store-select-group';

  const storeLabel = document.createElement('label');
  storeLabel.textContent = '請選擇分店：';
  storeLabel.style.marginRight = '8px';

  const storeSelect = document.createElement('select');
  storeSelect.className = 'store-select';
  storeSelect.id = 'storeSelect';

  const params = new URLSearchParams(window.location.search);
  const storeFromUrl = params.get("store");

  let isStoreValid = false;

  // ✅ 用 query 參數略過 ngrok 警告頁，避免預檢
  fetch(`${apiBaseUrl}/stores?ngrok-skip-browser-warning=true`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP 錯誤：${res.status}`);
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("回傳的不是 JSON（可能是 HTML 錯誤頁或被攔下）");
      }
      return res.json();
    })
    .then(data => {
      const storeNames = data.store_names || [];
      if (storeNames.length === 0) {
        alert("找不到可用分店，請聯絡店家！");
        return;
      }
      storeNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name.trim();
        option.textContent = name;
        storeSelect.appendChild(option);
      });
    })
    .catch(error => {
      alert("發生錯誤：\n" + error.message);
      console.error("Fetch 錯誤：", error);
    });

  storeSelect.onchange = () => {
    const selected = storeSelect.value;
    if (selected) {
      isStoreValid = true;
      localStorage.setItem("store_name", selected);
    }
  };

  storeSection.appendChild(storeLabel);
  storeSection.appendChild(storeSelect);
  container.appendChild(storeSection);

  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'button-group';

  function handleNav(targetPage) {
    const store = storeSelect.value;
    if (!store) {
      alert("請先選擇有效分店！");
      return;
    }
    window.location.href = `?page=${targetPage}&store=${encodeURIComponent(store)}`;
  }

  const orderBtn = document.createElement('button');
  orderBtn.textContent = '開始點餐';
  orderBtn.className = 'nav-button';
  orderBtn.onclick = () => handleNav("menu");

  const cartBtn = document.createElement('button');
  cartBtn.textContent = '查看購物車';
  cartBtn.className = 'nav-button';
  cartBtn.onclick = () => handleNav("cart");

  const statusBtn = document.createElement('button');
  statusBtn.textContent = '查看訂單狀態';
  statusBtn.className = 'nav-button';
  statusBtn.onclick = () => handleNav("confirm");

  buttonGroup.appendChild(orderBtn);
  buttonGroup.appendChild(cartBtn);
  buttonGroup.appendChild(statusBtn);
  container.appendChild(buttonGroup);
}
