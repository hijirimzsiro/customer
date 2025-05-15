export function renderHomePage(container) {
  container.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = '歡迎選購紅豆餅商品';
  title.className = 'home-title';

  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'button-group';

  const orderBtn = document.createElement('button');
  orderBtn.textContent = '開始點餐';
  orderBtn.className = 'nav-button';
  orderBtn.onclick = () => {
    window.location.href = '?page=order';
  };

  const cartBtn = document.createElement('button');
  cartBtn.textContent = '查看購物車';
  cartBtn.className = 'nav-button';
  cartBtn.onclick = () => {
    window.location.href = '?page=cart';
  };

  const statusBtn = document.createElement('button');
  statusBtn.textContent = '查看訂單狀態';
  statusBtn.className = 'nav-button';
  statusBtn.onclick = () => {
    window.location.href = '?page=confirm';
  };

  buttonGroup.appendChild(orderBtn);
  buttonGroup.appendChild(cartBtn);
  buttonGroup.appendChild(statusBtn);

  container.appendChild(title);
  container.appendChild(buttonGroup);
}
