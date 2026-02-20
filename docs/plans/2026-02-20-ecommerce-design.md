# Design - E-commerce 3D World

**Date** : 2026-02-20
**Contexte** : Transformation du site vitrine en e-commerce complet

---

## Besoins

- Produits uniques + avec variantes (matériau, taille, couleur)
- Impression à la demande (pas de gestion de stock)
- Livraison : frais fixes configurables + option retrait (à définir)
- Auth : admin (gestion boutique) + clients optionnels (achat invité ou compte)
- Paiement : Stripe Checkout

---

## Architecture technique

- **Framework** : Next.js 16 (mode serveur, suppression `output: "export"`)
- **Base de données** : Supabase PostgreSQL + Prisma ORM
- **Auth** : Supabase Auth (email/mdp pour admin et clients)
- **Storage** : Supabase Storage (images produits)
- **Paiement** : Stripe Checkout (sessions) + Webhooks
- **Déploiement** : Vercel (connecté au repo GitHub)

---

## Modèle de données

```
User (id, email, name, phone, role: ADMIN|CLIENT, createdAt)
Product (id, name, slug, description, price, categoryId, images[], hasVariants, isActive, createdAt)
ProductVariant (id, productId, name, priceOverride?, attributes JSON, isActive)
Category (id, name, slug, description, order)
Order (id, userId?, email, name, phone, status: PENDING|PAID|PROCESSING|SHIPPED|DELIVERED, totalAmount, shippingMethod, shippingCost, stripeSessionId, createdAt)
OrderItem (id, orderId, productId, variantId?, quantity, unitPrice)
ShopSettings (id, shopName, shippingFixedPrice, freeShippingThreshold, pickupEnabled, pickupAddress)
```

---

## Pages publiques (boutique)

| Page | URL | Contenu |
|---|---|---|
| Boutique | `/boutique` | Grille de produits filtrable par catégorie |
| Produit | `/boutique/[slug]` | Fiche produit (images, description, variantes, prix, panier) |
| Panier | `/panier` | Liste articles, quantités, total, bouton Commander |
| Checkout | Via Stripe | Stripe Checkout hébergé |
| Confirmation | `/commande/[id]` | Confirmation après paiement |
| Compte client | `/mon-compte` | Historique commandes (optionnel) |
| Connexion | `/connexion` | Login/inscription client |

Pages vitrine existantes inchangées.

---

## Dashboard Admin (`/admin`)

| Page | Contenu |
|---|---|
| Tableau de bord | Stats (commandes du jour, CA mois, commandes en cours) |
| Produits | CRUD, upload images, variantes, activation |
| Catégories | CRUD, réordonnancement |
| Commandes | Liste avec filtres statut, détail, mise à jour statut |
| Paramètres | Frais livraison, seuil gratuit, retrait, infos boutique |

---

## Flux d'achat

1. Client parcourt la boutique
2. Ajoute au panier (localStorage)
3. Va au panier, vérifie
4. Choix : invité (email) ou se connecter
5. Choix livraison (envoi / retrait)
6. Redirection Stripe Checkout
7. Paiement OK → Webhook → Commande en BDD
8. Page confirmation + Email confirmation
9. Admin reçoit notification
10. Admin change statut → Client notifié par email

---

## Emails

- Confirmation de commande (client)
- Nouvelle commande (admin)
- Changement de statut (client)
- Erreurs techniques (vguyon.dev@hotmail.com)
