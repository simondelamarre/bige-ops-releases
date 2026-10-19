# Spring Boot sur OKS + Kafka + PostgreSQL + Redis + Keycloak

Le schéma type des grandes entreprises et des scale-ups Java : des microservices Spring Boot derrière une gateway, Kafka pour les événements, PostgreSQL pour les données, Redis pour le cache, Keycloak pour l’identité. Sur OKS, le Kubernetes managé d’Outscale, disponible aussi en Région SecNumCloud, bige-ops génère le cluster, les manifests et le chiffrage.

**En bref.** Topologie oks : control plane haute disponibilité cp.3.masters.small, nodepool de 3 nœuds tinav6.c8r16p2 (24 vCPU, 48 GiB). Gateway, front, consumers Kafka, microservices orders et catalog, Kafka, Keycloak, PostgreSQL et Redis en Deployments. Estimation bige-ops : **918,80 € HT/mois**, plus les trois LBU des Services exposés.

## Architecture

OKS cp.3.masters.small (HA), nodepool 3 × tinav6.c8r16p2 ; gateway Spring Cloud (HPA 2→6), web, microservices orders et catalog (custom, image registre), worker Kafka ; Kafka 4.3.1 (KRaft) et Keycloak 26.8.1 en custom ; PostgreSQL 17 et Redis 8 ; pods de données sur emptyDir, backup PostgreSQL vers OOS.

## Coût mensuel estimé

Calculé avec bige-ops estimate --json sur le catalogue public Outscale synchronisé le 17 septembre 2026, Région eu-west-2, en € HT par mois (730 heures). Estimation indicative, sur la grille publique ; le trafic sortant est à 0 € HT au catalogue public de cette Région.

| Ligne bige-ops | Ce que c’est | € HT / mois |
| --- | --- | --- |
| OOS platform-backups — 100 GiB | sauvegardes PostgreSQL (100 GiB) | 2,50 € |
| OKS control plane — cp.3.masters.small | control plane HA (3 masters) | 94,90 € |
| Nodepool default — tinav6.c8r16p2 × 3 | 3 nœuds : 24 vCPU, 48 GiB, disques inclus | 821,40 € |
| **Total estimé** | | **918,80 €** |

LBU gateway + web + Keycloak : 3 × 21,90 € → 984,50 € HT/mois au total.

```
bige-ops init -n stack-spring-boot-oks-kafka-keycloak
bige-ops add layout custom --name platform --runtime java --web spa --worker --db postgres --db redis --topology oks --lbu
bige-ops validate
bige-ops estimate --json
```

```yaml
name: stack-spring-boot-oks-kafka-keycloak
region: eu-west-2
components:
- type: stack
  name: platform
  topology: oks
  services: [api, web, worker, postgres, redis, orders, catalog, kafka, keycloak]
  images: {postgres: 'postgres:17', redis: 'redis:8-alpine'}
  control_plane: cp.3.masters.small
  nodepools:
  - {name: default, type: tinav6.c8r16p2, count: 3}
  service_config:
    postgres:
      backup: {enabled: true, oos_bucket: platform-backups}
    api:
      hpa: {enabled: true, min: 2, max: 6, target_cpu: 70}
    orders: {kind: custom, image: 'registry.example.com/platform/orders:1.0.0', port: 8080,
      memory_mb: 1024, replicas: 2}
    catalog: {kind: custom, image: 'registry.example.com/platform/catalog:1.0.0', port: 8080,
      memory_mb: 1024, replicas: 2}
    kafka: {kind: custom, image: 'apache/kafka:4.3.1', port: 9092, memory_mb: 2048}
    keycloak:
      kind: custom
      image: quay.io/keycloak/keycloak:26.8.1
      port: 8080
      memory_mb: 1024
      command: [start]
      expose: true
- {type: oos_bucket, name: platform-backups, bucket: platform-backups, size: 100, purpose: backups}
```

## Données

