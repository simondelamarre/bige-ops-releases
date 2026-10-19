# Go sur Outscale

Un binaire statique, une empreinte mémoire minuscule, une concurrence native : Go est taillé pour les API et les services réseau. Sur Outscale, une VM modeste suffit souvent ; bige-ops la dimensionne, la chiffre et vérifie si tes routes Gin et net/http demandent une connexion.

**En bref.** Runtime go dans bige-ops : port 8080, 256 MiB par service par défaut. Côté failles : routes net/http et Gin accessibles sans connexion, modules Go (go.mod) et image golang comparés aux failles connues.

## Frameworks et bibliothèques

- **net/http** : Le serveur HTTP de la bibliothèque standard, avec le routage par motifs (méthode et chemin) depuis Go 1.22. bige-ops repère les routes déclarées par http.HandleFunc() et mux.HandleFunc(). ([doc](https://pkg.go.dev/net/http) · [OpenCVE](https://app.opencve.io/cve/?vendor=golang&product=go) · [OpenCVE](https://app.opencve.io/cve/?vendor=golang&product=net))
- **Gin** : Le framework web Go le plus utilisé : routeur rapide, middlewares, binding. bige-ops repère les routes r.GET(), group.POST() et les groupes r.Group() ; une API ouverte à n’importe quel site est transmise à l’audit approfondi. ([doc](https://gin-gonic.com/en/docs/) · [OpenCVE](https://app.opencve.io/cve/?vendor=gin-gonic&product=gin))
- **chi, Echo, pgx** : chi et Echo sont d’autres routeurs courants ; pgx est le driver PostgreSQL de référence. Leurs versions dans go.mod sont comparées aux failles connues, comme tous tes modules. ([doc](https://pkg.go.dev/github.com/jackc/pgx/v5) · [OpenCVE](https://app.opencve.io/cve/?vendor=go-chi&product=chi) · [OpenCVE](https://app.opencve.io/cve/?vendor=labstack&product=echo) · [OpenCVE](https://app.opencve.io/cve/?vendor=jackc&product=pgx))

## Sur Outscale avec bige-ops

Le runtime go de bige-ops prévoit 256 MiB et le port 8080 : un binaire Go dans une image distroless ou scratch démarre en quelques millisecondes. Une VM app tinav6.c2r4p2 (2 vCPU, 4 GiB) porte confortablement une API et ses consumers.

- `single-vm` : une VM publique, apps + bases en Docker Compose (prototype, démo).
- `multi-vm` : VM app derrière un LBU, une VM privée par base, NAT pour la sortie (production lisible).
- `oks` : cluster OKS, un Deployment par service, Service LoadBalancer → LBU (scale, microservices, HPA).

```
bige-ops add layout go-app --name api
# ou sur mesure :
bige-ops add layout custom --runtime go --web none --worker \
  --db postgres --topology multi-vm --lbu
```

## Ce que bige-ops vérifie dans ton code Go

Des failles, il y en aura toujours : l’important est de voir d’abord celles qui sont exposées. Sans clé ni IA (le « mode direct »), bige-ops lit le code de tes dépôts sur ton poste :

- **Pages et API exposées** : routes net/http et Gin ; une route marquée publique, ou sensible (/admin, /account, /payment…) sans vérification de connexion visible, ressort comme « page ou API accessible sans être connecté ».
- **Erreurs classiques** : mots de passe ou clés écrits en clair dans le code, vérification des certificats HTTPS désactivée, lecture de fichiers hors du dossier prévu, API ouverte à n’importe quel site.
- **Modules Go** : chaque module de go.mod est comparé à la base publique des failles connues des bibliothèques open source ([OSV](https://osv.dev/)).
- **Ta stack** : avec ta clé OpenCVE, l’image `golang` est comparée aux failles connues du registre mondial des vulnérabilités (CVE) : [Go sur OpenCVE](https://app.opencve.io/cve/?vendor=golang&product=go).

Tout est ensuite classé par urgence : ce qui est exposé à Internet d’abord. Pourquoi le refaire toi-même ? C’est chez toi, sur ton poste, et c’est gratuit. En option, l’audit approfondi de bige-ops advanced relit ces pistes avec ta propre clé d’IA, écarte les fausses alertes et classe chaque faille par type, selon le catalogue de référence (CWE). Méthode complète : [ce que bige-ops vérifie](https://bige.dev/stacks.html#verifications).

## Bases de données

- **PostgreSQL** : pgx, database/sql, sqlc. [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) — [Go + PostgreSQL + NATS](https://bige.dev/stack-go-postgresql-nats.html)
- **Redis** : cache, rate limiting. [OpenCVE](https://app.opencve.io/cve/?vendor=redis&product=redis)
- **MongoDB** : driver officiel Go. [OpenCVE](https://app.opencve.io/cve/?vendor=mongodb&product=mongodb)

Jamais de base exposée à Internet : subnet privé + security group au CIDR du Net (multi-VM), Service interne (OKS).

## Versions à épingler

Chaque version majeure de Go est maintenue jusqu’à la sortie de deux versions plus récentes : aujourd’hui Go 1.27 et 1.26. Épingle la version dans go.mod (directive go) et dans l’image de build (FROM golang:1.27). Sources : historique des versions Go · gestion des vulnérabilités Go · Failles connues : Go sur OpenCVE.

## OpenCVE, la source des failles connues

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : les failles publiées dans le registre mondial des vulnérabilités (CVE) et ses sources (NVD, MITRE, liste KEV des failles déjà exploitées tenue par la CISA…), avec leur note de gravité sur 10 (CVSS) et leur probabilité d’être exploitées (EPSS), rangées par éditeur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

## Stacks chiffrées

- [Go + PostgreSQL + NATS](https://bige.dev/stack-go-postgresql-nats.html) (302,60 € HT/mois)

Docs : [Go](https://go.dev/doc/) · [net/http](https://pkg.go.dev/net/http) · [Gin](https://gin-gonic.com/en/docs/) · [pgx](https://pkg.go.dev/github.com/jackc/pgx/v5) · [NATS](https://docs.nats.io/)

HTML : [lang-go.html](https://bige.dev/lang-go.html)
