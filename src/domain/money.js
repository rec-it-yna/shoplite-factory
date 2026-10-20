'use strict';

/*
 * Règles d'argent de ShopLite :
 *  - tous les montants sont des ENTIERS en centimes (jamais de nombre à virgule) ;
 *  - les taux (remises, TVA) sont en points de base (bps) : 100 bps = 1 %, 10 000 bps = 100 % ;
 *  - arrondi « bancaire » au demi pair (half-even).
 */

const BPS_PER_UNIT = 10000;

/** Convertit une chaîne en euros ("12.34" ou "12,34") en centimes. */
function toCents(euros) {
  const m = String(euros).trim().replace(',', '.').match(/^(-?)(\d+)(?:\.(\d{1,2}))?$/);
  if (!m) throw new TypeError(`Montant invalide : ${euros}`);
  const cents = Number(m[2]) * 100 + Number((m[3] || '0').padEnd(2, '0'));
  return m[1] ? -cents : cents;
}

/** Division entière arrondie au demi pair : divideHalfEven(5, 2) = 2, divideHalfEven(7, 2) = 4. */
function divideHalfEven(numerator, denominator) {
  const q = Math.floor(numerator / denominator);
  const r = numerator - q * denominator;
  if (r * 2 > denominator) return q + 1;
  if (r * 2 < denominator) return q;
  return q % 2 === 0 ? q : q + 1;
}

/** Applique un taux en points de base à un montant en centimes. applyBps(1999, 500) = 100. */
function applyBps(amountCents, bps) {
  if (!Number.isInteger(amountCents) || !Number.isInteger(bps)) {
    throw new TypeError('applyBps attend des entiers (centimes, bps)');
  }
  return divideHalfEven(amountCents * bps, BPS_PER_UNIT);
}

/** 123456 -> "1 234,56 €" */
function formatEUR(cents) {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  const euros = String(Math.floor(abs / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${sign}${euros},${String(abs % 100).padStart(2, '0')} €`;
}

module.exports = { BPS_PER_UNIT, toCents, divideHalfEven, applyBps, formatEUR };
