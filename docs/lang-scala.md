# Scala sur Outscale

Scala marie programmation fonctionnelle et JVM : Play pour le web, Pekko ou Akka pour les systèmes d’acteurs distribués et le streaming. Sur Outscale, bige-ops les déploie comme des services JVM, sur OKS ou en multi-VM.

**En bref.** Scala tourne sur la JVM : runtime java dans bige-ops (port 8080, 1 GiB), image construite par sbt depuis ton Dockerfile.

## Frameworks et bibliothèques

- **Play Framework** : Le framework web réactif et sans état de l’écosystème Scala (et Java). ([doc](https://www.playframework.com/documentation/latest/Home) · [OpenCVE](https://app.opencve.io/cve/?vendor=lightbend&product=play_framework))
- **Apache Pekko et Akka** : Acteurs, clustering, streams : Apache Pekko est le fork communautaire de la fondation Apache ; Akka poursuit sa route de son côté. ([doc](https://pekko.apache.org/) · [OpenCVE](https://app.opencve.io/cve/?vendor=apache&product=pekko) · [OpenCVE](https://app.opencve.io/cve/?vendor=lightbend&product=akka))
- **sbt** : L’outil de build Scala ; sbt-native-packager produit l’image ou l’archive à déployer. ([doc](https://www.scala-sbt.org/) · [OpenCVE](https://app.opencve.io/cve/?vendor=scala-lang&product=scala))

## Sur Outscale avec bige-ops

Déclare tes services Scala en runtime java : 1 GiB et le port 8080 par défaut, à ajuster selon le heap. Sur OKS, un cluster Pekko trouve ses pairs par l’API Kubernetes ; en multi-VM, les services partagent la VM app.

- `single-vm` : une VM publique, apps + bases en Docker Compose (prototype, démo).
- `multi-vm` : VM app derrière un LBU, une VM privée par base, NAT pour la sortie (production lisible).
- `oks` : cluster OKS, un Deployment par service, Service LoadBalancer → LBU (scale, microservices, HPA).

```
bige-ops add layout custom --runtime java --web none --worker \
  --db postgres --topology oks --lbu
```

## Ce que bige-ops vérifie pour Scala

Des failles, il y en aura toujours : l’important est de voir d’abord celles qui sont exposées. L’analyse du code Scala arrive ; ta stack est déjà couverte : avec ta clé OpenCVE, ses composants et ses images (y compris celles de tes Dockerfile et docker-compose) sont comparés aux failles connues publiées dans le registre mondial des vulnérabilités (CVE) ; l’exposition dans la simulation et le coût sur Outscale sont calculés à côté.

Tout est classé par urgence : ce qui est exposé à Internet d’abord. Pourquoi le refaire toi-même ? C’est chez toi, sur ton poste, et c’est gratuit. Méthode complète : [ce que bige-ops vérifie](https://bige.dev/stacks.html#verifications).

## Bases de données

- **PostgreSQL** : Slick, Doobie, Skunk. [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) — [Quarkus sur OKS + PostgreSQL + Kafka](https://bige.dev/stack-quarkus-oks-postgresql-kafka.html)
- **Apache Kafka** : Pekko Connectors (Alpakka) Kafka. [OpenCVE](https://app.opencve.io/cve/?vendor=apache&product=kafka) — [Spring Boot sur OKS + Kafka + Keycloak](https://bige.dev/stack-spring-boot-oks-kafka-keycloak.html)

Jamais de base exposée à Internet : subnet privé + security group au CIDR du Net (multi-VM), Service interne (OKS).

## Versions à épingler

Épingle Scala (Scala 3 a une ligne LTS) et sbt dans build.sbt et project/build.properties, et un JDK LTS dans l’image. Docs : Scala · Failles connues : Scala sur OpenCVE.

## OpenCVE, la source des failles connues

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : les failles publiées dans le registre mondial des vulnérabilités (CVE) et ses sources (NVD, MITRE, liste KEV des failles déjà exploitées tenue par la CISA…), avec leur note de gravité sur 10 (CVSS) et leur probabilité d’être exploitées (EPSS), rangées par éditeur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

## Stacks chiffrées

- [Spring Boot sur OKS + Kafka + Keycloak](https://bige.dev/stack-spring-boot-oks-kafka-keycloak.html) (918,80 € HT/mois)
- [Quarkus sur OKS + PostgreSQL + Kafka](https://bige.dev/stack-quarkus-oks-postgresql-kafka.html) (523,35 € HT/mois)

Docs : [Scala](https://docs.scala-lang.org/) · [Play](https://www.playframework.com/documentation/latest/Home) · [Apache Pekko](https://pekko.apache.org/) · [sbt](https://www.scala-sbt.org/)

HTML : [lang-scala.html](https://bige.dev/lang-scala.html)
