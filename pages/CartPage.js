import { createCartList } from '../components/CartList.js';

// ✅ 公用方法：取得當前分店名稱（從網址或 localStorage）
function getCurrentStoreName() {
  const urlStore = new URLSearchParams(window.location.search).get("store");
  if (urlStore) {
    localStorage.setItem("store_name", urlStore); // 同步儲存
    return urlStore;
  }
  return localStorage.getItem("store_name");
}

export function renderCartPage(container) {
  container.innerHTML = '';
  container.className = 'cart-page-container';

  const card = document.createElement('div');
  card.className = 'cart-box';

  const title = document.createElement('h3');
  title.className = 'cart-title';
  title.textContent = '購物車';
  card.appendChild(title);

  const header = document.createElement('div');
  header.className = 'cart-header';

  const itemHeader = document.createElement('span');
  itemHeader.style.flex = '1.9';
  itemHeader.style.textAlign = 'left';
  itemHeader.style.paddingLeft = '12px';
  itemHeader.innerText = '品項';

  const quantityHeader = document.createElement('span');
  quantityHeader.style.flex = '1';
  quantityHeader.style.textAlign = 'center';
  quantityHeader.innerText = '數量';

  const priceHeader = document.createElement('span');
  priceHeader.style.flex = '1.75';
  priceHeader.style.textAlign = 'right';
  priceHeader.style.paddingRight = '32px';
  priceHeader.innerText = '價格';

  header.appendChild(itemHeader);
  header.appendChild(quantityHeader);
  header.appendChild(priceHeader);
  card.appendChild(header);

  const { element: cartList, refresh } = createCartList(updateTotal, updateTotal);
  card.appendChild(cartList);

  const total = document.createElement('div');
  total.className = 'cart-total';
  total.textContent = '小計: $0';
  card.appendChild(total);

  const btnGroup = document.createElement('div');
  btnGroup.className = 'cart-btn-group';

  const backBtn = document.createElement('button');
  backBtn.textContent = '返回';
  backBtn.onclick = () => {
    const store = getCurrentStoreName();
    if (store) {
      window.location.href = `?page=menu&store=${encodeURIComponent(store)}`;
    } else {
      window.location.href = '?page=menu';
    }
  };

  const submitBtn = document.createElement('button');
  submitBtn.textContent = '下單';
  submitBtn.onclick = async () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      alert('購物車是空的喔~');
      return;
    }

    const store_name = getCurrentStoreName();
    if (!store_name) {
      alert("⚠️ 未指定分店，請重新選擇分店");
      return;
    }

    const items = cart.map(item => ({
      menu_id: item.menu_id,
      quantity: item.quantity
    }));

    try {
      const response = await fetch("http://127.0.0.1:5000/public_place_order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ store_name, items })
      });

      if (!response.ok) throw new Error("送出訂單失敗");

      const result = await response.json();
      if (!result.order_number) {
        alert("⚠️ 後端未傳回訂單編號，請聯絡店家");
        return;
      }

      localStorage.setItem('orderNumber', result.order_number);
      localStorage.removeItem('cart');

      if (result.order_id) {
        localStorage.setItem('latestOrderId', result.order_id);
      } else {
        console.warn('⚠️ 後端未回傳訂單 ID');
      }

      window.location.href = `?page=confirm&store=${encodeURIComponent(store_name)}`;
    } catch (err) {
      alert("發送訂單失敗，請稍後再試！");
      console.error("送出訂單錯誤:", err);
    }
  };

  btnGroup.appendChild(backBtn);
  btnGroup.appendChild(submitBtn);
  card.appendChild(btnGroup);

  container.appendChild(card);

  function updateTotal() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    total.textContent = `小計: $${totalAmount}`;

    if (typeof refresh === 'function') {
      refresh();
    }
  }

  updateTotal();
}
