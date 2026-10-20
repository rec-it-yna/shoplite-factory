'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { handle } = require('../src/routes/orders');
const { createStore } = require('../src/data/seed');
const { createCustomerRepository } = require('../src/data/customerRepository');
const { createOrderRepository } = require('../src/data/orderRepository');

function deps() {
  const store = createStore();
  return { customerRepo: createCustomerRepository(store), orderRepo: createOrderRepository(store) };
}

test('GET /customers/C1 : le client et ses commandes payées', () => {
  const res = handle('GET', '/customers/C1', deps());
  assert.equal(res.status, 200);
  assert.equal(res.body.name, 'Atelier Durand');
  assert.equal(res.body.paidOrders, 3);
});

test('GET /customers/X : client inconnu -> 404', () => {
  const res = handle('GET', '/customers/X', deps());
  assert.equal(res.status, 404);
  assert.equal(res.body.error, 'CUSTOMER_NOT_FOUND');
});

test('GET /orders/O5/quote : le devis', () => {
  const res = handle('GET', '/orders/O5/quote', deps());
  assert.equal(res.status, 200);
  assert.equal(res.body.totalLabel, '117,26 €');
});

test('route inconnue -> null (404 renvoyé par le serveur)', () => {
  assert.equal(handle('GET', '/inconnu', deps()), null);
});
