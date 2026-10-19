# Laravel + Horizon + MySQL + Redis sur Outscale

Laravel pour le produit, Horizon pour piloter les queues Redis, MySQL pour les données : la stack PHP moderne de nombreuses startups. bige-ops la pose sur Outscale en multi-VM, MySQL et Redis en subnet privé, et la chiffre.

**En bref.** Topologie multi-vm : VM app (Laravel + workers Horizon) derrière un LBU, MySQL 8.4 et Redis sur VMs privées, backups OOS, NAT. Estimation bige-ops : **423,06 € HT/mois**.

## Pourquoi cette stack tourne bien sur Outscale

- **Des bases rapides et stables** : Les volumes io1 garantissent jusqu’à 13 000 IOPS par volume : tes requêtes gardent des temps de réponse réguliers, même sous charge. [Volumes](https://docs.outscale.com/en/userguide/About-Volumes.html)
- **Un réseau privé et des sauvegardes sûres** : Tes bases restent dans le réseau privé de ton projet, jamais exposées à Internet. Les sauvegardes partent vers l’Object Storage, compatible S3 et répliqué entre plusieurs zones.
- **Prêt pour les clients exigeants** : Régions qualifiées SecNumCloud 3.2 pour le secteur public, certification HDS pour la santé. [Pourquoi Outscale](pourquoi-outscale.html) · [SecNumCloud 3.2](https://www.3ds.com/newsroom/press-releases/outscale-first-cloud-qualified-secnumcloud-32)

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

| Base | Image épinglée | Backup | Failles connues |
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

Des failles, il y en aura toujours : l’important est de voir d’abord celles qui sont exposées. bige-ops lit le code de tes dépôts sur ton poste, compare tes paquets Composer à la base publique des failles connues des bibliothèques open source ([OSV](https://osv.dev/)) et, avec ta clé OpenCVE, les composants de ta stack au registre mondial des vulnérabilités (CVE) ; puis il classe tout par urgence, l’exposé à Internet d’abord. Pourquoi le refaire toi-même ? C’est chez toi, sur ton poste, et c’est gratuit.

Avec ta clé OpenCVE, chaque composant reconnu (image, paquet installé) est rapproché de sa fiche éditeur/produit (une requête par produit). Classement : gravité notée sur 10 (CVSS), au moins haute si la faille est déjà exploitée (liste KEV de la CISA) ; puis exposition dans la simulation (Internet ou derrière le LBU : gravité pleine ; subnet privé : un cran de moins, sauf faille déjà exploitée) ; départage : déjà exploitée, puis note, puis probabilité d’exploitation (EPSS). Rapprochement au niveau du produit, pas de la version : à recouper avec ta version épinglée ; `latest` signalé comme version non épinglée.

| Composant | Fiche OpenCVE | Dans bige-ops |
| --- | --- | --- |
| MySQL | [MySQL](https://app.opencve.io/cve/?vendor=oracle&product=mysql) | reconnu automatiquement depuis l’image mysql:8.4 · exposition : privée |
| Redis | [Redis](https://app.opencve.io/cve/?vendor=redis&product=redis) | reconnu automatiquement depuis l’image redis:8-alpine · exposition : privée |
| PHP, Laravel | [PHP](https://app.opencve.io/cve/?vendor=php&product=php) · [Laravel](https://app.opencve.io/cve/?vendor=laravel&product=framework) | fiche de référence (pas encore reconnu automatiquement) ; paquets Composer vérifiés dans OSV |

Sur ton poste, sans clé ni IA (mode direct) : routes Laravel (Route::) et connexion exigée (middleware('auth')), exécution de commandes construites avec des données externes, mots de passe ou clés écrits en clair dans le code, paquets Composer vérifiés dans OSV ; le HTML affiché sans échappement dans Blade ({!! !!}) est transmis à l’audit approfondi. Détail : PHP sur Outscale.

Audit approfondi (bige-ops advanced, ta propre clé d’IA) : relit les pistes repérées, confirme les vraies failles, écarte les fausses alertes et classe chacune par type de faille, selon le catalogue de référence (CWE), avec son urgence et un ticket GitHub prêt à ouvrir.

## Avant le deploy

- `validate` (services custom, HTTPS sans ORN EIM refusé, rappel NAT pour les VMs privées)
- `preflight` : clés Outscale, OMI, stack, IP des hôtes, Dockerfile, secrets build/runtime, jeton GitHub, alerte backup OOS ; une erreur bloque le deploy
- `plan` : Terraform, risques de perte de données ; buckets OOS protégés
- Vulnérabilités : failles connues des composants (OpenCVE) classées selon leur exposition, `latest` signalé, dépôts relus sur ton poste, sans clé ni IA

## OpenCVE, la source des failles connues

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : les failles publiées dans le registre mondial des vulnérabilités (CVE) et ses sources (NVD, MITRE, liste KEV des failles déjà exploitées tenue par la CISA…), avec leur note de gravité sur 10 (CVSS) et leur probabilité d’être exploitées (EPSS), rangées par éditeur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

Docs : [Laravel](https://laravel.com/docs) · [Horizon](https://laravel.com/docs/horizon) · [Queues Laravel](https://laravel.com/docs/queues) · [MySQL 8.4](https://dev.mysql.com/doc/refman/8.4/en/) · [Redis](https://redis.io/docs/latest/)

HTML : [stack-laravel-horizon-mysql-redis.html](https://bige.dev/stack-laravel-horizon-mysql-redis.html)
