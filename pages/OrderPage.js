import { createMenuCard } from '../components/MenuSelector.js';

const menu = [
  { name: '原味紅豆餅', price: 15, imgUrl: './images/redbean.png' },
  { name: '巧克力餅', price: 20, imgUrl: './images/choco.png' },
  { name: '奶油餅', price: 15, imgUrl: './images/cream.png' },
];

export function renderOrderPage(container) {
  container.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = '請選擇商品';
  title.style.textAlign = 'center';
  container.appendChild(title);

  const menuArea = document.createElement('div');
  menuArea.className = 'menu-container';

  menu.forEach(item => {
    const card = createMenuCard(item, (orderItem) => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push(orderItem);
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${orderItem.name} x${orderItem.quantity} 已加入購物車`);
    });
    menuArea.appendChild(card);
  });

  const btnWrapper = document.createElement('div');
  btnWrapper.style.textAlign = 'center';
  btnWrapper.style.marginTop = '30px';

  const toCartBtn = document.createElement('button');
  toCartBtn.textContent = '前往購物車';
  toCartBtn.className = 'next-btn';
  toCartBtn.onclick = () => {
    window.location.href = '?page=cart';
  };

  btnWrapper.appendChild(toCartBtn);
  container.appendChild(menuArea);
  container.appendChild(btnWrapper);
}
