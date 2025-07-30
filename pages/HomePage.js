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

  // 🚀 發送 API 取得分店清單
  fetch("http://127.0.0.1:5000/stores")
    .then(res => res.json())
    .then(data => {
      const storeNames = data.store_names || [];
      if (storeNames.length === 0) {
        alert("⚠️ 找不到可用分店，請聯絡店家！");
        return;
      }

      // 加入選項
      storeNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        storeSelect.appendChild(option);
      });

      // 儲存預設第一間
      localStorage.setItem("store_name", storeNames[0]);
    });

  // ⏺️ 選擇分店變更時同步儲存
  storeSelect.onchange = () => {
    const selected = storeSelect.value;
    localStorage.setItem("store_name", selected);
  };

  storeSection.appendChild(storeLabel);
  storeSection.appendChild(storeSelect);
  container.appendChild(storeSection);

  // 🔽 功能按鈕區塊
  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'button-group';

  const orderBtn = document.createElement('button');
  orderBtn.textContent = '開始點餐';
  orderBtn.className = 'nav-button';
  orderBtn.onclick = () => {
    const store = storeSelect.value;
    if (!store) {
      alert("請先選擇分店");
      return;
    }
    window.location.href = `?page=menu&store=${encodeURIComponent(store)}`;
  };

  const cartBtn = document.createElement('button');
  cartBtn.textContent = '查看購物車';
  cartBtn.className = 'nav-button';
  cartBtn.onclick = () => {
    const store = storeSelect.value;
    if (!store) {
      alert("請先選擇分店");
      return;
    }
    window.location.href = `?page=cart&store=${encodeURIComponent(store)}`;
  };

  const statusBtn = document.createElement('button');
  statusBtn.textContent = '查看訂單狀態';
  statusBtn.className = 'nav-button';
  statusBtn.onclick = () => {
    const store = storeSelect.value;
    if (!store) {
      alert("請先選擇分店");
      return;
    }
    window.location.href = `?page=confirm&store=${encodeURIComponent(store)}`;
  };

  buttonGroup.appendChild(orderBtn);
  buttonGroup.appendChild(cartBtn);
  buttonGroup.appendChild(statusBtn);

  container.appendChild(buttonGroup);
}
