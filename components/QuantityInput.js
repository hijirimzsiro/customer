export function createQuantityInput(initialValue = 1, onChange) {
    const wrapper = document.createElement('div');
    wrapper.className = 'quantity-input';
  
    const minusBtn = document.createElement('button');
    minusBtn.textContent = '−';
    minusBtn.className = 'btn';
  
    const input = document.createElement('input');
    input.type = 'number';
    input.value = initialValue;
    input.min = 1;
    input.max = 500;
  
    const plusBtn = document.createElement('button');
    plusBtn.textContent = '+';
    plusBtn.className = 'btn';
  
    function updateValue(val) {
      let num = parseInt(val);
      if (isNaN(num) || num < 1) num = 1;
      if (num > 500) num = 500;
      input.value = num;
      if (typeof onChange === 'function') onChange(num);
    }
  
    minusBtn.onclick = () => updateValue(parseInt(input.value) - 1);
    plusBtn.onclick = () => updateValue(parseInt(input.value) + 1);
    input.onchange = () => updateValue(input.value);
  
    wrapper.appendChild(minusBtn);
    wrapper.appendChild(input);
    wrapper.appendChild(plusBtn);
  
    return wrapper;
  }
  