# Variables d'environnement Vercel — 3D World

## Configuration Vercel Dashboard

Toutes les variables d'environnement doivent être configurées dans **Vercel Dashboard > Settings > Environment Variables**.

## Variables de base de données

### DATABASE_URL
- **Type** : Secret (côté serveur)
- **Description** : URL de connexion PostgreSQL avec pool Supabase
- **Format** : `postgresql://[user]:[password]@[host]:[port]/[database]?schema=[schema]`
- **Exemple** : `postgresql://postgres:password@db.supabase.co:5432/postgres?schema=public`
- **Obligatoire** : OUI
- **Environnement** : Production + Preview

## Variables Supabase (authentification)

### NEXT_PUBLIC_SUPABASE_URL
- **Type** : Public (exposé au client)
- **Description** : URL du projet Supabase
- **Format** : `https://[project].supabase.co`
- **Exemple** : `https://abc123xyz.supabase.co`
- **Obligatoire** : OUI
- **Utilisé pour** : Authentification côté client, requêtes Supabase

### NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Type** : Public (exposé au client)
- **Description** : Clé anonyme Supabase (publique, pas de secret)
- **Format** : Token JWT long
- **Obligatoire** : OUI
- **Utilisé pour** : Authentification côté client, requêtes RLS

### SUPABASE_SERVICE_ROLE_KEY
- **Type** : Secret (côté serveur uniquement)
- **Description** : Clé de rôle service Supabase (admin, contourne RLS)
- **Format** : Token JWT long
- **Obligatoire** : OUI (pour les fonctions serveur)
- **Utilisé pour** : Opérations serveur qui contournent RLS (webhooks, sync)
- **Environnement** : Production + Preview

## Variables Stripe (paiements)

### STRIPE_SECRET_KEY
- **Type** : Secret (côté serveur uniquement)
- **Description** : Clé secrète Stripe pour API côté serveur
- **Format** : `sk_live_...` ou `sk_test_...`
- **Obligatoire** : OUI
- **Utilisé pour** : Créer sessions Checkout, traiter webhooks
- **Environnement** : Production + Preview

### NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- **Type** : Public (exposé au client)
- **Description** : Clé publique Stripe pour afficher paiements côté client
- **Format** : `pk_live_...` ou `pk_test_...`
- **Obligatoire** : OUI
- **Utilisé pour** : Initialiser Stripe.js côté client
- **Note** : Doit correspondre à STRIPE_SECRET_KEY (même environnement test/live)

### STRIPE_WEBHOOK_SECRET
- **Type** : Secret (côté serveur)
- **Description** : Secret webhook Stripe pour vérifier la signature des événements
- **Format** : `whsec_...`
- **Obligatoire** : OUI
- **Utilisé pour** : POST /api/stripe/webhook
- **Génération** : Webhook Stripe Dashboard > Signing secret
- **Environnement** : Production + Preview (secrets différents)

## Variables email (Resend)

### RESEND_API_KEY
- **Type** : Secret (côté serveur)
- **Description** : Clé API Resend pour envoyer les emails
- **Format** : `re_...` ou `re_live_...`
- **Obligatoire** : OUI
- **Utilisé pour** :
  - Confirmation de commande client
  - Notification nouvelle commande (admin)
  - Alertes erreur
- **Environnement** : Production + Preview

## Variables application

### NEXT_PUBLIC_APP_URL
- **Type** : Public (exposé au client)
- **Description** : URL racine de l'application en production
- **Format** : `https://www.3d-world.online`
- **Important** : Pas de slash à la fin
- **Obligatoire** : OUI
- **Utilisé pour** :
  - URLs d'authentification Supabase
  - Callbacks OAuth
  - Links absolus dans les emails

### ADMIN_EMAIL
- **Type** : Public
- **Description** : Email admin pour les notifications de nouvelles commandes
- **Format** : Email valide
- **Obligatoire** : Recommandé
- **Utilisé pour** : `/api/stripe/webhook` envoie une notif à cet email

### ERROR_ALERT_EMAIL
- **Type** : Public
- **Description** : Email pour recevoir les alertes d'erreur
- **Format** : Email valide
- **Valeur** : `vguyon.dev@hotmail.com`
- **Obligatoire** : OUI (pour monitoring en production)
- **Utilisé pour** : Endpoints `/api/error-report` reçoit les erreurs frontend

## Environnements recommandés

### Production
Configurer **tous les secrets** avec des vraies clés (live Stripe, etc.)
```
DATABASE_URL = postgresql://... (prod DB)
NEXT_PUBLIC_SUPABASE_URL = https://abc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
SUPABASE_SERVICE_ROLE_KEY = eyJ...
STRIPE_SECRET_KEY = sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...
STRIPE_WEBHOOK_SECRET = whsec_... (webhook prod)
RESEND_API_KEY = re_...
NEXT_PUBLIC_APP_URL = https://www.3d-world.online
ADMIN_EMAIL = admin@3d-world.online
ERROR_ALERT_EMAIL = vguyon.dev@hotmail.com
```

### Preview (Staging/Test)
Peut utiliser clés test Stripe et DB staging :
```
DATABASE_URL = postgresql://... (staging DB)
NEXT_PUBLIC_SUPABASE_URL = https://staging.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
SUPABASE_SERVICE_ROLE_KEY = eyJ...
STRIPE_SECRET_KEY = sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_...
STRIPE_WEBHOOK_SECRET = whsec_... (webhook staging)
RESEND_API_KEY = re_...
NEXT_PUBLIC_APP_URL = https://staging.3d-world.online
ADMIN_EMAIL = admin@3d-world.online
ERROR_ALERT_EMAIL = vguyon.dev@hotmail.com
```

## Notes importantes

1. **Variables NEXT_PUBLIC_***
   - Exposées dans le JavaScript du client (visible dans source page)
   - Ne jamais y mettre de secrets ou clés privées

2. **Ordre de déploiement**
   - Configurer les variables **avant** le premier déploiement
   - Ou redéployer après les avoir ajoutées

3. **Webhooks Stripe**
   - Créer 2 webhooks Stripe (1 prod, 1 test)
   - Chacun a un secret unique (`whsec_...`)
   - S'assurer que l'URL du webhook est correcte : `/api/stripe/webhook`

4. **Vérification locale**
   - Les .env.local déjà commités permettent de tester localement
   - Les secrets ne doivent PAS être commités (sinon danger de sécurité!)

5. **Refresh après modification**
   - Après modification dans Vercel Dashboard
   - Il faut redéployer pour que les nouveaux secrets soient appliqués
   - Aucun redéploiement n'est requis pour les variables publiques (NEXT_PUBLIC_*)

## Dépannage courant

### "STRIPE_WEBHOOK_SECRET manquante"
- Vérifier que `STRIPE_WEBHOOK_SECRET` est bien configurée dans Vercel
- Vérifier que le webhook Stripe envoie bien les événements à `/api/stripe/webhook`

### "Erreur authentification Supabase"
- Vérifier que `NEXT_PUBLIC_SUPABASE_URL` est correcte
- Vérifier que `NEXT_PUBLIC_SUPABASE_ANON_KEY` est valide

### Emails ne s'envoient pas
- Vérifier que `RESEND_API_KEY` est correcte
- Vérifier que `ADMIN_EMAIL` et `ERROR_ALERT_EMAIL` sont valides
- Vérifier les logs Vercel : `Deployments > Logs`
