# Stack IA : FastAPI + pgvector + Redis + OOS + GPU sur Outscale

Un assistant RAG ou une API d’inférence qui reste sur un cloud souverain : FastAPI pour l’API, PostgreSQL avec pgvector pour les embeddings, Redis pour le cache et les jobs, OOS pour les documents, et une VM GPU Outscale pour servir le modèle. bige-ops pose l’ensemble et le chiffre, GPU compris.

**En bref.** Topologie multi-vm : VM app tinav6.c4r8p2 (FastAPI, front, worker d’ingestion) derrière un LBU, PostgreSQL + pgvector et Redis privés, VM d’inférence privée tinav7.c16r64p1 avec un GPU NVIDIA L40, 500 GiB de documents dans OOS, backups, NAT. Estimation bige-ops : **2 654,65 € HT/mois**.

## Pourquoi cette stack tourne bien sur Outscale

- **Des bases rapides et stables** : Les volumes io1 garantissent jusqu’à 13 000 IOPS par volume : tes requêtes gardent des temps de réponse réguliers, même sous charge. [Volumes](https://docs.outscale.com/en/userguide/About-Volumes.html)
- **Des GPU à la demande** : Des cartes NVIDIA récentes (L40, H100…) au catalogue public : tu ajoutes la puissance de calcul quand ton modèle en a besoin.
- **Un réseau privé et des sauvegardes sûres** : Tes bases restent dans le réseau privé de ton projet, jamais exposées à Internet. Les sauvegardes partent vers l’Object Storage, compatible S3 et répliqué entre plusieurs zones.
- **Prêt pour les clients exigeants** : Régions qualifiées SecNumCloud 3.2 pour le secteur public, certification HDS pour la santé. [Pourquoi Outscale](pourquoi-outscale.html) · [SecNumCloud 3.2](https://www.3ds.com/newsroom/press-releases/outscale-first-cloud-qualified-secnumcloud-32)

## Architecture

VM app tinav6.c4r8p2 (FastAPI :8000, front, worker d’ingestion) derrière LBU ; PostgreSQL 17 + pgvector et Redis 8 privés ; VM d’inférence privée tinav7.c16r64p1 + 1 GPU NVIDIA L40 (fGPU) ; OOS 500 GiB documents + 100 GiB backups ; NAT.

## Coût mensuel estimé

Calculé avec bige-ops estimate --json sur le catalogue public Outscale synchronisé le 17 septembre 2026, Région eu-west-2, en € HT par mois (730 heures). Estimation indicative, sur la grille publique ; le trafic sortant est à 0 € HT au catalogue public de cette Région.

| Ligne bige-ops | Ce que c’est | € HT / mois |
| --- | --- | --- |
| LBU rag-web | entrée publique | 21,90 € |
| VM rag-inference — tinav7.c16r64p1 | inférence : 16 vCPU, 64 GiB, 1 × L40, 200 GiB | 2 217,84 € |
| OOS rag-documents — 500 GiB | documents sources (500 GiB) | 12,50 € |
| OOS rag-backups — 100 GiB | sauvegardes PostgreSQL (100 GiB) | 2,50 € |
| VM rag-app — tinav6.c4r8p2 | FastAPI + front + worker | 135,80 € |
| VM rag-redis — tinav6.c2r2p3 | cache, jobs d’ingestion | 54,76 € |
| VM rag-postgres — tinav6.c4r8p2 | PostgreSQL 17 + pgvector, io1 | 169,20 € |
| NAT gateway | sortie du subnet privé | 36,50 € |
| EIP VM rag-app (attachée — 1ʳᵉ offerte / Net) | IP de la VM app (1ʳᵉ offerte) | 0,00 € |
| EIP NAT (attachée supplémentaire) | IP publique du NAT | 3,65 € |
| **Total estimé** | | **2 654,65 €** |

VM GPU : 2 217,84 € ; reste de la stack : 436,81 € HT/mois.

```
bige-ops init -n stack-ai-fastapi-pgvector-gpu
bige-ops add layout custom --name rag --runtime python --web spa --worker --db postgres --db redis --topology multi-vm --lbu
bige-ops validate
bige-ops estimate --json
```

```yaml
name: stack-ai-fastapi-pgvector-gpu
region: eu-west-2
enable_nat: true
components:
- type: stack
  name: rag
  topology: multi-vm
  services: [api, web, worker, postgres, redis]
  images: {postgres: 'pgvector/pgvector:pg17', redis: 'redis:8-alpine'}
  sizing: {app_vm: tinav6.c4r8p2, postgres_vm: tinav6.c4r8p2, redis_vm: tinav6.c2r2p3}
  service_config:
    postgres:
      backup: {enabled: true, oos_bucket: rag-backups}
- type: load_balancer
  name: rag-web
  scheme: internet-facing
  backend_vms: [rag-app]
- {type: vm, name: rag-inference, size: tinav7.c16r64p1, subnet: private, volume_size: 200,
  gpu: 1, gpu_type: Nvidia L40}
- {type: oos_bucket, name: rag-documents, bucket: rag-documents, size: 500, purpose: documents}
- {type: oos_bucket, name: rag-backups, bucket: rag-backups, size: 100, purpose: backups}
```

## Données

| Base | Image épinglée | Backup | Failles connues |
| --- | --- | --- | --- |
| PostgreSQL | `pgvector/pgvector:pg17` | pg_dump → gzip → bucket OOS | [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) |
| Redis | `redis:8-alpine` | snapshot RDB / AOF → bucket OOS | [OpenCVE](https://app.opencve.io/cve/?vendor=redis&product=redis) |
| pgvector | `pgvector/pgvector:pg17` | inclus dans le dump PostgreSQL | [OpenCVE](https://app.opencve.io/cve/?vendor=pgvector&product=pgvector) |

**PostgreSQL.** PostgreSQL 18 (supporté jusqu’en novembre 2030), 17 (novembre 2029), 16 (défaut bige-ops, novembre 2028) et 15 (novembre 2027) sont maintenus ; 14 sort du support le 12 novembre 2026. La simulation épingle pgvector/pgvector:pg17. Source : politique de versions PostgreSQL. Durcissement : un rôle applicatif dédié (jamais le superutilisateur), des règles pg_hba.conf limitées au CIDR du Net en scram-sha-256, et des mises à jour mineures régulières (la majeure reste celle que tu épingles).

**Redis.** La simulation garde redis:8-alpine, le tag par défaut de bige-ops : il suit la dernière Redis 8. Épingle la mineure (par exemple 8.10) si tu veux un build strictement reproductible. Durcissement : un mot de passe ou des ACL, le protected mode actif, aucune exposition publique, et les commandes d’administration réservées à un utilisateur dédié (sécurité Redis).

Backup activé (`backup.enabled` + bucket OOS protégé) ; `backup.sh` préparé.

## Exposition

- Seule entrée publique : le LBU internet-facing, listener HTTPS 443 + certificat EIM
- VM app en subnet public, ports applicatifs ouverts au seul CIDR du Net (via le LBU)
- Bases en subnet privé, sans IP publique, security group au CIDR du Net ; administration par tunnel SSH
- Security group de la VM app : SSH, 80 et 443 ouverts ; resserre SSH sur tes CIDR connus, app sur un port applicatif (3000, 8000, 8080…)
- NAT : sortie du subnet privé, aucune entrée

## Vulnérabilités

Des failles, il y en aura toujours : l’important est de voir d’abord celles qui sont exposées. bige-ops lit le code de tes dépôts sur ton poste, compare tes bibliothèques à la base publique des failles connues des bibliothèques open source ([OSV](https://osv.dev/)) et, avec ta clé OpenCVE, les composants de ta stack au registre mondial des vulnérabilités (CVE) ; puis il classe tout par urgence, l’exposé à Internet d’abord. Pourquoi le refaire toi-même ? C’est chez toi, sur ton poste, et c’est gratuit.

Avec ta clé OpenCVE, chaque composant reconnu (image, paquet installé) est rapproché de sa fiche éditeur/produit (une requête par produit). Classement : gravité notée sur 10 (CVSS), au moins haute si la faille est déjà exploitée (liste KEV de la CISA) ; puis exposition dans la simulation (Internet ou derrière le LBU : gravité pleine ; subnet privé : un cran de moins, sauf faille déjà exploitée) ; départage : déjà exploitée, puis note, puis probabilité d’exploitation (EPSS). Rapprochement au niveau du produit, pas de la version : à recouper avec ta version épinglée ; `latest` signalé comme version non épinglée.

| Composant | Fiche OpenCVE | Dans bige-ops |
| --- | --- | --- |
| Redis | [Redis](https://app.opencve.io/cve/?vendor=redis&product=redis) | reconnu automatiquement depuis l’image redis:8-alpine · exposition : privée |
| PostgreSQL + pgvector | [PostgreSQL](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) · [pgvector](https://app.opencve.io/cve/?vendor=pgvector&product=pgvector) | image pgvector/pgvector pas encore reconnue automatiquement : ces deux fiches sont tes références |
| Docker (VM d’inférence) | [Docker](https://app.opencve.io/cve/?vendor=docker&product=docker) | reconnu automatiquement depuis les paquets installés sur la VM dédiée |
| Python | [Python](https://app.opencve.io/cve/?vendor=python&product=python) | reconnu depuis l’image de base de ton Dockerfile (FROM python), à la lecture de tes dépôts |
| FastAPI, Starlette, Pydantic | [FastAPI](https://app.opencve.io/cve/?vendor=tiangolo&product=fastapi) · [Starlette](https://app.opencve.io/cve/?vendor=encode&product=starlette) · [Pydantic](https://app.opencve.io/cve/?vendor=pydantic&product=pydantic) | fiche de référence (pas encore reconnu automatiquement) ; versions PyPI épinglées vérifiées dans OSV |

Sur ton poste, sans clé ni IA (mode direct) : routes FastAPI (@app.get, @router.post) et pages accessibles sans être connecté, mots de passe ou clés écrits en clair dans le code (clés d’API de modèles comprises), vérification des certificats HTTPS désactivée, requêtes à la base construites avec ce que tape l’utilisateur (injection SQL), dépendances PyPI épinglées vérifiées dans OSV. Détail : Python sur Outscale.

Audit approfondi (bige-ops advanced, ta propre clé d’IA) : relit les pistes repérées, confirme les vraies failles, écarte les fausses alertes et classe chacune par type de faille, selon le catalogue de référence (CWE), avec son urgence et un ticket GitHub prêt à ouvrir.

## Avant le deploy

- `validate` (services custom, HTTPS sans ORN EIM refusé, rappel NAT pour les VMs privées)
- `preflight` : clés Outscale, OMI, stack, IP des hôtes, Dockerfile, secrets build/runtime, jeton GitHub, alerte backup OOS ; une erreur bloque le deploy
- `plan` : Terraform, risques de perte de données ; buckets OOS protégés
- Vulnérabilités : failles connues des composants (OpenCVE) classées selon leur exposition, `latest` signalé, dépôts relus sur ton poste, sans clé ni IA

## OpenCVE, la source des failles connues

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : les failles publiées dans le registre mondial des vulnérabilités (CVE) et ses sources (NVD, MITRE, liste KEV des failles déjà exploitées tenue par la CISA…), avec leur note de gravité sur 10 (CVSS) et leur probabilité d’être exploitées (EPSS), rangées par éditeur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

Docs : [FastAPI](https://fastapi.tiangolo.com/) · [pgvector](https://github.com/pgvector/pgvector) · [GPU flexibles Outscale](https://docs.outscale.com/fr/userguide/À-propos-des-flexible-GPU.html) · [OOS](https://docs.outscale.com/fr/userguide/À-propos-d-OOS.html) · [Redis](https://redis.io/docs/latest/) · [SecNumCloud](https://fr.outscale.com/secnumcloud/)

HTML : [stack-ai-fastapi-pgvector-gpu.html](https://bige.dev/stack-ai-fastapi-pgvector-gpu.html)
