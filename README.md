<p align="center">
  <img src="docs/screens/shot-simule.png" alt="Capture de bige-ops : le Visual d’une stack sur une machine (API, front, PostgreSQL et sauvegardes), estimée à 74,50 € HT par mois." width="920" />
</p>

<p align="center">
  <a href="https://bige.dev/install.html#macos"><img src="https://img.shields.io/badge/macOS-Installer%20avec%20brew-0ea5a4?style=for-the-badge&logo=apple&logoColor=white" alt="Installer sur macOS avec Homebrew" height="44" /></a>
  &nbsp;
  <a href="https://github.com/simondelamarre/bige-ops-releases/releases/latest"><img src="https://img.shields.io/badge/Linux-AppImage%20%2F%20.deb-1f2937?style=for-the-badge&logo=linux&logoColor=white" alt="Télécharger pour Linux" height="44" /></a>
</p>

```bash
brew install --cask simondelamarre/bige-ops/bige-ops
```

<p align="center"><strong>Gratuit · local · sans compte cloud pour commencer</strong> · <a href="https://bige.dev/">bige.dev</a></p>

---

## Simple, facile et pratique

### Simule : ta stack et son prix, avant de déployer
<p align="center"><img src="docs/screens/shot-grandis.png" alt="Capture de bige-ops : le Visual d’une stack multi-VM, VM app à 136 €, VM PostgreSQL à 169 € et VM Redis à 55 € par mois, total 381,66 € HT." width="880" /></p>

### Sécurise : tes failles, les plus exposées d’abord, sans clé ni IA
<p align="center"><img src="docs/screens/shot-failles.png" alt="Capture de bige-ops : une injection SQL réelle dans OWASP Juice Shop, ligne 34 de routes/login.ts, exposée à Internet." width="880" /></p>
<p align="center"><img src="docs/screens/shot-deps.png" alt="Capture de bige-ops : CVE-2022-25887 sur sanitize-html 1.4.2, reliée à OpenCVE, avec l’issue GitHub proposée en un clic." width="880" /></p>

## Une simulation, une seule réalité

- **Visual ↔ configuration.** Un seul bouton Appliquer réconcilie `project.yaml`, valide la stack, régénère les fichiers utiles et recharge le Visual. La transaction est locale, atomique et restaurée en cas d’erreur.
- **Pas de déploiement sur un brouillon.** Plan, Apply cloud et Deploy restent distincts et ne sont proposés qu’après application de la configuration.
- **VM, parc VM ou OKS.** Les subnets, routes, IP publiques ou privées, NAT, load balancers, pods et nodepools sont représentés selon la topologie réellement déclarée.
- **Monorepos compris.** Front, API, workers et services gardent leur dépôt, branche et chemin propres pour préparer plusieurs workloads depuis un seul repo.

## Des vulnérabilités actionnables

- Le scan suit la **branche active** : changer de branche invalide les anciennes routes et vulnérabilités au lieu de les mélanger.
- Les routes sont regroupées par **dépôt, stack et service**, avec leur exposition publique, interne ou source uniquement.
- Les CWE de code et CVE de dépendances sont priorisées par **applicabilité, exposition, sévérité et correctif disponible**, plutôt que d’afficher tout l’historique brut.

## Pas cher, maîtrisé et sans VPS

bige-ops est gratuit. Ton cloud, tu le paies au prix public, et tu le vois ligne par ligne avant de déployer.

