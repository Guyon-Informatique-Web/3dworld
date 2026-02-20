# E-commerce 3D World - Plan d'implémentation

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transformer le site vitrine 3D World en e-commerce complet avec gestion admin, panier, paiement Stripe et comptes clients.

**Architecture:** Next.js 16 en mode serveur (suppression export statique) avec Supabase (auth + PostgreSQL + storage), Prisma ORM, et Stripe Checkout. Dashboard admin protégé, panier côté client (localStorage), checkout via Stripe sessions, webhooks pour créer les commandes.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Supabase (auth + DB + storage), Prisma 6, Stripe, Framer Motion, Resend (emails)

---

## Task 1 : Infrastructure - Supprimer l'export statique + configurer Supabase & Prisma

**Files:**
- Modify: `next.config.ts` (supprimer output: "export")
- Modify: `package.json` (nouvelles dépendances)
- Create: `prisma/schema.prisma`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/prisma.ts`
- Create: `.env.local` (variables Supabase + Stripe)
- Modify: `.env` (template des variables nécessaires)
- Modify: `.gitignore` (s'assurer que .env.local est ignoré)

**Step 1: Installer les dépendances**

```bash
cd "/mnt/c/Mes Projets/PERSO/clients/3dworld"
npm install @supabase/supabase-js @supabase/ssr prisma @prisma/client stripe resend
npm install -D @types/stripe
```

**Step 2: Supprimer l'export statique**

Dans `next.config.ts`, supprimer `output: "export"` et `images.unoptimized`. Ajouter la config images pour Supabase Storage :

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
```

**Step 3: Créer le schéma Prisma**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

enum UserRole {
  ADMIN
  CLIENT
}

enum OrderStatus {
  PENDING
  PAID
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

enum ShippingMethod {
  DELIVERY
  PICKUP
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  phone     String?
  role      UserRole @default(CLIENT)
  supabaseId String  @unique @map("supabase_id")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  orders    Order[]

