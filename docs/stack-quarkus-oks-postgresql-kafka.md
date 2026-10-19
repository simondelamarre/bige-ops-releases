# Quarkus sur OKS + PostgreSQL + Kafka

Quarkus démarre en millisecondes et consomme peu de mémoire : sur Kubernetes, ça veut dire plus de pods par nœud et un HPA qui réagit vite. Avec Kafka pour les événements et PostgreSQL pour les données, c’est une base cloud-native solide ; bige-ops la pose sur OKS et la chiffre.

**En bref.** Topologie oks : control plane cp.3.masters.small, nodepool de 3 nœuds tinav6.c4r8p2. API Quarkus (512 MiB, HPA de 2 à 8), consumers Kafka, Kafka et PostgreSQL en Deployments. Estimation bige-ops : **523,35 € HT/mois**, plus le LBU de l’API.

## Architecture

OKS cp.3.masters.small, nodepool 3 × tinav6.c4r8p2 ; api Quarkus (512 MiB, HPA 2→8), worker consumers Kafka ; Kafka 4.3.1 (custom, KRaft) et PostgreSQL 17 internes ; backup OOS.

## Coût mensuel estimé

Calculé avec bige-ops estimate --json sur le catalogue public Outscale synchronisé le 17 septembre 2026, Région eu-west-2, en € HT par mois (730 heures). Estimation indicative, sur la grille publique ; le trafic sortant est à 0 € HT au catalogue public de cette Région.

| Ligne bige-ops | Ce que c’est | € HT / mois |
| --- | --- | --- |
| OOS quarkus-backups — 50 GiB | sauvegardes PostgreSQL | 1,25 € |
| OKS control plane — cp.3.masters.small | control plane HA (3 masters) | 94,90 € |
| Nodepool default — tinav6.c4r8p2 × 3 | 3 nœuds : 12 vCPU, 24 GiB, disques inclus | 427,20 € |
| **Total estimé** | | **523,35 €** |

LBU de l’API : 21,90 € → 545,25 € HT/mois au total.

```
bige-ops init -n stack-quarkus-oks-postgresql-kafka
bige-ops add layout custom --name quarkus --runtime java --web none --worker --db postgres --topology oks --lbu
bige-ops validate
bige-ops estimate --json
```

```yaml
name: stack-quarkus-oks-postgresql-kafka
region: eu-west-2
components:
- type: stack
  name: quarkus
  topology: oks
  services: [api, worker, postgres, kafka]
  images: {postgres: 'postgres:17'}
  control_plane: cp.3.masters.small
  nodepools:
  - {name: default, type: tinav6.c4r8p2, count: 3}
  service_config:
    postgres:
      backup: {enabled: true, oos_bucket: quarkus-backups}
    api:
      hpa: {enabled: true, min: 2, max: 8, target_cpu: 70}
    kafka: {kind: custom, image: 'apache/kafka:4.3.1', port: 9092, memory_mb: 2048}
- {type: oos_bucket, name: quarkus-backups, bucket: quarkus-backups, size: 50, purpose: backups}
```

## Données

| Base | Image épinglée | Backup | CVE |
| --- | --- | --- | --- |
| PostgreSQL | `postgres:17` | pg_dump → gzip → bucket OOS | [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) |
| Apache Kafka | `apache/kafka:4.3.1` | réplication et rétention Kafka | [OpenCVE](https://app.opencve.io/cve/?vendor=apache&product=kafka) |

**PostgreSQL.** PostgreSQL 18 (supporté jusqu’en novembre 2030), 17 (novembre 2029), 16 (défaut bige-ops, novembre 2028) et 15 (novembre 2027) sont maintenus ; 14 sort du support le 12 novembre 2026. La simulation épingle postgres:17. Source : politique de versions PostgreSQL. Durcissement : un rôle applicatif dédié (jamais le superutilisateur), des règles pg_hba.conf limitées au CIDR du Net en scram-sha-256, et des mises à jour mineures régulières (la majeure reste celle que tu épingles).

Backup activé (`backup.enabled` + bucket OOS protégé) ; `backup.sh` préparé.

## Exposition

- Entrées publiques = Services LoadBalancer → LBU, HTTPS via `expose.tls.server_certificate_id` (ORN EIM)
- Bases et brokers en ClusterIP, jamais de LoadBalancer ni NodePort vers une base
- API Kubernetes restreinte à ton IP (`/32`) ou `OKS_ADMIN_CIDR`

## Vulnérabilités

Avec ta clé OpenCVE, chaque composant reconnu (image, package) est rapproché de sa fiche fournisseur/produit (une requête par produit). Classement : sévérité CVSS (KEV ⇒ au moins haute), puis exposition dans la simulation (Internet ou derrière LBU : sévérité pleine ; subnet privé : un cran de moins, sauf KEV), départage KEV → CVSS → EPSS. Rapprochement au niveau produit, à recouper avec la version épinglée ; `latest` signalé comme version non épinglée.

| Composant | Fiche OpenCVE | Dans bige-ops |
| --- | --- | --- |
| PostgreSQL | [PostgreSQL](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) | mappé automatiquement depuis l’image postgres:17 · exposition : privée (pod interne) |
| Kubernetes (OKS) | [Kubernetes](https://app.opencve.io/cve/?vendor=kubernetes&product=kubernetes) | mappé automatiquement (topologie oks) · exposé via les LBU |
| Apache Kafka | [Apache Kafka](https://app.opencve.io/cve/?vendor=apache&product=kafka) | fiche de référence (composant hors table de correspondance automatique) |
| Quarkus, Hibernate ORM | [Quarkus](https://app.opencve.io/cve/?vendor=redhat&product=quarkus) · [Hibernate ORM](https://app.opencve.io/cve/?vendor=hibernate&product=hibernate_orm) | fiche de référence (composant hors table de correspondance automatique) |
| JDK | [OpenJDK](https://app.opencve.io/cve/?vendor=oracle&product=openjdk) | fiche de référence (composant hors table de correspondance automatique) |

L’analyse du code Java arrive ; la stack est déjà couverte : composants et images confrontés à OpenCVE, exposition sur OKS et coût sur Outscale. Détail : Java sur Outscale.

## Avant le deploy

- `validate` (image requise pour un pod, HTTPS via `expose.tls`)
- `preflight` : clés Outscale, OMI, stack, IP des hôtes, Dockerfile, secrets build/runtime, jeton GitHub, alerte backup OOS ; une erreur bloque le deploy
- `plan` : Terraform + specs OKS, risques de perte de données ; buckets OOS protégés
- Vulnérabilités : OpenCVE classé par exposition, `latest` signalé, dépôts en mode direct

## OpenCVE, le référentiel CVE de bige-ops

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : CVE publiées (NVD, MITRE, KEV de la CISA…) enrichies CVSS / EPSS et rangées par fournisseur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

Docs : [Quarkus](https://quarkus.io/guides/) · [Quarkus + Kafka](https://quarkus.io/guides/kafka) · [Apache Kafka](https://kafka.apache.org/documentation/) · [PostgreSQL](https://www.postgresql.org/docs/) · [OKS](https://docs.outscale.com/fr/userguide/À-propos-d-OKS.html)

HTML : [stack-quarkus-oks-postgresql-kafka.html](https://bige.dev/stack-quarkus-oks-postgresql-kafka.html)
