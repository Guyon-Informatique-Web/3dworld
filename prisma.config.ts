// Configuration Prisma pour Supabase (connexion poolée + directe)
// Les URLs viennent du fichier commun clients/.env.local via load-common-env.ts

import "./load-common-env";
import { defineConfig } from "prisma/config";

const datasourceUrl = process.env["DIRECT_URL"] || process.env["DATABASE_URL"];
if (!datasourceUrl) {
  throw new Error("DIRECT_URL ou DATABASE_URL manquante. Vérifier load-common-env.ts et .env.local");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: datasourceUrl,
  },
});
