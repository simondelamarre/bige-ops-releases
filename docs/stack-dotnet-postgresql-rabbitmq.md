# ASP.NET Core + PostgreSQL + RabbitMQ sur Outscale

Une API ASP.NET Core sous Linux, Entity Framework Core sur PostgreSQL, RabbitMQ pour les commandes et les événements : la stack .NET moderne de nombreuses entreprises. bige-ops la pose sur Outscale, base et broker en subnet privé, et la chiffre.

**En bref.** Topologie multi-vm : VM app tinav6.c4r8p2 (API ASP.NET Core et worker, runtime custom, port 8080) derrière un LBU, PostgreSQL 17 privé, RabbitMQ sur VM privée dédiée tinav6.c2r4p2, backups OOS, NAT. Estimation bige-ops : **438,40 € HT/mois**.

## Architecture

VM app tinav6.c4r8p2 (ASP.NET Core :8080 + worker, runtime custom) derrière LBU ; PostgreSQL 17 privé ; RabbitMQ 4.3 sur VM privée dédiée tinav6.c2r4p2 ; OOS backups ; NAT.

## Coût mensuel estimé

Calculé avec bige-ops estimate --json sur le catalogue public Outscale synchronisé le 17 septembre 2026, Région eu-west-2, en € HT par mois (730 heures). Estimation indicative, sur la grille publique ; le trafic sortant est à 0 € HT au catalogue public de cette Région.

| Ligne bige-ops | Ce que c’est | € HT / mois |
| --- | --- | --- |
| LBU dotnet-web | entrée publique | 21,90 € |
| VM dotnet-rabbitmq — tinav6.c2r4p2 | RabbitMQ (VM privée dédiée) | 70,10 € |
| OOS dotnet-backups — 50 GiB | sauvegardes PostgreSQL | 1,25 € |
| VM dotnet-app — tinav6.c4r8p2 | API ASP.NET Core + worker | 135,80 € |
| VM dotnet-postgres — tinav6.c4r8p2 | PostgreSQL 17, disque io1 | 169,20 € |
| NAT gateway | sortie du subnet privé | 36,50 € |
| EIP VM dotnet-app (attachée — 1ʳᵉ offerte / Net) | IP de la VM app (1ʳᵉ offerte) | 0,00 € |
| EIP NAT (attachée supplémentaire) | IP publique du NAT | 3,65 € |
| **Total estimé** | | **438,40 €** |



```
bige-ops init -n stack-dotnet-postgresql-rabbitmq
bige-ops add layout custom --name dotnet --runtime go --web none --worker --db postgres --topology multi-vm --lbu
bige-ops validate
bige-ops estimate --json
```

```yaml
name: stack-dotnet-postgresql-rabbitmq
region: eu-west-2
enable_nat: true
components:
- type: stack
  name: dotnet
  topology: multi-vm
  services: [api, worker, postgres]
  images: {postgres: 'postgres:17'}
  sizing: {app_vm: tinav6.c4r8p2, postgres_vm: tinav6.c4r8p2}
  service_config:
    postgres:
      backup: {enabled: true, oos_bucket: dotnet-backups}
- type: load_balancer
  name: dotnet-web
  scheme: internet-facing
  backend_vms: [dotnet-app]
- {type: vm, name: dotnet-rabbitmq, size: tinav6.c2r4p2, subnet: private, volume_size: 40}
- {type: oos_bucket, name: dotnet-backups, bucket: dotnet-backups, size: 50, purpose: backups}
```

## Données

| Base | Image épinglée | Backup | CVE |
| --- | --- | --- | --- |
| PostgreSQL | `postgres:17` | pg_dump → gzip → bucket OOS | [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) |
| RabbitMQ | `rabbitmq:4.3` | export des définitions ; files durables sur le disque de la VM | [OpenCVE](https://app.opencve.io/cve/?vendor=rabbitmq&product=rabbitmq) |

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
| Docker (VM RabbitMQ) | [Docker](https://app.opencve.io/cve/?vendor=docker&product=docker) | mappé automatiquement depuis les packages de la VM dédiée |
| RabbitMQ | [RabbitMQ](https://app.opencve.io/cve/?vendor=rabbitmq&product=rabbitmq) | fiche de référence (composant hors table de correspondance automatique) |
| .NET, ASP.NET Core, Npgsql | [.NET](https://app.opencve.io/cve/?vendor=microsoft&product=.net) · [ASP.NET Core](https://app.opencve.io/cve/?vendor=microsoft&product=asp.net_core) · [Npgsql](https://app.opencve.io/cve/?vendor=npgsql&product=npgsql) | fiche de référence (composant hors table de correspondance automatique) |

L’analyse du code .NET arrive ; la stack est déjà couverte : composants et images confrontés à OpenCVE, exposition et coût. Détail : .NET sur Outscale.

## Avant le deploy

- `validate` (services custom, HTTPS sans ORN EIM refusé, rappel NAT pour les VMs privées)
- `preflight` : clés Outscale, OMI, stack, IP des hôtes, Dockerfile, secrets build/runtime, jeton GitHub, alerte backup OOS ; une erreur bloque le deploy
- `plan` : Terraform, risques de perte de données ; buckets OOS protégés
- Vulnérabilités : OpenCVE classé par exposition, `latest` signalé, dépôts en mode direct

## OpenCVE, le référentiel CVE de bige-ops

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : CVE publiées (NVD, MITRE, KEV de la CISA…) enrichies CVSS / EPSS et rangées par fournisseur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

Docs : [ASP.NET Core](https://learn.microsoft.com/aspnet/core/) · [EF Core](https://learn.microsoft.com/ef/core/) · [Npgsql](https://www.npgsql.org/) · [RabbitMQ](https://www.rabbitmq.com/docs) · [PostgreSQL](https://www.postgresql.org/docs/)

HTML : [stack-dotnet-postgresql-rabbitmq.html](https://bige.dev/stack-dotnet-postgresql-rabbitmq.html)
