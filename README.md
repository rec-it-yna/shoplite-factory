# ShopLite — Lab software factory

API de devis **fictive** (papeterie) utilisée pour un lab de formation :
du ticket (issue) à la fusion d'une pull request, avec GitHub Copilot.
Aucune donnée réelle.

## Lancer

```bash
npm test      # tests automatiques (aucune dépendance à installer)
npm start     # API sur http://localhost:3000
```

## Routes

- `GET /customers/:id` : un client et son nombre de commandes payées
- `GET /orders/:id/quote` : le devis d'une commande

## Organisation

```
src/server.js          serveur HTTP et journal (logs)
src/routes/orders.js   routes de l'API
src/domain/            règles métier : prix, remises, arrondis
src/data/              dépôts en mémoire et données fictives
src/legacy/            ancien code obsolète (ne plus utiliser)
test/                  tests (node:test)
.github/               CI, formulaires d'issue, modèle de pull request
```

## Conventions

- Montants : entiers en centimes. Taux : points de base (100 bps = 1 %).
- Erreurs métier : `BusinessError` avec un code stable (HTTP 422).
- Chaque correction s'accompagne d'un test de non-régression.
