# Next.js + NestJS + PostgreSQL + Redis sur Outscale

Le choix de nombreuses startups SaaS : Next.js pour le front et le rendu serveur, NestJS pour une API structurée, BullMQ pour les tâches de fond, PostgreSQL pour les données, Redis pour le cache et les files, et un bucket compatible S3 pour les fichiers. Voici cette stack posée sur Outscale par bige-ops, chiffrée ligne par ligne.

**En bref.** Topologie multi-vm en eu-west-2 : une VM app (Next.js, NestJS, worker BullMQ) derrière un LBU, PostgreSQL et Redis sur deux VMs privées, deux buckets OOS (uploads et backups), un NAT pour la sortie du subnet privé. Estimation bige-ops : **428,06 € HT/mois**.

## Architecture

VM app tinav6.c4r8p2 (Next.js :3000, NestJS :3001, worker BullMQ) derrière un LBU HTTPS ; PostgreSQL 17 (tinav6.c4r8p2, io1 60 GiB / 3 000 IOPS) et Redis 8 (tinav6.c2r2p3) en subnet privé ; OOS 200 GiB (uploads) + 50 GiB (backups) ; NAT pour la sortie du privé.

## Coût mensuel estimé

Calculé avec bige-ops estimate --json sur le catalogue public Outscale synchronisé le 17 septembre 2026, Région eu-west-2, en € HT par mois (730 heures). Estimation indicative, sur la grille publique ; le trafic sortant est à 0 € HT au catalogue public de cette Région.

| Ligne bige-ops | Ce que c’est | € HT / mois |
| --- | --- | --- |
| LBU app-web | entrée publique HTTP/HTTPS | 21,90 € |
| OOS saas-app-backups — 50 GiB | sauvegardes PostgreSQL | 1,25 € |
| OOS saas-app-uploads — 200 GiB | fichiers des utilisateurs (S3) | 5,00 € |
| VM app-app — tinav6.c4r8p2 | Next.js + NestJS + worker BullMQ | 135,80 € |
| VM app-redis — tinav6.c2r2p3 | cache, sessions, files BullMQ | 54,76 € |
| VM app-postgres — tinav6.c4r8p2 | PostgreSQL 17, disque io1 | 169,20 € |
| NAT gateway | sortie Internet du subnet privé | 36,50 € |
| EIP VM app-app (attachée — 1ʳᵉ offerte / Net) | IP de la VM app (1ʳᵉ offerte) | 0,00 € |
| EIP NAT (attachée supplémentaire) | IP publique du NAT | 3,65 € |
| **Total estimé** | | **428,06 €** |



```
bige-ops init -n stack-nextjs-nestjs-postgresql-redis
bige-ops add layout custom --name app --runtime nodejs --web same --worker --db postgres --db redis --topology multi-vm --lbu
bige-ops validate
bige-ops estimate --json
```

```yaml
name: stack-nextjs-nestjs-postgresql-redis
region: eu-west-2
enable_nat: true
components:
- type: stack
  name: app
  topology: multi-vm
  services: [api, web, worker, postgres, redis]
  images: {postgres: 'postgres:17', redis: 'redis:8-alpine'}
  sizing: {app_vm: tinav6.c4r8p2, postgres_vm: tinav6.c4r8p2, redis_vm: tinav6.c2r2p3}
  service_config:
    postgres:
      backup: {enabled: true, oos_bucket: saas-app-backups}
- type: load_balancer
  name: app-web
  scheme: internet-facing
  backend_vms: [app-app]
- {type: oos_bucket, name: saas-app-backups, bucket: saas-app-backups, size: 50, purpose: backups}
- {type: oos_bucket, name: saas-app-uploads, bucket: saas-app-uploads, size: 200, purpose: uploads}
```

## Données