| Base | Image épinglée | Backup | CVE |
| --- | --- | --- | --- |
| PostgreSQL | `postgres:17` | pg_dump → gzip → bucket OOS | [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) |
| Redis | `redis:8-alpine` | snapshot RDB / AOF → bucket OOS | [OpenCVE](https://app.opencve.io/cve/?vendor=redis&product=redis) |
| Apache Kafka | `apache/kafka:4.3.1` | réplication et rétention Kafka ; topics critiques recopiables vers OOS | [OpenCVE](https://app.opencve.io/cve/?vendor=apache&product=kafka) |
| Keycloak | `quay.io/keycloak/keycloak:26.8.1` | export des realms ; base Keycloak à placer dans PostgreSQL | [OpenCVE](https://app.opencve.io/cve/?vendor=redhat&product=keycloak) |

**PostgreSQL.** PostgreSQL 18 (supporté jusqu’en novembre 2030), 17 (novembre 2029), 16 (défaut bige-ops, novembre 2028) et 15 (novembre 2027) sont maintenus ; 14 sort du support le 12 novembre 2026. La simulation épingle postgres:17. Source : politique de versions PostgreSQL. Durcissement : un rôle applicatif dédié (jamais le superutilisateur), des règles pg_hba.conf limitées au CIDR du Net en scram-sha-256, et des mises à jour mineures régulières (la majeure reste celle que tu épingles).

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
| PostgreSQL | [PostgreSQL](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) | mappé automatiquement depuis l’image postgres:17 · exposition : privée (pod interne) |
| Redis | [Redis](https://app.opencve.io/cve/?vendor=redis&product=redis) | mappé automatiquement depuis l’image redis:8-alpine · exposition : privée (pod interne) |
| Kubernetes (OKS) | [Kubernetes](https://app.opencve.io/cve/?vendor=kubernetes&product=kubernetes) | mappé automatiquement (topologie oks) · exposé via les LBU |
| Apache Kafka | [Apache Kafka](https://app.opencve.io/cve/?vendor=apache&product=kafka) | fiche de référence (composant hors table de correspondance automatique) |
| Keycloak | [Keycloak](https://app.opencve.io/cve/?vendor=redhat&product=keycloak) | fiche de référence (composant hors table de correspondance automatique) |
| Spring Boot, Spring Cloud Gateway, Spring Security | [Spring Boot](https://app.opencve.io/cve/?vendor=vmware&product=spring_boot) · [Spring Cloud Gateway](https://app.opencve.io/cve/?vendor=vmware&product=spring_cloud_gateway) · [Spring Security](https://app.opencve.io/cve/?vendor=vmware&product=spring_security) | fiche de référence (composant hors table de correspondance automatique) |
| JDK | [OpenJDK](https://app.opencve.io/cve/?vendor=oracle&product=openjdk) | fiche de référence (composant hors table de correspondance automatique) |

L’analyse du code Java arrive ; la stack est déjà couverte : composants et images confrontés à OpenCVE, exposition sur OKS et coût sur Outscale. Détail : Java sur Outscale.

## Avant le deploy

- `validate` (image requise pour un pod, HTTPS via `expose.tls`)
- `preflight` : clés Outscale, OMI, stack, IP des hôtes, Dockerfile, secrets build/runtime, jeton GitHub, alerte backup OOS ; une erreur bloque le deploy
- `plan` : Terraform + specs OKS, risques de perte de données ; buckets OOS protégés
- Vulnérabilités : OpenCVE classé par exposition, `latest` signalé, dépôts en mode direct

## OpenCVE, le référentiel CVE de bige-ops

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : CVE publiées (NVD, MITRE, KEV de la CISA…) enrichies CVSS / EPSS et rangées par fournisseur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

Docs : [Spring Boot](https://docs.spring.io/spring-boot/index.html) · [Spring Cloud](https://spring.io/projects/spring-cloud) · [Apache Kafka](https://kafka.apache.org/documentation/) · [Keycloak](https://www.keycloak.org/documentation) · [OKS](https://docs.outscale.com/fr/userguide/À-propos-d-OKS.html) · [Load balancers dans OKS](https://docs.outscale.com/fr/userguide/Créer-des-load-balancers-dans-OKS.html) · [SecNumCloud](https://fr.outscale.com/secnumcloud/)

HTML : [stack-spring-boot-oks-kafka-keycloak.html](https://bige.dev/stack-spring-boot-oks-kafka-keycloak.html)
