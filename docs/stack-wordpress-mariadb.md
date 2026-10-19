# WordPress + MariaDB sur Outscale

Un site WordPress sérieux mérite mieux qu’une machine unique où tout est exposé. bige-ops pose WordPress sur Outscale derrière un LBU HTTPS, MariaDB en subnet privé, sauvegardes dans OOS, et chiffre l’ensemble.

**En bref.** Topologie multi-vm : VM app tinav6.c2r4p2 (WordPress, image construite depuis wordpress:7.1-php8.3-apache) derrière un LBU, MariaDB 11.4 sur VM privée tinav6.c2r4p2, backups OOS, NAT. Estimation bige-ops : **236,90 € HT/mois**.

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

| Base | Image épinglée | Backup | CVE |
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

Avec ta clé OpenCVE, chaque composant reconnu (image, package) est rapproché de sa fiche fournisseur/produit (une requête par produit). Classement : sévérité CVSS (KEV ⇒ au moins haute), puis exposition dans la simulation (Internet ou derrière LBU : sévérité pleine ; subnet privé : un cran de moins, sauf KEV), départage KEV → CVSS → EPSS. Rapprochement au niveau produit, à recouper avec la version épinglée ; `latest` signalé comme version non épinglée.

| Composant | Fiche OpenCVE | Dans bige-ops |
| --- | --- | --- |
| MariaDB | [MariaDB](https://app.opencve.io/cve/?vendor=mariadb&product=mariadb) | mappé automatiquement depuis l’image mariadb:11.4 · exposition : privée |
| WordPress, WooCommerce | [WordPress](https://app.opencve.io/cve/?vendor=wordpress&product=wordpress) · [WooCommerce](https://app.opencve.io/cve/?vendor=woocommerce&product=woocommerce) | fiche de référence (composant hors table de correspondance automatique) |
| PHP | [PHP](https://app.opencve.io/cve/?vendor=php&product=php) | fiche de référence (composant hors table de correspondance automatique) |

Mode direct, sans clé : site reconnu à son wp-config.php, routes REST register_rest_route, secrets en dur, eval / exec, et paquets Composer s’il y en a, rapprochés d’OSV. Détail : PHP sur Outscale.

## Avant le deploy

- `validate` (services custom, HTTPS sans ORN EIM refusé, rappel NAT pour les VMs privées)
- `preflight` : clés Outscale, OMI, stack, IP des hôtes, Dockerfile, secrets build/runtime, jeton GitHub, alerte backup OOS ; une erreur bloque le deploy
- `plan` : Terraform, risques de perte de données ; buckets OOS protégés
- Vulnérabilités : OpenCVE classé par exposition, `latest` signalé, dépôts en mode direct

## OpenCVE, le référentiel CVE de bige-ops

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : CVE publiées (NVD, MITRE, KEV de la CISA…) enrichies CVSS / EPSS et rangées par fournisseur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

Docs : [WordPress](https://wordpress.org/documentation/) · [WordPress Developer](https://developer.wordpress.org/) · [image wordpress](https://hub.docker.com/_/wordpress) · [MariaDB](https://mariadb.com/docs/)

HTML : [stack-wordpress-mariadb.html](https://bige.dev/stack-wordpress-mariadb.html)
