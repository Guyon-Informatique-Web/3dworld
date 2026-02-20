# 3D World - Site Vitrine - Plan d'implémentation

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Créer un site vitrine statique moderne et créatif pour 3D World (impression 3D), optimisé SEO, hébergé sur Hostinger.

**Architecture:** Site Next.js 15 exporté en statique (`output: 'export'`). Pas de backend, pas de base de données. Formulaire de contact via Web3Forms (service externe gratuit). Galerie filtrable côté client. Animations Framer Motion.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Web3Forms, next/image (static export)

---

## Task 1 : Initialisation du projet

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`, `.gitignore`

**Step 1: Créer le projet Next.js**

```bash
cd "/mnt/c/Mes Projets/PERSO/clients/3dworld"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Choisir les options : TypeScript=Yes, ESLint=Yes, Tailwind=Yes, src/=Yes, App Router=Yes.

**Step 2: Installer les dépendances**

```bash
npm install framer-motion
npm install -D @types/node
```

**Step 3: Configurer l'export statique dans next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // Nécessaire pour l'export statique
  },
};

export default nextConfig;
```

**Step 4: Configurer Tailwind v4 dans globals.css**

```css
@import "tailwindcss";

/* Palette 3D World */
@theme {
  --color-primary: #7c3aed;       /* Violet */
  --color-primary-light: #a78bfa;  /* Violet clair */
  --color-primary-dark: #5b21b6;   /* Violet foncé */
  --color-accent: #f97316;         /* Orange CTA */
  --color-accent-light: #fdba74;   /* Orange clair */
  --color-accent-dark: #ea580c;    /* Orange foncé */
  --color-bg: #fafafa;             /* Fond principal */
  --color-bg-alt: #f3f0ff;         /* Fond alternatif (violet très léger) */
  --color-text: #1e1b2e;           /* Texte principal */
  --color-text-light: #6b7280;     /* Texte secondaire */
}
```

**Step 5: Vérifier que le build fonctionne**

```bash
npm run build
```

Expected: Build réussi sans erreur.

**Step 6: Commit**

```bash
git init
git add .
git commit -m "init: projet Next.js 15 avec Tailwind v4 et export statique"
```

---

## Task 2 : Layout partagé (Header + Footer + Navigation)

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/layout/MobileMenu.tsx`
- Create: `src/components/ui/Logo.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Créer le composant Logo**

`src/components/ui/Logo.tsx` — Logo SVG stylisé "3D World" avec icône géométrique 3D.

**Step 2: Créer le Header avec navigation responsive**

`src/components/layout/Header.tsx` — Navigation fixe avec :
- Logo à gauche
- Liens : Accueil, Services, Réalisations, À propos, Contact
- Bouton CTA "Devis gratuit" (orange accent)
- Menu hamburger sur mobile
- Background transparent → blanc au scroll (avec useEffect + scroll listener)

**Step 3: Créer le menu mobile**

`src/components/layout/MobileMenu.tsx` — Menu slide-in animé avec Framer Motion :
- Overlay sombre
- Panel latéral avec les liens
- Animation d'entrée/sortie

**Step 4: Créer le Footer**

`src/components/layout/Footer.tsx` — Footer avec :
- 3 colonnes : Infos (logo + description), Liens rapides, Contact
- Liens réseaux sociaux (icônes SVG : Instagram, Facebook, TikTok)
- Copyright dynamique (année)
- Lien "Site créé par Guyon Informatique & Web"

**Step 5: Intégrer dans layout.tsx**

```tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

**Step 6: Vérifier le build + rendu visuel**

```bash
npm run dev
```

Ouvrir Chrome, vérifier header/footer sur desktop et mobile.

**Step 7: Commit**

```bash
git add .
git commit -m "feat: layout partagé (header, footer, navigation responsive)"
```

---

## Task 3 : Page d'accueil

**Files:**
- Create: `src/components/home/HeroSection.tsx`
- Create: `src/components/home/ServicesPreview.tsx`
- Create: `src/components/home/GalleryPreview.tsx`
- Create: `src/components/home/TestimonialsSection.tsx`
- Create: `src/components/home/CTASection.tsx`
- Create: `src/components/ui/SectionTitle.tsx`
- Create: `src/components/ui/AnimatedSection.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Créer AnimatedSection (wrapper Framer Motion)**

Composant réutilisable qui anime ses enfants à l'entrée dans le viewport (fade-in + slide-up).

```tsx
"use client";
import { motion } from "framer-motion";

