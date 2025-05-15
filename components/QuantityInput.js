export function createQuantityInput(initial = 1) {
  let quantity = initial;

  const wrapper = document.createElement('div');
  wrapper.className = 'quantity-input';

  const minusBtn = document.createElement('button');
  minusBtn.textContent = '−';
  minusBtn.className = 'btn';

  const display = document.createElement('span');
  display.textContent = quantity;
  display.className = 'quantity-display'; // You can style this in CSS

  const plusBtn = document.createElement('button');
  plusBtn.textContent = '+';
  plusBtn.className = 'btn';

  // Update display
  const updateDisplay = () => {
    display.textContent = quantity;
  };

  // Click handlers
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

  // Method to get value from outside
  wrapper.getValue = () => quantity;

  wrapper.appendChild(minusBtn);
  wrapper.appendChild(display);
  wrapper.appendChild(plusBtn);

  return wrapper;
}
