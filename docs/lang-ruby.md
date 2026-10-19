# Ruby on Rails sur Outscale

Rails reste l’un des chemins les plus courts entre une idée et un produit en ligne. Sur Outscale, bige-ops pose Puma et Sidekiq sur la VM app, PostgreSQL et Redis en subnet privé, chiffre l’ensemble et vérifie si tes routes Rails demandent une connexion.

**En bref.** Rails se déclare en runtime custom, construit depuis ton Dockerfile (port 3000 pour Puma). Côté failles : routes Rails (config/routes.rb) accessibles sans connexion, mots de passe ou clés écrits en clair dans le code.

## Frameworks et bibliothèques

- **Ruby on Rails** : Le framework MVC complet : Active Record, Action Cable, Hotwire. bige-ops repère tes routes (get, post, resources, resource, match, root) et les namespace ; before_action :authenticate marque une action protégée (connexion exigée), skip_before_action :authenticate une action ouverte à tous. ([doc](https://guides.rubyonrails.org/) · [OpenCVE](https://app.opencve.io/cve/?vendor=rubyonrails&product=rails) · [OpenCVE](https://app.opencve.io/cve/?vendor=rack&product=rack))
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

## Ce que bige-ops vérifie dans ton code Ruby

Des failles, il y en aura toujours : l’important est de voir d’abord celles qui sont exposées. Sans clé ni IA (le « mode direct »), bige-ops lit le code de tes dépôts sur ton poste :

- **Pages et API exposées** : routes Rails et `namespace` ; une action ouverte (`skip_before_action :authenticate`), ou une route sensible sans `before_action :authenticate` ni autre vérification de connexion visible, ressort comme « page ou API accessible sans être connecté ».
- **Erreurs classiques** : mots de passe ou clés écrits en clair dans le code.
- **Bibliothèques** : un package.json éventuel est comparé à la base publique des failles connues des bibliothèques open source ([OSV](https://osv.dev/)) ; pour les gems, garde Gemfile.lock à jour.
- **Ta stack** : avec ta clé OpenCVE, PostgreSQL et Redis sont comparés automatiquement aux failles connues du registre mondial des vulnérabilités (CVE) ; Ruby et Rails en référence : [Ruby sur OpenCVE](https://app.opencve.io/cve/?vendor=ruby-lang&product=ruby) · [Rails sur OpenCVE](https://app.opencve.io/cve/?vendor=rubyonrails&product=rails).

Tout est ensuite classé par urgence : ce qui est exposé à Internet d’abord. Pourquoi le refaire toi-même ? C’est chez toi, sur ton poste, et c’est gratuit. En option, l’audit approfondi de bige-ops advanced relit ces pistes avec ta propre clé d’IA, écarte les fausses alertes et classe chaque faille par type, selon le catalogue de référence (CWE). Méthode complète : [ce que bige-ops vérifie](https://bige.dev/stacks.html#verifications).

## Bases de données

- **PostgreSQL** : Active Record, adaptateur pg. [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) — [Rails + Sidekiq + PostgreSQL + Redis](https://bige.dev/stack-rails-sidekiq-postgresql-redis.html)
- **Redis** : Sidekiq, cache, Action Cable. [OpenCVE](https://app.opencve.io/cve/?vendor=redis&product=redis) — [Rails + Sidekiq + PostgreSQL + Redis](https://bige.dev/stack-rails-sidekiq-postgresql-redis.html)
- **MySQL** : adaptateur mysql2 / trilogy. [OpenCVE](https://app.opencve.io/cve/?vendor=oracle&product=mysql)

Jamais de base exposée à Internet : subnet privé + security group au CIDR du Net (multi-VM), Service interne (OKS).

## Versions à épingler

Ruby 4.0 et 3.4 sont en maintenance normale, 3.3 en maintenance de sécurité jusqu’à mars 2027. Côté Rails, chaque série mineure reçoit les corrections un an : reste sur une série maintenue. Sources : branches Ruby · politique de maintenance Rails · Failles connues : Ruby sur OpenCVE.

## OpenCVE, la source des failles connues

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : les failles publiées dans le registre mondial des vulnérabilités (CVE) et ses sources (NVD, MITRE, liste KEV des failles déjà exploitées tenue par la CISA…), avec leur note de gravité sur 10 (CVSS) et leur probabilité d’être exploitées (EPSS), rangées par éditeur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

## Stacks chiffrées

- [Rails + Sidekiq + PostgreSQL + Redis](https://bige.dev/stack-rails-sidekiq-postgresql-redis.html) (423,06 € HT/mois)

Docs : [Ruby](https://www.ruby-lang.org/en/documentation/) · [Rails Guides](https://guides.rubyonrails.org/) · [Sécurité Rails](https://guides.rubyonrails.org/security.html) · [Sidekiq](https://sidekiq.org/) · [Puma](https://puma.io/)

HTML : [lang-ruby.html](https://bige.dev/lang-ruby.html)
