export function renderConfirmationPage(container) {
  container.innerHTML = '';
  container.className = 'confirmation-container';

  const title = document.createElement('h3');
  title.textContent = '已收到您的訂單，請耐心等候～';
  title.className = 'confirm-title';
  container.appendChild(title);

  const sub = document.createElement('p');
  sub.textContent = '您的訂單號碼是';
  sub.className = 'confirm-sub';
  container.appendChild(sub);

  // ✅ 從 localStorage 取得當日訂單號碼（例如：4）
  const dailyNumber = localStorage.getItem('orderNumber');

  const numberWrapper = document.createElement('div');
  numberWrapper.className = 'order-number';
  numberWrapper.textContent = dailyNumber || '?';
  container.appendChild(numberWrapper);

  const unit = document.createElement('div');
  unit.className = 'order-unit';
  unit.textContent = '號';
  container.appendChild(unit);

  const wait = document.createElement('p');
  wait.textContent = '請等候叫號';
  wait.className = 'confirm-wait';
  container.appendChild(wait);

  const btn = document.createElement('button');
  btn.className = 'next-btn';
  btn.textContent = '我要加點';
  btn.onclick = () => window.location.href = '?page=menu';
  container.appendChild(btn);
}
