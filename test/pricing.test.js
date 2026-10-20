'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { quoteOrder } = require('../src/domain/pricing');
const { applyBps, toCents, formatEUR } = require('../src/domain/money');
const { createStore } = require('../src/data/seed');
const { createCustomerRepository } = require('../src/data/customerRepository');
const { createOrderRepository } = require('../src/data/orderRepository');

function setup() {
  const store = createStore();
  return { customerRepo: createCustomerRepository(store), orderRepo: createOrderRepository(store) };
}

test('arrondi au demi pair', () => {
  assert.equal(applyBps(10, 500), 0);   // 0,5 centime -> 0 (pair)
  assert.equal(applyBps(30, 500), 2);   // 1,5 centime -> 2 (pair)
  assert.equal(applyBps(1999, 500), 100);
});

test('conversion et affichage', () => {
  assert.equal(toCents('12,3'), 1230);
  assert.equal(formatEUR(123456), '1 234,56 €');
});

test('devis O1 : particulier, sans remise', () => {
  const deps = setup();
  const q = quoteOrder(deps.orderRepo.getOrderById('O1'), deps);
  assert.equal(q.subtotalCents, 1596);
  assert.equal(q.discount.discountCents, 0);
  assert.equal(q.vatCents, 319);
  assert.equal(q.totalCents, 1915);
});

test('devis O5 : client PRO avec remise volume', () => {
  const deps = setup();
  const q = quoteOrder(deps.orderRepo.getOrderById('O5'), deps);
  assert.equal(q.subtotalCents, 10980);
  assert.deepEqual(q.discount.applied.map((a) => a.id), ['VOLUME', 'PRO']);
  assert.equal(q.discount.discountCents, 1208); // 1100 bps de 10 980
  assert.equal(q.totalCents, 11726);
});
