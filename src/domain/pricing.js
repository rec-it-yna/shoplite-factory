'use strict';

const { applyBps } = require('./money');
const { buildDiscountContext, computeDiscount } = require('./discounts');
const { BusinessError } = require('../errors');

/** TVA unique de 20 %, en points de base. */
const VAT_BPS = 2000;

function subtotalOf(order) {
  if (!order.lines || order.lines.length === 0) {
    throw new BusinessError('ORDER_EMPTY', 'La commande ne contient aucune ligne');
  }
  return order.lines.reduce((sum, line) => {
    if (!Number.isInteger(line.quantity) || line.quantity <= 0) {
      throw new BusinessError('QUANTITY_INVALID', `Quantité invalide pour ${line.sku}`);
    }
    return sum + line.unitPriceCents * line.quantity;
  }, 0);
}

/**
 * Devis d'une commande : sous-total HT, remises, net HT, TVA, total TTC (en centimes).
 * Les remises s'appliquent sur le HT, la TVA sur le net après remise.
 */
function quoteOrder(order, { customerRepo }) {
  const subtotalCents = subtotalOf(order);
  const ctx = buildDiscountContext(order, customerRepo);
  const discount = computeDiscount(subtotalCents, ctx);
  const netCents = subtotalCents - discount.discountCents;
  const vatCents = applyBps(netCents, VAT_BPS);
  return {
    subtotalCents,
    discount,
    netCents,
    vatCents,
    totalCents: netCents + vatCents,
  };
}

module.exports = { VAT_BPS, subtotalOf, quoteOrder };
