// Page admin newsletter — liste des abonnés et statistiques

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import SubscriberList from "@/components/admin/newsletter/SubscriberList";

interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
}

export default async function NewsletterPage() {
  await requireAdmin();

  // Récupérer tous les abonnés triés par date de création décroissante
  const subscribers = (await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  })) as Subscriber[];

  // Compter les abonnés actifs et total
  const activeCount = subscribers.filter((s) => s.isActive).length;
  const totalCount = subscribers.length;

  return (
    <SubscriberList
      subscribers={subscribers}
      activeCount={activeCount}
      totalCount={totalCount}
    />
  );
}
