import { renderHomePage } from './pages/HomePage.js';
import { renderMenuPage } from './pages/menuPage.js';
import { renderOrderPage } from './pages/OrderPage.js';
import { renderCartPage } from './pages/CartPage.js';
import { renderConfirmationPage } from './pages/ConfirmationPage.js';

// 頁面與對應函式及 CSS 的映射
const pages = {
  home: { render: renderHomePage, css: 'homePage.css' },
  menu: { render: renderMenuPage, css: 'menuPage.css' },
  order: { render: renderOrderPage, css: 'orderPage.css' },
  cart: { render: renderCartPage, css: 'cartPage.css' },
  confirm: { render: renderConfirmationPage, css: 'confirmationPage.css' },
};

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (!app) {
    console.error('找不到 #app 容器，請確認 HTML 結構是否正確。');
    return;
  }

  const search = new URLSearchParams(window.location.search);
  const page = search.get('page') || 'home'; // 預設顯示 home 頁面

  // 清除原有樣式
  document.querySelectorAll('link[rel=stylesheet]').forEach(link => {
    if (link.href.includes('Page.css')) link.remove();
  });

  // 動態載入 CSS 並渲染對應頁面
  if (pages[page]) {
    const { render, css } = pages[page];
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `style/${css}`;
    document.head.appendChild(link);
    render(app);
  } else {
    console.warn(`未定義的頁面: ${page}，自動導向 menu`);
    window.location.href = '?page=home';
  }
});
