import { apiBaseUrl } from "../settings.js";

export function renderHomePage(container) {
  container.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = '歡迎選購紅豆餅';
  title.className = 'home-title';
  container.appendChild(title);

  // 🔽 分店選單區塊
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

  let isStoreValid = false; // ❗ 用來記錄 storeFromUrl 是否有效

// 🚀 發送 API 取得分店清單
fetch(`${apiBaseUrl}/stores`)
  .then(res => res.json())
  .then(data => {
    const storeNames = data.store_names || [];
    if (storeNames.length === 0) {
      alert("⚠️ 找不到可用分店，請聯絡店家！");
      return;
    }

    // 建立選項
    storeNames.forEach(name => {
      const option = document.createElement('option');
      option.value = name.trim(); // 去除空白
      option.textContent = name;
      storeSelect.appendChild(option);
    });

    // 嘗試設定網址中的 store 為預設值
    if (storeFromUrl) {
      // 強制比對：不分全形/半形、空白、大小寫
      const matchedStore = storeNames.find(name => name.trim() === storeFromUrl.trim());
      if (matchedStore) {
        storeSelect.value = matchedStore;
        isStoreValid = true;
        localStorage.setItem("store_name", matchedStore);
      } else {
        storeSelect.selectedIndex = -1;
        localStorage.removeItem("store_name");
      }
    } else {
      storeSelect.selectedIndex = -1;
    }
  });

  // 使用者變更選擇時儲存
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

  // 🔽 功能按鈕區塊
  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'button-group';

  function handleNav(targetPage) {
    const store = storeSelect.value;
    if (!store) {
      alert("❗ 請選擇有效分店後再繼續操作！");
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
