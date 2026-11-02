# Par où commencer ?

Pas besoin d’équipe DevOps. Tu choisis un point de départ selon ton activité, et bige-ops s’occupe du reste : réseau, sauvegardes et déploiement sur ton compte Outscale. Changer de topologie plus tard, c’est une simulation de plus.

| | Pour qui | Ce que tu obtiens | Exemple concret |
| --- | --- | --- | --- |
| **Une machine** | TPE, outil métier, site, première version d’un produit | Une VM pour l’app et sa base, adresse publique, sauvegardes vers l’Object Storage | `node-lite` : une VM 2 vCPU / 4 Gio avec l’API, le web et PostgreSQL, IP publique, sans load balancer |
| **L’app et ses données séparées** | Une activité qui tourne, des clients qui comptent sur toi | App derrière un load balancer, chaque base sur sa VM dans un réseau privé | `python-app` : VM app 4 vCPU / 8 Gio (API, front, worker) derrière un LBU ; PostgreSQL sur sa VM privée 4 vCPU / 8 Gio en io1 ; Redis sur une VM 2 vCPU / 2 Gio |
| **Kubernetes managé** | Plusieurs services, des pics de charge, une équipe qui grandit | Cluster OKS dont Outscale opère le control plane, nodepools que tu dimensionnes, autoscaling des nœuds en option | Services sur un `compute-pool` (2 nœuds 4 vCPU / 8 Gio), bases sur un `data-pool` (2 nœuds 4 vCPU / 16 Gio) |

Ce sont les tailles de départ, modifiables dans le Visual. Une fois l’app installée, ta simulation affiche son estimation ligne par ligne, sur la grille publique Outscale, avant tout déploiement.

## Optimise tes bases à tes usages

Chaque base démarre avec des réglages pensés pour son usage ; tu ajustes ensuite en voyant l’estimation de ta simulation suivre.

| Usage | Ce que bige-ops met en place (app et données séparées) | À ajuster |
| --- | --- | --- |
| Données de l’app (PostgreSQL, MySQL, MariaDB, MongoDB) | VM dédiée en réseau privé, disque io1 à 3 000 IOPS, sauvegarde OOS en un clic | IOPS (100 à 13 000), RAM, rétention |
| Cache et files (Redis) | Petite VM (2 vCPU, 2 Gio), 20 Gio gp2 | RAM |
| Recherche et vecteurs (Weaviate) | VM dédiée sur io1, index en mémoire | RAM |
| Graphes (Neo4j) | VM dédiée sur io1 | RAM, IOPS |
| Pour démarrer (une machine) | Base sur la même machine, sauvegarde OOS | Séparer la base quand elle grossit |

Un disque io1 se compte à sa taille et à ses IOPS provisionnées : ta simulation en tient compte, ligne par ligne.

**Quand passer à l’étape suivante** : quand une panne de la machine devient un vrai problème pour tes clients ou que ta base grossit ; vers Kubernetes quand tu as plusieurs services ou des pics de charge. Tu dupliques ta simulation, tu changes la topologie et tu compares les deux versions (machines, bases, estimation).

**bige-ops s’occupe de** : réseau privé et ouvertures, données (dump vers l’Object Storage, restauration, migration depuis le panneau Données d’une base), HTTPS, secrets en coffre local, estimation et risques affichés avant chaque déploiement.

**Points de départ prêts à l’emploi** :

- `node-lite` (une machine) : API et web Node.js, PostgreSQL sur la même VM, IP publique.
- `python-app`, `php-app`, `go-app` (app et données séparées) : API, front SPA, worker · PostgreSQL et Redis · LBU.
- `java-spring` : API Spring Boot, front SPA · PostgreSQL et Redis · LBU.
- `elixir-phoenix` : Phoenix (API et LiveView), worker · PostgreSQL et Redis · LBU.
- `node-app` : API, web, worker · MongoDB, Redis et Weaviate · LBU.
- `python-ml` : API Python, front SPA, worker · PostgreSQL, Redis et Weaviate · LBU.

Pour les développeurs :

```
bige-ops add layouts
bige-ops add layout node-app --name mon-app
bige-ops add layout custom --runtime python --db postgres --db redis --web spa --lbu
```

HTML : [layouts.html](https://bige.dev/layouts.html)
