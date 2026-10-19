# bige-ops

**bige-ops est une application gratuite, installée sur ton poste.** Elle conçoit ton infrastructure cloud, la chiffre, vérifie ses failles et la déploie sur ton compte. Sans équipe DevOps.

```bash
brew install --cask simondelamarre/bige-ops/bige-ops
```

macOS avec Homebrew. Linux : [AppImage ou .deb](https://github.com/simondelamarre/bige-ops-releases/releases/latest). Site : [bige.dev](https://bige.dev/)

![Capture de bige-ops : le Visual d’une stack sur une machine (API, front, PostgreSQL et sauvegardes), estimée à 74,50 € HT par mois.](docs/screens/shot-simule.png)

**Simuler.** Une application et sa base sur une machine : 74,50 € HT par mois, calculés sur la grille publique.

## Simple, facile et pratique

Tu pars d’une stack prête ou tu dessines la tienne. bige-ops pose le réseau, les machines, les bases et les sauvegardes, affiche le prix de chaque brique et déploie sur ton compte. Pas besoin d’équipe DevOps.

![Capture de bige-ops : le Visual d’une stack multi-VM, VM app à 136 €, VM PostgreSQL à 169 € et VM Redis à 55 € par mois, total 381,66 € HT.](docs/screens/shot-grandis.png)

**Grandir.** Load balancer, application, PostgreSQL et Redis en réseau privé : 381,66 € HT par mois, chaque VM avec son prix.

Il vérifie aussi tes failles, sur ton poste, sans clé ni IA : les pages et les API ouvertes sans connexion, les mots de passe en clair, les requêtes SQL construites avec la saisie, et tes bibliothèques face aux failles connues ([OSV](https://osv.dev/), et [OpenCVE](https://www.opencve.io/) avec ta clé). Ce qui est exposé à Internet passe en premier.

![Capture de bige-ops : l’arbre des routes de Juice Shop jusqu’à login.ts, et la ligne 34 surlignée, une requête SQL construite avec l’email et le mot de passe saisis.](docs/screens/shot-failles.png)

**Sécuriser.** Une vraie injection SQL dans [OWASP Juice Shop](https://owasp.org/projects/juice-shop), ligne 34 de `routes/login.ts`, trouvée sur ton poste, sans clé ni IA.

![Capture de bige-ops : la fiche CVE-2022-25887 sur sanitize-html 1.4.2, exposée à Internet, priorité 1, avec son lien OpenCVE et le bouton Proposer une issue GitHub.](docs/screens/shot-deps.png)

**Corriger.** sanitize-html 1.4.2 et ses CVE, reliées à OpenCVE, avec l’issue GitHub proposée en un clic.

## Pas cher, maîtrisé et sans VPS

bige-ops est gratuit. Ton cloud, tu le paies au prix public, et tu vois chaque ligne avant de déployer.

| Tu es | bige-ops te donne | Budget indicatif |
|---|---|---|
| TPE sans informaticien | Une machine, avec ses sauvegardes | ~75 €/mois |
| Startup qui lance son produit | L’app et ses données séparées | ~382 €/mois |
| Scale-up qui passe à Kubernetes | Un cluster dédié | dès ~458 €/mois |
| Éditeur qui vend aux grands comptes | SecNumCloud, HDS, ISO 27001, et un rapport de failles pour le dossier | ~919 €/mois |
| Agence ou ESN | Chaque stack chiffrée pour ton devis, déployée sur le compte de ton client | de ~75 à ~919 €/mois par client |

| Stack prête | Budget indicatif |
|---|---|
| [Une app et sa base sur une machine](https://bige.dev/layouts.html) | ~75 €/mois |
| [WordPress + MariaDB](https://bige.dev/stack-wordpress-mariadb.html) | ~237 €/mois |
| [Go + PostgreSQL + NATS](https://bige.dev/stack-go-postgresql-nats.html) | ~303 €/mois |
| [Phoenix + PostgreSQL](https://bige.dev/stack-phoenix-postgresql.html) | ~368 €/mois |
| [Django + Celery](https://bige.dev/stack-django-celery-postgresql-redis.html) · [Rails + Sidekiq](https://bige.dev/stack-rails-sidekiq-postgresql-redis.html) · [Laravel + Horizon](https://bige.dev/stack-laravel-horizon-mysql-redis.html) | ~423 €/mois |
| [Next.js + NestJS + PostgreSQL + Redis](https://bige.dev/stack-nextjs-nestjs-postgresql-redis.html) | ~428 €/mois |
| [.NET + PostgreSQL + RabbitMQ](https://bige.dev/stack-dotnet-postgresql-rabbitmq.html) | ~438 €/mois |
| [Node.js + MongoDB + Redis sur Kubernetes](https://bige.dev/stack-express-mongodb-redis-oks.html) | ~458 €/mois |
| [Quarkus + Kafka sur Kubernetes](https://bige.dev/stack-quarkus-oks-postgresql-kafka.html) | ~523 €/mois |
| [Jakarta EE + OpenSearch](https://bige.dev/stack-jakarta-ee-opensearch-postgresql.html) | ~715 €/mois |
| [Spring Boot + Kafka + Keycloak sur Kubernetes](https://bige.dev/stack-spring-boot-oks-kafka-keycloak.html) | ~919 €/mois |
| [IA : FastAPI + pgvector + GPU](https://bige.dev/stack-ai-fastapi-pgvector-gpu.html) | ~2 655 €/mois |

Estimations HT calculées par bige-ops sur la grille publique (eu-west-2). [Toutes les stacks et les langages](https://bige.dev/stacks.html)

Ne perds pas ton temps sur Heroku, Fly.io, Render, Railway, Vercel, Netlify, Clever Cloud, Koyeb, Northflank, DigitalOcean, Linode, Vultr, Hetzner, Contabo, Hostinger…

**Si tu cherches un vrai cloud provider pour avancer : [Outscale](https://bige.dev/pourquoi-outscale.html).**

- **Premier cloud qualifié SecNumCloud 3.2**, le visa de l’ANSSI, en décembre 2023 ; premier IaaS qualifié SecNumCloud dès 2019 ([source](https://www.3ds.com/newsroom/press-releases/outscale-first-cloud-qualified-secnumcloud-32)).
- **Kubernetes dédié** : avec OKS, chaque client a son cluster et son control plane isolés, sans partage de ressources.
- **Des bases qui tiennent la charge** : jusqu’à 13 000 IOPS garanties par volume io1.
- **Un prix public**, ligne par ligne, sans devis.
- **Prêt pour les clients exigeants** : HDS, ISO 27001, 27017 et 27018, CISPE, TISAX.

## Encore plus simple, basique et pratique

Une commande pour l’installer, rien à payer, pas de compte cloud pour commencer. Ta stack est un simple fichier dans ton Git : tu la relis, tu la versionnes, tu la jettes si tu veux. Tes secrets restent dans un coffre local.

Ce qu’il ne fait pas : remplacer un expert sur une infra critique. Il estime sur les prix publics, hors remises négociées, déploie des apps en conteneurs, et le HTTPS passe par un load balancer avec ton certificat. [Ce qu’il sait faire, et ce qu’il ne sait pas](https://bige.dev/savoir.html)

## Bientôt d’autres providers SecNumCloud et français

**Le prix compte, mais pas seul : où vivent tes données, qui les protège et qui te répond comptent autant.**

bige-ops est indépendant. Ta stack est décrite une fois, dans un format ouvert. Quand d’autres clouds français arriveront dans bige-ops, tu compareras la même stack, prix à l’appui. Installe maintenant, tu choisiras ensuite. [OVHcloud](https://www.ovhcloud.com/fr/) · [Scaleway](https://www.scaleway.com/fr/)

---

[Par où commencer](https://bige.dev/layouts.html) · [Une idée, un bug ?](https://github.com/simondelamarre/bige-ops-releases/issues/new/choose)

<!-- Other clouds hidden for now (see ENABLED_PROVIDER_IDS in desktop/src/lib/providers.ts).
Previous copy, to restore with them:
<em>Outscale live · Scaleway, OVH, AWS, Azure, GCP, Fly… bientôt</em>
| Bientôt | Scaleway · OVH · AWS · Azure · GCP · Fly |
-->