| Base | Image épinglée | Backup | CVE |
| --- | --- | --- | --- |
| PostgreSQL | `postgres:17` | pg_dump → gzip → bucket OOS | [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) |
| Redis | `redis:8-alpine` | snapshot RDB / AOF → bucket OOS | [OpenCVE](https://app.opencve.io/cve/?vendor=redis&product=redis) |

**PostgreSQL.** PostgreSQL 18 (supporté jusqu’en novembre 2030), 17 (novembre 2029), 16 (défaut bige-ops, novembre 2028) et 15 (novembre 2027) sont maintenus ; 14 sort du support le 12 novembre 2026. La simulation épingle postgres:17. Source : politique de versions PostgreSQL. Durcissement : un rôle applicatif dédié (jamais le superutilisateur), des règles pg_hba.conf limitées au CIDR du Net en scram-sha-256, et des mises à jour mineures régulières (la majeure reste celle que tu épingles).

**Redis.** La simulation garde redis:8-alpine, le tag par défaut de bige-ops : il suit la dernière Redis 8. Épingle la mineure (par exemple 8.10) si tu veux un build strictement reproductible. Durcissement : un mot de passe ou des ACL, le protected mode actif, aucune exposition publique, et les commandes d’administration réservées à un utilisateur dédié (sécurité Redis).

Backup activé (`backup.enabled` + bucket OOS protégé) ; `backup.sh` préparé.

## Exposition

- Seule entrée publique : le LBU internet-facing, listener HTTPS 443 + certificat EIM
- VM app en subnet public, ports applicatifs ouverts au seul CIDR du Net (via le LBU)
- Bases en subnet privé, sans IP publique, security group au CIDR du Net ; administration par tunnel SSH
- Security group de la VM app : SSH, 80 et 443 ouverts ; resserre SSH sur tes CIDR connus, app sur un port applicatif (3000, 8000, 8080…)
- NAT : sortie du subnet privé, aucune entrée

## Vulnérabilités

Avec ta clé OpenCVE, chaque composant reconnu (image, package) est rapproché de sa fiche fournisseur/produit (une requête par produit). Classement : sévérité CVSS (KEV ⇒ au moins haute), puis exposition dans la simulation (Internet ou derrière LBU : sévérité pleine ; subnet privé : un cran de moins, sauf KEV), départage KEV → CVSS → EPSS. Rapprochement au niveau produit, à recouper avec la version épinglée ; `latest` signalé comme version non épinglée.

| Composant | Fiche OpenCVE | Dans bige-ops |
| --- | --- | --- |
| PostgreSQL | [PostgreSQL](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) | mappé automatiquement depuis l’image postgres:17 · exposition : privée (descend d’un cran) |
| Redis | [Redis](https://app.opencve.io/cve/?vendor=redis&product=redis) | mappé automatiquement depuis l’image redis:8-alpine · exposition : privée |
| Node.js | [Node.js](https://app.opencve.io/cve/?vendor=nodejs&product=node.js) | mappé depuis le FROM node de ton Dockerfile (scan des dépôts) |
| Next.js, NestJS | [Next.js](https://app.opencve.io/cve/?vendor=vercel&product=next.js) · [NestJS](https://app.opencve.io/cve/?vendor=nestjs&product=nest) | fiche de référence (composant hors table de correspondance automatique) ; leurs versions npm passent par OSV |

Mode direct, sans clé : routes Next.js (route handlers, pages/api) et NestJS (@Controller, @Get, @UseGuards), failles de code et XSS front, dépendances npm rapprochées d’OSV. Détail : Node.js sur Outscale.

## Avant le deploy

- `validate` (services custom, HTTPS sans ORN EIM refusé, rappel NAT pour les VMs privées)
- `preflight` : clés Outscale, OMI, stack, IP des hôtes, Dockerfile, secrets build/runtime, jeton GitHub, alerte backup OOS ; une erreur bloque le deploy
- `plan` : Terraform, risques de perte de données ; buckets OOS protégés
- Vulnérabilités : OpenCVE classé par exposition, `latest` signalé, dépôts en mode direct

## OpenCVE, le référentiel CVE de bige-ops

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : CVE publiées (NVD, MITRE, KEV de la CISA…) enrichies CVSS / EPSS et rangées par fournisseur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

Docs : [Next.js](https://nextjs.org/docs) · [NestJS](https://docs.nestjs.com/) · [BullMQ](https://docs.bullmq.io/) · [PostgreSQL](https://www.postgresql.org/docs/) · [Redis](https://redis.io/docs/latest/) · [OOS](https://docs.outscale.com/fr/userguide/À-propos-d-OOS.html) · [LBU Outscale](https://docs.outscale.com/fr/userguide/À-propos-des-load-balancers.html)

HTML : [stack-nextjs-nestjs-postgresql-redis.html](https://bige.dev/stack-nextjs-nestjs-postgresql-redis.html)
