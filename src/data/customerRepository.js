'use strict';

/**
 * Dépôt clients en mémoire.
 * @param {{ customers: object[], orders: object[] }} store
 */
function createCustomerRepository(store) {
  return {
    getCustomerById(id) {
      return store.customers.find((c) => c.id === id) || null;
    },

    listCustomers() {
      return [...store.customers];
    },

    /** Nombre TOTAL de commandes du client, tous statuts confondus (brouillons, annulées… inclus). */
    countOrders(customerId) {
      return store.orders.filter((o) => o.customerId === customerId).length;
    },

    /** Nombre de commandes PAYÉES du client (statut PAID uniquement). */
    countPaidOrders(customerId) {
      return store.orders.filter((o) => o.customerId === customerId && o.status === 'PAID').length;
    },
  };
}

module.exports = { createCustomerRepository };