| Stack | Pour qui | Budget indicatif |
|---|---|---|
| [Une app et sa base sur une machine](https://bige.dev/layouts.html) | TPE, outil métier, premier produit | ~75 €/mois |
| [WordPress + MariaDB](https://bige.dev/stack-wordpress-mariadb.html) | Site, e-commerce léger | ~237 €/mois |
| [Go + PostgreSQL + NATS](https://bige.dev/stack-go-postgresql-nats.html) | API rapide, événements | ~303 €/mois |
| [Phoenix + PostgreSQL](https://bige.dev/stack-phoenix-postgresql.html) | Temps réel | ~368 €/mois |
| [Django + Celery](https://bige.dev/stack-django-celery-postgresql-redis.html) · [Rails + Sidekiq](https://bige.dev/stack-rails-sidekiq-postgresql-redis.html) · [Laravel + Horizon](https://bige.dev/stack-laravel-horizon-mysql-redis.html) | SaaS avec tâches de fond | ~423 €/mois |
| [Next.js + NestJS + PostgreSQL + Redis](https://bige.dev/stack-nextjs-nestjs-postgresql-redis.html) | SaaS TypeScript | ~428 €/mois |
| [.NET + PostgreSQL + RabbitMQ](https://bige.dev/stack-dotnet-postgresql-rabbitmq.html) | Applications métier | ~438 €/mois |
| [Node.js + MongoDB + Redis sur Kubernetes](https://bige.dev/stack-express-mongodb-redis-oks.html) | Scale-up | ~458 €/mois |
| [Quarkus + Kafka sur Kubernetes](https://bige.dev/stack-quarkus-oks-postgresql-kafka.html) | Microservices Java | ~523 €/mois |
| [Jakarta EE + OpenSearch](https://bige.dev/stack-jakarta-ee-opensearch-postgresql.html) | Grands comptes, recherche | ~715 €/mois |
| [Spring Boot + Kafka + Keycloak sur Kubernetes](https://bige.dev/stack-spring-boot-oks-kafka-keycloak.html) | Grands comptes | ~919 €/mois |
| [IA : FastAPI + pgvector + GPU](https://bige.dev/stack-ai-fastapi-pgvector-gpu.html) | Produit IA | ~2 655 €/mois |

Estimations HT calculées par bige-ops sur la grille publique (eu-west-2). [Toutes les stacks et les langages →](https://bige.dev/stacks.html)

Ne perds pas ton temps sur Heroku, Fly.io, Render, Railway, Vercel, Netlify, Clever Cloud, Koyeb, Northflank, DigitalOcean, Linode, Vultr, Hetzner, Contabo, Hostinger…

### Si tu cherches un vrai cloud provider pour avancer : [Outscale](https://bige.dev/pourquoi-outscale.html).

- **Premier cloud qualifié SecNumCloud 3.2.** Visa de l’ANSSI pour son cloud public, en décembre 2023. Pionnier depuis 2019, premier IaaS à obtenir SecNumCloud. ([source](https://www.3ds.com/newsroom/press-releases/outscale-first-cloud-qualified-secnumcloud-32))
- **Kubernetes managé, rien qu’à toi.** Avec OKS, chaque client a son cluster dédié, son control plane isolé, sans partage de ressources.
- **Des bases qui tiennent la charge.** Jusqu’à 13 000 IOPS garanties par volume io1.
- **Un prix public, ligne par ligne.** Pas besoin de devis pour savoir combien coûte ta stack.
- **Prêt pour les clients exigeants.** HDS pour la santé, ISO 27001, 27017 et 27018, CISPE, TISAX.
- **Une marque de Dassault Systèmes.** La même infrastructure porte la plateforme 3DEXPERIENCE.

## Encore plus simple, basique et pratique

1. **Installe.** C’est gratuit.
2. **Simule.** Pars d’une stack prête et vois le prix.
3. **Déploie** sur ton compte, quand tu veux. Pas besoin de DevOps.

## Questions franches

- **C’est prêt pour la prod ?** bige-ops est jeune (v0.7) et avance vite. Avant chaque déploiement, une étape de revue te montre ce qui va changer, et ta stack reste un fichier versionné dans ton Git. Pour une infra critique, garde un expert dans la boucle.
- **Et le HTTPS ?** Il passe par le load balancer, avec ton certificat chargé dans le cloud : bige-ops le branche pour toi.
- **Pourquoi brew sur macOS ?** Une commande installe l’app et la prépare pour macOS. Sur Linux : AppImage ou .deb.
- **Les prix sont-ils justes ?** Ce sont les prix publics du catalogue, ligne par ligne, recalculés à chaque modification. Si tu négocies une remise, elle vient en plus.

---

<p align="center"><strong>Le prix compte, mais pas seul : où vivent tes données, qui les protège et qui te répond comptent autant.</strong></p>

<h3 align="center">Bientôt d’autres providers SecNumCloud et français</h3>

<p align="center">
  <strong>bige-ops est indépendant.</strong> Ta stack est décrite une fois. Quand d’autres clouds français arriveront dans bige-ops,<br/>
  tu compareras la même stack, prix à l’appui. <strong>Installe maintenant, tu choisiras ensuite.</strong><br/>
  <a href="https://www.ovhcloud.com/fr/">OVHcloud</a> · <a href="https://www.scaleway.com/fr/">Scaleway</a>
</p>

<p align="center">
  <a href="https://bige.dev/layouts.html">Par où commencer</a> ·
  <a href="https://bige.dev/#failles">Comment on trouve tes failles</a> ·
  <a href="https://github.com/simondelamarre/bige-ops-releases/issues/new/choose">Une idée ?</a>
</p>

<!-- Other clouds hidden for now (see ENABLED_PROVIDER_IDS in desktop/src/lib/providers.ts).
Previous copy, to restore with them:
<em>Outscale live · Scaleway, OVH, AWS, Azure, GCP, Fly… bientôt</em>
| Bientôt | Scaleway · OVH · AWS · Azure · GCP · Fly |
-->
