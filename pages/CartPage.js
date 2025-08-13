import { createCartList } from '../components/CartList.js';
import { apiBaseUrl } from "../settings.js";

// ✅ 取得分店名稱（網址優先，否則 localStorage）
function getCurrentStoreName() {
  const urlStore = new URLSearchParams(window.location.search).get("store");
  if (urlStore) {
    localStorage.setItem("store_name", urlStore);
    return urlStore;
  }
  return localStorage.getItem("store_name");
}

// ✅ 讀/寫購物車
function readCart() {
  try { return JSON.parse(localStorage.getItem('cart') || '[]'); }
  catch { return []; }
}
function writeCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// ✅ 嘗試把 cart 中缺少 menu_id 的品項補齊（用 /public_menus 查表）
async function hydrateMenuIds(cart) {
  // 如果都已經有 menu_id，就直接回傳
  if (cart.every(it => it.menu_id)) return cart;

  // 取一次菜單，建立 name -> menu 及（可選）price -> menu 的查表
  const res = await fetch(`${apiBaseUrl}/public_menus`);
  if (!res.ok) throw new Error(`載入菜單失敗（HTTP ${res.status}）`);
  const data = await res.json();
  const menus = Array.isArray(data?.menus) ? data.menus : [];

  const byName = new Map(menus.map(m => [String(m.name).trim(), m]));
  const byNamePrice = new Map(menus.map(m => [`${String(m.name).trim()}|${m.price}`, m]));

  let changed = false;

  const fixed = cart.map(item => {
    if (item.menu_id) return item; // 已有 id
    const name = String(item.name || '').trim();
    const price = item.price;

    let m = byName.get(name) || byNamePrice.get(`${name}|${price}`);
    if (m) {
      changed = true;
      return { ...item, menu_id: m.menu_id, price: m.price ?? item.price, imgUrl: item.imgUrl ?? m.imgUrl };
    }
    return item; // 先保留，後面再檢查是否仍缺
  });

  if (changed) writeCart(fixed);
  return fixed;
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
  itemHeader.innerText = '品項';

  const quantityHeader = document.createElement('span');
  quantityHeader.style.flex = '1';
  quantityHeader.style.textAlign = 'center';
  quantityHeader.innerText = '數量';

  const priceHeader = document.createElement('span');
  priceHeader.style.flex = '1.75';
  priceHeader.style.textAlign = 'right';
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
  backBtn.className = 'cart-back-btn';   // ✅ 獨立樣式
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
  submitBtn.className = 'cart-submit-btn'; // ✅ 獨立樣式
  submitBtn.textContent = '下單';
  submitBtn.onclick = async () => {
    let cart = readCart();
    if (cart.length === 0) {
      alert('購物車是空的喔~');
      return;
    }

    const store_name = getCurrentStoreName();
    if (!store_name) {
      alert("⚠️ 未指定分店，請回首頁選擇分店後再下單");
      return;
    }

    try {
      // 1) 自動補齊缺少的 menu_id
      cart = await hydrateMenuIds(cart);

      // 2) 再次檢查是否還有缺少 menu_id 或 quantity
      const missing = cart.filter(it => !it.menu_id || !(Number.isInteger(it.quantity) || typeof it.quantity === 'number'));
      if (missing.length) {
        const names = missing.map(m => m.name || '(未命名)').join('、');
        alert(
          `以下品項缺少 menu_id 或數量，請刪除後重新加入：\n${names}`
        );
        console.warn('缺少必要欄位的品項：', missing);
        return;
      }

      // 3) 組 payload（相容多種後端鍵名）
      const payload = {
        store_name,
        store: store_name,
        items: cart.map(item => ({
          menu_id: item.menu_id,
          quantity: item.quantity,
          qty: item.quantity
        }))
      };

      const url = `${apiBaseUrl}/public_place_order`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const text = await response.text();
      if (!response.ok) {
        console.error("下單失敗，伺服器回應：", text);
        alert(`發送訂單失敗（HTTP ${response.status}）：\n${text || '（無訊息）'}`);
        return;
      }

      let result; try { result = JSON.parse(text); } catch { result = {}; }

      if (!result.order_number) {
        alert(`⚠️ 後端未傳回訂單編號：\n${text || '(無詳細訊息)'}`);
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
      console.error("送出訂單錯誤：", err);
      alert(`發送訂單失敗，請稍後再試！\n${err?.message || ''}`);
    }
  };

  btnGroup.appendChild(backBtn);
  btnGroup.appendChild(submitBtn);
  card.appendChild(btnGroup);

  container.appendChild(card);

  function updateTotal() {
    const cart = readCart();
    const totalAmount = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
    total.textContent = `小計: $${totalAmount}`;
    if (typeof refresh === 'function') refresh();
  }

  updateTotal();
}
