export async function renderMenuPage(container) {
  container.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = '請選擇想購買的品項';
  title.className = 'order-title';
  container.appendChild(title);

  const menuArea = document.createElement('div');
  menuArea.className = 'menu-container';
  container.appendChild(menuArea);

  try {
    const response = await fetch('http://127.0.0.1:5000/public_menus');
    if (!response.ok) throw new Error('Load failed');

    const result = await response.json();
    const menu = result.menus;

    menu.forEach(item => {
      const card = document.createElement('div');
      card.className = 'menu-card';

      const img = document.createElement('img');
      img.src = item.imgUrl;
      img.alt = item.name;
      img.className = 'menu-image';
      card.appendChild(img);

      const info = document.createElement('div');
      info.className = 'menu-info';

      const name = document.createElement('h3');
      name.textContent = item.name;
      info.appendChild(name);

      const price = document.createElement('p');
      price.textContent = `價格: $${item.price}`;
      price.className = 'menu-price';
      info.appendChild(price);

      card.appendChild(info);

      const actions = document.createElement('div');
      actions.className = 'menu-actions';

      const quantityBox = document.createElement('div');
      quantityBox.className = 'quantity-input';

      const minusBtn = document.createElement('button');
      minusBtn.textContent = '-';
      minusBtn.className = 'quantity-btn';

      const quantity = document.createElement('input');
      quantity.type = 'number';
      quantity.value = 0;
      quantity.min = 1;
      quantity.className = 'quantity-display';

      const plusBtn = document.createElement('button');
      plusBtn.textContent = '+';
      plusBtn.className = 'quantity-btn';

      minusBtn.onclick = () => {
        if (parseInt(quantity.value) > 1) {
          quantity.value = parseInt(quantity.value) - 1;
        }
      };

      plusBtn.onclick = () => {
        quantity.value = parseInt(quantity.value) + 1;
      };

      quantityBox.appendChild(minusBtn);
      quantityBox.appendChild(quantity);
      quantityBox.appendChild(plusBtn);

      const addButton = document.createElement('button');
      addButton.innerHTML = '🛒 加入購物車';
      addButton.className = 'cart-btn';
      addButton.onclick = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const qty = parseInt(quantity.value);
        const existingItem = cart.find(i => i.menu_id === item.menu_id);

        if (existingItem) {
          existingItem.quantity += qty;
        } else {
          cart.push({ ...item, quantity: qty });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('✅ 已加入購物車');
      };

      actions.appendChild(quantityBox);
      actions.appendChild(addButton);

      card.appendChild(actions);
      menuArea.appendChild(card);
    });

    // ✅ 新增：底部「前往購物車」按鈕
    const goToCart = document.createElement('button');
    goToCart.textContent = '前往購物車';
    goToCart.className = 'go-cart-btn';
    goToCart.onclick = () => {
      window.location.href = '?page=cart';
    };
    container.appendChild(goToCart);
  } catch (err) {
    const warning = document.createElement('p');
    warning.textContent = '⚠️ 無法載入菜單，請稍後再試';
    warning.style.color = 'red';
    container.appendChild(warning);
    console.error('Menu load error: ', err);
  }
}
