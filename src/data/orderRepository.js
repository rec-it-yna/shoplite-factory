'use strict';

const ORDER_STATUSES = ['DRAFT', 'PAID', 'CANCELLED', 'REFUNDED'];

/**
 * Dépôt commandes en mémoire.
 * @param {{ customers: object[], orders: object[] }} store
 */
function createOrderRepository(store) {
  return {
    getOrderById(id) {
      return store.orders.find((o) => o.id === id) || null;
    },

    listOrdersByCustomer(customerId) {
      return store.orders.filter((o) => o.customerId === customerId);
    },

    saveOrder(order) {
      if (!ORDER_STATUSES.includes(order.status)) throw new TypeError(`Statut inconnu : ${order.status}`);
      const i = store.orders.findIndex((o) => o.id === order.id);
      if (i >= 0) store.orders[i] = order; else store.orders.push(order);
      return order;
    },
  };
}

module.exports = { ORDER_STATUSES, createOrderRepository };
