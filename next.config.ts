// Configuration Next.js pour 3D World (e-commerce)
// Import side-effect : charge les variables d'environnement depuis clients/.env.local
import "./load-common-env";
import { publicEnvVars } from "./load-common-env";
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
    // Formats modernes pour optimisation: AVIF (meilleure compression) et WebP
    formats: ["image/avif", "image/webp"],
  },
  // Expose les variables NEXT_PUBLIC_ chargées depuis le fichier commun
  env: publicEnvVars,
};

export default nextConfig;
