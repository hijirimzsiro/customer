const menu = [
    { name: '原味紅豆餅', price: 15, imgUrl: './images/redbean.png' },
    { name: '巧克力餅', price: 20, imgUrl: './images/choco.png' },
    { name: '奶油餅', price: 15, imgUrl: './images/cream.png' },
  ];
  
  export function renderMenuPage(container) {
    container.innerHTML = '';
  
    const title = document.createElement('h2');
    title.textContent = '歡迎選購商品';
    title.style.textAlign = 'center';
    container.appendChild(title);
  
    const menuArea = document.createElement('div');
    menuArea.className = 'menu-container';
  
    menu.forEach(item => {
      const card = document.createElement('div');
      card.className = 'menu-card';
  
      const img = document.createElement('img');
      img.src = item.imgUrl || '';
      img.alt = item.name;
  
      const name = document.createElement('h3');
      name.textContent = item.name;
  
      const price = document.createElement('p');
      price.textContent = `價格：$${item.price}`;
  
      const addBtn = document.createElement('button');
      addBtn.textContent = '加入購物車';
      addBtn.className = 'cart-btn';
      addBtn.onclick = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push({ ...item, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${item.name} 已加入購物車`);
      };
  
      card.appendChild(img);
      card.appendChild(name);
      card.appendChild(price);
      card.appendChild(addBtn);
  
      menuArea.appendChild(card);
    });
  
    container.appendChild(menuArea);
  
    const toCartBtn = document.createElement('button');
    toCartBtn.textContent = '前往購物車';
    toCartBtn.className = 'next-btn';
    toCartBtn.style.marginTop = '30px';
    toCartBtn.onclick = () => {
      window.location.href = '?page=cart';
    };
    container.appendChild(toCartBtn);
  }
  