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
  header.innerHTML = `<span>品項</span><span>價格</span>`;
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
  submitBtn.onclick = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      alert('購物車是空的唷！');
      return;
    }
    const orderNumber = Math.floor(Math.random() * 90000) + 10000;
    localStorage.setItem('orderNumber', orderNumber);
    localStorage.removeItem('cart');
    window.location.href = '?page=confirm';
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
