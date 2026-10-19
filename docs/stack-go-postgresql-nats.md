# Go + PostgreSQL + NATS sur Outscale

Des API Go et des services qui échangent par messages NATS : sobre, rapide, facile à faire grandir. Go consomme si peu qu’une petite VM porte l’API, les consumers et le serveur NATS ; bige-ops la pose sur Outscale avec PostgreSQL en subnet privé.

**En bref.** Topologie multi-vm : VM app tinav6.c2r4p2 (API Go, consumers, serveur NATS JetStream en service custom) derrière un LBU, PostgreSQL privé, backups OOS, NAT. Estimation bige-ops : **302,60 € HT/mois**.

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

| Base | Image épinglée | Backup | CVE |
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

Avec ta clé OpenCVE, chaque composant reconnu (image, package) est rapproché de sa fiche fournisseur/produit (une requête par produit). Classement : sévérité CVSS (KEV ⇒ au moins haute), puis exposition dans la simulation (Internet ou derrière LBU : sévérité pleine ; subnet privé : un cran de moins, sauf KEV), départage KEV → CVSS → EPSS. Rapprochement au niveau produit, à recouper avec la version épinglée ; `latest` signalé comme version non épinglée.

| Composant | Fiche OpenCVE | Dans bige-ops |
| --- | --- | --- |
| PostgreSQL | [PostgreSQL](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) | mappé automatiquement depuis l’image postgres:17 · exposition : privée |
| Go | [Go](https://app.opencve.io/cve/?vendor=golang&product=go) | mappé depuis le FROM golang de ton Dockerfile (scan des dépôts) |
| NATS Server | [NATS Server](https://app.opencve.io/cve/?vendor=nats&product=nats-server) | fiche de référence (composant hors table de correspondance automatique) |
| Gin, pgx | [Gin](https://app.opencve.io/cve/?vendor=gin-gonic&product=gin) · [pgx](https://app.opencve.io/cve/?vendor=jackc&product=pgx) | fiche de référence (composant hors table de correspondance automatique) ; modules de go.mod contrôlés par OSV |

Mode direct, sans clé : routes net/http et Gin, InsecureSkipVerify, secrets, traversée de chemin, modules go.mod rapprochés d’OSV. Détail : Go sur Outscale.

## Avant le deploy

- `validate` (services custom, HTTPS sans ORN EIM refusé, rappel NAT pour les VMs privées)
- `preflight` : clés Outscale, OMI, stack, IP des hôtes, Dockerfile, secrets build/runtime, jeton GitHub, alerte backup OOS ; une erreur bloque le deploy
- `plan` : Terraform, risques de perte de données ; buckets OOS protégés
- Vulnérabilités : OpenCVE classé par exposition, `latest` signalé, dépôts en mode direct

## OpenCVE, le référentiel CVE de bige-ops

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : CVE publiées (NVD, MITRE, KEV de la CISA…) enrichies CVSS / EPSS et rangées par fournisseur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

Docs : [Go](https://go.dev/doc/) · [NATS](https://docs.nats.io/) · [pgx](https://pkg.go.dev/github.com/jackc/pgx/v5) · [PostgreSQL](https://www.postgresql.org/docs/)

HTML : [stack-go-postgresql-nats.html](https://bige.dev/stack-go-postgresql-nats.html)
