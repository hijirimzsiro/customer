import { createOrderStatus } from '../components/OrderStatus.js';

export function renderConfirmationPage(container) {
  container.innerHTML = '';

  const orderNumber = localStorage.getItem('orderNumber');
  const statusView = createOrderStatus(orderNumber);
  container.appendChild(statusView);
}
