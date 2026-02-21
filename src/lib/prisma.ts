// Client Prisma singleton — initialisation lazy avec adapter pg pour Prisma 7
// En développement, l'instance est stockée dans globalThis pour survivre au hot-reload

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error("DATABASE_URL manquante. Vérifier load-common-env.ts et .env.local");
    }
    const adapter = new PrismaPg({
      connectionString: dbUrl,
    });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma;
}

// Proxy lazy : PrismaClient n'est instancié qu'au premier appel réel
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    return Reflect.get(getPrismaClient(), prop);
  },
});
