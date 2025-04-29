export function createOrderStatus(orderNumber) {
  const wrapper = document.createElement('div');
  wrapper.className = 'order-status';

  const title = document.createElement('h3');
  title.textContent = '已收到您的訂單，請耐心等候～';
  wrapper.appendChild(title);

  const tip = document.createElement('p');
  tip.textContent = '您的訂單號碼是';
  wrapper.appendChild(tip);

  const numberDisplay = document.createElement('div');
  numberDisplay.className = 'order-number';
  numberDisplay.textContent = orderNumber ? `${orderNumber} 號` : '--';
  wrapper.appendChild(numberDisplay);

  const tip2 = document.createElement('p');
  tip2.textContent = '請等候叫號';
  wrapper.appendChild(tip2);

  const btnWrapper = document.createElement('div');
  btnWrapper.style.textAlign = 'center';
  btnWrapper.style.marginTop = '30px';

  const backBtn = document.createElement('button');
  backBtn.textContent = '我要加點';
  backBtn.className = 'next-btn';
  backBtn.onclick = () => {
    window.location.href = '?page=order';
  };

  btnWrapper.appendChild(backBtn);
  wrapper.appendChild(btnWrapper);

  return wrapper;
}
