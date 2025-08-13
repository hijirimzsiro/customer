import { apiBaseUrl } from "../settings.js";

function createButton(text, className, onClick) {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.className = className;
  if (onClick) btn.onclick = onClick;
  return btn;
}

function createQuantityInput() {
  const quantityBox = document.createElement('div');
  quantityBox.className = 'quantity-input';

  const minusBtn = createButton('-', 'btn');
  const plusBtn = createButton('+', 'btn');
  const input = document.createElement('input');
  input.type = 'number';
  input.value = 0;
  input.min = 0;
  input.className = 'quantity-display';

  minusBtn.onclick = () => {
    const current = parseInt(input.value);
    if (current > 0) input.value = current - 1;
  };
  plusBtn.onclick = () => {
    const current = parseInt(input.value);
    input.value = current + 1;
  };

  quantityBox.appendChild(minusBtn);
  quantityBox.appendChild(input);
  quantityBox.appendChild(plusBtn);

  return quantityBox;
}

function createMenuCard(item) {
  const card = document.createElement('div');
  card.className = 'menu-card';

  const img = document.createElement('img');
  img.src = item.imgUrl;
  img.alt = item.name;
  img.className = 'menu-image';

  const info = document.createElement('div');
  info.className = 'menu-info';

  const name = document.createElement('h3');
  name.textContent = item.name;

  const price = document.createElement('p');
  price.textContent = `價格: $${item.price}`;
  price.className = 'menu-price';

  info.appendChild(name);
  info.appendChild(price);

  const actions = document.createElement('div');
  actions.className = 'menu-actions';

  const quantityBox = createQuantityInput();
  const input = quantityBox.querySelector('input');

  const addButton = createButton('🛒 加入購物車', 'cart-btn', () => {
    const qty = parseInt(input.value);
    if (qty <= 0 || isNaN(qty)) {
      alert('請選擇數量');
      return;
    }
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(i => i.menu_id === item.menu_id);
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({ ...item, quantity: qty });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${item.name} x${qty} 已加入購物車`);
    input.value = 0;
  });

  actions.appendChild(quantityBox);
  actions.appendChild(addButton);

  card.appendChild(img);
  card.appendChild(info);
  card.appendChild(actions);

  return card;
}

export async function renderMenuPage(container) {
  container.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = '請選擇想購買的品項';
  title.className = 'order-title';
  container.appendChild(title);

  const menuArea = document.createElement('div');
  menuArea.className = 'menu-container';
  container.appendChild(menuArea);

  const quantityInputs = [];

  try {
    // ✅ GET 使用 query 參數避免預檢
    const response = await fetch(`${apiBaseUrl}/public_menus?ngrok-skip-browser-warning=true`);
    if (!response.ok) throw new Error('Load failed');

    const result = await response.json();
    const menu = result.menus;

    menu.forEach(item => {
      const card = createMenuCard(item);
      const input = card.querySelector('input');
      menuArea.appendChild(card);
      quantityInputs.push({ item, input });
    });

    const goToCart = createButton('前往購物車', 'next-btn', () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      quantityInputs.forEach(({ item, input }) => {
        const qty = parseInt(input.value);
        if (qty > 0 && !isNaN(qty)) {
          const existing = cart.find(i => i.menu_id === item.menu_id);
          if (existing) existing.quantity += qty;
          else cart.push({ ...item, quantity: qty });
          input.value = 0;
        }
      });
      localStorage.setItem('cart', JSON.stringify(cart));
      window.location.href = '?page=cart';
    });

    container.appendChild(goToCart);

  } catch (err) {
    const warning = document.createElement('p');
    warning.textContent = '無法載入菜單，請稍後再試';
    warning.style.color = 'red';
    container.appendChild(warning);
    console.error('Menu load error: ', err);
  }
}
