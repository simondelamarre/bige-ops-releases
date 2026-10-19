# Express + MongoDB + Redis + BullMQ sur OKS

Une API Express, MongoDB pour la souplesse du document, Redis et BullMQ pour les jobs : un classique des startups Node. Sur OKS, chaque brique devient un Deployment, l’API et ses workers montent en charge avec l’HPA, et Outscale opère le control plane.

**En bref.** Topologie oks : control plane cp.mono.master, nodepool de 3 nœuds tinav6.c4r8p2, Kubernetes 1.34. Deployments api, web, worker BullMQ, MongoDB et Redis ; backups MongoDB vers OOS. Estimation bige-ops : **457,65 € HT/mois**, plus les LBU créés par les Services exposés.

## Architecture

OKS (cp.mono.master, Kubernetes 1.34), nodepool 3 × tinav6.c4r8p2 ; Deployments api (Express, HPA), web, worker BullMQ ; MongoDB 8.0 et Redis 8 en ClusterIP sur emptyDir, backup MongoDB vers OOS.

## Coût mensuel estimé

Calculé avec bige-ops estimate --json sur le catalogue public Outscale synchronisé le 17 septembre 2026, Région eu-west-2, en € HT par mois (730 heures). Estimation indicative, sur la grille publique ; le trafic sortant est à 0 € HT au catalogue public de cette Région.

| Ligne bige-ops | Ce que c’est | € HT / mois |
| --- | --- | --- |
| OOS express-app-backups — 50 GiB | sauvegardes MongoDB | 1,25 € |
| OKS control plane — cp.mono.master | control plane OKS (1 master) | 29,20 € |
| Nodepool default — tinav6.c4r8p2 × 3 | 3 nœuds : 12 vCPU, 24 GiB, disques inclus | 427,20 € |
| **Total estimé** | | **457,65 €** |

LBU des Services api et web : 2 × 21,90 € → 501,45 € HT/mois au total. Variante production cp.3.masters.small : 523,35 € (567,15 € avec les LBU).

```
bige-ops init -n stack-express-mongodb-redis-oks
bige-ops add layout custom --name app --runtime nodejs --web same --worker --db mongodb --db redis --topology oks --lbu
bige-ops validate
bige-ops estimate --json
```

```yaml
name: stack-express-mongodb-redis-oks
region: eu-west-2
components:
- type: stack
  name: app
  topology: oks
  services: [api, web, worker, mongodb, redis]
  images: {mongodb: 'mongo:8.0', redis: 'redis:8-alpine'}
  service_config:
    mongodb:
      backup: {enabled: true, oos_bucket: express-app-backups}
- {type: oos_bucket, name: express-app-backups, bucket: express-app-backups, size: 50, purpose: backups}
```

## Données

| Base | Image épinglée | Backup | CVE |
| --- | --- | --- | --- |
| MongoDB | `mongo:8.0` | mongodump → tar → bucket OOS | [OpenCVE](https://app.opencve.io/cve/?vendor=mongodb&product=mongodb) |
| Redis | `redis:8-alpine` | snapshot RDB / AOF → bucket OOS | [OpenCVE](https://app.opencve.io/cve/?vendor=redis&product=redis) |

**MongoDB.** Le tag mongo:8 par défaut de bige-ops suit la dernière 8.x ; la simulation épingle mongo:8.0, la branche de référence de la génération 8. Durcissement : l’authentification activée dès l’initialisation (utilisateur root et utilisateur applicatif distincts), une écoute limitée au réseau privé, et la checklist sécurité MongoDB.

**Redis.** La simulation garde redis:8-alpine, le tag par défaut de bige-ops : il suit la dernière Redis 8. Épingle la mineure (par exemple 8.10) si tu veux un build strictement reproductible. Durcissement : un mot de passe ou des ACL, le protected mode actif, aucune exposition publique, et les commandes d’administration réservées à un utilisateur dédié (sécurité Redis).

Backup activé (`backup.enabled` + bucket OOS protégé) ; `backup.sh` préparé.

## Exposition

- Entrées publiques = Services LoadBalancer → LBU, HTTPS via `expose.tls.server_certificate_id` (ORN EIM)
- Bases et brokers en ClusterIP, jamais de LoadBalancer ni NodePort vers une base
- API Kubernetes restreinte à ton IP (`/32`) ou `OKS_ADMIN_CIDR`

## Vulnérabilités

Avec ta clé OpenCVE, chaque composant reconnu (image, package) est rapproché de sa fiche fournisseur/produit (une requête par produit). Classement : sévérité CVSS (KEV ⇒ au moins haute), puis exposition dans la simulation (Internet ou derrière LBU : sévérité pleine ; subnet privé : un cran de moins, sauf KEV), départage KEV → CVSS → EPSS. Rapprochement au niveau produit, à recouper avec la version épinglée ; `latest` signalé comme version non épinglée.

| Composant | Fiche OpenCVE | Dans bige-ops |
| --- | --- | --- |
| MongoDB | [MongoDB](https://app.opencve.io/cve/?vendor=mongodb&product=mongodb) | mappé automatiquement depuis l’image mongo:8.0 · exposition : privée (pod interne) |
| Redis | [Redis](https://app.opencve.io/cve/?vendor=redis&product=redis) | mappé automatiquement depuis l’image redis:8-alpine · exposition : privée (pod interne) |
| Kubernetes (OKS) | [Kubernetes](https://app.opencve.io/cve/?vendor=kubernetes&product=kubernetes) | mappé automatiquement (topologie oks) · exposé via les LBU |
| Node.js | [Node.js](https://app.opencve.io/cve/?vendor=nodejs&product=node.js) | mappé depuis le FROM node de ton Dockerfile (scan des dépôts) |
| Express | [Express](https://app.opencve.io/cve/?vendor=openjsf&product=express) | fiche de référence (composant hors table de correspondance automatique) ; version npm contrôlée par OSV |

Mode direct, sans clé : routes Express (et Fastify, Koa, Hono si tu les mélanges), signaux d’authentification, failles de code, dépendances npm (Express, Mongoose, BullMQ…) rapprochées d’OSV. Détail : Node.js sur Outscale.

## Avant le deploy

- `validate` (image requise pour un pod, HTTPS via `expose.tls`)
- `preflight` : clés Outscale, OMI, stack, IP des hôtes, Dockerfile, secrets build/runtime, jeton GitHub, alerte backup OOS ; une erreur bloque le deploy
- `plan` : Terraform + specs OKS, risques de perte de données ; buckets OOS protégés
- Vulnérabilités : OpenCVE classé par exposition, `latest` signalé, dépôts en mode direct

## OpenCVE, le référentiel CVE de bige-ops

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : CVE publiées (NVD, MITRE, KEV de la CISA…) enrichies CVSS / EPSS et rangées par fournisseur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

Docs : [Express](https://expressjs.com/) · [BullMQ](https://docs.bullmq.io/) · [MongoDB](https://www.mongodb.com/docs/manual/) · [Redis](https://redis.io/docs/latest/) · [OKS](https://docs.outscale.com/fr/userguide/À-propos-d-OKS.html) · [HPA Kubernetes](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)

HTML : [stack-express-mongodb-redis-oks.html](https://bige.dev/stack-express-mongodb-redis-oks.html)
