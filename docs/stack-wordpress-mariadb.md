# WordPress + MariaDB sur Outscale

Un site WordPress sérieux mérite mieux qu’une machine unique où tout est exposé. bige-ops pose WordPress sur Outscale derrière un LBU HTTPS, MariaDB en subnet privé, sauvegardes dans OOS, et chiffre l’ensemble.

**En bref.** Topologie multi-vm : VM app tinav6.c2r4p2 (WordPress, image construite depuis wordpress:7.1-php8.3-apache) derrière un LBU, MariaDB 11.4 sur VM privée tinav6.c2r4p2, backups OOS, NAT. Estimation bige-ops : **236,90 € HT/mois**.

## Pourquoi cette stack tourne bien sur Outscale

- **Des bases rapides et stables** : Les volumes io1 garantissent jusqu’à 13 000 IOPS par volume : tes requêtes gardent des temps de réponse réguliers, même sous charge. [Volumes](https://docs.outscale.com/en/userguide/About-Volumes.html)
- **Un réseau privé et des sauvegardes sûres** : Tes bases restent dans le réseau privé de ton projet, jamais exposées à Internet. Les sauvegardes partent vers l’Object Storage, compatible S3 et répliqué entre plusieurs zones.
- **Prêt pour les clients exigeants** : Régions qualifiées SecNumCloud 3.2 pour le secteur public, certification HDS pour la santé. [Pourquoi Outscale](pourquoi-outscale.html) · [SecNumCloud 3.2](https://www.3ds.com/newsroom/press-releases/outscale-first-cloud-qualified-secnumcloud-32)

## Architecture

VM app tinav6.c2r4p2 (WordPress 7.1, PHP 8.3) derrière LBU ; MariaDB 11.4 LTS (tinav6.c2r4p2, io1) en subnet privé ; OOS backups ; NAT.

## Coût mensuel estimé

Calculé avec bige-ops estimate --json sur le catalogue public Outscale synchronisé le 17 septembre 2026, Région eu-west-2, en € HT par mois (730 heures). Estimation indicative, sur la grille publique ; le trafic sortant est à 0 € HT au catalogue public de cette Région.

| Ligne bige-ops | Ce que c’est | € HT / mois |
| --- | --- | --- |
| LBU app-web | entrée publique | 21,90 € |
| OOS wordpress-backups — 50 GiB | sauvegardes MariaDB | 1,25 € |
| VM app-app — tinav6.c2r4p2 | WordPress (PHP 8.3, Apache) | 70,10 € |
| VM app-mariadb — tinav6.c2r4p2 | MariaDB 11.4, disque io1 | 103,50 € |
| NAT gateway | sortie du subnet privé | 36,50 € |
| EIP VM app-app (attachée — 1ʳᵉ offerte / Net) | IP de la VM app (1ʳᵉ offerte) | 0,00 € |
| EIP NAT (attachée supplémentaire) | IP publique du NAT | 3,65 € |
| **Total estimé** | | **236,90 €** |



```
bige-ops init -n stack-wordpress-mariadb
bige-ops add layout custom --name app --runtime php --web none --no-worker --db mariadb --topology multi-vm --lbu
bige-ops validate
bige-ops estimate --json
```

```yaml
name: stack-wordpress-mariadb
region: eu-west-2
enable_nat: true
components:
- type: stack
  name: app
  topology: multi-vm
  services: [api, mariadb]
  images: {mariadb: 'mariadb:11.4'}
  sizing: {app_vm: tinav6.c2r4p2, mariadb_vm: tinav6.c2r4p2}
  service_config:
    mariadb:
      backup: {enabled: true, oos_bucket: wordpress-backups}
- type: load_balancer
  name: app-web
  scheme: internet-facing
  backend_vms: [app-app]
- {type: oos_bucket, name: wordpress-backups, bucket: wordpress-backups, size: 50, purpose: backups}
```

## Données

| Base | Image épinglée | Backup | Failles connues |
| --- | --- | --- | --- |
| MariaDB | `mariadb:11.4` | mariadb-dump → gzip → bucket OOS | [OpenCVE](https://app.opencve.io/cve/?vendor=mariadb&product=mariadb) |

**MariaDB.** MariaDB publie des versions LTS (10.11, 11.4, 11.8…) ; la simulation épingle mariadb:11.4 plutôt que le mariadb:11 par défaut, qui suit la dernière 11.x. Calendrier : versions MariaDB. Durcissement : pas de root distant, un utilisateur applicatif limité aux adresses du Net, et mariadb-secure-installation appliqué dans l’image ou au premier démarrage.

Backup activé (`backup.enabled` + bucket OOS protégé) ; `backup.sh` préparé.

## Exposition

- Seule entrée publique : le LBU internet-facing, listener HTTPS 443 + certificat EIM
- VM app en subnet public, ports applicatifs ouverts au seul CIDR du Net (via le LBU)
- Bases en subnet privé, sans IP publique, security group au CIDR du Net ; administration par tunnel SSH
- Security group de la VM app : SSH, 80 et 443 ouverts ; resserre SSH sur tes CIDR connus, app sur un port applicatif (3000, 8000, 8080…)
- NAT : sortie du subnet privé, aucune entrée

## Vulnérabilités

Des failles, il y en aura toujours : l’important est de voir d’abord celles qui sont exposées. bige-ops lit le code de tes dépôts sur ton poste, compare tes paquets Composer, s’il y en a, à la base publique des failles connues des bibliothèques open source ([OSV](https://osv.dev/)) et, avec ta clé OpenCVE, les composants de ta stack au registre mondial des vulnérabilités (CVE) ; puis il classe tout par urgence, l’exposé à Internet d’abord. Pourquoi le refaire toi-même ? C’est chez toi, sur ton poste, et c’est gratuit.

Avec ta clé OpenCVE, chaque composant reconnu (image, paquet installé) est rapproché de sa fiche éditeur/produit (une requête par produit). Classement : gravité notée sur 10 (CVSS), au moins haute si la faille est déjà exploitée (liste KEV de la CISA) ; puis exposition dans la simulation (Internet ou derrière le LBU : gravité pleine ; subnet privé : un cran de moins, sauf faille déjà exploitée) ; départage : déjà exploitée, puis note, puis probabilité d’exploitation (EPSS). Rapprochement au niveau du produit, pas de la version : à recouper avec ta version épinglée ; `latest` signalé comme version non épinglée.

| Composant | Fiche OpenCVE | Dans bige-ops |
| --- | --- | --- |
| MariaDB | [MariaDB](https://app.opencve.io/cve/?vendor=mariadb&product=mariadb) | reconnu automatiquement depuis l’image mariadb:11.4 · exposition : privée |
| WordPress, WooCommerce | [WordPress](https://app.opencve.io/cve/?vendor=wordpress&product=wordpress) · [WooCommerce](https://app.opencve.io/cve/?vendor=woocommerce&product=woocommerce) | fiche de référence (pas encore reconnu automatiquement) |
| PHP | [PHP](https://app.opencve.io/cve/?vendor=php&product=php) | fiche de référence (pas encore reconnu automatiquement) |

Sur ton poste, sans clé ni IA (mode direct) : site reconnu à son wp-config.php, routes de l’API REST (register_rest_route), mots de passe ou clés écrits en clair dans le code, exécution de commandes construites avec des données externes, paquets Composer (s’il y en a) vérifiés dans OSV. Détail : PHP sur Outscale.

Audit approfondi (bige-ops advanced, ta propre clé d’IA) : relit les pistes repérées, confirme les vraies failles, écarte les fausses alertes et classe chacune par type de faille, selon le catalogue de référence (CWE), avec son urgence et un ticket GitHub prêt à ouvrir.

## Avant le deploy

- `validate` (services custom, HTTPS sans ORN EIM refusé, rappel NAT pour les VMs privées)
- `preflight` : clés Outscale, OMI, stack, IP des hôtes, Dockerfile, secrets build/runtime, jeton GitHub, alerte backup OOS ; une erreur bloque le deploy
- `plan` : Terraform, risques de perte de données ; buckets OOS protégés
- Vulnérabilités : failles connues des composants (OpenCVE) classées selon leur exposition, `latest` signalé, dépôts relus sur ton poste, sans clé ni IA

## OpenCVE, la source des failles connues

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : les failles publiées dans le registre mondial des vulnérabilités (CVE) et ses sources (NVD, MITRE, liste KEV des failles déjà exploitées tenue par la CISA…), avec leur note de gravité sur 10 (CVSS) et leur probabilité d’être exploitées (EPSS), rangées par éditeur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

Docs : [WordPress](https://wordpress.org/documentation/) · [WordPress Developer](https://developer.wordpress.org/) · [image wordpress](https://hub.docker.com/_/wordpress) · [MariaDB](https://mariadb.com/docs/)

HTML : [stack-wordpress-mariadb.html](https://bige.dev/stack-wordpress-mariadb.html)
