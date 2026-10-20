'use strict';

const { quoteOrder } = require('../domain/pricing');
const { formatEUR } = require('../domain/money');

/** Routes de l'API. Renvoie { status, body } ou null si la route n'existe pas. */
function handle(method, url, { customerRepo, orderRepo }) {
  let m = url.match(/^\/customers\/([\w-]+)$/);
  if (method === 'GET' && m) {
    const customer = customerRepo.getCustomerById(m[1]);
    if (!customer) return { status: 404, body: { error: 'CUSTOMER_NOT_FOUND' } };
    return { status: 200, body: { ...customer, paidOrders: customerRepo.countPaidOrders(customer.id) } };
  }

  m = url.match(/^\/orders\/([\w-]+)\/quote$/);
  if (method === 'GET' && m) {
    const order = orderRepo.getOrderById(m[1]);
    if (!order) return { status: 404, body: { error: 'ORDER_NOT_FOUND' } };
    const quote = quoteOrder(order, { customerRepo });
    return { status: 200, body: { orderId: order.id, ...quote, totalLabel: formatEUR(quote.totalCents) } };
  }

  return null;
}

module.exports = { handle };
