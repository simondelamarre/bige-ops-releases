# Go + PostgreSQL + NATS sur Outscale

Des API Go et des services qui échangent par messages NATS : sobre, rapide, facile à faire grandir. Go consomme si peu qu’une petite VM porte l’API, les consumers et le serveur NATS ; bige-ops la pose sur Outscale avec PostgreSQL en subnet privé.

**En bref.** Topologie multi-vm : VM app tinav6.c2r4p2 (API Go, consumers, serveur NATS JetStream en service custom) derrière un LBU, PostgreSQL privé, backups OOS, NAT. Estimation bige-ops : **302,60 € HT/mois**.

## Pourquoi cette stack tourne bien sur Outscale

- **Des bases rapides et stables** : Les volumes io1 garantissent jusqu’à 13 000 IOPS par volume : tes requêtes gardent des temps de réponse réguliers, même sous charge. [Volumes](https://docs.outscale.com/en/userguide/About-Volumes.html)
- **Un réseau privé et des sauvegardes sûres** : Tes bases restent dans le réseau privé de ton projet, jamais exposées à Internet. Les sauvegardes partent vers l’Object Storage, compatible S3 et répliqué entre plusieurs zones.
- **Prêt pour les clients exigeants** : Régions qualifiées SecNumCloud 3.2 pour le secteur public, certification HDS pour la santé. [Pourquoi Outscale](pourquoi-outscale.html) · [SecNumCloud 3.2](https://www.3ds.com/newsroom/press-releases/outscale-first-cloud-qualified-secnumcloud-32)

## Architecture

VM app tinav6.c2r4p2 (API Go :8080, consumers, NATS JetStream :4222 en service custom) derrière LBU ; PostgreSQL 17 privé ; OOS backups ; NAT. Variante : NATS sur VM privée dédiée.

## Coût mensuel estimé

Calculé avec bige-ops estimate --json sur le catalogue public Outscale synchronisé le 17 septembre 2026, Région eu-west-2, en € HT par mois (730 heures). Estimation indicative, sur la grille publique ; le trafic sortant est à 0 € HT au catalogue public de cette Région.

| Ligne bige-ops | Ce que c’est | € HT / mois |
| --- | --- | --- |
| LBU app-web | entrée publique | 21,90 € |
| OOS go-app-backups — 50 GiB | sauvegardes PostgreSQL | 1,25 € |
| VM app-app — tinav6.c2r4p2 | API Go + consumers + NATS | 70,10 € |
| VM app-postgres — tinav6.c4r8p2 | PostgreSQL 17, disque io1 | 169,20 € |
| NAT gateway | sortie du subnet privé | 36,50 € |
| EIP VM app-app (attachée — 1ʳᵉ offerte / Net) | IP de la VM app (1ʳᵉ offerte) | 0,00 € |
| EIP NAT (attachée supplémentaire) | IP publique du NAT | 3,65 € |
| **Total estimé** | | **302,60 €** |

Variante NATS sur VM privée dédiée tinav6.c2r4p2 : 372,70 € HT/mois (dont 70,10 € pour la VM NATS).

```
bige-ops init -n stack-go-postgresql-nats
bige-ops add layout custom --name app --runtime go --web none --worker --db postgres --topology multi-vm --lbu
bige-ops validate
bige-ops estimate --json
```

```yaml
name: stack-go-postgresql-nats
region: eu-west-2
enable_nat: true
components:
- type: stack
  name: app
  topology: multi-vm
  services: [api, worker, postgres, nats]
  images: {postgres: 'postgres:17'}
  sizing: {app_vm: tinav6.c2r4p2, postgres_vm: tinav6.c4r8p2}
  service_config:
    postgres:
      backup: {enabled: true, oos_bucket: go-app-backups}
    nats:
      kind: custom
      image: nats:2.15
      port: 4222
      memory_mb: 256
      command: [-js]
- type: load_balancer
  name: app-web
  scheme: internet-facing
  backend_vms: [app-app]
- {type: oos_bucket, name: go-app-backups, bucket: go-app-backups, size: 50, purpose: backups}
```

## Données

| Base | Image épinglée | Backup | Failles connues |
| --- | --- | --- | --- |
| PostgreSQL | `postgres:17` | pg_dump → gzip → bucket OOS | [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) |
| NATS JetStream | `nats:2.15` | flux et KV persistés sur le disque de la VM | [OpenCVE](https://app.opencve.io/cve/?vendor=nats&product=nats-server) |

**PostgreSQL.** PostgreSQL 18 (supporté jusqu’en novembre 2030), 17 (novembre 2029), 16 (défaut bige-ops, novembre 2028) et 15 (novembre 2027) sont maintenus ; 14 sort du support le 12 novembre 2026. La simulation épingle postgres:17. Source : politique de versions PostgreSQL. Durcissement : un rôle applicatif dédié (jamais le superutilisateur), des règles pg_hba.conf limitées au CIDR du Net en scram-sha-256, et des mises à jour mineures régulières (la majeure reste celle que tu épingles).

Backup activé (`backup.enabled` + bucket OOS protégé) ; `backup.sh` préparé.

## Exposition

- Seule entrée publique : le LBU internet-facing, listener HTTPS 443 + certificat EIM
- VM app en subnet public, ports applicatifs ouverts au seul CIDR du Net (via le LBU)
- Bases en subnet privé, sans IP publique, security group au CIDR du Net ; administration par tunnel SSH
- Security group de la VM app : SSH, 80 et 443 ouverts ; resserre SSH sur tes CIDR connus, app sur un port applicatif (3000, 8000, 8080…)
- NAT : sortie du subnet privé, aucune entrée

## Vulnérabilités

Des failles, il y en aura toujours : l’important est de voir d’abord celles qui sont exposées. bige-ops lit le code de tes dépôts sur ton poste, compare tes modules Go à la base publique des failles connues des bibliothèques open source ([OSV](https://osv.dev/)) et, avec ta clé OpenCVE, les composants de ta stack au registre mondial des vulnérabilités (CVE) ; puis il classe tout par urgence, l’exposé à Internet d’abord. Pourquoi le refaire toi-même ? C’est chez toi, sur ton poste, et c’est gratuit.

Avec ta clé OpenCVE, chaque composant reconnu (image, paquet installé) est rapproché de sa fiche éditeur/produit (une requête par produit). Classement : gravité notée sur 10 (CVSS), au moins haute si la faille est déjà exploitée (liste KEV de la CISA) ; puis exposition dans la simulation (Internet ou derrière le LBU : gravité pleine ; subnet privé : un cran de moins, sauf faille déjà exploitée) ; départage : déjà exploitée, puis note, puis probabilité d’exploitation (EPSS). Rapprochement au niveau du produit, pas de la version : à recouper avec ta version épinglée ; `latest` signalé comme version non épinglée.

| Composant | Fiche OpenCVE | Dans bige-ops |
| --- | --- | --- |
| PostgreSQL | [PostgreSQL](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) | reconnu automatiquement depuis l’image postgres:17 · exposition : privée |
| Go | [Go](https://app.opencve.io/cve/?vendor=golang&product=go) | reconnu depuis l’image de base de ton Dockerfile (FROM golang), à la lecture de tes dépôts |
| NATS Server | [NATS Server](https://app.opencve.io/cve/?vendor=nats&product=nats-server) | fiche de référence (pas encore reconnu automatiquement) |
| Gin, pgx | [Gin](https://app.opencve.io/cve/?vendor=gin-gonic&product=gin) · [pgx](https://app.opencve.io/cve/?vendor=jackc&product=pgx) | fiche de référence (pas encore reconnu automatiquement) ; modules de go.mod vérifiés dans OSV |

Sur ton poste, sans clé ni IA (mode direct) : routes net/http et Gin, vérification des certificats HTTPS désactivée, mots de passe ou clés écrits en clair dans le code, lecture de fichiers hors du dossier prévu, modules go.mod vérifiés dans OSV. Détail : Go sur Outscale.

Audit approfondi (bige-ops advanced, ta propre clé d’IA) : relit les pistes repérées, confirme les vraies failles, écarte les fausses alertes et classe chacune par type de faille, selon le catalogue de référence (CWE), avec son urgence et un ticket GitHub prêt à ouvrir.

## Avant le deploy

- `validate` (services custom, HTTPS sans ORN EIM refusé, rappel NAT pour les VMs privées)
- `preflight` : clés Outscale, OMI, stack, IP des hôtes, Dockerfile, secrets build/runtime, jeton GitHub, alerte backup OOS ; une erreur bloque le deploy
- `plan` : Terraform, risques de perte de données ; buckets OOS protégés
- Vulnérabilités : failles connues des composants (OpenCVE) classées selon leur exposition, `latest` signalé, dépôts relus sur ton poste, sans clé ni IA

## OpenCVE, la source des failles connues

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : les failles publiées dans le registre mondial des vulnérabilités (CVE) et ses sources (NVD, MITRE, liste KEV des failles déjà exploitées tenue par la CISA…), avec leur note de gravité sur 10 (CVSS) et leur probabilité d’être exploitées (EPSS), rangées par éditeur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

Docs : [Go](https://go.dev/doc/) · [NATS](https://docs.nats.io/) · [pgx](https://pkg.go.dev/github.com/jackc/pgx/v5) · [PostgreSQL](https://www.postgresql.org/docs/)

HTML : [stack-go-postgresql-nats.html](https://bige.dev/stack-go-postgresql-nats.html)
