import { createCartList } from '../components/CartList.js';

export function renderCartPage(container) {
  container.innerHTML = '';

  // 標題
  const title = document.createElement('h2');
  title.textContent = '購物車內容';
  title.style.textAlign = 'center';
  container.appendChild(title);

  // 總計區塊
  const totalDiv = document.createElement('div');
  totalDiv.className = 'total-amount';
  totalDiv.textContent = '小計: $0';
  container.appendChild(totalDiv);

  // 購物車列表
  const { element: cartList, refresh } = createCartList(updateTotal, updateTotal);
  container.appendChild(cartList);

  // 按鈕區塊
  const btnGroup = document.createElement('div');
  btnGroup.className = 'btn-group';

  // 返回按鈕
  const backBtn = document.createElement('button');
  backBtn.textContent = '返回';
  backBtn.onclick = () => window.location.href = '?page=order';
  btnGroup.appendChild(backBtn);

  // 結帳按鈕
  const checkoutBtn = document.createElement('button');
  checkoutBtn.textContent = '下單';
  checkoutBtn.onclick = () => {
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
  btnGroup.appendChild(checkoutBtn);

  // 放入頁面
  container.appendChild(btnGroup);

  // 更新總價
  function updateTotal() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalDiv.textContent = `小計: $${total}`;
    refresh(); // 更新畫面元件
  }

  updateTotal(); // 初始化金額顯示
}
