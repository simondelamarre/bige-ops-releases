# PHP sur Outscale

Laravel pour les produits SaaS, WordPress pour les sites et la publication, Symfony pour les applications d’entreprise : PHP reste partout. bige-ops le pose sur Outscale avec ses bases MySQL ou MariaDB en subnet privé, chiffre la stack et vérifie si tes routes Laravel et WordPress demandent une connexion.

**En bref.** Runtime php dans bige-ops : API sur le port 8080, front sur le 80, 512 MiB par défaut. Côté failles : routes Laravel et WordPress accessibles sans connexion, HTML Blade affiché sans échappement, bibliothèques Composer (Packagist) comparées aux failles connues.

## Frameworks et bibliothèques

- **Laravel** : Le framework PHP des équipes produit : Eloquent, files, Horizon, Sanctum. bige-ops repère les routes Route::get(), Route::match() et les groupes Route::prefix() ; ->middleware('auth') marque une route protégée (connexion exigée), et le HTML affiché sans échappement par Blade ({!! !!}) est transmis à l’audit approfondi. ([doc](https://laravel.com/docs) · [OpenCVE](https://app.opencve.io/cve/?vendor=laravel&product=framework))
- **WordPress** : Le CMS le plus utilisé du web, et son écosystème d’extensions (WooCommerce en tête). bige-ops reconnaît un site WordPress à son wp-config.php et repère les routes de l’API REST déclarées par register_rest_route(). ([doc](https://developer.wordpress.org/) · [OpenCVE](https://app.opencve.io/cve/?vendor=wordpress&product=wordpress) · [OpenCVE](https://app.opencve.io/cve/?vendor=woocommerce&product=woocommerce))
- **Symfony** : Les composants et le framework derrière une large part du PHP d’entreprise. Il se conteneurise et se déploie sur Outscale comme Laravel (PHP-FPM ou serveur web intégré à l’image) ; ses dépendances Composer sont comparées aux failles connues, comme les autres. ([doc](https://symfony.com/doc/current/index.html) · [OpenCVE](https://app.opencve.io/cve/?vendor=symfony&product=symfony))
- **Composer et PHP-FPM** : Composer gère les paquets Packagist ; PHP-FPM sert l’application derrière nginx ou Apache dans l’image. bige-ops lit require et require-dev de chaque composer.json. ([doc](https://getcomposer.org/doc/) · [OpenCVE](https://app.opencve.io/cve/?vendor=php&product=php) · [OpenCVE](https://app.opencve.io/cve/?vendor=guzzlephp&product=guzzle))

## Sur Outscale avec bige-ops

Le runtime php de bige-ops construit ton image depuis le Dockerfile du dépôt (PHP-FPM, Apache ou FrankenPHP : c’est ton choix d’image) et l’expose sur le port 8080, avec un front sur le port 80 si tu en déclares un. Les workers (queues Laravel, Horizon, Symfony Messenger) partagent la VM app.

- `single-vm` : une VM publique, apps + bases en Docker Compose (prototype, démo).
- `multi-vm` : VM app derrière un LBU, une VM privée par base, NAT pour la sortie (production lisible).
- `oks` : cluster OKS, un Deployment par service, Service LoadBalancer → LBU (scale, microservices, HPA).

```
bige-ops add layout php-app --name shop
# ou sur mesure :
bige-ops add layout custom --runtime php --web same --worker \
  --db mysql --db redis --topology multi-vm --lbu
```

## Ce que bige-ops vérifie dans ton code PHP

Des failles, il y en aura toujours : l’important est de voir d’abord celles qui sont exposées. Sans clé ni IA (le « mode direct »), bige-ops lit ton code PHP sur ton poste :

- **Pages et API exposées** : routes Laravel (`Route::`) et WordPress (`register_rest_route`) ; `middleware('auth')` marque une route protégée ; une route sensible sans vérification de connexion visible ressort comme « page ou API accessible sans être connecté ».
- **Erreurs classiques** : mots de passe ou clés écrits en clair dans le code, exécution de commandes construites avec des données externes ; le HTML affiché sans échappement par Blade (`{!! !!}`) est transmis à l’audit approfondi.
- **Bibliothèques** : paquets Packagist (composer.json) comparés à la base publique des failles connues des bibliothèques open source ([OSV](https://osv.dev/)).
- **Ta stack** : avec ta clé OpenCVE, MySQL, MariaDB, Redis et nginx sont comparés automatiquement aux failles connues du registre mondial des vulnérabilités (CVE) ; runtime PHP en référence : [PHP sur OpenCVE](https://app.opencve.io/cve/?vendor=php&product=php).

Tout est ensuite classé par urgence : ce qui est exposé à Internet d’abord. Pourquoi le refaire toi-même ? C’est chez toi, sur ton poste, et c’est gratuit. En option, l’audit approfondi de bige-ops advanced relit ces pistes avec ta propre clé d’IA, écarte les fausses alertes et classe chaque faille par type, selon le catalogue de référence (CWE). Méthode complète : [ce que bige-ops vérifie](https://bige.dev/stacks.html#verifications).

## Bases de données

- **MySQL** : Eloquent, Doctrine ; MySQL 8.4 LTS. [OpenCVE](https://app.opencve.io/cve/?vendor=oracle&product=mysql) — [Laravel + Horizon + MySQL + Redis](https://bige.dev/stack-laravel-horizon-mysql-redis.html)
- **MariaDB** : prise en charge par WordPress dès la 10.11 (voir les prérequis). [OpenCVE](https://app.opencve.io/cve/?vendor=mariadb&product=mariadb) — [WordPress + MariaDB](https://bige.dev/stack-wordpress-mariadb.html)
- **Redis** : cache, sessions, queues Laravel et Horizon. [OpenCVE](https://app.opencve.io/cve/?vendor=redis&product=redis) — [Laravel + Horizon + MySQL + Redis](https://bige.dev/stack-laravel-horizon-mysql-redis.html)
- **PostgreSQL** : pris en charge par Laravel et Doctrine. [OpenCVE](https://app.opencve.io/cve/?vendor=postgresql&product=postgresql)

Jamais de base exposée à Internet : subnet privé + security group au CIDR du Net (multi-VM), Service interne (OKS).

## Versions à épingler

PHP publie ses dates de support : 8.4 (sécurité jusqu’au 31 décembre 2028) et 8.5 (jusqu’au 31 décembre 2029) sont les bons choix ; 8.3 reste couvert jusqu’à fin 2027 et 8.2 jusqu’au 31 décembre 2026. WordPress demande PHP 8.3 ou plus. Laravel corrige les bugs 18 mois et la sécurité 2 ans par version majeure. Sources : versions supportées de PHP · politique de support Laravel · Failles connues : PHP sur OpenCVE.

## OpenCVE, la source des failles connues

bige-ops s’appuie sur [OpenCVE](https://www.opencve.io/) : les failles publiées dans le registre mondial des vulnérabilités (CVE) et ses sources (NVD, MITRE, liste KEV des failles déjà exploitées tenue par la CISA…), avec leur note de gravité sur 10 (CVSS) et leur probabilité d’être exploitées (EPSS), rangées par éditeur et produit ([explorateur](https://app.opencve.io/)). Projet open source, code et communauté sur [GitHub](https://github.com/opencve/opencve), installable chez toi. Merci à ses mainteneurs et contributeurs.

## Stacks chiffrées

- [Laravel + Horizon + MySQL + Redis](https://bige.dev/stack-laravel-horizon-mysql-redis.html) (423,06 € HT/mois)
- [WordPress + MariaDB](https://bige.dev/stack-wordpress-mariadb.html) (236,90 € HT/mois)

Docs : [PHP](https://www.php.net/docs.php) · [Laravel](https://laravel.com/docs) · [Laravel Horizon](https://laravel.com/docs/horizon) · [WordPress Developer](https://developer.wordpress.org/) · [Symfony](https://symfony.com/doc/current/index.html) · [Composer](https://getcomposer.org/doc/)

HTML : [lang-php.html](https://bige.dev/lang-php.html)
