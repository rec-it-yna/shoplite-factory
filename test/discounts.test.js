'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { buildDiscountContext, computeDiscount, MAX_DISCOUNT_BPS } = require('../src/domain/discounts');
const { BusinessError } = require('../src/errors');

/** Faux dépôt clients : seules les méthodes utilisées par le code testé. */
function fakeCustomerRepo(customer, { paidOrders = 0, allOrders = 0 } = {}) {
  return {
    getCustomerById: (id) => (id === customer.id ? customer : null),
    countOrders: () => allOrders,
    countPaidOrders: () => paidOrders,
  };
}

const order = (lines, extra = {}) => ({ customerId: 'X1', lines, ...extra });
const particulier = { id: 'X1', segment: 'PARTICULIER' };
const pro = { id: 'X1', segment: 'PRO' };

test('aucune remise pour un particulier sans code ni volume', () => {
  const ctx = buildDiscountContext(order([{ sku: 'A', quantity: 2, unitPriceCents: 1000 }]), fakeCustomerRepo(particulier));
  const d = computeDiscount(2000, ctx);
  assert.equal(d.totalBps, 0);
  assert.equal(d.discountCents, 0);
});

test('client PRO : 8 %', () => {
  const ctx = buildDiscountContext(order([{ sku: 'A', quantity: 1, unitPriceCents: 10000 }]), fakeCustomerRepo(pro));
  const d = computeDiscount(10000, ctx);
  assert.deepEqual(d.applied.map((a) => a.id), ['PRO']);
  assert.equal(d.discountCents, 800);
});

test('les remises s\'additionnent puis sont plafonnées à 30 %', () => {
  const ctx = buildDiscountContext(
    order([{ sku: 'A', quantity: 12, unitPriceCents: 1000 }], { promoCode: 'VIP20' }),
    fakeCustomerRepo(pro),
  );
  const d = computeDiscount(12000, ctx); // 2000 + 300 + 800 = 3100 bps demandés
  assert.equal(d.capped, true);
  assert.equal(d.totalBps, MAX_DISCOUNT_BPS);
  assert.equal(d.discountCents, 3600);
});

test('un code promo inconnu est une erreur métier', () => {
  const ctx = buildDiscountContext(order([{ sku: 'A', quantity: 1, unitPriceCents: 1000 }], { promoCode: 'FAUX' }), fakeCustomerRepo(particulier));
  assert.throws(() => computeDiscount(1000, ctx), (err) => err instanceof BusinessError && err.code === 'PROMO_INVALID');
});
