# Go sur Outscale

Un binaire statique, une empreinte mémoire minuscule, une concurrence native : Go est taillé pour les API et les services réseau. Sur Outscale, une VM modeste suffit souvent ; bige-ops la dimensionne, la chiffre et lit tes routes Gin et net/http.

**En bref.** Runtime go dans bige-ops : port 8080, 256 MiB par service par défaut. Scan : routes net/http et Gin, modules Go (go.mod) via OSV, image golang rapprochée d’OpenCVE.

## Frameworks et bibliothèques

- **net/http** : Le serveur HTTP de la bibliothèque standard, avec le routage par motifs (méthode et chemin) depuis Go 1.22. bige-ops lit http.HandleFunc() et mux.HandleFunc(). ([doc](https://pkg.go.dev/net/http) · [OpenCVE](https://app.opencve.io/cve/?vendor=golang&product=go) · [OpenCVE](https://app.opencve.io/cve/?vendor=golang&product=net))
- **Gin** : Le framework web Go le plus utilisé : routeur rapide, middlewares, binding. bige-ops lit r.GET(), group.POST() et les groupes r.Group() ; un CORS ouvert à * est préparé pour l’audit approfondi. ([doc](https://gin-gonic.com/en/docs/) · [OpenCVE](https://app.opencve.io/cve/?vendor=gin-gonic&product=gin))
- **chi, Echo, pgx** : chi et Echo sont d’autres routeurs courants ; pgx est le driver PostgreSQL de référence. Leurs versions dans go.mod passent par OSV comme tous tes modules. ([doc](https://pkg.go.dev/github.com/jackc/pgx/v5) · [OpenCVE](https://app.opencve.io/cve/?vendor=go-chi&product=chi) · [OpenCVE](https://app.opencve.io/cve/?vendor=labstack&product=echo) · [OpenCVE](https://app.opencve.io/cve/?vendor=jackc&product=pgx))

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

## Scan bige-ops

Mode direct : routes net/http et Gin, secrets, InsecureSkipVerify, path traversal, CORS * ; go.mod → OSV. Clé OpenCVE : image `golang` → [Go sur OpenCVE](https://app.opencve.io/cve/?vendor=golang&product=go).

## Bases de données

- **PostgreSQL** : pgx, database/sql, sqlc. [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) — [Go + PostgreSQL + NATS](https://bige.dev/stack-go-postgresql-nats.html)
- **Redis** : cache, rate limiting. [OpenCVE](https://app.opencve.io/cve/?vendor=redis&product=redis)
- **MongoDB** : driver officiel Go. [OpenCVE](https://app.opencve.io/cve/?vendor=mongodb&product=mongodb)

Jamais de base exposée à Internet : subnet privé + security group au CIDR du Net (multi-VM), Service interne (OKS).

## Versions à épingler

Chaque version majeure de Go est maintenue jusqu’à la sortie de deux versions plus récentes : aujourd’hui Go 1.27 et 1.26. Épingle la version dans go.mod (directive go) et dans l’image de build (FROM golang:1.27). Sources : historique des versions Go · gestion des vulnérabilités Go · CVE : Go sur OpenCVE.

## OpenCVE, le référentiel CVE de bige-ops

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : CVE publiées (NVD, MITRE, KEV de la CISA…) enrichies CVSS / EPSS et rangées par fournisseur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

## Stacks chiffrées

- [Go + PostgreSQL + NATS](https://bige.dev/stack-go-postgresql-nats.html) (302,60 € HT/mois)

Docs : [Go](https://go.dev/doc/) · [net/http](https://pkg.go.dev/net/http) · [Gin](https://gin-gonic.com/en/docs/) · [pgx](https://pkg.go.dev/github.com/jackc/pgx/v5) · [NATS](https://docs.nats.io/)

HTML : [lang-go.html](https://bige.dev/lang-go.html)
