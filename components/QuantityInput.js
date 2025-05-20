export function createQuantityInput(initial = 1, onChange) {
  let quantity = initial;

  const wrapper = document.createElement('div');
  wrapper.className = 'quantity-input';

  const minusBtn = document.createElement('button');
  minusBtn.textContent = '−';
  minusBtn.className = 'btn';

  const display = document.createElement('span');
  display.textContent = quantity;
  display.className = 'quantity-display';

  const plusBtn = document.createElement('button');
  plusBtn.textContent = '+';
  plusBtn.className = 'btn';

  const updateDisplay = () => {
    display.textContent = quantity;
    if (typeof onChange === 'function') {
      onChange(quantity); // ✅ 通知外部
    }
  };

  minusBtn.onclick = () => {
    if (quantity > 1) {
      quantity--;
      updateDisplay();
    }
  };

  plusBtn.onclick = () => {
    quantity++;
    updateDisplay();
  };

  wrapper.getValue = () => quantity;

  wrapper.appendChild(minusBtn);
  wrapper.appendChild(display);
  wrapper.appendChild(plusBtn);

  return wrapper;
}
