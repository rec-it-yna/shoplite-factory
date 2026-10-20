'use strict';

const http = require('node:http');
const { createStore } = require('./data/seed');
const { createCustomerRepository } = require('./data/customerRepository');
const { createOrderRepository } = require('./data/orderRepository');
const { handle } = require('./routes/orders');
const { BusinessError } = require('./errors');

const store = createStore();
const deps = {
  customerRepo: createCustomerRepository(store),
  orderRepo: createOrderRepository(store),
};

function log(level, message) {
  const line = `${new Date().toISOString()} ${level.padEnd(5)} ${message}`;
  if (level === 'ERROR') console.error(line); else console.log(line);
}

function send(req, res, status, body) {
  log('INFO', `${req.method} ${req.url} -> ${status}${body.error ? ' ' + body.error : ''}`);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body, null, 2));
}

const server = http.createServer((req, res) => {
  try {
    const result = handle(req.method, req.url, deps);
    if (!result) return send(req, res, 404, { error: 'NOT_FOUND' });
    return send(req, res, result.status, result.body);
  } catch (err) {
    if (err instanceof BusinessError) return send(req, res, 422, { error: err.code, message: err.message });
    log('ERROR', `${req.method} ${req.url}\n${err.stack}`);
    return send(req, res, 500, { error: 'INTERNAL_ERROR' });
  }
});

const PORT = Number(process.env.PORT) || 3000;
if (require.main === module) {
  server.listen(PORT, () => console.log(`ShopLite sur http://localhost:${PORT}`));
}

module.exports = { server };
