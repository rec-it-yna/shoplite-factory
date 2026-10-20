'use strict';

/*
 * OBSOLÈTE : ancien calcul de prix (2023), en euros à virgule.
 * NE PLUS UTILISER. Conservé uniquement pour recalculer les anciennes factures
 * pendant la migration. Le calcul actuel est dans src/domain/pricing.js.
 */
function calculateTotal(order, customer) {
  let total = 0;
  for (const line of order.items) {
    total += line.price * line.qty;
  }
  // ancienne remise fidélité : plus de 5 commandes
  if (customer.orders && customer.orders.length > 5) {
    total = total * 0.95;
  }
  if (order.coupon === 'WELCOME') {
    total = total - 5;
  }
  return Math.round(total * 1.2 * 100) / 100;
}

module.exports = { calculateTotal };
