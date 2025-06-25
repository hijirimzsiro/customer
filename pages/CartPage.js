import { createCartList } from '../components/CartList.js';

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
  backBtn.onclick = () => window.location.href = '?page=order';

  const submitBtn = document.createElement('button');
  submitBtn.textContent = '下單';
  submitBtn.onclick = async () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      alert('購物車是空的唷！');
      return;
    }

    const items = cart.map(item => ({
      menu_id: item.id, // ✅ 修正為後端接受的欄位
      quantity: item.quantity
    }));

    try {
   const response = await fetch("http://127.0.0.1:5000/public_place_order", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ items })
});


      if (!response.ok) throw new Error("送出訂單失敗");

      const result = await response.json();
      localStorage.setItem('orderNumber', result.order_id); // ✅ 儲存訂單編號
      localStorage.removeItem('cart');
      window.location.href = '?page=confirm';
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
    refresh();
  }

  updateTotal();
}
