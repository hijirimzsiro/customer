const API_BASE_URL = "http://127.0.0.1:5000"; // or your backend address

import { createMenuCard } from '../components/MenuSelector.js';

const menu = [
  { id: '原味紅豆餅', name: '原味紅豆餅', price: 15, imgUrl: './images/紅豆.png' },
  { id: '奶油餅', name: '奶油餅', price: 15, imgUrl: './images/奶油.png' },
  { id: '花生餅', name: '花生餅', price: 15, imgUrl: './images/花生.jpg' },
  { id: '巧克力餅', name: '巧克力餅', price: 20, imgUrl: './images/巧克力.png' },
  { id: 'OREO鮮奶油餅', name: 'OREO鮮奶油餅', price: 20, imgUrl: './images/OREO鮮奶油.jpg' },
  { id: '可可布朗尼餅', name: '可可布朗尼餅', price: 20, imgUrl: './images/可可布朗尼.jpg' },
  { id: '紅豆麻糬餅', name: '紅豆麻糬餅', price: 20, imgUrl: './images/紅豆麻糬.jpeg' },
  { id: '抹茶麻糬餅', name: '抹茶麻糬餅', price: 20, imgUrl: './images/抹茶麻糬.jpg' },
  { id: '黑芝麻鮮奶油餅', name: '黑芝麻鮮奶油餅', price: 20, imgUrl: './images/黑芝麻鮮奶油.jpg' },
  { id: '珍珠鮮奶油餅', name: '珍珠鮮奶油餅', price: 20, imgUrl: './images/珍珠鮮奶油.jpg' }
];


export function renderOrderPage(container) {
  container.innerHTML = '';

  // ✅ 外層容器 - 套用背景與邊界
  const pageWrapper = document.createElement('div');
  pageWrapper.className = 'order-page-container';

  // ✅ 標題 - 改用 .order-title class 套用樣式
  const title = document.createElement('h2');
  title.textContent = '請選擇想購買的品項';
  title.className = 'order-title';
  pageWrapper.appendChild(title);

  const menuArea = document.createElement('div');
  menuArea.className = 'menu-container';

  menu.forEach(item => {
    const card = createMenuCard(item, (orderItem) => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = cart.find(i => i.id === orderItem.id);
      if (existing) {
        existing.quantity += orderItem.quantity;
      } else {
        cart.push(orderItem);
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${orderItem.name} x${orderItem.quantity} 已加入購物車`);
    });
    menuArea.appendChild(card);
  });

  const btnWrapper = document.createElement('div');
  btnWrapper.style.textAlign = 'center';
  btnWrapper.style.marginTop = '20px';

  const toCartBtn = document.createElement('button');
  toCartBtn.textContent = '前往購物車';
  toCartBtn.className = 'next-btn';
  toCartBtn.onclick = () => {
    window.location.href = '?page=cart';
  };

  btnWrapper.appendChild(toCartBtn);

  // ✅ 加入背景容器中
  pageWrapper.appendChild(menuArea);
  pageWrapper.appendChild(btnWrapper);
  container.appendChild(pageWrapper);
}
