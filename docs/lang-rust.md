# Rust sur Outscale

Rust apporte la performance du natif et la sûreté mémoire : idéal pour les API à fort trafic, les proxies et les services de traitement. Un binaire Rust tient dans quelques mégaoctets et quelques centaines de MiB de RAM : bige-ops le dimensionne au plus juste sur Outscale.

**En bref.** Preset de service rust dans bige-ops : port 8080, 256 MiB, binaire release dans ton image.

## Frameworks et bibliothèques

- **Axum** : Le framework web de l’équipe Tokio, sur hyper et tower : routage typé, extracteurs, middlewares tower. ([doc](https://docs.rs/axum/latest/axum/) · [OpenCVE](https://app.opencve.io/cve/?vendor=tokio&product=tokio) · [OpenCVE](https://app.opencve.io/cve/?vendor=hyper&product=hyper))
- **Actix Web** : Un framework mature et parmi les plus rapides, avec son propre runtime d’acteurs au-dessus de Tokio. ([doc](https://actix.rs/) · [OpenCVE](https://app.opencve.io/cve/?vendor=actix&product=actix-web))
- **Tokio, SQLx et Cargo** : Tokio pour l’asynchrone, SQLx pour PostgreSQL vérifié à la compilation, Cargo pour le build ; RustSec recense les avis de sécurité des crates. ([doc](https://tokio.rs/) · [OpenCVE](https://app.opencve.io/cve/?vendor=rust-lang&product=cargo) · [OpenCVE](https://app.opencve.io/cve/?vendor=rust-lang&product=rust))

## Sur Outscale avec bige-ops

Déclare tes services avec le runtime rust : 256 MiB et le port 8080 par défaut. Un build multi-étapes (cargo build --release puis une image distroless) donne une image minimale ; une VM tinav6.c2r4p2 porte une API Rust très chargée.

- `single-vm` : une VM publique, apps + bases en Docker Compose (prototype, démo).
- `multi-vm` : VM app derrière un LBU, une VM privée par base, NAT pour la sortie (production lisible).
- `oks` : cluster OKS, un Deployment par service, Service LoadBalancer → LBU (scale, microservices, HPA).

```
# service_config (extrait)
api:
  runtime: rust
  port: 8080
  memory_mb: 256
```

## Scan bige-ops

L’analyse du code Rust arrive ; ta stack est déjà couverte : composants et images (y compris celles de tes Dockerfile et docker-compose) confrontés à OpenCVE, exposition dans la simulation et coût sur Outscale.

## Bases de données

- **PostgreSQL** : SQLx, Diesel, tokio-postgres. [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) — [Go + PostgreSQL + NATS](https://bige.dev/stack-go-postgresql-nats.html)
- **Redis** : redis-rs, fred. [OpenCVE](https://app.opencve.io/cve/?vendor=redis&product=redis)
- **NATS** : async-nats. [OpenCVE](https://app.opencve.io/cve/?vendor=nats&product=nats-server) — [Go + PostgreSQL + NATS](https://bige.dev/stack-go-postgresql-nats.html)

Jamais de base exposée à Internet : subnet privé + security group au CIDR du Net (multi-VM), Service interne (OKS).

## Versions à épingler

Rust publie une version stable toutes les six semaines, rétrocompatible : épingle la toolchain dans rust-toolchain.toml et les crates dans Cargo.lock. Docs : Rust · CVE : Rust sur OpenCVE.

## OpenCVE, le référentiel CVE de bige-ops

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : CVE publiées (NVD, MITRE, KEV de la CISA…) enrichies CVSS / EPSS et rangées par fournisseur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

## Stacks chiffrées

- [Go + PostgreSQL + NATS](https://bige.dev/stack-go-postgresql-nats.html) : même architecture pour une API Rust.

Docs : [Rust](https://www.rust-lang.org/learn) · [Axum](https://docs.rs/axum/latest/axum/) · [Actix Web](https://actix.rs/) · [Tokio](https://tokio.rs/) · [RustSec](https://rustsec.org/)

HTML : [lang-rust.html](https://bige.dev/lang-rust.html)
