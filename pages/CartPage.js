import { createCartList } from '../components/CartList.js';

export function renderCartPage(container) {
  container.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = '購物車內容';
  title.style.textAlign = 'center';
  container.appendChild(title);

  const totalDiv = document.createElement('div');
  totalDiv.className = 'total-amount';
  totalDiv.textContent = '小計：$0';
  container.appendChild(totalDiv);

  const { element: cartList, refresh } = createCartList(updateTotal, updateTotal);
  container.appendChild(cartList);

  const btnGroup = document.createElement('div');
  btnGroup.className = 'btn-group';

  const backBtn = document.createElement('button');
  backBtn.textContent = '返回';
  backBtn.onclick = () => window.location.href = '?page=order';

  const checkoutBtn = document.createElement('button');
  checkoutBtn.textContent = '下單';
  checkoutBtn.onclick = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      alert('購物車是空的喔！');
      return;
    }
    const orderNumber = Math.floor(Math.random() * 90000) + 10000;
    localStorage.setItem('orderNumber', orderNumber);
    localStorage.removeItem('cart');
    window.location.href = '?page=confirm';
  };

  btnGroup.appendChild(backBtn);
  btnGroup.appendChild(checkoutBtn);
  container.appendChild(btnGroup);

  function updateTotal() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalDiv.textContent = `小計：$${total}`;
    refresh();
  }

  updateTotal();
}
