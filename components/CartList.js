import { createQuantityInput } from './QuantityInput.js';

export function createCartList(onUpdate, onRemove) {
  const wrapper = document.createElement('div');
  wrapper.className = 'cart-list';

  function render() {
    wrapper.innerHTML = ''; // 每次重繪

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (cart.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = '購物車是空的喔～';
      wrapper.appendChild(empty);
      return;
    }

    cart.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'cart-item';

      const name = document.createElement('span');
      name.textContent = item.name;

      const qtyControl = createQuantityInput(item.quantity, (newQty) => {
        item.quantity = newQty;
        cart[index] = item;
        localStorage.setItem('cart', JSON.stringify(cart));
        if (typeof onUpdate === 'function') onUpdate();
      });

      const totalPrice = document.createElement('span');
      totalPrice.textContent = `$${item.price * item.quantity}`;

      const removeBtn = document.createElement('button');
      removeBtn.textContent = '🗑️';
      removeBtn.className = 'remove-btn';
      removeBtn.onclick = () => {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        if (typeof onRemove === 'function') onRemove();
        render(); // 重新顯示
      };

      row.appendChild(name);
      row.appendChild(qtyControl);
      row.appendChild(totalPrice);
      row.appendChild(removeBtn);

      wrapper.appendChild(row);
    });
  }

  render();

  return { element: wrapper, refresh: render };
}
