# Ruby on Rails sur Outscale

Rails reste l’un des chemins les plus courts entre une idée et un produit en ligne. Sur Outscale, bige-ops pose Puma et Sidekiq sur la VM app, PostgreSQL et Redis en subnet privé, chiffre l’ensemble et lit tes routes Rails.

**En bref.** Rails se déclare en runtime custom, construit depuis ton Dockerfile (port 3000 pour Puma). Scan : routes Rails (config/routes.rb), signaux before_action :authenticate, secrets en dur.

## Frameworks et bibliothèques

- **Ruby on Rails** : Le framework MVC complet : Active Record, Action Cable, Hotwire. bige-ops lit le DSL de routes (get, post, resources, resource, match, root) et les namespace ; before_action :authenticate marque une action protégée, skip_before_action :authenticate une action ouverte. ([doc](https://guides.rubyonrails.org/) · [OpenCVE](https://app.opencve.io/cve/?vendor=rubyonrails&product=rails) · [OpenCVE](https://app.opencve.io/cve/?vendor=rack&product=rack))
- **Puma** : Le serveur d’application par défaut de Rails, multi-thread et multi-process. ([doc](https://puma.io/) · [OpenCVE](https://app.opencve.io/cve/?vendor=puma&product=puma))
- **Sidekiq** : Les jobs de fond sur Redis, l’autre moitié de presque toutes les apps Rails en production. ([doc](https://sidekiq.org/) · [OpenCVE](https://app.opencve.io/cve/?vendor=contribsys&product=sidekiq))
- **Devise et Nokogiri** : Deux gems omniprésentes : l’authentification Devise et le parseur XML/HTML Nokogiri, à suivre de près. ([doc](https://github.com/heartcombo/devise) · [OpenCVE](https://app.opencve.io/cve/?vendor=plataformatec&product=devise) · [OpenCVE](https://app.opencve.io/cve/?vendor=nokogiri&product=nokogiri))

## Sur Outscale avec bige-ops

bige-ops n’a pas besoin d’un preset Ruby : déclare api et worker en runtime custom, construits depuis ton Dockerfile (image ruby officielle, bundle exec puma d’un côté, bundle exec sidekiq de l’autre), avec RAILS_ENV=production et le port 3000.

- `single-vm` : une VM publique, apps + bases en Docker Compose (prototype, démo).
- `multi-vm` : VM app derrière un LBU, une VM privée par base, NAT pour la sortie (production lisible).
- `oks` : cluster OKS, un Deployment par service, Service LoadBalancer → LBU (scale, microservices, HPA).

```
# service_config (extrait)
api:
  runtime: custom
  port: 3000
  env:
    RAILS_ENV: {mode: literal, value: production}
worker:
  runtime: custom
```

## Scan bige-ops

Mode direct : routes Rails + namespace, signal `before_action :authenticate`, secrets ; OSV via le package.json éventuel. Clé OpenCVE : PostgreSQL et Redis mappés ; Ruby et Rails en référence : [Ruby sur OpenCVE](https://app.opencve.io/cve/?vendor=ruby-lang&product=ruby) · [Rails sur OpenCVE](https://app.opencve.io/cve/?vendor=rubyonrails&product=rails).

## Bases de données

- **PostgreSQL** : Active Record, adaptateur pg. [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) — [Rails + Sidekiq + PostgreSQL + Redis](https://bige.dev/stack-rails-sidekiq-postgresql-redis.html)
- **Redis** : Sidekiq, cache, Action Cable. [OpenCVE](https://app.opencve.io/cve/?vendor=redis&product=redis) — [Rails + Sidekiq + PostgreSQL + Redis](https://bige.dev/stack-rails-sidekiq-postgresql-redis.html)
- **MySQL** : adaptateur mysql2 / trilogy. [OpenCVE](https://app.opencve.io/cve/?vendor=oracle&product=mysql)

Jamais de base exposée à Internet : subnet privé + security group au CIDR du Net (multi-VM), Service interne (OKS).

## Versions à épingler

Ruby 4.0 et 3.4 sont en maintenance normale, 3.3 en maintenance de sécurité jusqu’à mars 2027. Côté Rails, chaque série mineure reçoit les corrections un an : reste sur une série maintenue. Sources : branches Ruby · politique de maintenance Rails · CVE : Ruby sur OpenCVE.

## OpenCVE, le référentiel CVE de bige-ops

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : CVE publiées (NVD, MITRE, KEV de la CISA…) enrichies CVSS / EPSS et rangées par fournisseur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

## Stacks chiffrées

- [Rails + Sidekiq + PostgreSQL + Redis](https://bige.dev/stack-rails-sidekiq-postgresql-redis.html) (423,06 € HT/mois)

Docs : [Ruby](https://www.ruby-lang.org/en/documentation/) · [Rails Guides](https://guides.rubyonrails.org/) · [Sécurité Rails](https://guides.rubyonrails.org/security.html) · [Sidekiq](https://sidekiq.org/) · [Puma](https://puma.io/)

HTML : [lang-ruby.html](https://bige.dev/lang-ruby.html)
