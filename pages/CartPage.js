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
  header.innerHTML = `
    <span style="flex: 1; text-align: left; padding-left: 12px;">品項</span>
    <span style="flex: 1; text-align: center;">數量</span>
    <span style="flex: 1; text-align: right; padding-right: 8px;">價格</span>
  `;
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
      menu_name: item.name,
      quantity: item.quantity
    }));

    const total_price = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
      const response = await fetch("http://127.0.0.1:5000/orders/place_order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ items, total_price })
      });

      if (!response.ok) throw new Error("送出訂單失敗");

      const orderNumber = Math.floor(Math.random() * 90000) + 10000;
      localStorage.setItem('orderNumber', orderNumber);
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
