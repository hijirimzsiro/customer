// components/MenuSelector.js
import { createQuantityInput } from './QuantityInput.js';

export function createMenuCard({ id, name, price, imgUrl }, onAddToCart) {
  const card = document.createElement('div');
  card.className = 'menu-card';

  // 左側圖片
  const img = document.createElement('img');
  img.src = imgUrl;
  img.alt = name;
  img.className = 'menu-image';

  // 中間名稱（單獨一欄）
  const nameBox = document.createElement('div');
  nameBox.className = 'menu-info';
  const title = document.createElement('h3');
  title.className = 'menu-name';
  title.textContent = name;
  nameBox.appendChild(title);

  // 右側資訊列：價格 + 數量 + 按鈕
  const actions = document.createElement('div');
  actions.className = 'menu-actions';

  const priceTag = document.createElement('p');
  priceTag.className = 'menu-price';
  priceTag.textContent = `價格: $${price}`;

  const quantityInput = createQuantityInput(0); // 預設數量為 0

  const cartBtn = document.createElement('button');
  cartBtn.textContent = '加入購物車';
  cartBtn.className = 'cart-btn';
  cartBtn.onclick = () => {
    const quantity = quantityInput.getValue();
    if (typeof onAddToCart === 'function') {
      onAddToCart({ id, name, price, quantity });
    }
  };

  actions.appendChild(priceTag);
  actions.appendChild(quantityInput);
  actions.appendChild(cartBtn);

  // 組裝卡片：圖片、名稱、右側動作
  card.appendChild(img);
  card.appendChild(nameBox);
  card.appendChild(actions);

  return card;
}
