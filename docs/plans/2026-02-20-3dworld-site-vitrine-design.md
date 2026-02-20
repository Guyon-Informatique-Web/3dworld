# Design - Site Vitrine 3D World

**Date** : 2026-02-20
**Client** : 3D World (impression 3D)
**Site actuel** : https://www.3d-world.online/ (Wix)
**Objectif** : Créer un site vitrine moderne et créatif pour toucher plus de monde

---

## Contexte

- **Services** : Impression 3D sur commande + Vente de créations
- **Cible** : Particuliers + Professionnels
- **Style** : Coloré / Créatif
- **Type** : Site vitrine avec catalogue (e-commerce prévu plus tard)
- **Hébergement** : Hostinger (export statique)

---

## Architecture & Pages

| Page | Contenu |
|---|---|
| **Accueil** | Hero percutant avec animation 3D, présentation des services, galerie aperçu, témoignages, CTA devis |
| **Services** | Détail : Impression sur commande (process étape par étape) + Créations en vente (catalogue visuel) |
| **Galerie / Réalisations** | Grille filtrable par catégorie (déco, figurines, prototypes, accessoires), lightbox |
| **À propos** | Histoire de 3D World, passion, machines, matériaux |
| **Contact** | Formulaire de devis, coordonnées, localisation, réseaux sociaux |

---

## Stack technique

- **Framework** : Next.js 15, React 19, `output: 'export'` (statique)
- **Style** : Tailwind CSS v4
- **Animations** : Framer Motion
- **Formulaire** : Service externe (Formspree ou Web3Forms)
- **SEO** : Metadata par page, sitemap.xml, robots.txt, Schema.org (LocalBusiness)
- **Images** : next/image, WebP, lazy loading
- **Responsive** : Mobile-first

---

## Direction artistique

- **Palette** : Fond clair, accents violet/bleu électrique + orange/jaune pour CTA
- **Typographie** : Inter ou Space Grotesk (corps), font display audacieuse (titres)
- **Visuels** : Photos grand format, hover créatifs, micro-animations
- **Ambiance** : Atelier créatif moderne

---

## Fonctionnalités clés

- Galerie filtrable avec catégories et lightbox
- Formulaire de devis (description projet, fichier 3D optionnel, matériau, quantité)
- Section témoignages avec carrousel
- CTA visibles sur chaque page
- Liens réseaux sociaux
- Google Analytics

---

## SEO & Performance

- Export statique < 1s chargement
- Metadata unique par page (title, description, Open Graph)
- Sitemap XML + robots.txt
- Données structurées Schema.org (LocalBusiness, Product)
- Images optimisées, lazy loading

---

## Évolutions futures

- Ajout e-commerce (Stripe) pour vente directe
- CMS headless si besoin de gestion de contenu autonome
