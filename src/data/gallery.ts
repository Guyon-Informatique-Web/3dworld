// Données de la galerie de réalisations

export type GalleryCategory =
  | "all"
  | "deco"
  | "figurines"
  | "prototypes"
  | "accessoires"
  | "custom";

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: GalleryCategory;
  /** Chemin vers l'image (vide = placeholder gradient) */
  image: string;
}

/** Liste des catégories pour le filtre */
export const CATEGORIES: { value: GalleryCategory; label: string }[] = [
  { value: "all", label: "Tout" },
  { value: "deco", label: "Décoration" },
  { value: "figurines", label: "Figurines" },
  { value: "prototypes", label: "Prototypes" },
  { value: "accessoires", label: "Accessoires" },
  { value: "custom", label: "Sur mesure" },
];

/** Éléments de la galerie (données statiques) */
export const galleryItems: GalleryItem[] = [
  {
    id: "1",
    title: "Vase géométrique",
    description:
      "Vase décoratif aux formes géométriques modernes, imprimé en PLA blanc.",
    category: "deco",
    image: "",
  },
  {
    id: "2",
    title: "Dragon articulé",
    description:
      "Figurine de dragon entièrement articulée, imprimée en une seule pièce.",
    category: "figurines",
    image: "",
  },
  {
    id: "3",
    title: "Boîtier électronique",
    description:
      "Prototype de boîtier pour carte Arduino, imprimé en PETG noir.",
    category: "prototypes",
    image: "",
  },
  {
    id: "4",
    title: "Support téléphone",
    description:
      "Support de bureau ajustable pour smartphone, design minimaliste.",
    category: "accessoires",
    image: "",
  },
  {
    id: "5",
    title: "Lampe lithophane",
    description:
      "Lampe personnalisée avec photo en lithophane, éclairage LED intégré.",
    category: "custom",
    image: "",
  },
  {
    id: "6",
    title: "Pot de fleur suspendu",
    description:
      "Pot de fleur design avec système de suspension intégré.",
    category: "deco",
    image: "",
  },
  {
    id: "7",
    title: "Figurine personnage",
    description:
      "Figurine de personnage de jeu vidéo, imprimée en résine haute définition.",
    category: "figurines",
    image: "",
  },
  {
    id: "8",
    title: "Engrenage de remplacement",
    description:
      "Pièce mécanique de remplacement imprimée en ABS pour machine industrielle.",
    category: "prototypes",
    image: "",
  },
  {
    id: "9",
    title: "Porte-clés personnalisé",
    description:
      "Porte-clés avec logo d'entreprise, imprimé en PLA multicolore.",
    category: "custom",
    image: "",
  },
  {
    id: "10",
    title: "Étagère murale",
    description: "Étagère murale modulaire au design hexagonal.",
    category: "deco",
    image: "",
  },
  {
    id: "11",
    title: "Range-câbles",
    description:
      "Organisateur de câbles pour bureau, clips et guides intégrés.",
    category: "accessoires",
    image: "",
  },
  {
    id: "12",
    title: "Maquette architecturale",
    description:
      "Maquette à l'échelle d'un bâtiment pour présentation client.",
    category: "prototypes",
    image: "",
  },
];
