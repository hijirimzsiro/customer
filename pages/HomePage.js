export function renderHomePage(container) {
    console.log("✅ Home page is rendering");

    container.innerHTML = '';
  
    const wrapper = document.createElement('div');
    wrapper.className = 'home-page';
  
    const title = document.createElement('h1');
    title.textContent = '紅豆餅點餐開張';
  
    const startBtn = document.createElement('button');
    startBtn.textContent = '開始點餐';
    startBtn.className = 'start-btn';
  
    startBtn.onclick = () => {
      window.location.href = '?page=menu';
    };
  
    wrapper.appendChild(title);
    wrapper.appendChild(startBtn);
    container.appendChild(wrapper);
  }
  