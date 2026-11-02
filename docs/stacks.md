# Stacks et langages sur Outscale

Les architectures que les équipes font vraiment tourner, posées sur Outscale par bige-ops : architecture, versions à épingler, exposition, failles connues suivies avec OpenCVE et commandes pour reproduire chaque stack.

## Startups

| Stack | Sur Outscale |
| --- | --- |
| [Next.js + NestJS + PostgreSQL + Redis + OOS](https://bige.dev/stack-nextjs-nestjs-postgresql-redis.html) | multi-VM · LBU · OOS |
| [Express + MongoDB + Redis + BullMQ sur OKS](https://bige.dev/stack-express-mongodb-redis-oks.html) | OKS · 3 nœuds · 2 LBU |
| [Django + Celery + PostgreSQL + Redis](https://bige.dev/stack-django-celery-postgresql-redis.html) | multi-VM · LBU |
| [Rails + Sidekiq + PostgreSQL + Redis](https://bige.dev/stack-rails-sidekiq-postgresql-redis.html) | multi-VM · LBU |
| [Laravel + Horizon + MySQL + Redis](https://bige.dev/stack-laravel-horizon-mysql-redis.html) | multi-VM · LBU |
| [Go + PostgreSQL + NATS](https://bige.dev/stack-go-postgresql-nats.html) | multi-VM · LBU |

## Grandes entreprises

| Stack | Sur Outscale |
| --- | --- |
| [Spring Boot sur OKS + Kafka + Keycloak](https://bige.dev/stack-spring-boot-oks-kafka-keycloak.html) | OKS HA · 3 nœuds c8r16 · 3 LBU |
| [Quarkus sur OKS + PostgreSQL + Kafka](https://bige.dev/stack-quarkus-oks-postgresql-kafka.html) | OKS HA · 3 nœuds · 1 LBU |
| [Jakarta EE + OpenSearch + PostgreSQL](https://bige.dev/stack-jakarta-ee-opensearch-postgresql.html) | multi-VM · VM de recherche |
| [ASP.NET Core + PostgreSQL + RabbitMQ](https://bige.dev/stack-dotnet-postgresql-rabbitmq.html) | multi-VM · VM broker |
| [IA : FastAPI + pgvector + GPU](https://bige.dev/stack-ai-fastapi-pgvector-gpu.html) | multi-VM · VM GPU L40 |

Sur OKS, chaque Service exposé crée son propre LBU : le tableau en donne le nombre.

## Sites et temps réel

| Stack | Sur Outscale |
| --- | --- |
| [WordPress + MariaDB](https://bige.dev/stack-wordpress-mariadb.html) | multi-VM · LBU |
| [Phoenix + PostgreSQL](https://bige.dev/stack-phoenix-postgresql.html) | multi-VM · LBU |

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

Des failles, il y en aura toujours : l’important est de voir d’abord celles qui sont exposées. La méthode, sans rien cacher :

1. Il lit le code de tes dépôts, sur ton poste, sans clé ni IA (le « mode direct ») : JavaScript, TypeScript, Python, Go, PHP et Ruby ; les tests et suites e2e sont écartés pour éviter les fausses alertes.
2. Il repère les pages et les API que ton app expose, avec un module par framework (Express, Fastify, Hono, Koa, LoopBack, NestJS, Next.js, tRPC, Django, FastAPI, Flask, net/http, Gin, Laravel, WordPress, Rails), et regarde si chacune demande une connexion. Une route marquée publique, ou une page sensible (admin, compte, paiement…) sans vérification visible, ressort comme « page ou API accessible sans être connecté ».
3. Il cherche les erreurs classiques : mots de passe ou clés écrits en clair dans le code, requête à la base construite avec ce que tape l’utilisateur (injection SQL), exécution de commandes construites avec des données externes, code injecté qui s’exécute dans le navigateur de tes utilisateurs (XSS), API ouverte à n’importe quel site, vérification des certificats HTTPS désactivée.
4. Il compare tes bibliothèques (npm, PyPI, modules Go, Packagist) à la base publique des failles connues des bibliothèques open source ([OSV](https://osv.dev/)).
5. Avec ta clé OpenCVE, il compare ta stack (composants de la simulation, images de tes Dockerfile et docker-compose) au registre mondial des vulnérabilités (CVE).
6. Il classe tout par urgence : ce qui est exposé à Internet d’abord.

En mode direct, ton code ne quitte pas ton poste : vers OSV et OpenCVE ne partent que des noms de bibliothèques et de composants (avec leur version, pour OSV). Pourquoi le refaire toi-même ? C’est chez toi, sur ton poste, et c’est gratuit.

Pour Java, .NET, Kotlin, Scala, Rust, Elixir et OCaml, la lecture du code arrive ; leurs stacks sont déjà couvertes : composants et images comparés aux failles connues avec OpenCVE et classés selon leur exposition.

Reconnus automatiquement sur OpenCVE : [postgresql](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) · [mysql](https://app.opencve.io/cve/?vendor=oracle&product=mysql) · [mariadb](https://app.opencve.io/cve/?vendor=mariadb&product=mariadb) · [mongodb](https://app.opencve.io/cve/?vendor=mongodb&product=mongodb) · [redis](https://app.opencve.io/cve/?vendor=redis&product=redis) · [nginx](https://app.opencve.io/cve/?vendor=f5&product=nginx) · [node](https://app.opencve.io/cve/?vendor=nodejs&product=node.js) · [python](https://app.opencve.io/cve/?vendor=python&product=python) · [go](https://app.opencve.io/cve/?vendor=golang&product=go) · [kubernetes](https://app.opencve.io/cve/?vendor=kubernetes&product=kubernetes) · [docker](https://app.opencve.io/cve/?vendor=docker&product=docker).

Avec ta clé OpenCVE, chaque composant reconnu (image, paquet installé) est rapproché de sa fiche éditeur/produit (une requête par produit). Classement : gravité notée sur 10 (CVSS), au moins haute si la faille est déjà exploitée (liste KEV de la CISA) ; puis exposition dans la simulation (Internet ou derrière le LBU : gravité pleine ; subnet privé : un cran de moins, sauf faille déjà exploitée) ; départage : déjà exploitée, puis note, puis probabilité d’exploitation (EPSS). Rapprochement au niveau du produit, pas de la version : à recouper avec ta version épinglée ; `latest` signalé comme version non épinglée.

Audit approfondi, en option (bige-ops advanced, ta propre clé d’IA) : il relit les pistes repérées, confirme les vraies failles, écarte les fausses alertes et classe chacune par type de faille, selon le catalogue de référence (CWE), avec un ticket GitHub prêt à ouvrir. Seuls des extraits ciblés de ton code partent, avec ta clé, chez le fournisseur d’IA choisi.

## OpenCVE, la source des failles connues

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : les failles publiées dans le registre mondial des vulnérabilités (CVE) et ses sources (NVD, MITRE, liste KEV des failles déjà exploitées tenue par la CISA…), avec leur note de gravité sur 10 (CVSS) et leur probabilité d’être exploitées (EPSS), rangées par éditeur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

HTML : [stacks.html](https://bige.dev/stacks.html)
