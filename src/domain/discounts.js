'use strict';

const { applyBps } = require('./money');
const { BusinessError } = require('../errors');

/** Plafond global des remises cumulées : 30 % du sous-total (en points de base). */
const MAX_DISCOUNT_BPS = 3000;

/** Codes promo actifs, en points de base. */
const PROMO_CODES = {
  BIENVENUE10: 1000,
  ETE5: 500,
  VIP20: 2000,
};

/*
 * Une règle de remise = { id, label, appliesTo(ctx) -> boolean, bps(ctx) -> entier }.
 * Les remises s'ADDITIONNENT (en bps) puis le total est plafonné à MAX_DISCOUNT_BPS.
 * Pour ajouter une remise : ajouter une règle dans RULES, compléter buildDiscountContext
 * si la règle a besoin d'une nouvelle information, et ajouter un test dans test/discounts.test.js.
 */
const RULES = [
  {
    id: 'PROMO',
    label: 'Code promo',
    appliesTo: (ctx) => Boolean(ctx.promoCode),
    bps: (ctx) => {
      const bps = PROMO_CODES[ctx.promoCode];
      if (bps === undefined) throw new BusinessError('PROMO_INVALID', `Code promo inconnu : ${ctx.promoCode}`);
      return bps;
    },
  },
  {
    id: 'VOLUME',
    label: 'Remise volume (10 articles et plus)',
    appliesTo: (ctx) => ctx.itemCount > 10,
    bps: () => 300,
  },
  {
    id: 'PRO',
    label: 'Client professionnel',
    appliesTo: (ctx) => ctx.customer.segment === 'PRO',
    bps: () => 800,
  },
];

/**
 * Rassemble les informations dont les règles ont besoin.
 * @param {object} order commande { customerId, promoCode?, lines: [{ sku, quantity, unitPriceCents }] }
 * @param {object} customerRepo dépôt clients (voir src/data/customerRepository.js)
 */
function buildDiscountContext(order, customerRepo) {
  const customer = customerRepo.getCustomerById(order.customerId);
  return {
    customer,
    promoCode: order.promoCode || null,
    itemCount: order.lines.reduce((n, line) => n + line.quantity, 0),
  };
}

/** Calcule les remises applicables et leur montant, plafonné. */
function computeDiscount(subtotalCents, ctx) {
  const applied = RULES
    .filter((rule) => rule.appliesTo(ctx))
    .map((rule) => ({ id: rule.id, label: rule.label, bps: rule.bps(ctx) }));
  const requestedBps = applied.reduce((sum, a) => sum + a.bps, 0);
  const totalBps = Math.min(requestedBps, MAX_DISCOUNT_BPS);
  return {
    applied,
    totalBps,
    capped: requestedBps > MAX_DISCOUNT_BPS,
    discountCents: applyBps(subtotalCents, totalBps),
  };
}

module.exports = { MAX_DISCOUNT_BPS, PROMO_CODES, RULES, buildDiscountContext, computeDiscount };
