# Java sur Outscale

Java fait tourner l’essentiel des systèmes d’information des grandes entreprises, et une bonne part des plateformes des scale-ups. Spring Boot en microservices sur Kubernetes, Quarkus natif, Jakarta EE sur serveur d’applications : bige-ops pose chacun sur Outscale, sur OKS ou en multi-VM, avec PostgreSQL, Kafka ou Keycloak, et chiffre l’ensemble au catalogue public.

**En bref.** Runtime java dans bige-ops : port 8080, 1 GiB par service par défaut, SPRING_PROFILES_ACTIVE=prod. Layout prêt à l’emploi : java-spring (Spring Boot + SPA, PostgreSQL, Redis, LBU). Kafka, Keycloak ou OpenSearch se déclarent en services custom ou en VMs dédiées.

## Frameworks et bibliothèques

- **Spring Boot** : Le standard de fait des microservices Java : auto-configuration, Actuator, Spring Data, Spring Security. Une image par service, des sondes de santé prêtes pour Kubernetes. Doc de référence : Spring Boot Reference. ([doc](https://spring.io/projects/spring-boot) · [OpenCVE](https://app.opencve.io/cve/?vendor=vmware&product=spring_boot) · [OpenCVE](https://app.opencve.io/cve/?vendor=vmware&product=spring_framework) · [OpenCVE](https://app.opencve.io/cve/?vendor=vmware&product=spring_security))
- **Spring Cloud** : Gateway, configuration centralisée, découverte de services, résilience : les briques d’une architecture microservices. Spring for Apache Kafka branche les consumers et producers. ([doc](https://spring.io/projects/spring-cloud) · [OpenCVE](https://app.opencve.io/cve/?vendor=vmware&product=spring_cloud_gateway) · [OpenCVE](https://app.opencve.io/cve/?vendor=vmware&product=spring_cloud_config) · [OpenCVE](https://app.opencve.io/cve/?vendor=vmware&product=spring_for_apache_kafka))
- **Quarkus** : Le Java taillé pour Kubernetes : démarrage en millisecondes et faible mémoire, en JVM comme en natif (GraalVM), avec un modèle de programmation Jakarta EE et MicroProfile. ([doc](https://quarkus.io/guides/) · [OpenCVE](https://app.opencve.io/cve/?vendor=redhat&product=quarkus))
- **Micronaut** : Injection de dépendances à la compilation, empreinte réduite, compatible natif. Guide : Micronaut user guide. ([doc](https://micronaut.io/) · [OpenCVE](https://app.opencve.io/cve/?vendor=objectcomputing&product=micronaut))
- **Jakarta EE : WildFly, Payara, Open Liberty** : Le standard d’entreprise (ex-Java EE) : CDI, JAX-RS, JPA, JMS. Il tourne sur un serveur d’applications : WildFly, Payara ou Open Liberty, chacun disponible en image conteneur. ([doc](https://jakarta.ee/) · [OpenCVE](https://app.opencve.io/cve/?vendor=redhat&product=wildfly) · [OpenCVE](https://app.opencve.io/cve/?vendor=payara&product=payara) · [OpenCVE](https://app.opencve.io/cve/?vendor=ibm&product=open_liberty))
- **Vert.x et Dropwizard** : Vert.x pour le réactif et l’événementiel non bloquant ; Dropwizard pour des services REST compacts sur Jetty, Jersey et Jackson. ([doc](https://vertx.io/docs/) · [OpenCVE](https://app.opencve.io/cve/?vendor=eclipse&product=vert.x) · [OpenCVE](https://app.opencve.io/cve/?vendor=dropwizard&product=dropwizard))
- **Hibernate et JPA** : L’ORM de référence, implémentation de Jakarta Persistence (JPA), utilisé par Spring Data JPA, Quarkus Panache et les serveurs Jakarta EE. Côté dépendances, jackson-databind et Log4j sont deux bibliothèques à suivre de près. ([doc](https://hibernate.org/orm/) · [OpenCVE](https://app.opencve.io/cve/?vendor=hibernate&product=hibernate_orm) · [OpenCVE](https://app.opencve.io/cve/?vendor=fasterxml&product=jackson-databind) · [OpenCVE](https://app.opencve.io/cve/?vendor=apache&product=log4j))
- **Maven et Gradle** : Les deux outils de build de la JVM ; Gradle domine chez Android et Kotlin, Maven reste très présent en entreprise. Un build multi-étapes produit un JAR exécutable dans une image JRE légère. ([doc](https://maven.apache.org/) · [OpenCVE](https://app.opencve.io/cve/?vendor=apache&product=maven) · [OpenCVE](https://app.opencve.io/cve/?vendor=gradle&product=gradle))

## Sur Outscale avec bige-ops

Le runtime java de bige-ops réserve 1 GiB et le port 8080 par service, avec SPRING_PROFILES_ACTIVE=prod. Ton Dockerfile part d’une image JRE (par exemple eclipse-temurin:25-jre) ; sur OKS, chaque microservice devient un Deployment avec ses réplicas, sa mémoire et son HPA sur le CPU. Les middlewares sans preset (Kafka, Keycloak, OpenSearch) se déclarent en services custom avec leur image officielle, ou en VMs privées dédiées.

- `single-vm` : une VM publique, apps + bases en Docker Compose (prototype, démo).
- `multi-vm` : VM app derrière un LBU, une VM privée par base, NAT pour la sortie (production lisible).
- `oks` : cluster OKS, un Deployment par service, Service LoadBalancer → LBU (scale, microservices, HPA).

```
bige-ops add layout java-spring --name platform
# ou sur mesure, sur OKS :
bige-ops add layout custom --runtime java --web spa --worker \
  --db postgres --db redis --topology oks --lbu
```

## Ce que bige-ops vérifie pour Java

Des failles, il y en aura toujours : l’important est de voir d’abord celles qui sont exposées. L’analyse du code Java arrive ; ta stack est déjà couverte : avec ta clé OpenCVE, ses composants et ses images (y compris celles de tes Dockerfile et docker-compose) sont comparés aux failles connues publiées dans le registre mondial des vulnérabilités (CVE) ; l’exposition dans la simulation et le coût sur Outscale sont calculés à côté. Reconnus automatiquement : PostgreSQL, Redis, Kubernetes ; références : [Spring Boot sur OpenCVE](https://app.opencve.io/cve/?vendor=vmware&product=spring_boot) · [Quarkus sur OpenCVE](https://app.opencve.io/cve/?vendor=redhat&product=quarkus) · [Apache Kafka sur OpenCVE](https://app.opencve.io/cve/?vendor=apache&product=kafka) · [Keycloak sur OpenCVE](https://app.opencve.io/cve/?vendor=redhat&product=keycloak).

Tout est classé par urgence : ce qui est exposé à Internet d’abord. Pourquoi le refaire toi-même ? C’est chez toi, sur ton poste, et c’est gratuit. Méthode complète : [ce que bige-ops vérifie](https://bige.dev/stacks.html#verifications).

## Bases de données

- **PostgreSQL** : JDBC, Hibernate / JPA, Spring Data, Panache. [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) — [Spring Boot sur OKS + Kafka + Keycloak](https://bige.dev/stack-spring-boot-oks-kafka-keycloak.html), [Quarkus sur OKS + PostgreSQL + Kafka](https://bige.dev/stack-quarkus-oks-postgresql-kafka.html), [Jakarta EE + OpenSearch + PostgreSQL](https://bige.dev/stack-jakarta-ee-opensearch-postgresql.html)
- **Apache Kafka** : événements et intégration entre services (doc Kafka). [OpenCVE](https://app.opencve.io/cve/?vendor=apache&product=kafka) — [Spring Boot sur OKS + Kafka + Keycloak](https://bige.dev/stack-spring-boot-oks-kafka-keycloak.html), [Quarkus sur OKS + PostgreSQL + Kafka](https://bige.dev/stack-quarkus-oks-postgresql-kafka.html)
- **Redis** : cache Spring, sessions, rate limiting. [OpenCVE](https://app.opencve.io/cve/?vendor=redis&product=redis) — [Spring Boot sur OKS + Kafka + Keycloak](https://bige.dev/stack-spring-boot-oks-kafka-keycloak.html)
- **OpenSearch / Elasticsearch** : recherche plein texte et journaux. [OpenCVE](https://app.opencve.io/cve/?vendor=opensearch&product=opensearch) — [Jakarta EE + OpenSearch + PostgreSQL](https://bige.dev/stack-jakarta-ee-opensearch-postgresql.html)
- **MySQL / MariaDB** : encore très présents dans le parc existant. [OpenCVE](https://app.opencve.io/cve/?vendor=oracle&product=mysql)

Jamais de base exposée à Internet : subnet privé + security group au CIDR du Net (multi-VM), Service interne (OKS).

## Versions à épingler

Vise un JDK LTS : 25 (septembre 2025) ou 21, distribués notamment par Eclipse Temurin (images Docker). Reste sur une branche Spring Boot encore supportée (onglet Support de la page projet) et épingle tes BOM Maven ou Gradle. Projets JDK : OpenJDK · Failles connues : OpenJDK sur OpenCVE · Spring Framework sur OpenCVE.

## OpenCVE, la source des failles connues

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : les failles publiées dans le registre mondial des vulnérabilités (CVE) et ses sources (NVD, MITRE, liste KEV des failles déjà exploitées tenue par la CISA…), avec leur note de gravité sur 10 (CVSS) et leur probabilité d’être exploitées (EPSS), rangées par éditeur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

## Stacks chiffrées

- [Spring Boot sur OKS + Kafka + Keycloak](https://bige.dev/stack-spring-boot-oks-kafka-keycloak.html) (918,80 € HT/mois)
- [Quarkus sur OKS + PostgreSQL + Kafka](https://bige.dev/stack-quarkus-oks-postgresql-kafka.html) (523,35 € HT/mois)
- [Jakarta EE + OpenSearch + PostgreSQL](https://bige.dev/stack-jakarta-ee-opensearch-postgresql.html) (714,95 € HT/mois)

Docs : [dev.java](https://dev.java/) · [Spring Boot](https://docs.spring.io/spring-boot/index.html) · [Spring Cloud](https://spring.io/projects/spring-cloud) · [Quarkus](https://quarkus.io/guides/) · [Micronaut](https://docs.micronaut.io/latest/guide/) · [Jakarta EE](https://jakarta.ee/) · [WildFly](https://docs.wildfly.org/) · [Vert.x](https://vertx.io/docs/) · [Hibernate ORM](https://hibernate.org/orm/) · [Maven](https://maven.apache.org/)

HTML : [lang-java.html](https://bige.dev/lang-java.html)
