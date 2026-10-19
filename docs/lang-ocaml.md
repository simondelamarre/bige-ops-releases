# OCaml sur Outscale

OCaml allie typage fort, compilation native et excellentes performances : un choix solide pour des backends web sûrs et sobres. bige-ops déploie ton service OCaml sur Outscale comme un service custom construit depuis ton Dockerfile, avec ses bases en subnet privé.

**En bref.** Service custom dans bige-ops : image construite depuis ton Dockerfile (opam + dune), port et mémoire au choix. Topologies mono-VM, multi-VM ou OKS.

## Frameworks et bibliothèques

- **Dream** : Un framework web tout-en-un dans un seul module : routeur, sessions, formulaires protégés contre le CSRF, WebSockets, GraphQL, HTTPS et HTTP/2, et accès SQL via Caqti. ([doc](https://camlworks.github.io/dream/))
- **Opium** : Un framework léger inspiré de Sinatra, pour des API REST simples. ([doc](https://github.com/rgrinberg/opium))
- **Ocsigen et Eliom** : Eliom écrit client et serveur dans le même programme OCaml, servi par Ocsigen Server ; le client est compilé en JavaScript. ([doc](https://ocsigen.org/))
- **Caqti** : L’interface commune aux bases relationnelles : pilotes PostgreSQL (postgresql://), MariaDB (mariadb://) et SQLite, choisis par l’URI de connexion. ([doc](https://github.com/paurkedal/ocaml-caqti) · [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) · [OpenCVE](https://app.opencve.io/cve/?vendor=mariadb&product=mariadb))
- **opam et dune** : opam installe le compilateur et les paquets, dune construit le projet ; un Dockerfile multi-étapes part de l’image ocaml/opam et livre un binaire natif dans une image minimale. ([doc](https://opam.ocaml.org/) · [OpenCVE](https://app.opencve.io/cve/?vendor=ocaml&product=opam) · [OpenCVE](https://app.opencve.io/cve/?vendor=ocaml&product=ocaml))

## Sur Outscale avec bige-ops

Déclare ton service en kind: custom avec l’image construite depuis ton Dockerfile (ou un dépôt Git), son port et sa mémoire : un binaire natif OCaml se contente de peu. En multi-VM il partage la VM app ; sur OKS il devient un Deployment (une image est requise pour un pod).

- `single-vm` : une VM publique, apps + bases en Docker Compose (prototype, démo).
- `multi-vm` : VM app derrière un LBU, une VM privée par base, NAT pour la sortie (production lisible).
- `oks` : cluster OKS, un Deployment par service, Service LoadBalancer → LBU (scale, microservices, HPA).

```
# service_config (extrait)
web:
  kind: custom
  image: registry.example.com/acme/ocaml-web:1.0.0
  port: 8080
  memory_mb: 256
```

## Ce que bige-ops vérifie pour OCaml

Des failles, il y en aura toujours : l’important est de voir d’abord celles qui sont exposées. L’analyse du code OCaml arrive ; ta stack est déjà couverte : avec ta clé OpenCVE, ses composants et ses images (y compris celles de tes Dockerfile et docker-compose) sont comparés aux failles connues publiées dans le registre mondial des vulnérabilités (CVE) ; l’exposition dans la simulation et le coût sur Outscale sont calculés à côté.

Tout est classé par urgence : ce qui est exposé à Internet d’abord. Pourquoi le refaire toi-même ? C’est chez toi, sur ton poste, et c’est gratuit. Méthode complète : [ce que bige-ops vérifie](https://bige.dev/stacks.html#verifications).

## Bases de données

- **PostgreSQL** : Caqti (postgresql://), Petrol. [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) — [Phoenix + PostgreSQL](https://bige.dev/stack-phoenix-postgresql.html)
- **MariaDB** : Caqti (mariadb://). [OpenCVE](https://app.opencve.io/cve/?vendor=mariadb&product=mariadb) — [WordPress + MariaDB](https://bige.dev/stack-wordpress-mariadb.html)
- **Redis** : clients redis OCaml. [OpenCVE](https://app.opencve.io/cve/?vendor=redis&product=redis)

Jamais de base exposée à Internet : subnet privé + security group au CIDR du Net (multi-VM), Service interne (OKS).

## Versions à épingler

Épingle le compilateur dans ton switch opam et tes paquets dans un fichier de lock opam. Sources : versions d’OCaml · sécurité OCaml · Failles connues : OCaml sur OpenCVE · opam sur OpenCVE.

## OpenCVE, la source des failles connues

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : les failles publiées dans le registre mondial des vulnérabilités (CVE) et ses sources (NVD, MITRE, liste KEV des failles déjà exploitées tenue par la CISA…), avec leur note de gravité sur 10 (CVSS) et leur probabilité d’être exploitées (EPSS), rangées par éditeur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

## Stacks chiffrées

- Architectures transposables : [Phoenix + PostgreSQL](https://bige.dev/stack-phoenix-postgresql.html), [WordPress + MariaDB](https://bige.dev/stack-wordpress-mariadb.html).

Docs : [OCaml](https://ocaml.org/docs) · [Dream](https://camlworks.github.io/dream/) · [Opium](https://github.com/rgrinberg/opium) · [Ocsigen](https://ocsigen.org/) · [Caqti](https://github.com/paurkedal/ocaml-caqti) · [opam](https://opam.ocaml.org/) · [dune](https://dune.build/)

HTML : [lang-ocaml.html](https://bige.dev/lang-ocaml.html)
