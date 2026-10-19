# Rails + Sidekiq + PostgreSQL + Redis sur Outscale

Puma pour servir Rails, Sidekiq pour les jobs, PostgreSQL et Redis : la stack Rails de production, telle que la font tourner beaucoup de produits. bige-ops la pose sur Outscale en multi-VM, avec les bases en subnet privé, et la chiffre.

**En bref.** Topologie multi-vm : VM app (Puma + Sidekiq, services custom construits depuis ton Dockerfile, port 3000) derrière un LBU, PostgreSQL et Redis privés, backups OOS, NAT. Estimation bige-ops : **423,06 € HT/mois**.

## Architecture

VM app tinav6.c4r8p2 (Puma :3000 + Sidekiq, runtime custom) derrière LBU ; PostgreSQL 17 et Redis 8 privés ; OOS backups ; NAT.

## Coût mensuel estimé

Calculé avec bige-ops estimate --json sur le catalogue public Outscale synchronisé le 17 septembre 2026, Région eu-west-2, en € HT par mois (730 heures). Estimation indicative, sur la grille publique ; le trafic sortant est à 0 € HT au catalogue public de cette Région.

| Ligne bige-ops | Ce que c’est | € HT / mois |
| --- | --- | --- |
| LBU app-web | entrée publique (→ Puma :3000) | 21,90 € |
| OOS rails-app-backups — 50 GiB | sauvegardes PostgreSQL | 1,25 € |
| VM app-app — tinav6.c4r8p2 | Rails (Puma) + Sidekiq | 135,80 € |
| VM app-redis — tinav6.c2r2p3 | Sidekiq, cache, Action Cable | 54,76 € |
| VM app-postgres — tinav6.c4r8p2 | PostgreSQL 17, disque io1 | 169,20 € |
| NAT gateway | sortie du subnet privé | 36,50 € |
| EIP VM app-app (attachée — 1ʳᵉ offerte / Net) | IP de la VM app (1ʳᵉ offerte) | 0,00 € |
| EIP NAT (attachée supplémentaire) | IP publique du NAT | 3,65 € |
| **Total estimé** | | **423,06 €** |



```
bige-ops init -n stack-rails-sidekiq-postgresql-redis
bige-ops add layout custom --name app --runtime python --web none --worker --db postgres --db redis --topology multi-vm --lbu
bige-ops validate
bige-ops estimate --json
```

```yaml
name: stack-rails-sidekiq-postgresql-redis
region: eu-west-2
enable_nat: true
components:
- type: stack
  name: app
  topology: multi-vm
  services: [api, worker, postgres, redis]
  images: {postgres: 'postgres:17', redis: 'redis:8-alpine'}
  sizing: {app_vm: tinav6.c4r8p2, postgres_vm: tinav6.c4r8p2, redis_vm: tinav6.c2r2p3}
  service_config:
    postgres:
      backup: {enabled: true, oos_bucket: rails-app-backups}
- type: load_balancer
  name: app-web
  scheme: internet-facing
  backend_vms: [app-app]
- {type: oos_bucket, name: rails-app-backups, bucket: rails-app-backups, size: 50, purpose: backups}
```

## Données

| Base | Image épinglée | Backup | CVE |
| --- | --- | --- | --- |
| PostgreSQL | `postgres:17` | pg_dump → gzip → bucket OOS | [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) |
| Redis | `redis:8-alpine` | snapshot RDB / AOF → bucket OOS | [OpenCVE](https://app.opencve.io/cve/?vendor=redis&product=redis) |

**PostgreSQL.** PostgreSQL 18 (supporté jusqu’en novembre 2030), 17 (novembre 2029), 16 (défaut bige-ops, novembre 2028) et 15 (novembre 2027) sont maintenus ; 14 sort du support le 12 novembre 2026. La simulation épingle postgres:17. Source : politique de versions PostgreSQL. Durcissement : un rôle applicatif dédié (jamais le superutilisateur), des règles pg_hba.conf limitées au CIDR du Net en scram-sha-256, et des mises à jour mineures régulières (la majeure reste celle que tu épingles).

**Redis.** La simulation garde redis:8-alpine, le tag par défaut de bige-ops : il suit la dernière Redis 8. Épingle la mineure (par exemple 8.10) si tu veux un build strictement reproductible. Durcissement : un mot de passe ou des ACL, le protected mode actif, aucune exposition publique, et les commandes d’administration réservées à un utilisateur dédié (sécurité Redis).

Backup activé (`backup.enabled` + bucket OOS protégé) ; `backup.sh` préparé.

## Exposition

- Seule entrée publique : le LBU internet-facing, listener HTTPS 443 + certificat EIM
- VM app en subnet public, ports applicatifs ouverts au seul CIDR du Net (via le LBU)
- Bases en subnet privé, sans IP publique, security group au CIDR du Net ; administration par tunnel SSH
- Security group de la VM app : SSH, 80 et 443 ouverts ; resserre SSH sur tes CIDR connus, app sur un port applicatif (3000, 8000, 8080…)
- NAT : sortie du subnet privé, aucune entrée

## Vulnérabilités

Avec ta clé OpenCVE, chaque composant reconnu (image, package) est rapproché de sa fiche fournisseur/produit (une requête par produit). Classement : sévérité CVSS (KEV ⇒ au moins haute), puis exposition dans la simulation (Internet ou derrière LBU : sévérité pleine ; subnet privé : un cran de moins, sauf KEV), départage KEV → CVSS → EPSS. Rapprochement au niveau produit, à recouper avec la version épinglée ; `latest` signalé comme version non épinglée.

| Composant | Fiche OpenCVE | Dans bige-ops |
| --- | --- | --- |
| PostgreSQL | [PostgreSQL](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql) | mappé automatiquement depuis l’image postgres:17 · exposition : privée |
| Redis | [Redis](https://app.opencve.io/cve/?vendor=redis&product=redis) | mappé automatiquement depuis l’image redis:8-alpine · exposition : privée |
| Ruby, Rails, Sidekiq | [Ruby](https://app.opencve.io/cve/?vendor=ruby-lang&product=ruby) · [Rails](https://app.opencve.io/cve/?vendor=rubyonrails&product=rails) · [Sidekiq](https://app.opencve.io/cve/?vendor=contribsys&product=sidekiq) | fiche de référence (composant hors table de correspondance automatique) |

Mode direct, sans clé : routes Rails (config/routes.rb, namespace) et before_action :authenticate, secrets en dur ; un package.json éventuel passe par OSV. Détail : Ruby on Rails sur Outscale.

## Avant le deploy

- `validate` (services custom, HTTPS sans ORN EIM refusé, rappel NAT pour les VMs privées)
- `preflight` : clés Outscale, OMI, stack, IP des hôtes, Dockerfile, secrets build/runtime, jeton GitHub, alerte backup OOS ; une erreur bloque le deploy
- `plan` : Terraform, risques de perte de données ; buckets OOS protégés
- Vulnérabilités : OpenCVE classé par exposition, `latest` signalé, dépôts en mode direct

## OpenCVE, le référentiel CVE de bige-ops

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : CVE publiées (NVD, MITRE, KEV de la CISA…) enrichies CVSS / EPSS et rangées par fournisseur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

Docs : [Rails Guides](https://guides.rubyonrails.org/) · [Sidekiq](https://sidekiq.org/) · [Puma](https://puma.io/) · [PostgreSQL](https://www.postgresql.org/docs/) · [Redis](https://redis.io/docs/latest/)

HTML : [stack-rails-sidekiq-postgresql-redis.html](https://bige.dev/stack-rails-sidekiq-postgresql-redis.html)
