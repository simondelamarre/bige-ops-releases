# .NET sur Outscale

ASP.NET Core est multiplateforme, rapide et tourne parfaitement sous Linux, en conteneur. Sur Outscale, bige-ops pose ton API .NET derrière un LBU, PostgreSQL en subnet privé, RabbitMQ pour la messagerie, et chiffre la stack au catalogue public.

**En bref.** Un service .NET se déclare en runtime custom construit depuis ton Dockerfile (port 8080, le port par défaut des images ASP.NET Core récentes), avec ASPNETCORE_ENVIRONMENT=Production.

## Frameworks et bibliothèques

- **ASP.NET Core** : Minimal APIs, contrôleurs MVC, Razor, SignalR, gRPC, servis par Kestrel. Une image multi-étapes (SDK pour le build, runtime ASP.NET pour l’exécution) reste compacte. ([doc](https://learn.microsoft.com/aspnet/core/) · [OpenCVE](https://app.opencve.io/cve/?vendor=microsoft&product=asp.net_core) · [OpenCVE](https://app.opencve.io/cve/?vendor=microsoft&product=.net))
- **Entity Framework Core** : L’ORM de .NET : LINQ, migrations, suivi des changements ; PostgreSQL via le fournisseur Npgsql. ([doc](https://learn.microsoft.com/ef/core/) · [OpenCVE](https://app.opencve.io/cve/?vendor=npgsql&product=npgsql))
- **Messagerie** : Le client .NET de RabbitMQ (ou une couche comme MassTransit) pour les commandes et événements entre services. ([doc](https://www.rabbitmq.com/client-libraries/dotnet) · [OpenCVE](https://app.opencve.io/cve/?vendor=rabbitmq&product=rabbitmq))

## Sur Outscale avec bige-ops

Déclare api (et worker pour un consumer ou un BackgroundService) en runtime custom : port 8080, mémoire réglable, image construite depuis ton Dockerfile. Le LBU termine le TLS ; Kestrel parle HTTP derrière.

- `single-vm` : une VM publique, apps + bases en Docker Compose (prototype, démo).
- `multi-vm` : VM app derrière un LBU, une VM privée par base, NAT pour la sortie (production lisible).
- `oks` : cluster OKS, un Deployment par service, Service LoadBalancer → LBU (scale, microservices, HPA).

```
# service_config (extrait)
api:
  runtime: custom
  port: 8080
  memory_mb: 1024
  env:
    ASPNETCORE_ENVIRONMENT: {mode: literal, value: Production}
```

## Scan bige-ops

L’analyse du code .NET arrive ; ta stack est déjà couverte : composants et images (y compris celles de tes Dockerfile et docker-compose) confrontés à OpenCVE, exposition dans la simulation et coût sur Outscale.

## Bases de données

- **PostgreSQL** : EF Core + Npgsql, Dapper. [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) — [ASP.NET Core + PostgreSQL + RabbitMQ](https://bige.dev/stack-dotnet-postgresql-rabbitmq.html)
- **RabbitMQ** : commandes et événements, MassTransit. [OpenCVE](https://app.opencve.io/cve/?vendor=rabbitmq&product=rabbitmq) — [ASP.NET Core + PostgreSQL + RabbitMQ](https://bige.dev/stack-dotnet-postgresql-rabbitmq.html)
- **Redis** : cache distribué, sessions, SignalR backplane. [OpenCVE](https://app.opencve.io/cve/?vendor=redis&product=redis)

Jamais de base exposée à Internet : subnet privé + security group au CIDR du Net (multi-VM), Service interne (OKS).

## Versions à épingler

.NET 10 est la version LTS active, supportée jusqu’au 14 novembre 2028. .NET 8 (LTS) et .NET 9 (STS) arrivent tous deux en fin de support le 10 novembre 2026 : c’est le moment de passer à .NET 10. Source : politique de support .NET · CVE : .NET sur OpenCVE · ASP.NET Core sur OpenCVE.

## OpenCVE, le référentiel CVE de bige-ops

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : CVE publiées (NVD, MITRE, KEV de la CISA…) enrichies CVSS / EPSS et rangées par fournisseur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

## Stacks chiffrées

- [ASP.NET Core + PostgreSQL + RabbitMQ](https://bige.dev/stack-dotnet-postgresql-rabbitmq.html) (438,40 € HT/mois)

Docs : [.NET](https://learn.microsoft.com/dotnet/) · [ASP.NET Core](https://learn.microsoft.com/aspnet/core/) · [Entity Framework Core](https://learn.microsoft.com/ef/core/) · [Npgsql](https://www.npgsql.org/) · [RabbitMQ](https://www.rabbitmq.com/docs)

HTML : [lang-dotnet.html](https://bige.dev/lang-dotnet.html)
