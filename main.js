import { renderOrderPage } from './pages/OrderPage.js';
import { renderCartPage } from './pages/CartPage.js';
import { renderConfirmationPage } from './pages/ConfirmationPage.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (!app) {
    console.error('找不到 #app 容器，請確認 HTML 結構是否正確。');
    return;
  }

  const search = new URLSearchParams(window.location.search);
  const page = search.get('page');

  // 移除之前載入的樣式
  document.querySelectorAll('link[rel=stylesheet]').forEach(link => {
    if (link.href.includes('orderPage.css') || link.href.includes('cartPage.css') || link.href.includes('confirmationPage.css')) {
      link.remove();
    }
  });

  // 動態載入對應 CSS
  function loadPageCss(fileName) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `style/${fileName}`;
    document.head.appendChild(link);
  }

  if (page === 'cart') {
    loadPageCss('cartPage.css');
    renderCartPage(app);
  } else if (page === 'confirm') {
    loadPageCss('confirmationPage.css');
    renderConfirmationPage(app);
  } else {
    loadPageCss('orderPage.css');
    renderOrderPage(app);
  }
});