  @@map("users")
}

model Category {
  id          String    @id @default(uuid())
  name        String
  slug        String    @unique
  description String?
  order       Int       @default(0)
  isActive    Boolean   @default(true) @map("is_active")
  createdAt   DateTime  @default(now()) @map("created_at")
  products    Product[]

  @@map("categories")
}

model Product {
  id          String           @id @default(uuid())
  name        String
  slug        String           @unique
  description String
  price       Decimal          @db.Decimal(10, 2)
  images      String[]
  hasVariants Boolean          @default(false) @map("has_variants")
  isActive    Boolean          @default(true) @map("is_active")
  categoryId  String           @map("category_id")
  category    Category         @relation(fields: [categoryId], references: [id])
  variants    ProductVariant[]
  orderItems  OrderItem[]
  createdAt   DateTime         @default(now()) @map("created_at")
  updatedAt   DateTime         @updatedAt @map("updated_at")

  @@map("products")
}

model ProductVariant {
  id            String      @id @default(uuid())
  productId     String      @map("product_id")
  product       Product     @relation(fields: [productId], references: [id], onDelete: Cascade)
  name          String
  priceOverride Decimal?    @map("price_override") @db.Decimal(10, 2)
  attributes    Json        @default("{}")
  isActive      Boolean     @default(true) @map("is_active")
  createdAt     DateTime    @default(now()) @map("created_at")
  orderItems    OrderItem[]

  @@map("product_variants")
}

model Order {
  id              String         @id @default(uuid())
  userId          String?        @map("user_id")
  user            User?          @relation(fields: [userId], references: [id])
  email           String
  name            String
  phone           String?
  status          OrderStatus    @default(PENDING)
  totalAmount     Decimal        @map("total_amount") @db.Decimal(10, 2)
  shippingMethod  ShippingMethod @map("shipping_method")
  shippingCost    Decimal        @default(0) @map("shipping_cost") @db.Decimal(10, 2)
  shippingAddress String?        @map("shipping_address")
  stripeSessionId String?        @unique @map("stripe_session_id")
  items           OrderItem[]
  createdAt       DateTime       @default(now()) @map("created_at")
  updatedAt       DateTime       @updatedAt @map("updated_at")

  @@map("orders")
}

model OrderItem {
  id        String          @id @default(uuid())
  orderId   String          @map("order_id")
  order     Order           @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String          @map("product_id")
  product   Product         @relation(fields: [productId], references: [id])
  variantId String?         @map("variant_id")
  variant   ProductVariant? @relation(fields: [variantId], references: [id])
  quantity  Int
  unitPrice Decimal         @map("unit_price") @db.Decimal(10, 2)

  @@map("order_items")
}

model ShopSettings {
  id                    String  @id @default("default")
  shopName              String  @default("3D World") @map("shop_name")
  shippingFixedPrice    Decimal @default(5.00) @map("shipping_fixed_price") @db.Decimal(10, 2)
  freeShippingThreshold Decimal? @map("free_shipping_threshold") @db.Decimal(10, 2)
  pickupEnabled         Boolean @default(false) @map("pickup_enabled")
  pickupAddress         String? @map("pickup_address")

  @@map("shop_settings")
}
```

**Step 4: Créer les utilitaires Supabase**

`src/lib/supabase/client.ts` — Client Supabase côté navigateur (createBrowserClient).
`src/lib/supabase/server.ts` — Client Supabase côté serveur (createServerClient avec cookies).
`src/lib/prisma.ts` — Singleton PrismaClient.

**Step 5: Créer le fichier .env avec les variables nécessaires (template)**

```env
# .env (template, pas de secrets)
DATABASE_URL=""
DIRECT_URL=""
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
RESEND_API_KEY=""
ADMIN_EMAIL="contact@3dworld.fr"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Step 6: Générer le client Prisma et vérifier le build**

```bash
npx prisma generate
npm run build
```

**Step 7: Commit**

```bash
git add . && git commit -m "feat: infrastructure e-commerce (Supabase, Prisma, Stripe)"
```

---

## Task 2 : Authentification Supabase (Admin + Client)

**Files:**
- Create: `src/lib/auth.ts` (helpers auth : getUser, requireAdmin, requireAuth)
- Create: `src/app/(auth)/connexion/page.tsx`
- Create: `src/app/(auth)/inscription/page.tsx`
- Create: `src/components/auth/LoginForm.tsx`
- Create: `src/components/auth/RegisterForm.tsx`
- Create: `src/app/api/auth/callback/route.ts` (callback OAuth/email)
- Create: `src/middleware.ts` (protection routes admin)

**Step 1: Helpers d'authentification**

`src/lib/auth.ts` :
- `getUser()` : récupère l'utilisateur connecté (Supabase session + données User Prisma)
- `requireAuth()` : redirige vers /connexion si non connecté
- `requireAdmin()` : redirige vers / si pas ADMIN
- `createUserIfNotExists()` : crée l'entrée User Prisma lors de la première connexion

**Step 2: Page de connexion**

Formulaire email/mot de passe avec Supabase Auth. Style cohérent avec le site.
2 variantes : connexion admin et connexion client (même page, même formulaire).

**Step 3: Page d'inscription client**

Formulaire : nom, email, mot de passe, confirmation mot de passe.
Création du compte via Supabase Auth + entrée User Prisma (role CLIENT).

**Step 4: Middleware de protection**

```typescript
// src/middleware.ts
// Protège /admin/* → redirige vers /connexion si non connecté
// Protège /mon-compte/* → redirige vers /connexion si non connecté
```

**Step 5: Callback route**

Gère le retour après confirmation email Supabase.

**Step 6: Build + commit**

```bash
npm run build && git add . && git commit -m "feat: authentification Supabase (login, register, middleware)"
```

---

## Task 3 : Layout Admin + Dashboard

**Files:**
- Create: `src/app/admin/layout.tsx` (sidebar + header admin)
- Create: `src/app/admin/page.tsx` (dashboard stats)
- Create: `src/components/admin/AdminSidebar.tsx`
- Create: `src/components/admin/AdminHeader.tsx`
- Create: `src/components/admin/StatCard.tsx`

**Step 1: Layout admin**

Layout dédié avec sidebar à gauche (liens : Dashboard, Produits, Catégories, Commandes, Paramètres) et header avec nom de l'admin + bouton déconnexion. Vérification du rôle ADMIN.

**Step 2: Dashboard**

Page avec 4 StatCards :
- Commandes du jour (count)
- CA du mois (sum)
- Commandes en cours (PAID + PROCESSING)
- Total produits actifs

Données chargées via Server Components + requêtes Prisma.

**Step 3: Build + commit**

```bash
npm run build && git add . && git commit -m "feat: layout admin + dashboard statistiques"
```

---

## Task 4 : Admin - CRUD Catégories

**Files:**
- Create: `src/app/admin/categories/page.tsx` (liste)
- Create: `src/app/admin/categories/actions.ts` (Server Actions)
- Create: `src/components/admin/categories/CategoryForm.tsx`
- Create: `src/components/admin/categories/CategoryList.tsx`

**Step 1: Server Actions pour les catégories**

- `createCategory(formData)` — crée une catégorie, génère le slug automatiquement
- `updateCategory(id, formData)` — modifie une catégorie
- `deleteCategory(id)` — supprime (seulement si aucun produit lié)
- `reorderCategories(ids[])` — réordonne

**Step 2: Page liste + formulaire**

Table avec nom, slug, nombre de produits, statut, actions (modifier/supprimer).
Modal ou section dépliante pour le formulaire de création/modification.

**Step 3: Build + commit**

```bash
npm run build && git add . && git commit -m "feat: admin CRUD catégories"
```

---

## Task 5 : Admin - CRUD Produits + Upload images

**Files:**
- Create: `src/app/admin/produits/page.tsx` (liste)
- Create: `src/app/admin/produits/nouveau/page.tsx` (création)
- Create: `src/app/admin/produits/[id]/page.tsx` (édition)
- Create: `src/app/admin/produits/actions.ts` (Server Actions)
- Create: `src/components/admin/products/ProductForm.tsx`
- Create: `src/components/admin/products/ProductList.tsx`
- Create: `src/components/admin/products/ImageUpload.tsx`

**Step 1: Upload d'images vers Supabase Storage**

Composant `ImageUpload` :
- Drag & drop ou clic pour sélectionner
- Preview des images
- Upload vers Supabase Storage bucket "product-images"
- Réordonnancement par drag (première image = image principale)
- Suppression d'images

**Step 2: Server Actions produits**

- `createProduct(formData)` — crée produit + slug auto + images
- `updateProduct(id, formData)` — modifie
- `deleteProduct(id)` — supprime (soft : isActive=false, ou hard si aucune commande)
- `toggleProductActive(id)` — active/désactive

**Step 3: Formulaire produit**

Champs : nom, description (textarea), prix, catégorie (select), images (ImageUpload), a des variantes (toggle).

**Step 4: Liste des produits**

Table avec image miniature, nom, prix, catégorie, statut, actions.
Filtres par catégorie et statut.

**Step 5: Build + commit**

```bash
npm run build && git add . && git commit -m "feat: admin CRUD produits avec upload images"
```

---

## Task 6 : Admin - Gestion des variantes produit

**Files:**
- Create: `src/components/admin/products/VariantManager.tsx`
- Modify: `src/app/admin/produits/[id]/page.tsx` (intégrer VariantManager)
- Modify: `src/app/admin/produits/actions.ts` (actions variantes)

**Step 1: Server Actions variantes**

- `createVariant(productId, formData)` — nom, prix override, attributs
- `updateVariant(id, formData)`
- `deleteVariant(id)`
- `toggleVariantActive(id)`

**Step 2: Composant VariantManager**

Section dans la page d'édition produit. Liste des variantes existantes + formulaire d'ajout.
Champs : nom (ex: "PLA Blanc - Grande"), prix override (optionnel, sinon prix du produit), attributs dynamiques (clé/valeur : matériau=PLA, couleur=Blanc, taille=Grande).

**Step 3: Build + commit**

```bash
npm run build && git add . && git commit -m "feat: admin gestion variantes produit"
```

---

## Task 7 : Page Boutique publique (catalogue)

**Files:**
- Create: `src/app/boutique/page.tsx`
- Create: `src/components/shop/ProductCard.tsx`
- Create: `src/components/shop/ShopFilter.tsx`
- Create: `src/components/shop/ShopGrid.tsx`

**Step 1: Page boutique**

Server Component qui charge les produits actifs depuis Prisma (avec catégorie).
Filtrage par catégorie via searchParams (`/boutique?categorie=figurines`).
Tri par date (récent) ou prix.

**Step 2: ProductCard**

Carte produit avec : image principale (next/image depuis Supabase), nom, prix (ou "À partir de X€" si variantes), catégorie (badge), bouton "Voir le produit".

**Step 3: ShopFilter**

Barre de filtres par catégorie (même style que GalleryFilter existant).

**Step 4: Build + commit**

```bash
npm run build && git add . && git commit -m "feat: page boutique publique (catalogue produits)"
```

---

## Task 8 : Page Fiche produit

**Files:**
- Create: `src/app/boutique/[slug]/page.tsx`
- Create: `src/components/shop/ProductImages.tsx`
- Create: `src/components/shop/VariantSelector.tsx`
- Create: `src/components/shop/AddToCartButton.tsx`

**Step 1: Page fiche produit**

Server Component avec `generateStaticParams` pour les slugs.
Layout : galerie d'images à gauche, infos à droite.

**Step 2: ProductImages**

Galerie avec image principale grande + miniatures cliquables.
Lightbox au clic sur l'image principale.

**Step 3: VariantSelector**

Si le produit a des variantes : sélecteur (boutons ou select) qui met à jour le prix affiché.

**Step 4: AddToCartButton**

Bouton "Ajouter au panier" (client component). Ajoute au localStorage avec produit, variante sélectionnée, quantité.

**Step 5: Build + commit**

```bash
npm run build && git add . && git commit -m "feat: page fiche produit (images, variantes, ajout panier)"
```

---

## Task 9 : Panier (localStorage)

**Files:**
- Create: `src/lib/cart.ts` (logique panier : add, remove, update, clear, getTotal)
- Create: `src/context/CartContext.tsx` (Context React pour le panier)
- Create: `src/app/panier/page.tsx`
- Create: `src/components/shop/CartItem.tsx`
- Create: `src/components/shop/CartSummary.tsx`
- Create: `src/components/layout/CartBadge.tsx` (compteur dans le header)
- Modify: `src/components/layout/Header.tsx` (ajouter CartBadge)

**Step 1: Logique panier**

`src/lib/cart.ts` : fonctions pures pour manipuler le panier stocké en localStorage.
Interface CartItem : { productId, variantId?, name, variantName?, price, quantity, image }.

**Step 2: CartContext**

Context React + Provider dans layout.tsx. Expose : items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice.

**Step 3: Page panier**

Liste des articles avec image, nom, variante, prix unitaire, sélecteur quantité, bouton supprimer.
Résumé : sous-total, frais de livraison (estimés), total.
Bouton "Commander" → redirige vers le checkout.
Message si panier vide avec lien vers la boutique.

**Step 4: CartBadge dans le Header**

Petit badge rond orange sur l'icône panier, affichant le nombre d'articles.

**Step 5: Build + commit**

```bash
npm run build && git add . && git commit -m "feat: panier client (localStorage, context, page panier)"
```

---

## Task 10 : Checkout Stripe + Webhooks + Commandes

**Files:**
- Create: `src/app/api/checkout/route.ts` (crée la session Stripe)
- Create: `src/app/api/stripe/webhook/route.ts` (webhook Stripe)
- Create: `src/app/commande/[id]/page.tsx` (confirmation)
- Create: `src/components/shop/CheckoutForm.tsx` (infos client avant paiement)
- Create: `src/app/panier/checkout/page.tsx` (page checkout)
- Create: `src/lib/stripe.ts` (client Stripe)
- Create: `src/lib/orders.ts` (fonctions de création/gestion commandes)

**Step 1: Client Stripe**

`src/lib/stripe.ts` : initialisation du client Stripe côté serveur.

**Step 2: Page checkout**

Formulaire pré-paiement : nom, email, téléphone, choix livraison/retrait, adresse si livraison.
Si l'utilisateur est connecté, pré-remplir les champs.
Bouton "Payer" → appelle l'API checkout.

**Step 3: API création session Stripe**

`POST /api/checkout` :
- Reçoit les items du panier + infos client
- Vérifie les prix en BDD (ne jamais faire confiance au client)
- Calcule le total + frais de livraison
- Crée une Stripe Checkout Session avec les line_items
- Crée une commande PENDING en BDD avec le stripeSessionId
- Retourne l'URL de redirection Stripe

**Step 4: Webhook Stripe**

`POST /api/stripe/webhook` :
- Vérifie la signature Stripe
- Événement `checkout.session.completed` :
  - Met à jour le statut de la commande → PAID
  - Envoie email de confirmation au client
  - Envoie email de notification à l'admin

**Step 5: Page confirmation**

Affiche les détails de la commande après paiement réussi.
Accessible via `/commande/[id]` (retour depuis Stripe success_url).

**Step 6: Build + commit**

```bash
npm run build && git add . && git commit -m "feat: checkout Stripe + webhook + commandes"
```

---

## Task 11 : Admin - Gestion des commandes

**Files:**
- Create: `src/app/admin/commandes/page.tsx` (liste)
- Create: `src/app/admin/commandes/[id]/page.tsx` (détail)
- Create: `src/app/admin/commandes/actions.ts` (Server Actions)
- Create: `src/components/admin/orders/OrderList.tsx`
- Create: `src/components/admin/orders/OrderDetail.tsx`
- Create: `src/components/admin/orders/OrderStatusBadge.tsx`

**Step 1: Liste des commandes**

Table avec : numéro, date, client (nom + email), montant, statut (badge coloré), actions.
Filtres par statut (toutes, en attente, payées, en préparation, expédiées, livrées).
Tri par date (plus récentes d'abord).

**Step 2: Détail commande**

Page avec : infos client, adresse de livraison, liste des articles (avec images), montants (sous-total, livraison, total), historique des statuts.
Boutons pour changer le statut : Payée → En préparation → Expédiée → Livrée.

**Step 3: Server Actions**

- `updateOrderStatus(id, newStatus)` — met à jour + envoie email au client
- `cancelOrder(id)` — annule + remboursement Stripe si applicable

**Step 4: Build + commit**

```bash
npm run build && git add . && git commit -m "feat: admin gestion des commandes"
```

---

## Task 12 : Emails transactionnels (Resend)

**Files:**
- Create: `src/lib/email.ts` (client Resend + envoi)
- Create: `src/components/emails/OrderConfirmation.tsx` (template React Email)
- Create: `src/components/emails/NewOrderNotification.tsx`
- Create: `src/components/emails/OrderStatusUpdate.tsx`
- Create: `src/components/emails/ErrorAlert.tsx`

**Step 1: Client email**

`src/lib/email.ts` : initialisation Resend + fonctions d'envoi typées.

**Step 2: Templates d'emails**

Utiliser React pour les templates HTML (Resend supporte JSX).
- **Confirmation commande** (au client) : récap articles, montant, infos livraison
- **Nouvelle commande** (à l'admin) : détail complet de la commande
- **Mise à jour statut** (au client) : nouveau statut, message adapté
- **Alerte erreur** (à vguyon.dev@hotmail.com) : template rouge, contexte complet

**Step 3: Intégrer les envois**

- Webhook Stripe (commande payée) → confirmation client + notification admin
- Admin change statut → email au client
- Erreurs API → alerte email

**Step 4: Build + commit**

```bash
npm run build && git add . && git commit -m "feat: emails transactionnels (Resend)"
```

---

## Task 13 : Espace client (Mon compte)

**Files:**
- Create: `src/app/mon-compte/page.tsx` (historique commandes)
- Create: `src/app/mon-compte/layout.tsx` (layout simple)
- Create: `src/components/account/OrderHistory.tsx`
- Create: `src/components/account/AccountHeader.tsx`

**Step 1: Layout mon-compte**

Layout simple avec header : nom, email, bouton déconnexion.
Protégé par middleware (redirige vers /connexion si non connecté).

**Step 2: Historique des commandes**

Liste des commandes de l'utilisateur connecté (Prisma query par userId).
Chaque commande : numéro, date, montant, statut (badge), lien vers détail.

**Step 3: Build + commit**

```bash
npm run build && git add . && git commit -m "feat: espace client (historique commandes)"
```

---

## Task 14 : Admin - Paramètres boutique

**Files:**
- Create: `src/app/admin/parametres/page.tsx`
- Create: `src/app/admin/parametres/actions.ts`
- Create: `src/components/admin/settings/ShopSettingsForm.tsx`

**Step 1: Page paramètres**

Formulaire avec les réglages ShopSettings :
- Frais de livraison fixes (€)
- Seuil de livraison gratuite (€, optionnel)
- Retrait sur place activé (toggle)
- Adresse de retrait (si activé)

**Step 2: Server Action**

`updateShopSettings(formData)` — met à jour la ligne unique ShopSettings.

**Step 3: Seed initial**

Ajouter dans `prisma/seed.ts` : créer la ligne ShopSettings par défaut + un utilisateur admin.

**Step 4: Build + commit**

```bash
npm run build && git add . && git commit -m "feat: admin paramètres boutique + seed initial"
```

---

## Task 15 : Intégration boutique dans la navigation + polish

**Files:**
- Modify: `src/components/layout/Header.tsx` (ajouter liens Boutique + Panier)
- Modify: `src/components/layout/Footer.tsx` (ajouter lien Boutique)
- Modify: `src/components/layout/MobileMenu.tsx` (ajouter liens)
- Modify: `src/app/page.tsx` (mettre à jour les CTA vers /boutique)
- Modify: `src/app/sitemap.ts` (ajouter /boutique)
- Modify: `src/data/gallery.ts` (lier aux vrais produits si possible)

**Step 1: Navigation**

Ajouter "Boutique" dans les liens de navigation (entre Services et Réalisations).
Ajouter l'icône panier avec CartBadge dans le Header.

**Step 2: Sitemap & SEO**

Ajouter `/boutique` et les pages produits dynamiques au sitemap.
Metadata pour la page boutique et les fiches produits (dynamique via generateMetadata).

**Step 3: Mise à jour des CTA**

Les boutons "Voir nos créations" / "Découvrir" sur la page d'accueil pointent vers /boutique au lieu de /realisations.

**Step 4: Build final + commit**

```bash
npm run build && git add . && git commit -m "feat: intégration boutique dans la navigation + SEO"
```

---

## Résumé des tâches

| # | Tâche | Dépendances |
|---|---|---|
| 1 | Infrastructure (Supabase, Prisma, Stripe) | - |
| 2 | Authentification (login, register, middleware) | 1 |
| 3 | Layout Admin + Dashboard | 2 |
| 4 | Admin - CRUD Catégories | 3 |
| 5 | Admin - CRUD Produits + Upload images | 4 |
| 6 | Admin - Variantes produit | 5 |
| 7 | Page Boutique publique | 5 |
| 8 | Page Fiche produit | 7 |
| 9 | Panier (localStorage + Context) | 8 |
| 10 | Checkout Stripe + Webhooks + Commandes | 9 |
| 11 | Admin - Gestion commandes | 10 |
| 12 | Emails transactionnels (Resend) | 10 |
| 13 | Espace client (Mon compte) | 2, 10 |
| 14 | Admin - Paramètres boutique | 3 |
| 15 | Intégration navigation + polish | 9 |

## Prérequis avant de commencer

1. **Créer un projet Supabase** (ou libérer un slot en pausant un projet existant)
2. **Récupérer les clés Supabase** (URL, anon key, service role key, database URL)
3. **Créer un compte Stripe** pour 3D World (ou utiliser le mode test de ton compte existant)
4. **Créer un compte Resend** (ou utiliser celui existant)
5. **Remplir le `.env.local`** avec toutes les clés
