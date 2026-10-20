'use strict';

/* Jeu de données FICTIF. Statuts de commande : DRAFT, PAID, CANCELLED, REFUNDED. */

const customers = [
  { id: 'C1', name: 'Atelier Durand', segment: 'PARTICULIER', createdAt: '2024-03-02' },
  { id: 'C2', name: 'Bureau Nova SARL', segment: 'PRO', createdAt: '2023-11-15' },
  { id: 'C3', name: 'Lina Haddad', segment: 'PARTICULIER', createdAt: '2026-09-28' },
  { id: 'C4', name: 'Marc Petit', segment: 'PARTICULIER', createdAt: '2025-01-10' },
];

const orders = [
  { id: 'O1', customerId: 'C1', status: 'PAID', promoCode: null, lines: [{ sku: 'CAHIER-A5', quantity: 4, unitPriceCents: 399 }] },
  { id: 'O2', customerId: 'C1', status: 'PAID', promoCode: 'ETE5', lines: [{ sku: 'STYLO-BLEU', quantity: 12, unitPriceCents: 129 }] },
  { id: 'O3', customerId: 'C1', status: 'PAID', promoCode: null, lines: [{ sku: 'AGENDA-2027', quantity: 1, unitPriceCents: 1890 }] },
  { id: 'O4', customerId: 'C1', status: 'CANCELLED', promoCode: null, lines: [{ sku: 'SAC-TOILE', quantity: 2, unitPriceCents: 1450 }] },
  { id: 'O5', customerId: 'C2', status: 'PAID', promoCode: null, lines: [{ sku: 'RAMETTE-A4', quantity: 20, unitPriceCents: 549 }] },
  { id: 'O6', customerId: 'C4', status: 'PAID', promoCode: null, lines: [{ sku: 'CAHIER-A5', quantity: 2, unitPriceCents: 399 }] },
  { id: 'O7', customerId: 'C4', status: 'PAID', promoCode: null, lines: [{ sku: 'STYLO-NOIR', quantity: 3, unitPriceCents: 129 }] },
  { id: 'O8', customerId: 'C4', status: 'CANCELLED', promoCode: null, lines: [{ sku: 'AGENDA-2027', quantity: 1, unitPriceCents: 1890 }] },
  { id: 'O9', customerId: 'C4', status: 'REFUNDED', promoCode: null, lines: [{ sku: 'SAC-TOILE', quantity: 1, unitPriceCents: 1450 }] },
  { id: 'O10', customerId: 'C3', status: 'DRAFT', promoCode: 'BIENVENUE10', lines: [{ sku: 'CARNET-POCHE', quantity: 3, unitPriceCents: 650 }] },
  { id: 'O11', customerId: 'C5', status: 'DRAFT', promoCode: null, lines: [{ sku: 'RAMETTE-A4', quantity: 5, unitPriceCents: 549 }] },
  { id: 'O12', customerId: 'C3', status: 'DRAFT', promoCode: 'vip20', lines: [{ sku: 'AGENDA-2027', quantity: 2, unitPriceCents: 1890 }] },
  { id: 'O13', customerId: 'C1', status: 'DRAFT', promoCode: null, lines: [{ sku: 'STYLO-BLEU', quantity: 10, unitPriceCents: 129 }] },
];

/** Renvoie une copie fraîche des données (chaque test part d'un état propre). */
function createStore() {
  return JSON.parse(JSON.stringify({ customers, orders }));
}

module.exports = { createStore };
