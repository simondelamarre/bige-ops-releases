# Stacks et langages sur Outscale

Les architectures que les équipes font vraiment tourner, posées sur Outscale par bige-ops : coût mensuel calculé avec la CLI (catalogue public synchronisé le 17 septembre 2026, `eu-west-2`, € HT, 730 h), versions à épingler, exposition, vulnérabilités suivies avec OpenCVE.

## Startups

| Stack | Sur Outscale | € HT / mois |
| --- | --- | --- |
| [Next.js + NestJS + PostgreSQL + Redis + OOS](https://bige.dev/stack-nextjs-nestjs-postgresql-redis.html) | multi-VM · LBU · OOS | 428,06 € |
| [Express + MongoDB + Redis + BullMQ sur OKS](https://bige.dev/stack-express-mongodb-redis-oks.html) | OKS · 3 nœuds | 457,65 € · 501,45 € avec 2 LBU |
| [Django + Celery + PostgreSQL + Redis](https://bige.dev/stack-django-celery-postgresql-redis.html) | multi-VM · LBU | 423,06 € |
| [Rails + Sidekiq + PostgreSQL + Redis](https://bige.dev/stack-rails-sidekiq-postgresql-redis.html) | multi-VM · LBU | 423,06 € |
| [Laravel + Horizon + MySQL + Redis](https://bige.dev/stack-laravel-horizon-mysql-redis.html) | multi-VM · LBU | 423,06 € |
| [Go + PostgreSQL + NATS](https://bige.dev/stack-go-postgresql-nats.html) | multi-VM · LBU | 302,60 € |

## Grandes entreprises

| Stack | Sur Outscale | € HT / mois |
| --- | --- | --- |
| [Spring Boot sur OKS + Kafka + Keycloak](https://bige.dev/stack-spring-boot-oks-kafka-keycloak.html) | OKS HA · 3 nœuds c8r16 | 918,80 € · 984,50 € avec 3 LBU |
| [Quarkus sur OKS + PostgreSQL + Kafka](https://bige.dev/stack-quarkus-oks-postgresql-kafka.html) | OKS HA · 3 nœuds | 523,35 € · 545,25 € avec 1 LBU |
| [Jakarta EE + OpenSearch + PostgreSQL](https://bige.dev/stack-jakarta-ee-opensearch-postgresql.html) | multi-VM · VM de recherche | 714,95 € |
| [ASP.NET Core + PostgreSQL + RabbitMQ](https://bige.dev/stack-dotnet-postgresql-rabbitmq.html) | multi-VM · VM broker | 438,40 € |
| [IA : FastAPI + pgvector + GPU](https://bige.dev/stack-ai-fastapi-pgvector-gpu.html) | multi-VM · VM GPU L40 | 2 654,65 € |

Sur OKS, chaque Service exposé crée un LBU (21,90 € HT/mois l’unité).

## Sites et temps réel

| Stack | Sur Outscale | € HT / mois |
| --- | --- | --- |
| [WordPress + MariaDB](https://bige.dev/stack-wordpress-mariadb.html) | multi-VM · LBU | 236,90 € |
| [Phoenix + PostgreSQL](https://bige.dev/stack-phoenix-postgresql.html) | multi-VM · LBU | 368,30 € |

## Langages

- [Java](https://bige.dev/lang-java.html) : Spring Boot, Spring Cloud, Quarkus, Micronaut, Jakarta EE, Vert.x, Hibernate
- [Node.js](https://bige.dev/lang-nodejs.html) : Express, Fastify, Hono, Koa, LoopBack, NestJS, Next.js, tRPC, React, Vue, Svelte
- [Python](https://bige.dev/lang-python.html) : Django, FastAPI, Flask, Celery
- [PHP](https://bige.dev/lang-php.html) : Laravel, WordPress, Symfony
- [Go](https://bige.dev/lang-go.html) : net/http, Gin, chi, Echo
- [.NET](https://bige.dev/lang-dotnet.html) : ASP.NET Core, Entity Framework Core
- [Ruby](https://bige.dev/lang-ruby.html) : Rails, Puma, Sidekiq
- [Kotlin](https://bige.dev/lang-kotlin.html) : Ktor, Spring Boot Kotlin
- [Scala](https://bige.dev/lang-scala.html) : Play, Apache Pekko, Akka
- [Rust](https://bige.dev/lang-rust.html) : Axum, Actix Web, Tokio
- [Elixir](https://bige.dev/lang-elixir.html) : Phoenix, LiveView, Ecto, Oban
- [OCaml](https://bige.dev/lang-ocaml.html) : Dream, Opium, Ocsigen

## Ce que bige-ops vérifie

Mappés automatiquement sur OpenCVE : [postgresql](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) · [mysql](https://app.opencve.io/cve/?vendor=oracle&product=mysql) · [mariadb](https://app.opencve.io/cve/?vendor=mariadb&product=mariadb) · [mongodb](https://app.opencve.io/cve/?vendor=mongodb&product=mongodb) · [redis](https://app.opencve.io/cve/?vendor=redis&product=redis) · [nginx](https://app.opencve.io/cve/?vendor=f5&product=nginx) · [node](https://app.opencve.io/cve/?vendor=nodejs&product=node.js) · [python](https://app.opencve.io/cve/?vendor=python&product=python) · [go](https://app.opencve.io/cve/?vendor=golang&product=go) · [kubernetes](https://app.opencve.io/cve/?vendor=kubernetes&product=kubernetes) · [docker](https://app.opencve.io/cve/?vendor=docker&product=docker).

Avec ta clé OpenCVE, chaque composant reconnu (image, package) est rapproché de sa fiche fournisseur/produit (une requête par produit). Classement : sévérité CVSS (KEV ⇒ au moins haute), puis exposition dans la simulation (Internet ou derrière LBU : sévérité pleine ; subnet privé : un cran de moins, sauf KEV), départage KEV → CVSS → EPSS. Rapprochement au niveau produit, à recouper avec la version épinglée ; `latest` signalé comme version non épinglée.

Mode direct (sans clé) : lecture du code JS/TS/Python/Go/PHP/Ruby, routes par framework + signaux d’auth, failles de code, dépendances npm / PyPI / Go / Packagist → [OSV](https://osv.dev/). Audit approfondi avec ta clé LLM (CWE).

## OpenCVE, le référentiel CVE de bige-ops

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : CVE publiées (NVD, MITRE, KEV de la CISA…) enrichies CVSS / EPSS et rangées par fournisseur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

HTML : [stacks.html](https://bige.dev/stacks.html)
