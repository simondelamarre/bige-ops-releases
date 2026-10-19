# Kotlin sur Outscale

Kotlin a gagné le serveur après Android : concision, null-safety, coroutines. Ktor pour des services légers, Spring Boot en Kotlin pour profiter de tout l’écosystème Spring. Sur Outscale, bige-ops les traite comme des services JVM.

**En bref.** Kotlin tourne sur la JVM : runtime java dans bige-ops (port 8080, 1 GiB), image construite par Gradle depuis ton Dockerfile.

## Frameworks et bibliothèques

- **Ktor** : Le framework serveur de l’équipe Kotlin : asynchrone par coroutines, modulaire par plugins, moteurs Netty ou CIO. ([doc](https://ktor.io/docs/welcome.html) · [OpenCVE](https://app.opencve.io/cve/?vendor=jetbrains&product=ktor))
- **Spring Boot en Kotlin** : Spring prend Kotlin en charge de première classe : DSL de beans, coroutines dans WebFlux, extensions Kotlin pour Spring Data. ([doc](https://spring.io/guides/tutorials/spring-boot-kotlin) · [OpenCVE](https://app.opencve.io/cve/?vendor=vmware&product=spring_boot) · [OpenCVE](https://app.opencve.io/cve/?vendor=jetbrains&product=kotlin))
- **Gradle Kotlin DSL** : Le build idiomatique d’un projet Kotlin (build.gradle.kts), qui produit un JAR exécutable pour l’image. ([doc](https://docs.gradle.org/current/userguide/userguide.html) · [OpenCVE](https://app.opencve.io/cve/?vendor=gradle&product=gradle))

## Sur Outscale avec bige-ops

Un service Kotlin se déclare en runtime java : 1 GiB et le port 8080 par défaut, ajustables par service (memory_mb, réplicas, HPA sur OKS). Ktor tient souvent dans 512 MiB.

- `single-vm` : une VM publique, apps + bases en Docker Compose (prototype, démo).
- `multi-vm` : VM app derrière un LBU, une VM privée par base, NAT pour la sortie (production lisible).
- `oks` : cluster OKS, un Deployment par service, Service LoadBalancer → LBU (scale, microservices, HPA).

```
bige-ops add layout custom --runtime java --web none --worker \
  --db postgres --topology oks --lbu
```

## Ce que bige-ops vérifie pour Kotlin

Des failles, il y en aura toujours : l’important est de voir d’abord celles qui sont exposées. L’analyse du code Kotlin arrive ; ta stack est déjà couverte : avec ta clé OpenCVE, ses composants et ses images (y compris celles de tes Dockerfile et docker-compose) sont comparés aux failles connues publiées dans le registre mondial des vulnérabilités (CVE) ; l’exposition dans la simulation et le coût sur Outscale sont calculés à côté.

Tout est classé par urgence : ce qui est exposé à Internet d’abord. Pourquoi le refaire toi-même ? C’est chez toi, sur ton poste, et c’est gratuit. Méthode complète : [ce que bige-ops vérifie](https://bige.dev/stacks.html#verifications).

## Bases de données

- **PostgreSQL** : Exposed, jOOQ, Spring Data, R2DBC. [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) — [Spring Boot sur OKS + Kafka + Keycloak](https://bige.dev/stack-spring-boot-oks-kafka-keycloak.html)
- **Apache Kafka** : consumers en coroutines, Spring Kafka. [OpenCVE](https://app.opencve.io/cve/?vendor=apache&product=kafka) — [Quarkus sur OKS + PostgreSQL + Kafka](https://bige.dev/stack-quarkus-oks-postgresql-kafka.html)
- **Redis** : cache, sessions. [OpenCVE](https://app.opencve.io/cve/?vendor=redis&product=redis)

Jamais de base exposée à Internet : subnet privé + security group au CIDR du Net (multi-VM), Service interne (OKS).

## Versions à épingler

Épingle la version de Kotlin et du plugin Gradle dans build.gradle.kts, et un JDK LTS (25 ou 21) dans l’image. Docs : Kotlin · Failles connues : Kotlin sur OpenCVE · Ktor sur OpenCVE.

## OpenCVE, la source des failles connues

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : les failles publiées dans le registre mondial des vulnérabilités (CVE) et ses sources (NVD, MITRE, liste KEV des failles déjà exploitées tenue par la CISA…), avec leur note de gravité sur 10 (CVSS) et leur probabilité d’être exploitées (EPSS), rangées par éditeur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

## Stacks chiffrées

- [Spring Boot sur OKS + Kafka + Keycloak](https://bige.dev/stack-spring-boot-oks-kafka-keycloak.html) (918,80 € HT/mois)
- [Quarkus sur OKS + PostgreSQL + Kafka](https://bige.dev/stack-quarkus-oks-postgresql-kafka.html) (523,35 € HT/mois)

Docs : [Kotlin](https://kotlinlang.org/docs/home.html) · [Ktor](https://ktor.io/docs/welcome.html) · [Spring Boot + Kotlin](https://spring.io/guides/tutorials/spring-boot-kotlin)

HTML : [lang-kotlin.html](https://bige.dev/lang-kotlin.html)
