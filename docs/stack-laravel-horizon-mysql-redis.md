# Laravel + Horizon + MySQL + Redis sur Outscale

Laravel pour le produit, Horizon pour piloter les queues Redis, MySQL pour les données : la stack PHP moderne de nombreuses startups. bige-ops la pose sur Outscale en multi-VM, MySQL et Redis en subnet privé, et la chiffre.

**En bref.** Topologie multi-vm : VM app (Laravel + workers Horizon) derrière un LBU, MySQL 8.4 et Redis sur VMs privées, backups OOS, NAT. Estimation bige-ops : **423,06 € HT/mois**.

## Architecture

VM app tinav6.c4r8p2 (Laravel PHP-FPM + Horizon) derrière LBU ; MySQL 8.4 LTS et Redis 8 privés ; OOS backups ; NAT.

## Coût mensuel estimé

Calculé avec bige-ops estimate --json sur le catalogue public Outscale synchronisé le 17 septembre 2026, Région eu-west-2, en € HT par mois (730 heures). Estimation indicative, sur la grille publique ; le trafic sortant est à 0 € HT au catalogue public de cette Région.

| Ligne bige-ops | Ce que c’est | € HT / mois |
| --- | --- | --- |
| LBU app-web | entrée publique | 21,90 € |
| OOS laravel-app-backups — 50 GiB | sauvegardes MySQL | 1,25 € |
| VM app-app — tinav6.c4r8p2 | Laravel + Horizon | 135,80 € |
| VM app-redis — tinav6.c2r2p3 | queues Horizon, cache, sessions | 54,76 € |
| VM app-mysql — tinav6.c4r8p2 | MySQL 8.4, disque io1 | 169,20 € |
| NAT gateway | sortie du subnet privé | 36,50 € |
| EIP VM app-app (attachée — 1ʳᵉ offerte / Net) | IP de la VM app (1ʳᵉ offerte) | 0,00 € |
| EIP NAT (attachée supplémentaire) | IP publique du NAT | 3,65 € |
| **Total estimé** | | **423,06 €** |



```
bige-ops init -n stack-laravel-horizon-mysql-redis
bige-ops add layout custom --name app --runtime php --web same --worker --db mysql --db redis --topology multi-vm --lbu
bige-ops validate
bige-ops estimate --json
```

```yaml
name: stack-laravel-horizon-mysql-redis
region: eu-west-2
enable_nat: true
components:
- type: stack
  name: app
  topology: multi-vm
  services: [api, web, worker, mysql, redis]
  images: {mysql: 'mysql:8.4', redis: 'redis:8-alpine'}
  sizing: {app_vm: tinav6.c4r8p2, mysql_vm: tinav6.c4r8p2, redis_vm: tinav6.c2r2p3}
  service_config:
    mysql:
      backup: {enabled: true, oos_bucket: laravel-app-backups}
- type: load_balancer
  name: app-web
  scheme: internet-facing
  backend_vms: [app-app]
- {type: oos_bucket, name: laravel-app-backups, bucket: laravel-app-backups, size: 50, purpose: backups}
```

## Données

| Base | Image épinglée | Backup | CVE |
| --- | --- | --- | --- |
| MySQL | `mysql:8.4` | mysqldump → gzip → bucket OOS | [OpenCVE](https://app.opencve.io/cve/?vendor=oracle&product=mysql) |
| Redis | `redis:8-alpine` | snapshot RDB / AOF → bucket OOS | [OpenCVE](https://app.opencve.io/cve/?vendor=redis&product=redis) |

**MySQL.** MySQL 8.4 est la version LTS ; la série 8.0 est arrivée en fin de vie : la simulation épingle mysql:8.4 plutôt que le mysql:8 par défaut. Référence : manuel MySQL 8.4. Durcissement : pas de root distant, un utilisateur applicatif limité aux adresses du Net, et des droits réduits aux schémas de l’app.

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
| MySQL | [MySQL](https://app.opencve.io/cve/?vendor=oracle&product=mysql) | mappé automatiquement depuis l’image mysql:8.4 · exposition : privée |
| Redis | [Redis](https://app.opencve.io/cve/?vendor=redis&product=redis) | mappé automatiquement depuis l’image redis:8-alpine · exposition : privée |
| PHP, Laravel | [PHP](https://app.opencve.io/cve/?vendor=php&product=php) · [Laravel](https://app.opencve.io/cve/?vendor=laravel&product=framework) | fiche de référence (composant hors table de correspondance automatique) ; paquets Composer contrôlés par OSV |

Mode direct, sans clé : routes Laravel (Route::) et middleware('auth'), eval / exec, secrets, paquets Composer rapprochés d’OSV ; le Blade non échappé {!! !!} est préparé pour l’audit approfondi. Détail : PHP sur Outscale.

## Avant le deploy

- `validate` (services custom, HTTPS sans ORN EIM refusé, rappel NAT pour les VMs privées)
- `preflight` : clés Outscale, OMI, stack, IP des hôtes, Dockerfile, secrets build/runtime, jeton GitHub, alerte backup OOS ; une erreur bloque le deploy
- `plan` : Terraform, risques de perte de données ; buckets OOS protégés
- Vulnérabilités : OpenCVE classé par exposition, `latest` signalé, dépôts en mode direct

## OpenCVE, le référentiel CVE de bige-ops

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : CVE publiées (NVD, MITRE, KEV de la CISA…) enrichies CVSS / EPSS et rangées par fournisseur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

Docs : [Laravel](https://laravel.com/docs) · [Horizon](https://laravel.com/docs/horizon) · [Queues Laravel](https://laravel.com/docs/queues) · [MySQL 8.4](https://dev.mysql.com/doc/refman/8.4/en/) · [Redis](https://redis.io/docs/latest/)

HTML : [stack-laravel-horizon-mysql-redis.html](https://bige.dev/stack-laravel-horizon-mysql-redis.html)