export function AnimatedSection({ children, className, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

**Step 2: Créer SectionTitle (composant réutilisable)**

Titre de section avec sous-titre, centré, avec ligne décorative colorée.

**Step 3: Créer HeroSection**

Section hero plein écran avec :
- Titre accrocheur : "Donnez vie à vos idées en 3D"
- Sous-titre explicatif
- 2 boutons CTA : "Voir nos réalisations" (primary) + "Demander un devis" (accent)
- Illustration/pattern géométrique 3D en arrière-plan (CSS/SVG)
- Animation d'entrée avec Framer Motion

**Step 4: Créer ServicesPreview**

2 cartes côte à côte :
- "Impression sur commande" — icône + description + lien "En savoir plus"
- "Nos créations" — icône + description + lien "Découvrir"
Hover effect avec élévation + changement de couleur de bordure.

**Step 5: Créer GalleryPreview**

Grille 3x2 (desktop) / 2x2 (mobile) avec les meilleures réalisations.
Images placeholder pour l'instant (via `public/images/gallery/`).
Bouton "Voir toutes nos réalisations" en dessous.

**Step 6: Créer TestimonialsSection**

Carrousel de témoignages (3 témoignages en dur pour commencer) :
- Citation, nom, type de projet
- Navigation par flèches ou points
- Auto-scroll optionnel

**Step 7: Créer CTASection**

Bandeau coloré (dégradé violet → bleu) avec :
- "Vous avez un projet ? Parlons-en !"
- Bouton "Demander un devis gratuit" (orange)

**Step 8: Assembler la page d'accueil**

```tsx
// src/app/page.tsx
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesPreview />
      <GalleryPreview />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
```

**Step 9: Vérifier le rendu dans Chrome**

```bash
npm run dev
```

Tester sur desktop et mobile.

**Step 10: Commit**

```bash
git add .
git commit -m "feat: page d'accueil complète (hero, services, galerie, témoignages, CTA)"
```

---

## Task 4 : Page Services

**Files:**
- Create: `src/app/services/page.tsx`
- Create: `src/components/services/ServiceDetail.tsx`
- Create: `src/components/services/ProcessSteps.tsx`
- Create: `src/components/services/MaterialsList.tsx`

**Step 1: Créer ProcessSteps**

Timeline verticale illustrant le processus d'impression sur commande :
1. Envoyez votre idée ou fichier 3D
2. Échange et validation du projet
3. Impression et contrôle qualité
4. Livraison de votre pièce

Chaque étape avec numéro, icône, titre et description.

**Step 2: Créer MaterialsList**

Grille de cartes présentant les matériaux disponibles (PLA, PETG, ABS, TPU, Résine) avec :
- Nom du matériau
- Propriétés clés
- Cas d'usage typiques

**Step 3: Créer ServiceDetail**

Composant réutilisable pour présenter un service : image, titre, description, liste de points forts, CTA.

**Step 4: Assembler la page Services**

2 sections principales :
- **Impression sur commande** : ServiceDetail + ProcessSteps + MaterialsList
- **Nos créations** : ServiceDetail + aperçu galerie avec lien vers /realisations

**Step 5: Build + vérification visuelle**

```bash
npm run dev
```

**Step 6: Commit**

```bash
git add .
git commit -m "feat: page services (process, matériaux, détails)"
```

---

## Task 5 : Page Galerie / Réalisations

**Files:**
- Create: `src/app/realisations/page.tsx`
- Create: `src/components/gallery/GalleryGrid.tsx`
- Create: `src/components/gallery/GalleryFilter.tsx`
- Create: `src/components/gallery/Lightbox.tsx`
- Create: `src/data/gallery.ts`

**Step 1: Créer les données de la galerie**

```typescript
// src/data/gallery.ts
export type GalleryCategory = "all" | "deco" | "figurines" | "prototypes" | "accessoires" | "custom";

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: GalleryCategory;
  image: string; // chemin vers public/images/gallery/
}

export const galleryItems: GalleryItem[] = [
  // Données placeholder — à remplacer par les vraies photos
];
```

**Step 2: Créer GalleryFilter**

Barre de filtres horizontale avec boutons par catégorie :
- Tout, Déco, Figurines, Prototypes, Accessoires, Sur mesure
- Style : boutons pill, actif = couleur primary, inactif = gris
- Animation de transition au changement de filtre

**Step 3: Créer GalleryGrid**

Grille Masonry-like (CSS columns ou grid auto-fill) avec :
- Images avec overlay au hover (titre + catégorie)
- Animation d'apparition staggerée (Framer Motion)
- Click → ouvre Lightbox

**Step 4: Créer Lightbox**

Modal plein écran avec :
- Image en grand
- Titre + description
- Navigation (précédent/suivant)
- Fermeture (croix + clic extérieur + Escape)
- Animation d'ouverture/fermeture (Framer Motion)

**Step 5: Assembler la page Réalisations**

```tsx
export default function RealisationsPage() {
  return (
    <section>
      <SectionTitle title="Nos réalisations" subtitle="..." />
      <GalleryFilter />
      <GalleryGrid />
    </section>
  );
}
```

**Step 6: Vérifier le build + rendu**

```bash
npm run dev
```

Tester les filtres, la lightbox, la navigation, le responsive.

**Step 7: Commit**

```bash
git add .
git commit -m "feat: page réalisations (galerie filtrable, lightbox)"
```

---

## Task 6 : Page À propos

**Files:**
- Create: `src/app/a-propos/page.tsx`
- Create: `src/components/about/StorySection.tsx`
- Create: `src/components/about/EquipmentSection.tsx`
- Create: `src/components/about/StatsSection.tsx`

**Step 1: Créer StorySection**

Section "Notre histoire" avec :
- Texte narratif (placeholder à personnaliser)
- Photo de l'atelier ou portrait (placeholder)
- Layout asymétrique texte/image

**Step 2: Créer StatsSection**

Compteurs animés (Framer Motion) :
- X+ projets réalisés
- X+ clients satisfaits
- X+ matériaux disponibles
- Année de création

**Step 3: Créer EquipmentSection**

Grille des machines/imprimantes utilisées avec :
- Photo, nom, capacités
- Placeholder pour l'instant

**Step 4: Assembler la page**

**Step 5: Commit**

```bash
git add .
git commit -m "feat: page à propos (histoire, stats, équipement)"
```

---

## Task 7 : Page Contact + Formulaire de devis

**Files:**
- Create: `src/app/contact/page.tsx`
- Create: `src/components/contact/ContactForm.tsx`
- Create: `src/components/contact/ContactInfo.tsx`

**Step 1: Créer ContactInfo**

Colonne avec :
- Email, téléphone (si dispo)
- Localisation
- Horaires
- Liens réseaux sociaux (icônes cliquables)

**Step 2: Créer ContactForm**

Formulaire de demande de devis avec Web3Forms :
- Champs : Nom, Email, Téléphone (optionnel), Type de projet (select : impression sur commande / achat création / autre), Description du projet (textarea), Budget estimé (optionnel)
- Validation côté client (required, email format)
- Envoi via `fetch` POST vers `https://api.web3forms.com/submit`
- États : idle, loading, success, error
- Message de confirmation après envoi

```tsx
const onSubmit = async (data: FormData) => {
  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_key: "À_CONFIGURER", // Clé publique Web3Forms
      ...data,
    }),
  });
};
```

**Note** : La clé Web3Forms est publique (faite pour être dans le front). Créer un compte gratuit sur web3forms.com et récupérer la clé.

**Step 3: Assembler la page Contact**

Layout 2 colonnes : formulaire à gauche, infos à droite.

**Step 4: Tester l'envoi du formulaire**

```bash
npm run dev
```

Remplir et soumettre le formulaire, vérifier la réception.

**Step 5: Commit**

```bash
git add .
git commit -m "feat: page contact avec formulaire de devis (Web3Forms)"
```

---

## Task 8 : SEO & Metadata

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Modify: `src/app/layout.tsx` (metadata globale)
- Modify: chaque `page.tsx` (metadata spécifique)

**Step 1: Metadata globale dans layout.tsx**

```typescript
export const metadata: Metadata = {
  title: {
    default: "3D World | Impression 3D sur mesure",
    template: "%s | 3D World",
  },
  description: "Impression 3D sur commande et créations originales. Donnez vie à vos idées avec 3D World.",
  keywords: ["impression 3D", "impression 3D sur commande", "objets 3D", "prototypage", "créations 3D"],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.3d-world.online",
    siteName: "3D World",
  },
};
```

**Step 2: Metadata par page**

Chaque page exporte sa propre `metadata` avec title et description uniques.

**Step 3: Sitemap**

```typescript
// src/app/sitemap.ts
export default function sitemap() {
  const baseUrl = "https://www.3d-world.online";
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/realisations`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/a-propos`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.7 },
  ];
}
```

**Step 4: Robots.txt**

```typescript
// src/app/robots.ts
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://www.3d-world.online/sitemap.xml",
  };
}
```

**Step 5: Données structurées Schema.org**

Ajouter un script JSON-LD `LocalBusiness` dans le layout.

**Step 6: Build complet + vérification**

```bash
npm run build
```

Vérifier que toutes les pages sont générées en statique.

**Step 7: Commit**

```bash
git add .
git commit -m "feat: SEO complet (metadata, sitemap, robots, schema.org)"
```

---

## Task 9 : Polish & Export final

**Files:**
- Modify: styles globaux si besoin
- Create: `public/favicon.ico`, `public/images/og-image.jpg`

**Step 1: Favicon et OG image**

Créer un favicon SVG basé sur le logo + image Open Graph (1200x630).

**Step 2: Vérification responsive complète**

Tester chaque page en Chrome DevTools sur :
- Mobile (375px)
- Tablette (768px)
- Desktop (1280px+)

**Step 3: Vérification performance**

```bash
npm run build
```

Vérifier la taille du bundle et le nombre de fichiers générés dans `out/`.

**Step 4: Test Lighthouse**

Lancer un audit Lighthouse dans Chrome sur chaque page. Objectifs :
- Performance > 90
- Accessibility > 90
- Best Practices > 90
- SEO > 90

**Step 5: Commit final**

```bash
git add .
git commit -m "feat: polish final, favicon, og-image, vérifications"
```

---

## Résumé des tâches

| # | Tâche | Durée estimée |
|---|---|---|
| 1 | Initialisation du projet | Court |
| 2 | Layout (Header + Footer) | Moyen |
| 3 | Page d'accueil | Long |
| 4 | Page Services | Moyen |
| 5 | Page Réalisations (galerie) | Long |
| 6 | Page À propos | Court |
| 7 | Page Contact + formulaire | Moyen |
| 8 | SEO & Metadata | Court |
| 9 | Polish & Export | Court |
