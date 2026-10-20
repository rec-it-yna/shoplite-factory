'use strict';

/**
 * Erreur métier : renvoyée au client avec un code stable (HTTP 422).
 * Exemple : throw new BusinessError('PROMO_INVALID', 'Code promo inconnu');
 */
class BusinessError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'BusinessError';
    this.code = code;
  }
}

module.exports = { BusinessError };
