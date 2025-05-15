export async function renderMenuPage(container) {
  container.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = '請選擇想購買的品項';
  title.style.textAlign = 'center';
  container.appendChild(title);

  const menuArea = document.createElement('div');
  menuArea.className = 'menu-container';
  container.appendChild(menuArea);

  try {
    const response = await fetch('http://127.0.0.1:5000/menus/');
    if (!response.ok) throw new Error('Load failed');

    const menu = await response.json();

    menu.forEach(item => {
      const card = document.createElement('div');
      card.className = 'menu-card';

      const img = document.createElement('img');
      img.src = item.imgUrl;
      img.alt = item.name;
      card.appendChild(img);

      const name = document.createElement('h3');
      name.textContent = item.name;
      card.appendChild(name);

      const price = document.createElement('p');
      price.textContent = `價格: $${item.price}`;
      card.appendChild(price);

      menuArea.appendChild(card);
    });
  } catch (err) {
    const warning = document.createElement('p');
    warning.textContent = '⚠️ Failed to load menu from backend';
    warning.style.color = 'red';
    container.appendChild(warning);
    console.error('Menu load error: ', err);
  }
}
