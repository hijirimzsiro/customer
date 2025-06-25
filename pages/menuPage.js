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
    const response = await fetch('http://127.0.0.1:5000/public_menus'); // ✅ 改為公開 API
    if (!response.ok) throw new Error('Load failed');

    const result = await response.json();
    const menu = result.menus;

    menu.forEach(item => {
      const card = document.createElement('div');
      card.className = 'menu-card';

      const img = document.createElement('img');
      img.src = item.imgUrl; // ✅ 圖片網址，記得在 public/images 放對應圖片
      img.alt = item.name;
      img.className = 'menu-img';
      card.appendChild(img);

      const info = document.createElement('div');
      info.className = 'menu-info';

      const name = document.createElement('h3');
      name.textContent = item.name;
      info.appendChild(name);

      const price = document.createElement('p');
      price.textContent = `價格: $${item.price}`;
      info.appendChild(price);

      const addButton = document.createElement('button');
      addButton.textContent = '加入購物車';
      addButton.className = 'add-button';
      addButton.onclick = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(i => i.menu_id === item.menu_id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({ ...item, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('✅ 已加入購物車');
      };
      info.appendChild(addButton);

      card.appendChild(info);
      menuArea.appendChild(card);
    });
  } catch (err) {
    const warning = document.createElement('p');
    warning.textContent = '⚠️ 無法載入菜單，請稍後再試';
    warning.style.color = 'red';
    container.appendChild(warning);
    console.error('Menu load error: ', err);
  }
}
