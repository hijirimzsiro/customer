// components/MenuSelector.js
import { createQuantityInput } from './QuantityInput.js';

export function createMenuCard({ id, name, price, imgUrl }, onAddToCart) {
  const card = document.createElement('div');
  card.className = 'menu-card';

  const img = document.createElement('img');
  img.src = imgUrl;
  img.alt = name;
  img.className = 'menu-image';

  const title = document.createElement('h3');
  title.textContent = name;

  const priceTag = document.createElement('p');
  priceTag.innerHTML = `價格: <span class="menu-price">$${price}</span>`;

  const quantityInput = createQuantityInput(1); // 預設數量為 1

  const cartBtn = document.createElement('button');
  cartBtn.textContent = '🛒 加入購物車';
  cartBtn.className = 'cart-btn';
  cartBtn.onclick = () => {
    const quantity = quantityInput.getValue();
    if (typeof onAddToCart === 'function') {
      onAddToCart({ id, name, price, quantity });
    }
  };

  card.appendChild(img);
  card.appendChild(title);
  card.appendChild(priceTag);
  card.appendChild(quantityInput);
  card.appendChild(cartBtn);

  return card;
}
