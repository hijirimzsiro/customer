import { createQuantityInput } from './QuantityInput.js';

export function createMenuCard({ name, price, imgUrl }, onAddToCart) {
  const card = document.createElement('div');
  card.className = 'menu-card';

  const img = document.createElement('img');
  img.src = imgUrl;
  img.alt = name;

  const title = document.createElement('h3');
  title.textContent = name;

  const priceTag = document.createElement('p');
  priceTag.textContent = `價格：$${price}`;

  const quantityInput = createQuantityInput(1);

  const cartBtn = document.createElement('button');
  cartBtn.textContent = '🛒 加入購物車';
  cartBtn.className = 'cart-btn';

  cartBtn.onclick = () => {
    const quantity = parseInt(quantityInput.querySelector('input').value);
    if (typeof onAddToCart === 'function') {
      onAddToCart({ name, price, quantity });
    }
  };

  card.appendChild(img);
  card.appendChild(title);
  card.appendChild(priceTag);
  card.appendChild(quantityInput);
  card.appendChild(cartBtn);

  return card;
}
