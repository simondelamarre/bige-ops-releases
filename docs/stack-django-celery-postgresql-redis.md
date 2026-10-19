# Django + Celery + PostgreSQL + Redis sur Outscale

Django pour le produit et l’admin, Celery pour les tâches asynchrones, PostgreSQL et Redis : la stack Python des startups qui veulent livrer vite et solide. bige-ops la pose sur Outscale en multi-VM et la chiffre ligne par ligne.

**En bref.** Topologie multi-vm : VM app (Gunicorn + worker Celery) derrière un LBU, PostgreSQL et Redis sur VMs privées, backups OOS, NAT. Estimation bige-ops : **423,06 € HT/mois**.

## Architecture

VM app tinav6.c4r8p2 (Gunicorn :8000 + worker Celery) derrière LBU ; PostgreSQL 17 et Redis 8 en subnet privé ; OOS backups ; NAT.

## Coût mensuel estimé

Calculé avec bige-ops estimate --json sur le catalogue public Outscale synchronisé le 17 septembre 2026, Région eu-west-2, en € HT par mois (730 heures). Estimation indicative, sur la grille publique ; le trafic sortant est à 0 € HT au catalogue public de cette Région.

| Ligne bige-ops | Ce que c’est | € HT / mois |
| --- | --- | --- |
| LBU app-web | entrée publique | 21,90 € |
| OOS django-app-backups — 50 GiB | sauvegardes PostgreSQL | 1,25 € |
| VM app-app — tinav6.c4r8p2 | Django (Gunicorn) + worker Celery | 135,80 € |
| VM app-redis — tinav6.c2r2p3 | broker Celery, cache | 54,76 € |
| VM app-postgres — tinav6.c4r8p2 | PostgreSQL 17, disque io1 | 169,20 € |
| NAT gateway | sortie du subnet privé | 36,50 € |
| EIP VM app-app (attachée — 1ʳᵉ offerte / Net) | IP de la VM app (1ʳᵉ offerte) | 0,00 € |
| EIP NAT (attachée supplémentaire) | IP publique du NAT | 3,65 € |
| **Total estimé** | | **423,06 €** |



```
bige-ops init -n stack-django-celery-postgresql-redis
bige-ops add layout custom --name app --runtime python --web none --worker --db postgres --db redis --topology multi-vm --lbu
bige-ops validate
bige-ops estimate --json
```

```yaml
name: stack-django-celery-postgresql-redis
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
      backup: {enabled: true, oos_bucket: django-app-backups}
- type: load_balancer
  name: app-web
  scheme: internet-facing
  backend_vms: [app-app]
- {type: oos_bucket, name: django-app-backups, bucket: django-app-backups, size: 50, purpose: backups}
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
| Python | [Python](https://app.opencve.io/cve/?vendor=python&product=python) | mappé depuis le FROM python de ton Dockerfile (scan des dépôts) |
| Django, Celery | [Django](https://app.opencve.io/cve/?vendor=djangoproject&product=django) · [Celery](https://app.opencve.io/cve/?vendor=celeryproject&product=celery) | fiche de référence (composant hors table de correspondance automatique) ; versions PyPI épinglées contrôlées par OSV |

Mode direct, sans clé : routes Django (path, re_path) et décorateurs login_required, DEBUG = True, SQL en f-string, dépendances PyPI épinglées rapprochées d’OSV ; |safe et mark_safe sont préparés pour l’audit approfondi. Détail : Python sur Outscale.

## Avant le deploy

- `validate` (services custom, HTTPS sans ORN EIM refusé, rappel NAT pour les VMs privées)
- `preflight` : clés Outscale, OMI, stack, IP des hôtes, Dockerfile, secrets build/runtime, jeton GitHub, alerte backup OOS ; une erreur bloque le deploy
- `plan` : Terraform, risques de perte de données ; buckets OOS protégés
- Vulnérabilités : OpenCVE classé par exposition, `latest` signalé, dépôts en mode direct

## OpenCVE, le référentiel CVE de bige-ops

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : CVE publiées (NVD, MITRE, KEV de la CISA…) enrichies CVSS / EPSS et rangées par fournisseur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

Docs : [Django](https://docs.djangoproject.com/) · [Déployer Django](https://docs.djangoproject.com/en/stable/howto/deployment/) · [Celery](https://docs.celeryq.dev/) · [PostgreSQL](https://www.postgresql.org/docs/) · [Redis](https://redis.io/docs/latest/)

HTML : [stack-django-celery-postgresql-redis.html](https://bige.dev/stack-django-celery-postgresql-redis.html)
