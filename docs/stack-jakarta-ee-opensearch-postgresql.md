# Jakarta EE + OpenSearch + PostgreSQL sur Outscale

Le socle de nombreuses applications métier : un serveur Jakarta EE, PostgreSQL pour les transactions, un moteur de recherche pour le plein texte et les journaux. bige-ops pose ce trio sur Outscale en multi-VM, avec une VM de recherche dédiée et son volume BSU, et chiffre l’ensemble.

**En bref.** Topologie multi-vm : VM app tinav6.c8r16p2 (serveur Jakarta EE) derrière un LBU, PostgreSQL 17 sur VM privée tinav6.c4r16p2, OpenSearch sur VM privée dédiée tinav6.c4r16p2 avec 200 GiB de BSU, backups OOS, NAT. Estimation bige-ops : **714,95 € HT/mois**.

## Architecture

VM app tinav6.c8r16p2 (serveur Jakarta EE) derrière LBU ; PostgreSQL 17 (tinav6.c4r16p2, io1) privé ; OpenSearch sur VM privée dédiée tinav6.c4r16p2 + BSU gp2 200 GiB ; OOS backups ; NAT.

## Coût mensuel estimé

Calculé avec bige-ops estimate --json sur le catalogue public Outscale synchronisé le 17 septembre 2026, Région eu-west-2, en € HT par mois (730 heures). Estimation indicative, sur la grille publique ; le trafic sortant est à 0 € HT au catalogue public de cette Région.

| Ligne bige-ops | Ce que c’est | € HT / mois |
| --- | --- | --- |
| LBU erp-web | entrée publique | 21,90 € |
| VM erp-opensearch — tinav6.c4r16p2 | OpenSearch (VM privée dédiée) | 162,80 € |
| Volume erp-opensearch-data — 200 GiB | index OpenSearch (BSU gp2) | 22,00 € |
| OOS erp-backups — 100 GiB | sauvegardes PostgreSQL (100 GiB) | 2,50 € |
| VM erp-app — tinav6.c8r16p2 | serveur Jakarta EE | 267,20 € |
| VM erp-postgres — tinav6.c4r16p2 | PostgreSQL 17, disque io1 | 198,40 € |
| NAT gateway | sortie du subnet privé | 36,50 € |
| EIP VM erp-app (attachée — 1ʳᵉ offerte / Net) | IP de la VM app (1ʳᵉ offerte) | 0,00 € |
| EIP NAT (attachée supplémentaire) | IP publique du NAT | 3,65 € |
| **Total estimé** | | **714,95 €** |



```
bige-ops init -n stack-jakarta-ee-opensearch-postgresql
bige-ops add layout custom --name erp --runtime java --web none --no-worker --db postgres --topology multi-vm --lbu
bige-ops validate
bige-ops estimate --json
```

```yaml
name: stack-jakarta-ee-opensearch-postgresql
region: eu-west-2
enable_nat: true
components:
- type: stack
  name: erp
  topology: multi-vm
  services: [api, postgres]
  images: {postgres: 'postgres:17'}
  sizing: {app_vm: tinav6.c8r16p2, postgres_vm: tinav6.c4r16p2}
  service_config:
    postgres:
      backup: {enabled: true, oos_bucket: erp-backups}
- type: load_balancer
  name: erp-web
  scheme: internet-facing
  backend_vms: [erp-app]
- {type: vm, name: erp-opensearch, size: tinav6.c4r16p2, subnet: private, volume_size: 20}
- {type: volume, name: erp-opensearch-data, size: 200, volume_type: gp2, attach_vm: erp-opensearch}
- {type: oos_bucket, name: erp-backups, bucket: erp-backups, size: 100, purpose: backups}
```

## Données

| Base | Image épinglée | Backup | CVE |
| --- | --- | --- | --- |
| PostgreSQL | `postgres:17` | pg_dump → gzip → bucket OOS | [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) |
| OpenSearch | `opensearchproject/opensearch:3.9.0` | snapshots d’index vers un dépôt compatible S3 (OOS) | [OpenCVE](https://app.opencve.io/cve/?vendor=opensearch&product=opensearch) |
| Elasticsearch (alternative) | `branche 9.x` | snapshots d’index vers un dépôt compatible S3 (OOS) | [OpenCVE](https://app.opencve.io/cve/?vendor=elastic&product=elasticsearch) |

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
| Docker (VM OpenSearch) | [Docker](https://app.opencve.io/cve/?vendor=docker&product=docker) | mappé automatiquement depuis les packages de la VM dédiée |
| OpenSearch, Elasticsearch | [OpenSearch](https://app.opencve.io/cve/?vendor=opensearch&product=opensearch) · [Elasticsearch](https://app.opencve.io/cve/?vendor=elastic&product=elasticsearch) | fiche de référence (composant hors table de correspondance automatique) |
| WildFly, Payara, Open Liberty | [WildFly](https://app.opencve.io/cve/?vendor=redhat&product=wildfly) · [Payara](https://app.opencve.io/cve/?vendor=payara&product=payara) · [Open Liberty](https://app.opencve.io/cve/?vendor=ibm&product=open_liberty) | fiche de référence (composant hors table de correspondance automatique) |
| JDK, Hibernate | [OpenJDK](https://app.opencve.io/cve/?vendor=oracle&product=openjdk) · [Hibernate ORM](https://app.opencve.io/cve/?vendor=hibernate&product=hibernate_orm) | fiche de référence (composant hors table de correspondance automatique) |

L’analyse du code Java arrive ; la stack est déjà couverte : composants et images confrontés à OpenCVE, exposition et coût. Détail : Java sur Outscale.

## Avant le deploy

- `validate` (services custom, HTTPS sans ORN EIM refusé, rappel NAT pour les VMs privées)
- `preflight` : clés Outscale, OMI, stack, IP des hôtes, Dockerfile, secrets build/runtime, jeton GitHub, alerte backup OOS ; une erreur bloque le deploy
- `plan` : Terraform, risques de perte de données ; buckets OOS protégés
- Vulnérabilités : OpenCVE classé par exposition, `latest` signalé, dépôts en mode direct

## OpenCVE, le référentiel CVE de bige-ops

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : CVE publiées (NVD, MITRE, KEV de la CISA…) enrichies CVSS / EPSS et rangées par fournisseur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

Docs : [Jakarta EE](https://jakarta.ee/) · [WildFly](https://docs.wildfly.org/) · [OpenSearch](https://docs.opensearch.org/) · [PostgreSQL](https://www.postgresql.org/docs/) · [Volumes BSU](https://docs.outscale.com/fr/userguide/À-propos-des-volumes.html) · [SecNumCloud](https://fr.outscale.com/secnumcloud/)

HTML : [stack-jakarta-ee-opensearch-postgresql.html](https://bige.dev/stack-jakarta-ee-opensearch-postgresql.html)
