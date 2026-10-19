# Express + MongoDB + Redis + BullMQ sur OKS

Une API Express, MongoDB pour la souplesse du document, Redis et BullMQ pour les jobs : un classique des startups Node. Sur OKS, chaque brique devient un Deployment, l’API et ses workers montent en charge avec l’HPA, et Outscale opère le control plane.

**En bref.** Topologie oks : control plane cp.mono.master, nodepool de 3 nœuds tinav6.c4r8p2, Kubernetes 1.34. Deployments api, web, worker BullMQ, MongoDB et Redis ; backups MongoDB vers OOS. Estimation bige-ops : **457,65 € HT/mois**, plus les LBU créés par les Services exposés.

## Pourquoi cette stack tourne bien sur Outscale

- **Kubernetes managé, rien qu’à toi** : OKS te donne un cluster dédié, avec son control plane isolé et sans partage de ressources. Tu déploies tes services, Outscale opère le cluster. [OKS](https://docs.outscale.com/fr/userguide/%C3%80-propos-d-OKS.html)
- **Des bases rapides et stables** : Les volumes io1 garantissent jusqu’à 13 000 IOPS par volume : tes requêtes gardent des temps de réponse réguliers, même sous charge. [Volumes](https://docs.outscale.com/en/userguide/About-Volumes.html)
- **Un réseau privé et des sauvegardes sûres** : Tes bases restent dans le réseau privé de ton projet, jamais exposées à Internet. Les sauvegardes partent vers l’Object Storage, compatible S3 et répliqué entre plusieurs zones.
- **Prêt pour les clients exigeants** : Régions qualifiées SecNumCloud 3.2 pour le secteur public, certification HDS pour la santé. [Pourquoi Outscale](pourquoi-outscale.html) · [SecNumCloud 3.2](https://www.3ds.com/newsroom/press-releases/outscale-first-cloud-qualified-secnumcloud-32)

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

| Base | Image épinglée | Backup | Failles connues |
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

Des failles, il y en aura toujours : l’important est de voir d’abord celles qui sont exposées. bige-ops lit le code de tes dépôts sur ton poste, compare tes bibliothèques à la base publique des failles connues des bibliothèques open source ([OSV](https://osv.dev/)) et, avec ta clé OpenCVE, les composants de ta stack au registre mondial des vulnérabilités (CVE) ; puis il classe tout par urgence, l’exposé à Internet d’abord. Pourquoi le refaire toi-même ? C’est chez toi, sur ton poste, et c’est gratuit.

Avec ta clé OpenCVE, chaque composant reconnu (image, paquet installé) est rapproché de sa fiche éditeur/produit (une requête par produit). Classement : gravité notée sur 10 (CVSS), au moins haute si la faille est déjà exploitée (liste KEV de la CISA) ; puis exposition dans la simulation (Internet ou derrière le LBU : gravité pleine ; subnet privé : un cran de moins, sauf faille déjà exploitée) ; départage : déjà exploitée, puis note, puis probabilité d’exploitation (EPSS). Rapprochement au niveau du produit, pas de la version : à recouper avec ta version épinglée ; `latest` signalé comme version non épinglée.

| Composant | Fiche OpenCVE | Dans bige-ops |
| --- | --- | --- |
| MongoDB | [MongoDB](https://app.opencve.io/cve/?vendor=mongodb&product=mongodb) | reconnu automatiquement depuis l’image mongo:8.0 · exposition : privée (pod interne) |
| Redis | [Redis](https://app.opencve.io/cve/?vendor=redis&product=redis) | reconnu automatiquement depuis l’image redis:8-alpine · exposition : privée (pod interne) |
| Kubernetes (OKS) | [Kubernetes](https://app.opencve.io/cve/?vendor=kubernetes&product=kubernetes) | reconnu automatiquement (topologie oks) · exposé par les LBU |
| Node.js | [Node.js](https://app.opencve.io/cve/?vendor=nodejs&product=node.js) | reconnu depuis l’image de base de ton Dockerfile (FROM node), à la lecture de tes dépôts |
| Express | [Express](https://app.opencve.io/cve/?vendor=openjsf&product=express) | fiche de référence (pas encore reconnu automatiquement) ; version npm vérifiée dans OSV |

Sur ton poste, sans clé ni IA (mode direct) : routes Express (et Fastify, Koa, Hono si tu les mélanges) et connexion exigée ou non, erreurs classiques dans le code, dépendances npm (Express, Mongoose, BullMQ…) vérifiées dans OSV. Détail : Node.js sur Outscale.

Audit approfondi (bige-ops advanced, ta propre clé d’IA) : relit les pistes repérées, confirme les vraies failles, écarte les fausses alertes et classe chacune par type de faille, selon le catalogue de référence (CWE), avec son urgence et un ticket GitHub prêt à ouvrir.

## Avant le deploy

- `validate` (image requise pour un pod, HTTPS via `expose.tls`)
- `preflight` : clés Outscale, OMI, stack, IP des hôtes, Dockerfile, secrets build/runtime, jeton GitHub, alerte backup OOS ; une erreur bloque le deploy
- `plan` : Terraform + specs OKS, risques de perte de données ; buckets OOS protégés
- Vulnérabilités : failles connues des composants (OpenCVE) classées selon leur exposition, `latest` signalé, dépôts relus sur ton poste, sans clé ni IA

## OpenCVE, la source des failles connues

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : les failles publiées dans le registre mondial des vulnérabilités (CVE) et ses sources (NVD, MITRE, liste KEV des failles déjà exploitées tenue par la CISA…), avec leur note de gravité sur 10 (CVSS) et leur probabilité d’être exploitées (EPSS), rangées par éditeur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

Docs : [Express](https://expressjs.com/) · [BullMQ](https://docs.bullmq.io/) · [MongoDB](https://www.mongodb.com/docs/manual/) · [Redis](https://redis.io/docs/latest/) · [OKS](https://docs.outscale.com/fr/userguide/À-propos-d-OKS.html) · [HPA Kubernetes](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)

HTML : [stack-express-mongodb-redis-oks.html](https://bige.dev/stack-express-mongodb-redis-oks.html)
